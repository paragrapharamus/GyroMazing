#!/bin/bash

### Starts up the client on the Raspberry Pi ###

# The IP of the server
ip=$1
port=$2

# SSH into the Raspberry Pi and start up the client
ssh prduitorii@10.42.0.243 << EOF
	cd ~/Desktop/GyroMazing
	python client_udp.py $ip $port
EOF
