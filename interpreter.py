import spilib
import time


class MotorsAPI:
    '''
    This class works with motors on high level
    It is a wrapper around low level spilib driver
    '''
    def __init__(self, rotate_coef=40):
        self.rotate_coef = rotate_coef
        self.interpreter_controller_flag = False

    def drive(self, step):
        #print(step) FIXIT IMPLEMENT LOGGER
        action = step["action"]
        speed = step["speed"]
        if "sensor_id" in step:
            sensor_id = step["sensor_id"]
            sensor_val = step["sensor_val"]
        else:
            sensor_id = -1
            sensor_val = -1
        if step["action"] == "forward":
            steps_cnt = step["distance"] 
        elif step["action"] in ["right", "left"]:
            steps_cnt = step["angle"] * self.rotate_coef
        try: # FIXIT USED HERE ONLY WHILE LOCAL PC DEVELOPMENT
            spilib.move_robot(action, self.interpreter_controller_flag, speed=speed, steps=steps_cnt, sensor_id=sensor_id, sensor_val=sensor_val)
        except:
            time.sleep(4) # Fake execution time
        
class Interpreter:
    '''
    Main interpreter class
    This class execute code(JSON file) line by line
    '''
    def __init__(self, motors_driver, logger):
        self.finish_program = False # Interrupt program execution flag
        self.motors_driver = motors_driver
        self.logger = logger

    def interpret(self, data):
        self.logger.start_execution()
        for step in data:
            if not self.finish_program:
                print(step)
                if step["action"] in ["forward", "left", "right"]:
                    self.logger.write_entry(f"Motors {step['action']}")
                    self.motors_driver.drive(step)
                    #print(step) LOGGER
                elif step["action"] == "servo":
                    self.logger.write_entry(f"Servo action: {step['num']} steps")
                    spilib.move_servo(step["num"], step["start_angle"], step["finish_angle"], step["delay"]) # Servo works without driver wrapper like motors
                elif step["action"] == "python": # Execute custom python code from custom_python
                    self.logger.write_entry("Python code")
                    eval(step["source"])
                elif step["action"].startswith("threaded_"): # Multithreading on interpretation level (NOT fully implemented yet)
                    pass
                elif step['action'] == "delay": # Delay on interpretation level
                    self.logger.write_entry(f"Delay {step['delay']}")
                    time.sleep(step["delay"])
            else: # Interrupt execution (used for emergency stop)
                break
        self.finish_program = False # Toggle back interruption flag
        self.logger.finish_execution()
