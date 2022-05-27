import cv2
import threading
import time


thread = None


class Camera1():
    def __init__(self, fps=20, video_source=0):
        self.fps = fps
        self.video_source = video_source
        self.camera = cv2.VideoCapture(self.video_source)
        self.max_frames = 5 * self.fps
        self.frames = []
        self.isrunning = False

    def run(self):
        global thread
        if thread is None:
            thread = threading.Thread(target=self._capture_loop, daemon=True)
            self.isrunning = True
            thread.start()

    def _capture_loop(self):
        dt = 1/self.fps
        while self.isrunning:
            v, im = self.camera.read()
            if v:
                if len(self.frames) == self.max_frames:
                    self.frames = self.frames[1:]
                self.frames.append(im)
            time.sleep(dt)

    def stop(self):
        self.isrunning = False

    def get_frame(self, _bytes=True):
        if len(self.frames) > 0:
            if _bytes:
                self.frames[-1] = cv2.resize(self.frames[-1], (200, 200))
                img = cv2.imencode('.png', self.frames[-1], [int(cv2.IMWRITE_JPEG_QUALITY), 0])[1].tobytes()
            else:
                img = self.frames[-1]
        else:
            with open("images/not_found.jpeg", "rb") as f:
                img = f.read()
        return img
