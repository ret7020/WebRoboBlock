import spidev
import time
def list_int_to_bytes(input_list) -> list:
    """Split list of int values (-32768 to 32767) to list transferable by SPI

    Args:
        input_list (list): max 20 numbers

    Returns:
        list: transferable list
    """
    output_list = []
    for int_data in input_list:
        output_list.append(int_data >> 8)
        output_list.append(int_data & 255)
    return output_list


def spi_send(txData = []) -> list:
    """Send generated list by SPI

    Args:
        txData (list): if less than 40 numbers, will be filled with 0's

    Returns:
        list: received data
    """
    N = 40
    spi = spidev.SpiDev()
    spi.open(0, 0)
    spi.max_speed_hz = 1000000
    txData = list_int_to_bytes(txData)
    txData = txData+[0]*(N-len(txData))
    rxData = []
    _ = spi.xfer2([240])  # 240 - b11110000 - start byte

    for i in range(40):
        rxData.append(spi.xfer2([txData[i]])[0])
        
    spi.close()

    return rxData

def check_sensor(recieved, sensor_id, sensor_val):
    if sensor_id != -1:
        if int(recieved[sensor_id]) == int(sensor_val):
            return True
        else:
            return False

def move_robot(dir, speed=1000, accel=1000, steps=1000, verbose=False, sensor_id=-1, sensor_val=None):
    '''Moves a robot

    Args:
        dir (str): Possible values: 'forward', 'back', 'left', 'right'
        speed (int, optional): Speed. Defaults to 1000.
        accel (int, optional): Acceleration. Defaults to 1000.
        steps (int, optional): Number of steps. Defaults to 1000.
        verbose (bool, optional): Enable verbose printing. Defaults to False.
    '''
    if dir == 'forward':
        send_data = [1, speed, accel, steps, speed, accel, steps]
    elif dir == 'back':
        send_data = [1, speed, accel, -steps, speed, accel, -steps]
    elif dir == 'left':
        send_data = [1, speed, accel, -steps, speed, accel, steps]
    elif dir == 'right':
        send_data = [1, speed, accel, steps, speed, accel, -steps]
    else:
        print(f'No such direction: {dir}')
        return

    received_data = spi_send(send_data)
    time.sleep(0.07)
    #Freeze app until action finish
    while True:
        recieved = spi_send([])
        if (recieved[0] == 0 and recieved[1] == 0):
            print("Finish")
            break
        if check_sensor(recieved, sensor_id, sensor_val):
            spi_send([1, 0, 0, 0, 0, 0, 0])
            print("Stop")
            break


    if verbose:
        print(f'Moved {dir}, speed: {speed}, accel: {accel}, steps: {steps}')
        print(f'Received from arduino: {received_data}')


def move_servo(servo_num, start_angle, finish_angle, delay):
    data = [2, servo_num, start_angle, finish_angle, delay]
    spi_send(data)
    time.sleep(0.07)
    while True:
        recieved = spi_send([])
        if (recieved[0] == 0 and recieved[1] == 0):
            print("Finish servo")
            break
