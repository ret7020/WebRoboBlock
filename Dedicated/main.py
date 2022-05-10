from flask import Flask, render_template, request


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
    app.run(port=8080)
    
