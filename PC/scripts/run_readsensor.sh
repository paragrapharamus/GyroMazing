#!/bin/bash

### Starts up the C program that reads data from a gyroscope sensor connected to the Raspberry Pi ###

# SSHs into Raspberry Pi and runs the C code 
ssh prduitorii@10.42.0.243 << EOF
	cd ~/Desktop/GyroMazing
	./test
EOF
