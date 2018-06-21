#!/bin/bash

### Starts up the server in order to receive data from RPi ###

ip= $1
port=$2

cd ..
cd udp_communication_linux

python server.py $1 $2
