import socket
import sys
import time

def client(host):

    port = 1025

    print "[*] Creating a new socket..."
    s = socket.socket()
    print "    Socket created"
    print "[*] Conneting to server..."
    s.connect((host, port))
    print "    Connection established"

    print "Sending data..."
    while True:
      try:
         _file = open("out_gyro.txt", 'r')
      except IOError:
         print "Error occured while opening the file"
         sys.exit()

      message = _file.read();
      s.send(message)
      _file.close()
      time.sleep(0.05)

    c.close()


if __name__ == "__main__":
    client(sys.argv[1])
