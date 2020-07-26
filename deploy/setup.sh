#!/bin/bash

if aws configure --profile imdown list 2>&1 >/dev/null | grep -q "could not be found"; then
  echo
  echo "Looks like you need to configure AWS!"
  echo "Note: you will additionally need to acquire imdown.pem"
  read -rp 'Access Key: ' AWS_ACCESS_KEY
  read -rp 'Secret Key: ' AWS_SECRET_KEY
  read -r -p "Press enter to complete configuration..."
  aws configure --profile imdown set region us-west-1
  aws configure --profile imdown set aws_access_key_id "$AWS_ACCESS_KEY"
  aws configure --profile imdown set aws_secret_access_key "$AWS_SECRET_KEY"
  echo
else
  echo "Found existing AWS profile imdown"
fi

touch ~/.ssh/config
if grep -q "app.imhelladown.com" ~/.ssh/config; then
  echo "Found existing SSH configuration"
else
  echo
  echo "Host imdown"
  echo "    HostName app.imhelladown.com"
  echo "    User ubuntu"
  echo "    Port 22"
  echo "    IdentityFile ~/.ssh/imdown.pem"
  echo
  read -r -p "Press enter to configure SSH..."
  echo
  {
    echo
    echo "Host imdown"
    echo "    HostName app.imhelladown.com"
    echo "    User ubuntu"
    echo "    Port 22"
    echo "    IdentityFile ~/.ssh/imdown.pem"
  } >>~/.ssh/config
fi

echo "This step requires Homebrew and Pip"
echo "brew install awscli terraform"
echo "pip3 install ansible"
read -r -p "Press enter to install required packages..."
brew install awscli cowsay terraform
terraform -install-autocomplete 2>/dev/null
pip3 install ansible
