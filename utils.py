import requests
import json

def get_upstream_verion():
    upstream_config = requests.get("https://raw.githubusercontent.com/ret7020/WebRoboBlock/master/conf.json").text
    return json.loads(upstream_config)["version"]


def gen(camera):
	while True:
		frame = camera.get_frame()
		yield (b'--frame\r\n'
			   b'Content-Type: image/png\r\n\r\n' + frame + b'\r\n')

class TgPublish:
    def __init__(self, tg_bot_token):
        self.bot = telebot.TeleBot(tg_bot_token)
    
    def send(self, message):
        self.bot.send_message(conf["tg_user_chat_to_send"], message)


