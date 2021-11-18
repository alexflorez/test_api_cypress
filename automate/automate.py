import argparse
import os
import pathlib
import subprocess
import time
import signal

parser = argparse.ArgumentParser()
parser.add_argument("file", help="zipped file")
args = parser.parse_args()
zipfile = pathlib.Path(args.file)

target = zipfile.stem
cmd_unzip = ["unzip", "-q", "-o", f"{zipfile}", "-d" f"{target}"]
subprocess.run(cmd_unzip)

cwd = os.getcwd()
contents = pathlib.Path(cwd) / target

config_json = "package.json"
files = [file.name for file in contents.iterdir() if file.is_file()]
if not config_json in files:
    print("Cannot proceed. "
          f"{config_json} not found")
    exit()

os.chdir(contents)

cmd_install = ["npm", "install"]
subprocess.run(cmd_install)

cmd_start = ["npm", "start"]
proc = subprocess.Popen(cmd_start, stdout=subprocess.PIPE, 
                        preexec_fn=os.setsid)

os.chdir(cwd)
os.chdir('..')
file_spec = "apinode.spec.js"
cmd_cypress = ["npx", "cypress", "run", 
               "--spec", f"cypress/integration/{file_spec}",
               ">", f"{target}_out.txt"]
subprocess.run(cmd_cypress)

try:
    outs, errs = proc.communicate(timeout=30)
    print("try: ", outs)
except subprocess.TimeoutExpired:
    proc.kill()
    os.killpg(os.getpgid(proc.pid), signal.SIGTERM)  
    outs, errs = proc.communicate()
    print("except: ", outs)

