echo "[Agent] Webserver: $1"
echo "[Agent] PHP: $2"
echo "[Agent] Database: $3"

echo "[Agent] updating all system packages"
#sudo apt update -qq

echo "[Agent] checking nginx installed or not"
result=$(sudo apt -qq list nginx 2>/dev/null)
#echo $result
installed="false"
if [[ $result == *installed* ]] # * is used for pattern matching
then
  installed="true";
fi

if [[ $installed == "true" ]]
then
  echo "[Agent] nginx is already installed"
else
  echo "[Agent] installing nginx webserver"
  sudo apt install -qq --yes nginx
fi

echo "[Agent] Adjusting the Firewall"
sudo ufw allow 'Nginx Full'


#Method 1: Managing services in Linux with systemd
#systemctl start <service-name>
#systemctl stop <service-name>
#systemctl restart <service-name>
#systemctl status <service-name>

#Method 2: Managing services in Linux with init
#service --status-all
#service <service-name> start
#service <service-name> stop
#service <service-name> restart
#service <service-name> status

#netstat -napl | grep 80

#List Ubuntu Services with Service command
#service  --status-all

#List Services with systemctl command
#systemctl list-units

# Installing nginx
# sudo apt install nginx

# Installing PHP
#result=$(sudo apt list --installed | grep nginx | cut -d ":" -f2)
#result=$(sudo apt -qq list nginx)
#echo $result

# Installing PHP 7.4 with Apache
#sudo apt-get install --yes php
#sudo apt install libapache2-mod-php

# Installing Apache
#sudo apt install apache2


#Enabling PHP Repository
#sudo apt install software-properties-common
#require reboot
#sudo add-apt-repository ppa:ondrej/php
#sudo apt update


#Installing PHP 8.0 with Nginx
#sudo apt update
#sudo apt install php8.0-fpm

#sudo apt -qq list php
#sudo apt -qq list php8.0-fpm