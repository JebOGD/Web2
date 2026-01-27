#!/bin/sh

# Start HAProxy in background
haproxy -f /etc/haproxy/haproxy.cfg &

# Start Next.js app
pnpm start
