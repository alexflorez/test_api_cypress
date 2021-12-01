import argparse
import os
import pathlib
import signal
import subprocess
import time


API_DIR = "test_api" 


def report(results):
    lines = results.split("\n")
    tests = ["1:", "2:", "3:", "4:", "5:", "6:", "7:", "8:"]
    n = len(tests)
    it = 0
    idxs = []
    for i, line in enumerate(lines):
        if tests[it] in line:
            idxs.append(i)
            it += 1
        if it == n:
            break

    passing = set()
    for i, idx in enumerate(idxs, 1):
        line = lines[idx+1].split()
        # Last item is of the form (Nms)
        if "ms)" in line[-1]:
            passing.add(i)

    print("\n========================") 
    print("Score report")

    not_passing = set(range(1, 9)) - passing
    if not_passing:
        print(f"Did not pass test {', '.join(str(e) for e in not_passing)}")

    POINT = 10 / 8
    score = len(passing) * POINT
    print(f"The score is {score}")
    print("========================")


def install_cypress():
    cwd = os.getcwd()
    os.chdir(API_DIR)
    cmd_init = ["npm", "init", "-y"]
    print("Installing cypress")
    subprocess.run(cmd_init)
    cmd_install_cypress = ["npm", "install", "cypress", "--save-dev", "--quiet"]
    subprocess.run(cmd_install_cypress)
    os.chdir(cwd)
    print("Finish installing cypress")


def run_api_server():
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
        print("Cannot proceed. {config_json} not found")
        exit()

    os.chdir(contents)

    cmd_install = ["npm", "install", "--quiet"]
    subprocess.run(cmd_install)

    cmd_start = ["npm", "start"]
    proc = subprocess.Popen(cmd_start, stdout=subprocess.PIPE, 
                            preexec_fn=os.setsid)
    
    os.chdir(cwd)
    os.chdir(API_DIR)
    file_spec = "apinode.spec.js"
    cmd_cypress = ["npx", "cypress", "run", 
                   " --spec", f"cypress/{file_spec}"]
                   
    cyproc = subprocess.run(cmd_cypress, capture_output=True, text=True)
    results = cyproc.stdout
    try:
        outs, errs = proc.communicate(timeout=30)
        print("Stopping server")
    except subprocess.TimeoutExpired:
        proc.kill()
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)  
        outs, errs = proc.communicate()
        # print("There were some errors running the server")

    report(results)

