from datetime import datetime
import os

class Logger:
    def __init__(self, log_dir):
        self.log_dir = log_dir
        self.update_log()
    
    def update_log(self):
        self.log_file = os.path.join(self.log_dir, datetime.now().strftime('%d_%m_%Y.log'))
    def start_execution(self):
        self.update_log()
        entry = f"[{datetime.now().strftime('%H:%M:%S')}] <---EXECUTION STARTED--->"
        self.write_entry(entry)
    def finish_execution(self):
        self.update_log()
        entry = f"[{datetime.now().strftime('%H:%M:%S')}] <---EXECUTION STOPPED--->"
        self.write_entry(entry)
    def write_entry(self, text):
        self.update_log()
        entry = f"[{datetime.now().strftime('%H:%M:%S')}] {text}"
        with open(self.log_file, "a") as file:
            file.write(entry + "\n")