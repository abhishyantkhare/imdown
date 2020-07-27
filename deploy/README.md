# Deployment scripts
## Configure environment
Configures AWS and installs required software.
```shell script
./setup.sh
```
_Requires Homebrew and Pip. This script is idempotent_

## Deploy web server
Deploy your local backend code to the web server.
```shell script
./deploy.sh
```

## Create web server
Uses terraform to create and provision an EC2 instance to run the imdown backend.
You probably don't need to use this.
```shell script
./provision.sh
```
