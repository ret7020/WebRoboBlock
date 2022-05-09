import json
import os
import socket
import threading
import time

with open("rpi_config.json") as conf_file:
    CONFIG = json.load(conf_file)

class Logger:
    def __init__(self):
        os.makedirs("logs/", exist_ok=True)
        self.path_to_log = f'logs/{time.strftime("%Y%m%d-%H%M%S", time.gmtime())}.log'
        self.write_entry("Logger started")
    
    def write_entry(self, data, sender="MAIN"):
        with open(self.path_to_log, "a") as file:
            file.write(f'[{time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())}]{{{sender}}} {data}\n')
        



class MotorsApi:
    def __init__(self):
        pass

    def drive(self, data):
        logger.write_entry("Starting driving", sender="MOTORS_API")
        for step in data:
            if step["action"] in ["forward", "backward"]:
                print(step["action"], step["distance"], step["speed"])
            elif step["action"] in ["right", "left"]:
                print(step["action"], step["angle"], step["speed"])



class ClientThread:
    def __init__(self, connection):
        self.sock = connection
        threading.Thread(target=self.start_listening).start()

    def check_packet(self, packet):
        if packet["user"] == CONFIG["user"] and packet["pass"] == CONFIG["password"]:
            return True
        else:
            return False

    def start_listening(self):
        while True:
            data = self.sock.recv(1048576)
            if data:
                try:
                    data = json.loads(data)
                    if self.check_packet(data): #Check auth credenitals
                        data = data["data"]
                        if isinstance(data, list):
                            #Don't block listen thread
                            threading.Thread(target=motors.drive, args=(data, )).start()
                        else:
                            logger.write_entry("Data packet type != list", sender="CLIENT_THREAD")
                    else: 
                        logger.write_entry("Invalid pair(username/password)", sender="CLIENT_THREAD")
                except json.decoder.JSONDecodeError:
                    logger.write_entry("Bad packet; Not JSON", sender="CLIENT_THREAD")



class Server:
    def __init__(self, listen_from, port, clients_limit):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.bind((listen_from, port))
        self.sock.listen(clients_limit)
        logger.write_entry("[LOG] Server configured and socket satrted!", sender="SERVER")
    def connections_listener(self):
        logger.write_entry("[LOG] Starting listening", sender="SERVER")
        while True:
            connection, addr = self.sock.accept()
            logger.write_entry(f"[LOG] New client connected: {addr}; Starting uniq ClientThread", sender="SERVER")
            ClientThread(connection).start_listening()
            


if __name__ == "__main__":
    logger = Logger()
    motors = MotorsApi()
    server = Server(CONFIG['listen_from'], int(CONFIG['socket_port']), CONFIG['clients_limit'])
    print("Started. Check more info in log")
    server.connections_listener()