import socket
import sys
import time

def client(host, port):
	print "[*] Creating a new socket..."
	c = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	print "    Socket created"
	
	server_addr = (host, int(port))
	
	print "Sending data..."	
	while True:
		try:
			_file = open("out_gyro.txt", 'r')
		except IOError:
			print "Error occured while opening the file"
			sys.exit()

		data = _file.read();
		if data:
			c.sendto(data, server_addr)

		_file.close()
		time.sleep(0.02)  # 0.005 for Linux
	c.close()
		
if __name__ == '__main__':
	client(sys.argv[1], sys.argv[2])
