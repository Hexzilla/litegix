echo "Webserver: $1"
echo "PHP: $2"
echo "Database: $3"

echo "updating all system packages"
#sudo apt update -qq

echo "checking nginx installed or not"
result=$(sudo apt -qq list nginx 2>/dev/null)
echo $result

installed="false"
if [[ $result == *installed* ]] # * is used for pattern matching
then
  installed="true";
fi
echo "installed: $installed"

if [[ $installed == "false" ]]
then
  echo "installing nginx webserver"
  sudo apt install -qq --yes nginx
fi











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