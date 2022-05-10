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
        


class MotorsAPI:
    def __init__(self):
        self.rotate_coef = 40 #taken from the bullshit

    def drive(self, step):
        action = step["action"]
        speed = step["speed"]
        if step["action"] in ["forward", "backward"]:
            print(step["action"], step["distance"], step["speed"])
            steps_cnt = step["distance"]
        elif step["action"] in ["right", "left"]:
            steps_cnt = step["angle"] * self.rotate_coef

        print(action, steps_cnt, speed) #Send it to lib
        
        #time.sleep(0.5) #Fake wait to simulate real behaviour


class ControllerAPI:
    def __init__(self):
        pass

    def thread_block_test(self, data, time_wait):
        for _ in range(20):
            print(f"Thread - {data}")
            time.sleep(time_wait)

    def execute(self, data):
        logger.write_entry("Starting executing step by step", sender="CONTROLLER_API")
        for step in data:
            if step["action"] in ["forward", "backward", "left", "right"]:
                motors.drive(step)
            elif step["action"].startswith("threaded_"):
                threading.Thread(target=self.thread_block_test, args=(step["data"], step["time"], )).start()
        print("------")

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
                            threading.Thread(target=controller.execute, args=(data, )).start()
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
    controller = ControllerAPI()
    motors = MotorsAPI()
    server = Server(CONFIG['listen_from'], int(CONFIG['socket_port']), CONFIG['clients_limit'])
    print("Started. Check more info in log")
    server.connections_listener()