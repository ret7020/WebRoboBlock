from flask import Flask, render_template
from flask import request
from time import gmtime, strftime

app = Flask(__name__)
SESSION_LOG = []

@app.route("/deploytorpi", methods=['POST'])
def deploy():
    compiled = request.get_json()
    print(compiled)
    SESSION_LOG.append({"time": strftime("%Y-%m-%d %H:%M:%S", gmtime()), "type": 0, "data": compiled})
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

