from pathlib import Path
import subprocess,time,json,datetime,re,sys
ADB='/opt/homebrew/share/android-commandlinetools/platform-tools/adb'
SERIAL='emulator-5562'
PACKAGE='dev.idfixture.id_fixture'
ROOT=Path(__file__).resolve().parent
MODE=sys.argv[1]
def adb(*args,timeout=20):
    return subprocess.run([ADB,'-s',SERIAL,*args],capture_output=True,text=True,timeout=timeout)
def elapsed(value):
    match=re.search(r'(?:(\d+)m)?(?:(\d+)s)?(?:(\d+)ms)?$',value)
    if not match:return None
    return int(match[1] or 0)*60000+int(match[2] or 0)*1000+int(match[3] or 0)
def seconds_at(line):
    match=re.match(r'\d\d-\d\d (\d\d):(\d\d):(\d\d)\.(\d\d\d)',line)
    if not match:return None
    return int(match[1])*3600+int(match[2])*60+int(match[3])+int(match[4])/1000
log_path=ROOT/f'android-{MODE}-startup-logcat.txt'
with log_path.open('w') as stream:
    logcat=subprocess.Popen([ADB,'-s',SERIAL,'logcat','-v','threadtime','-T','1','ActivityTaskManager:I','FlutterJNI:D','ResourceExtractor:I','flutter:I','Choreographer:I','IDFixtureMeasure:I','AndroidRuntime:E','*:S'],stdout=stream,stderr=subprocess.STDOUT,text=True)
    records=[]
    try:
        for trial in range(1,4):
            label=f'{MODE}-cold-{trial}'
            adb('shell','am','force-stop',PACKAGE)
            old=adb('shell','pidof',PACKAGE).stdout.strip()
            time.sleep(2)
            cpu=adb('shell','top','-b','-n','2','-d','1','-m','10',timeout=10).stdout
            (ROOT/f'android-{label}-cpu-before.txt').write_text(cpu)
            (ROOT/f'host-{label}-load.txt').write_text(subprocess.check_output(['uptime'],text=True))
            marker=f'{label}-BEGIN'
            adb('shell','log','-p','i','-t','IDFixtureMeasure',marker)
            started=time.monotonic()
            result=adb('shell','am','start','-W','-n',PACKAGE+'/.MainActivity',timeout=45)
            command_ms=round((time.monotonic()-started)*1000)
            (ROOT/f'android-{label}-am-start.txt').write_text(result.stdout+result.stderr)
            text=''
            for unused in range(12):
                text=log_path.read_text()
                section=text.split(marker)[-1]
                if any('Displayed '+PACKAGE in line for line in section.splitlines()):break
                time.sleep(1)
            screenshot=ROOT/f'android-{label}.png'
            screenshot.write_bytes(subprocess.check_output([ADB,'-s',SERIAL,'exec-out','screencap','-p'],timeout=10))
            pid=adb('shell','pidof',PACKAGE).stdout.strip()
            section=log_path.read_text().split(marker)[-1]
            relevant=[line for line in section.splitlines() if 'Displayed '+PACKAGE in line or 'Fully drawn '+PACKAGE in line]
            extraction=[line for line in section.splitlines() if 'ResourceExtractor' in line]
            extraction_times=[seconds_at(line) for line in extraction]
            extraction_times=[value for value in extraction_times if value is not None]
            displayed_ms=None
            for line in relevant:
                match=re.search(r'Displayed .*: \+([^ ]+)',line)
                if match:displayed_ms=elapsed(match[1])
            metrics={key:int(value) for key,value in re.findall(r'^(ThisTime|TotalTime|WaitTime):\s*(\d+)',result.stdout,re.M)}
            status=re.search(r'^Status:\s*(.+)',result.stdout,re.M)
            record={'mode':MODE,'trial':trial,'definition':'force-stop cold process; first trial is first launch after installation; OS filesystem caches are not dropped','old_process_absent':not bool(old),'pid_after':pid,'status':status[1] if status else 'missing','am_start_metrics_ms':metrics,'host_command_wall_ms':command_ms,'displayed_ttid_ms':displayed_ms,'display_lines':relevant,'resource_extraction_lines':extraction,'resource_extraction_span_ms':round((max(extraction_times)-min(extraction_times))*1000) if len(extraction_times)>1 else None,'screenshot':screenshot.name,'captured_at':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(timespec='seconds')}
            records.append(record)
            (ROOT/f'android-{MODE}-startup-results.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
            print(json.dumps({key:record[key] for key in ['mode','trial','status','am_start_metrics_ms','displayed_ttid_ms','resource_extraction_span_ms']},ensure_ascii=False),flush=True)
            adb('shell','log','-p','i','-t','IDFixtureMeasure',f'{label}-END')
            time.sleep(3)
    finally:
        logcat.terminate()
        try:logcat.wait(timeout=5)
        except subprocess.TimeoutExpired:logcat.kill();logcat.wait(timeout=5)
