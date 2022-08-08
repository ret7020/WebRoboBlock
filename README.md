# WebRoboBlock
Control RPi robot using scratch-like(visual programming) web interface.
![image](https://user-images.githubusercontent.com/55328925/183447593-72934ad3-b645-4cbc-885c-8eb9cb0aa335.png)



## Installation
1. Clone repository to your RPi

    ```
    git clone https://github.com/ret7020/WebRoboBlock
    ```
2. Install modules
    
   ```
   pip3 install -r requirements.txt
   ```

3. Start flask server
    
    ```
    python3 main.py
    ```
4. Check your local ip

    ```
    ip a
    ```

5. Open web interface located here: <b><i>http://YOUR_RPI_IP:8080/</i></b>
   </br>But you can use ngrok tunnel, read more in Configuring section.

6. Play!

## Architecture
Your code maked from blocks "compiling" to JSON format:
```
[
   {
      action: "forward",
      distance: 10,
      speed: 1000,
      sensor_id: -1,
      sensor_val: 1
   },
   {
      action: "forward", 
      distance: 12,
      speed: 2000,
      sensor_id: -1,
      sensor_val: 1
   }
]
```
Each block generates block with different arguments(but there is an "action" argument en each)!
</br>
After "compiling" you can deploy your code to execution on real robot. IDE(web site) hosted on real robot. When you deploy project compiled json file sended via POST to web server and then this JSON going through interpreter. Each command executed one by one. </br>
Interpreter code file `interpreter.py` </br>
Communication with arduino and RPI library [Repo](https://github.com/stepanburmistrov/Raspberry-SPI-Arduino)

## Configuring
All settings stored in [conf.json](conf.json) file.
    <pre>
    {
        "web_port": 8080, #WebServer port; 
        "tg_bot_token": "", #API token for your telegram bot 
        "tg_user_chat_to_send": 1, #
        "camera_enabled": true, #Enable/Disable camera shot from web site
        "camera_id": 1, #id of camera(used in cv2.VideoCapture())
        "ngrok_start": false #Start http tunnel using ngrok
    }
    </pre>
To use 80 port you have to run main.py with root privileges(`sudo main.py`)
 
## Telegram Bot configuring
1. Create Telegram bot with [@BotFather](https://t.me/BotFather) </br>
2. Copy token and insert into config file(<i><b>tg_bot_token</b></i> section).</br>
3. Init the dialog with your bot(open your bot and click <b>"start"</b> button).</br>
4. Get your chat id with [@chatIDrobot](https://t.me/chatIDrobot) bot. </br>
5. Copy obtained token and insert into config file(<i><b>tg_user_chat_to_send</b></i> section).


 
## License
[MIT](https://choosealicense.com/licenses/mit/)
