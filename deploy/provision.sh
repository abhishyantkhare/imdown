#!/bin/bash

cd -P -- "$(dirname -- "$0")/terraform" || exit

echo "WARNING:"
echo "This will create a new EC2 instance. Do not use this script if you are trying to deploy new code."
echo
read -r -p "Press enter to continue..."

terraform fmt
terraform init || exit
terraform apply || exit
# Remove any old entries from ~/.ssh/known_hosts
ssh-keygen -R "app.imhelladown.com"
