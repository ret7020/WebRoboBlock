import ftplib


class FTP_Connection:
    def __init__(self, server, login, password):
        self.session = ftplib.FTP(server)
        self.session.login(login, password)
        self.session.encoding = "utf-8"
    
    def send_content(self, path_to, content):
        with open("link.txt", "w") as file:
            file.write(content)
        with open('link.txt', "rb") as file:
            self.session.storbinary(f'STOR {path_to}/link.txt', file)    
        

    def close_session(self):
        self.session.quit()

if __name__ == "__main__":
    print("Test")
    ftp = FTP_Connection("ftp", "", "")
    ftp.send_content("/http", "https://ngrok.io/test")
    ftp.close_session()
