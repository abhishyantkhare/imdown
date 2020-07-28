#!/bin/bash

cd -P -- "$(dirname -- "$0")/ansible" || exit

echo "WARNING:"
echo "This script will deploy your local backend to app.imhelladown.com and run flask db upgrade."
echo
read -r -p "Press enter to continue..."

ansible-playbook -i inventory deploy.yml
