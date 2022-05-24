from flask import Flask, render_template, request, Response
from pyngrok import ngrok
import spilib
import telebot
import json
import socket
from custom_python.py_classes import *
from camera1 import Camera1
import cv2

with open("conf.json", "r") as file:
    conf = json.load(file)
    

camera1 = Camera1(20, conf["camera_id"])
camera1.run()

def gen(camera):
	while True:
		frame = cv2.resize(camera.get_frame(), (100, 100))
		yield (b'--frame\r\n'
			   b'Content-Type: image/png\r\n\r\n' + frame + b'\r\n')
               

class TgPublish:
    def __init__(self) :
        self.bot = telebot.TeleBot(conf["tg_bot_token"])
    
    def send(self, message):
        self.bot.send_message(conf["tg_user_chat_to_send"], message)



class MotorsAPI:
    def __init__(self):
        self.rotate_coef = 40 #taken from the bullshit

    def drive(self, step):
        print(step)
        action = step["action"]
        speed = step["speed"]
        if "sensor_id" in step:
            sensor_id = step["sensor_id"]
            sensor_val = step["sensor_val"]
        else:
            sensor_id = -1
            sensor_val = -1
        if step["action"] in ["forward", "backward"]:
            steps_cnt = step["distance"]
        elif step["action"] in ["right", "left"]:
            steps_cnt = step["angle"] * self.rotate_coef
        spilib.move_robot(action, speed=speed, steps=steps_cnt, sensor_id=sensor_id, sensor_val=sensor_val)
        
        

app = Flask(__name__)

@app.route("/video_feed1")
def video_feed1():
	return Response(gen(camera1),mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route('/')
def index():
    return render_template("index.html")


@app.after_request
def add_header(r):
	r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	r.headers["Pragma"] = "no-cache"
	r.headers["Expires"] = "0"
	r.headers["Cache-Control"] = "public, max-age=0"
	return r


@app.route("/run", methods=["POST"])
def run():
    data = request.json
    for step in data:
        if step["action"] in ["forward", "backward", "left", "right"]:
            motors.drive(step)
        elif step["action"] == "servo":
            spilib.move_servo(step["num"], step["start_angle"], step["finish_angle"], step["delay"])
        elif step["action"] == "python":
            eval(step["source"])
        elif step["action"].startswith("threaded_"):
            pass
    return "1"




if __name__ == "__main__":
    motors = MotorsAPI()
    if conf["ngrok_start"]:
        tg_bot = TgPublish()
        public_url = ngrok.connect(conf["web_port"]).public_url
        print(f"Public URL: {public_url}")
        tg_bot.send(f"New RoboBlock instance started at:\nLocal: {socket.gethostbyname(socket.gethostname())}\nPublic: {public_url}")
    app.run(host="0.0.0.0", port=conf["web_port"])
    
