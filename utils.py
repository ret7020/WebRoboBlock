import requests
import json

def get_upstream_verion():
    upstream_config = requests.get("https://raw.githubusercontent.com/ret7020/WebRoboBlock/master/conf.json").text
    return json.loads(upstream_config)["version"]


