import pathlib
import argparse
import subprocess
import os

parser = argparse.ArgumentParser()
parser.add_argument("file", help="zipped file")
args = parser.parse_args()
zipfile = pathlib.Path(args.file)

target = zipfile.stem
cmd = ["unzip", "-q", "-o", f"{zipfile}", "-d" f"{target}"]
subprocess.run(cmd)

cwd = zipfile.cwd()
contents = cwd / target

config_json = "package.json"
files = [file.name for file in contents.iterdir() if file.is_file()]
if config_json in files:
    print("Proceed")

os.chdir(target)

cmd = ["npm", "install"]
subprocess.run(cmd)

cmd = ["npm", "start"]
try:
    subprocess.run(cmd, timeout=60)
except Exception as e:
    print("Time passed")
