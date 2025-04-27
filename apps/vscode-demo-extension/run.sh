#!/bin/bash
# Script to run the extension, stopping any existing instances

echo "Checking for processes on port 3000..."
# Find and kill any process using port 3000
PID=$(lsof -ti:3000)
if [ -n "$PID" ]; then
  echo "Killing process $PID on port 3000"
  kill -9 $PID
fi

echo "Rebuilding extension..."
./build.sh

echo "Starting extension in browser..."
pnpm run-in-browser 