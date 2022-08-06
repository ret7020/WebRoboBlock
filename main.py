from flask import Flask, render_template, request, Response
from pyngrok import ngrok
import spilib
import json
import socket
from custom_python.py_classes import *
from camera1 import Camera1
import public_ftp
import utils
import time
import interpreter
from logger import Logger


app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True


@app.route("/video_feed1")
def video_feed1():
	return Response(utils.gen(camera1), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route('/')
def index():
    return render_template("index.html", actual_version=actual_version)


@app.route("/stop_program")
def stop_program():
    global finish_program
    
    # Hardware stop using directly writing to low level arduino driver
    try:
        spilib.spi_send([1, 0, 0, 0, 0, 0, 0]) 
        spilib.spi_send([1, 0, 0, 0, 0, 0, 0])
    except: 
        pass
    interpr.finish_program = True # Stop interpreter
    motors_driver.interpreter_controller_flag = True # Stop driver

    print("Stopped")
    return "1"

@app.after_request
def add_header(r):
	r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	r.headers["Pragma"] = "no-cache"
	r.headers["Expires"] = "0"
	r.headers["Cache-Control"] = "public, max-age=0"
	return r


@app.route("/run", methods=["POST"])
def run():
    global finish_program
    data = request.json
    interpr.interpret(data)
    return "1"


if __name__ == "__main__":
    with open("conf.json", "r") as file:
        conf = json.load(file)
        
    finish_program = False
    actual_version = True
    if utils.get_upstream_verion() != conf["version"]:
        actual_version = False
    camera1 = Camera1(20, conf["camera_id"])
    if conf["camera_enabled"]:
        camera1.run()

    logger = Logger(conf["log_dir"])
    motors_driver = interpreter.MotorsAPI(rotate_coef=conf["rotate_coef"])
    interpr = interpreter.Interpreter(motors_driver, logger)

    if conf["ngrok_start"]:
        public_url = ngrok.connect(conf["web_port"]).public_url
        ftp = public_ftp.FTP_Connection("ftp", "-", "")
        ftp.send_content("/http", public_url)
        ftp.close_session()
        print(f"Public URL: {public_url}")
        if conf["send_tg_message"]:
            tg_bot = utils.TgPublish(conf["tg_bot_token"])
            tg_bot.send(f"App started with public url {public_url}")
    
    
    logger.write_entry("Application started")
    app.run(host="0.0.0.0", port=conf["web_port"])
