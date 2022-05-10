from flask import Flask, render_template, request
import spilib

class MotorsAPI:
    def __init__(self):
        self.rotate_coef = 40 #taken from the bullshit

    def drive(self, step):
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
        
        print(action, steps_cnt, speed) #Send it to lib
        
        #time.sleep(0.5) #Fake wait to simulate real behaviour

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route("/run", methods=["POST"])
def run():
    data = request.json
    for step in data:
        if step["action"] in ["forward", "backward", "left", "right"]:
            motors.drive(step)
        elif step["action"].startswith("threaded_"):
            pass
    return "1"
if __name__ == "__main__":
    motors = MotorsAPI()
    app.run(host="0.0.0.0", port=8080)
    
