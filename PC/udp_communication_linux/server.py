import socket
import sys
import time

def server(host, port):

	print ("[*] Creating a new socket...")
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	print ("    Socket created")
	print ("[*] Binding...")
	s.bind((host, int(port)))
	print ("    Server socket binded")

	print ("Receiving data...")
	while True:
		data, addr = s.recvfrom(1024)
		
		try:
			_file = open("../out_gyro.txt", 'w')
		except IOError:
			print ("Error occured while opening the file!")
			sys.exit()
			
		_file.write(str(data))
		print ("Received data: " + str(data))
		_file.write('\n')
		_file.close()
		time.sleep(0.005)
	s.close()
	
if __name__ == '__main__':
	server(sys.argv[1], sys.argv[2])


