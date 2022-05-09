from concurrent.futures import thread
from flask import Flask, render_template
from flask import request
from time import gmtime, strftime
import rpi.client as rp
import json
import threading


#Read config
with open("client_config.json") as conf_file:
    CONFIG = json.load(conf_file)

SESSION_LOG = []

app = Flask(__name__)

#Create RPI object with socket connection to raspberry pi
RPI = rp.RPI(CONFIG['rpi_host'], int(CONFIG['rpi_port']), CONFIG['rpi_socket_user'], CONFIG['rpi_socket_password'])

@app.route("/deploytorpi", methods=['POST'])
def deploy():
    compiled = request.get_json()
    print(compiled)
    SESSION_LOG.append({"time": strftime("%Y-%m-%d %H:%M:%S", gmtime()), "type": 0, "data": compiled})
    if not RPI.connected:
        RPI.connect()
    threading.Thread(target=RPI.send, args=(compiled, )).start()
    return "OK"

@app.route("/log", methods=['GET'])
def log_view():
    print(SESSION_LOG)
    return render_template("log.html", result=SESSION_LOG[::-1])
   
@app.after_request
def add_headers(response):
    #CORS
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Expose-Headers', 'Content-Type,Content-Length,Authorization,X-Pagination')
    return response
if __name__ == "__main__":
    app.run()
    
    

