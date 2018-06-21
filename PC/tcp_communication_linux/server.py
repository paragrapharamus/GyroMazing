import socket
import sys
import time

def server():
	host = '0.0.0.0'
	port = 1025

	print "[*] Creating a new socket..."
	server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	print "    Socket created"
	print "[*] Binding..."	
	server.bind((host, port))
	print "    Server socket binded"
	print "[*] Listening..."
	server.listen(1)

	print "[*] Accepting the connection..."
	c, addr = server.accept()
	print "    Connection established from: " + str(addr)

	print "Receiving data..."
	while True:
		data = c.recv(1024)
		if not data:
			break

		try:
			_file = open("../out_gyro.txt", 'w+')
		except IOError:
			print "Error occured while opening the file!"
			sys.exit()
		
		_file.write(str(data))
		_file.write('\n')
		_file.close()
		time.sleep(0.055)

	print "Connection ended. Client disconnected."
	c.close()

if __name__ == "__main__":
	server()
