#!/bin/bash

echo 'Run as sudo'

# exit this script if any command returns a non-zero exit code
set -e

GIT_SSH_COMMAND="ssh -i /home/ubuntu/.ssh/id_rsa" git pull
chown -hR /home/ubuntu/democracy_africa/.git ubuntu

source /home/ubuntu/democracy_africa/venv/bin/activate

echo 'Building frontend'
cd /home/ubuntu/democracy_africa/frontend
npm install
npm run build

cd ../backend

python manage.py collectstatic --noinput

supervisorctl restart democracy_africa
