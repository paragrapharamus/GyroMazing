#!/bin/bash

# Get the IP of the server
ipAll=$(ip a s|sed -ne '/127.0.0.1/!{s/^[ \t]*inet[ \t]*\([0-9.]\+\)\/.*$/\1/p}')

# Keep the first one in case we found many
set -- $ipAll
ip=$1
$port=1025

# Run helper scripts in parallel 
./scripts/run_server.sh --$ip --$port  &
./scripts/run_client.sh --$ip --$port  &
./scripts/run_readsensor.sh            &
./scripts/run_gyromazing.sh            &

# Wait for them to finish
wait
echo 'Process Complete!'
