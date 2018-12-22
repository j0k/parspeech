#
#  sound_delay.py
#

"""
Record sound and play it back after a delay.
"""

import multiprocessing as mp
import time

import pyaudio
import numpy

import pygame.mixer

CHUNK = 1024*5
CHANNELS = 1
RATE = 44100
DELAY_SECONDS = 15
DELAY_SIZE = int(DELAY_SECONDS * RATE / (10 * CHUNK))


def feed_queue(q):

    FORMAT = pyaudio.paInt16
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while True:
        frame = []
        for i in list(range(10)):
            frame.append(stream.read(CHUNK))

        data_ar = numpy.fromstring(b''.join(frame), dtype=numpy.uint16)
        if q.full():
            q.get_nowait()
        q.put(data_ar)


if __name__ == '__main__':
    #freeze_support()

    queue = mp.Queue(maxsize=DELAY_SIZE)
    p = mp.Process(target=feed_queue, args=(queue,))
    p.start()

    # give some time to bufer
    time.sleep(DELAY_SECONDS)

    pygame.mixer.init()
    S = pygame.mixer.Sound

    while True:

        d = queue.get()
        S(d).play()
