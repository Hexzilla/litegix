#!/bin/bash
#
#
# RunCloud installer script for server USER_SERVER_NAME (65.21.49.177)
# Do not use in other server

OSNAME=`lsb_release -s -i`
OSVERSION=`lsb_release -s -r`
OSCODENAME=`lsb_release -s -c`
SUPPORTEDVERSION="16.04 18.04 20.04"
PHPCLIVERSION="php74rc"
INSTALLPACKAGE="apache2-rc curl git wget mariadb-server expect nano openssl redis-server python-setuptools perl zip unzip net-tools bc fail2ban augeas-tools libaugeas0 augeas-lenses firewalld build-essential acl memcached beanstalkd passwd unattended-upgrades postfix nodejs make jq "

# Services detection
SERVICES=$(systemctl --type=service --state=active | grep -E '\.service' | cut -d ' ' -f1 | sed -r 's/.{8}$//' | tr '\n' ' ')
DETECTEDSERVICESCOUNT=0
DETECTEDSERVICESNAME=""