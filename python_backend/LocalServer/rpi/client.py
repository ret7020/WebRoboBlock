import socket
import json
import time

class RPI:
    def __init__(self, host, port, user_name, password):
        self.host = host
        self.port = port
        self.user_name = user_name
        self.password = password
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print(self.port)
        self.connect()
    
    def connect(self):
        self.sock.connect((self.host, self.port))

    def send(self, data):
        dict_final = {"user": self.user_name, "pass": self.password, "data": data}
        self.sock.send(json.dumps(dict_final).encode("utf-8"))

    def disconnect(self):
        #self.sock.send(b"!disconnect")
        self.sock.close()

if __name__ == "__main__":
    print("Testing PC->RPI communication module")
    RPI = RPI("127.0.0.1", 9999, "test", "1234")
    while True:
        RPI.send("test")
        time.sleep(2)
    
