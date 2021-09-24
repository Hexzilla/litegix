#!/bin/bash
# Litegix installer script

LITEGIX_TOKEN=""
LITEGIX_URL=""
INSTALL_STATE_URL="$LITEGIX_URL/api/installation/status/$LITEGIX_TOKEN"

echo "INSTALL_STATE_URL: $INSTALL_STATE_URL"
sleep 2

OS_NAME=`lsb_release -s -i`
OS_VERSION=`lsb_release -s -r`
OS_CODE_NAME=`lsb_release -s -c`
SUPPORTED_VERSIONS="16.04 18.04 20.04"
PHP_CLI_VERSION="php74"
INSTALL_PACKAGE="litegix-agent curl git wget mariadb-server expect nano openssl redis-server python-setuptools perl zip unzip net-tools bc fail2ban augeas-tools libaugeas0 augeas-lenses firewalld build-essential acl memcached beanstalkd passwd unattended-upgrades postfix nodejs make jq "

# Services detection
SERVICES=$(systemctl --type=service --state=active | grep -E '\.service' | cut -d ' ' -f1 | sed -r 's/.{8}$//' | tr '\n' ' ')
DETECTED_SERVICES_COUNT=0
DETECTED_SERVICES_NAME=""


function send_state {
  status=$1
  echo "send_state: $status"
  sleep 2
  curl --ipv4 --header "Content-Type: application/json" -X POST $INSTALL_STATE_URL -d '{"status": "'"$status"'"}'
  sleep 2
}

function send_data {
  payload=$1
  echo "send_data: $payload\n"
  curl --ipv4 --header "Content-Type: application/json" -X POST $INSTALL_STATE_URL -d $payload
}

function replace_true_whole_line {
    sed -i "s/.*$1.*/$2/" $3
}

function get_random_string {
    head /dev/urandom | tr -dc _A-Za-z0-9 | head -c55
}

function fix_auto_update() {
    AUTO_UPDATE_FILE_50="/etc/apt/apt.conf.d/50unattended-upgrades"
    AUTO_UPDATE_FILE_20="/etc/apt/apt.conf.d/20auto-upgrades"

    sed -i 's/Unattended-Upgrade::Allowed-Origins {/Unattended-Upgrade::Allowed-Origins {\n        "Litegix:${distro_codename}";/g' $AUTO_UPDATE_FILE_50
    replace_true_whole_line "\"\${distro_id}:\${distro_codename}-security\";" "        \"\${distro_id}:\${distro_codename}-security\";" $AUTO_UPDATE_FILE_50
    replace_true_whole_line "\/\/Unattended-Upgrade::AutoFixInterruptedDpkg" "Unattended-Upgrade::AutoFixInterruptedDpkg \"true\";" $AUTO_UPDATE_FILE_50
    replace_true_whole_line "\/\/Unattended-Upgrade::Remove-Unused-Dependencies" "Unattended-Upgrade::Remove-Unused-Dependencies \"true\";" $AUTO_UPDATE_FILE_50

    echo -ne "\n\n
    Dpkg::Options {
       \"--force-confdef\";
       \"--force-confold\";
    }" >> $AUTO_UPDATE_FILE_50

    echo "APT::Periodic::Update-Package-Lists \"1\";" > $AUTO_UPDATE_FILE_20
    echo "APT::Periodic::Unattended-Upgrade \"1\";" >> $AUTO_UPDATE_FILE_20
}

function bootstrap_server {
    echo "bootstrap_server"
    apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade -y
}

function bootstrap_installer {
    echo "bootstrap_installer"
    rm -f /etc/apt/apt.conf.d/50unattended-upgrades.ucf-dist

    apt-get install software-properties-common apt-transport-https -y

    # Install Key
    # Litegix
    # wget -qO - https://release.runcloud.io/runcloud.key | apt-key add -
    # MariaDB
    # apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8

    # Install Litegix Source List
    # echo "deb [arch=amd64] https://release.runcloud.io/ $OS_CODE_NAME main" > /etc/apt/sources.list.d/runcloud.list

    # LTS version nodejs
    curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

    echo "bootstrap_installer_add_repository"
    if [[ "$OS_CODE_NAME" == 'xenial' ]]; then
        add-apt-repository 'deb [arch=amd64] http://nyc2.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu xenial main'
        add-apt-repository 'deb [arch=amd64] http://sfo1.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu xenial main'

        echo "bootstrap_installer_add_packages"
        PIPEXEC="pip"
        INSTALL_PACKAGE+="libmysqlclient20 python-pip php55 php55-essentials php56 php56-essentials php70 php70-essentials php71 php71-essentials php72 php72-essentials php73 php73-essentials php74 php74-essentials php80 php80-essentials"

    elif [[ "$OS_CODE_NAME" == 'bionic' ]]; then
        add-apt-repository 'deb [arch=amd64] http://nyc2.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu bionic main'
        add-apt-repository 'deb [arch=amd64] http://sfo1.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu bionic main'

        echo "bootstrap_installer_add_packages"
        PIPEXEC="pip"
        INSTALL_PACKAGE+="libmysqlclient20 python-pip php70 php70-essentials php71 php71-essentials php72 php72-essentials php73 php73-essentials php74 php74-essentials php80 php80-essentials"

    elif [[ "$OS_CODE_NAME" == 'focal' ]]; then
        add-apt-repository 'deb [arch=amd64] http://nyc2.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu focal main'
        add-apt-repository 'deb [arch=amd64] http://sfo1.mirrors.digitalocean.com/mariadb/repo/10.4/ubuntu focal main'

        echo "bootstrap_installer_add_packages"
        PIPEXEC="pip3"
        INSTALL_PACKAGE+="libmysqlclient21 python3-pip php72 php72-essentials php73 php73-essentials php74 php74-essentials php80 php80-essentials dirmngr gnupg libmagic-dev"
    fi

    echo "INSTALL_PACKAGE; $INSTALL_PACKAGE"

    # APT PINNING
    echo "Package: *
Pin: release o=MariaDB
Pin-Priority: 900" > /etc/apt/preferences
}

function enable_swap {
    totalRAM=`grep MemTotal /proc/meminfo | awk '{print $2}'`
    if [[ $totalRAM -lt 4000000 ]]; then # kalau RAM less than 4GB, enable swap
        swapEnabled=`swapon --show | wc -l`
        if [[ $swapEnabled -eq 0 ]]; then # swap belum enable
            # create 2GB swap space
            fallocate -l 2G /swapfile
            chmod 600 /swapfile
            mkswap /swapfile
            swapon /swapfile

            # backup fstab
            cp /etc/fstab /etc/fstab.bak

            # register the swap to fstab
            echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        fi
    fi
}

function install_packages {
    apt-get update
    apt-get remove mysql-common --purge -y

    echo "install_packages"
    apt-get install $install_packages -y
}

function check_port {
    echo -ne "\n\n\nChecking if port 21000 is accessible...\n"

    # send command to check wait 2 seconds inside jobs before trying
    # curl -4 -H "Content-Type: application/json" -X POST https://manage.runcloud.io/webhooks/serverinstallation/testport/KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb/wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf 
    
    if [[ "$OS_CODE_NAME" == 'xenial' ]]; then
        timeout 15 bash -c "echo -e 'HTTP/1.1 200 OK\r\n' | nc -l 21000"
    else
        timeout 15 bash -c "echo -e 'HTTP/1.1 200 OK\r\n' | nc -N -l 21000"
    fi
    ncstatus=$?
    if [[ $ncstatus -ne 0 ]]; then
        clear
echo -ne "\n
##################################################
# Unable to connect through port 21000 inside    #
# this server. Please disable firewall for this  #
# port and rerun the installation script again!  #
##################################################
\n\n\n
"
        exit 1
    fi
}

function install_supervisor {
    export LC_ALL=C
    $PIPEXEC install supervisor
    echo_supervisord_conf > /etc/supervisord.conf
    echo -ne "\n\n\n[include]\nfiles=/etc/supervisor.d/*.conf\n\n" >> /etc/supervisord.conf
    mkdir -p /etc/supervisor.d

    echo "[Unit]
Description=supervisord - Supervisor process control system for UNIX
Documentation=http://supervisord.org
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/bin/supervisord -c /etc/supervisord.conf
ExecReload=/usr/local/bin/supervisorctl reload
ExecStop=/usr/local/bin/supervisorctl shutdown
User=root

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/supervisord.service

    systemctl daemon-reload
}

function install_fail2ban {
    echo "# Litegix Server API configuration file

[Definition]
failregex = Authentication error from <HOST>" > /etc/fail2ban/filter.d/litegix-agent.conf

    echo "[DEFAULT]
ignoreip = 127.0.0.1/8
bantime = 36000
findtime = 600
maxretry = 5


[sshd]
enabled = true
logpath = %(sshd_log)s
port = 22
banaction = iptables

[sshd-ddos]
enabled = true
logpath = %(sshd_log)s
banaction = iptables-multiport
filter = sshd

[litegix-agent]
enabled = true
logpath = /var/log/litegix.log
port = 21000
banaction = iptables
maxretry = 2" > /etc/fail2ban/jail.local
}

function install_mariadb {
    mkdir -p /tmp/lens
    curl -4 $LITEGIX_URL/files/lenses/augeas-mysql.aug --create-dirs -o /tmp/lens/mysql.aug 

    ROOTPASS=$(get_random_string)

    # Start mariadb untuk initialize
    systemctl start mysql

    SECURE_MYSQL=$(expect -c "
set timeout 5
spawn mysql_secure_installation

expect \"Enter current password for root (enter for none):\"
send \"\r\"

expect \"Switch to unix_socket authentication\"
send \"y\r\"

expect \"Change the root password?\"
send \"y\r\"

expect \"New password:\"
send \"$ROOTPASS\r\"

expect \"Re-enter new password:\"
send \"$ROOTPASS\r\"

expect \"Remove anonymous users?\"
send \"y\r\"

expect \"Disallow root login remotely?\"
send \"y\r\"

expect \"Remove test database and access to it?\"
send \"y\r\"

expect \"Reload privilege tables now?\"
send \"y\r\"

expect eof
")
    echo "$SECURE_MYSQL"


#     /usr/bin/augtool -I /tmp/lens/ <<EOF
# set /files/etc/mysql/my.cnf/target[ . = "client" ]/user root
# set /files/etc/mysql/my.cnf/target[ . = "client" ]/password $ROOTPASS
# save
# EOF

/usr/bin/augtool -I /tmp/lens/ <<EOF
set /files/etc/mysql/my.cnf/target[ . = "client" ]/user root
set /files/etc/mysql/my.cnf/target[ . = "client" ]/password $ROOTPASS
set /files/etc/mysql/my.cnf/target[ . = "mysqld" ]/bind-address 0.0.0.0
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/innodb_file_per_table 1
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/max_connections 15554
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_size 80M
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_type 1
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_limit 2M
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/query_cache_min_res_unit 2k
set /files/etc/mysql/conf.d/mariadb.cnf/target[ . = "mysqld" ]/thread_cache_size 60
save
EOF

echo "[client]
user=root
password=$ROOTPASS
" > /etc/mysql/conf.d/root.cnf

    chmod 600 /etc/mysql/conf.d/root.cnf
}

function install_webapp {
    USER="litegix"
    LITEGIX_PASSWORD=$(get_random_string)
    HOMEDIR="/home/$USER/"
    groupadd users-rc
    adduser --disabled-password --gecos "" $USER
    usermod -a -G users-rc $USER

    echo "$USER:$LITEGIX_PASSWORD" | chpasswd
    chmod 755 /home
    mkdir -p $HOMEDIR/logs/{nginx,apache2,fpm}

    # FACL
    setfacl -m g:users-rc:x /home
    setfacl -Rm g:users-rc:- /home/$USER
    setfacl -Rm g:users-rc:- /etc/mysql
    setfacl -Rm g:users-rc:- /var/log
    setfacl -Rm g:$USER:rx /home/$USER/logs


    mkdir -p /opt/Litegix/{.ssh,letsencrypt}


    echo "-----BEGIN DH PARAMETERS-----
MIICCAKCAgEAzZmGWVJjBWNtfh1Q4MrxFJ5uwTM6xkllSewPOdMq5BYmXOFAhYMr
vhbig5AJHDexbl/VFp64S6JaokQRbTtiibBfHV92LCK9hVRJ2eB7Wlg6t5+YYjKc
QiNxQ/uvSG3eqmAAr39V3oUWxeyCj/b1WdUVkDuKdJyHevDgfaoyFl7JHymxwvrn
HR9/x7lH5o2Uhl60uYaZxlhzbbrqMU/ygx9JCj6trL5C5pv9hpH+2uJdvkp/2NJj
BJCwiHmLMlfqXA3H8/T7L0vn/QLk1JUmqQeGdvZFqEmCe//LAT8llGofawtOUUwT
v65K1Ovagt7R9iu+nOFIh6XPsLVLemq2HFy+amk+Ti4UZ+EJxvO+s84LxSvAqjsk
clEE2v+AlIbe8Hjo6YzubXtqSrFLD049kxocPdQXqbDbvlI6br1UjYgWl08upKSZ
fIwCFFsqwE4y7zRg1VY7MKc0z6MCBU7om/gI4xlPSSBxAP1fN9hv6MbSV/LEvWxs
pFyShqTqefToDKiegPpqBs8LAsOtuH78eSm18SgKYpVPL1ph0VhhbphbsmKxmqaU
+EP6bSOc2tTwCMPWySQslHN4TdbsiQJE/gJuVeaCLM1+u4sd0rU9NQblThPuOILp
v03VfaTd1dUF1HmcqJSl/DYeeBVYjT8GtAKWI5JrvCKDIPvOB98xMysCAQI=
-----END DH PARAMETERS-----" > /etc/nginx-rc/dhparam.pem
}

function install_agent {
    AGENTLOCATION="/Litegix/Packages/LitegixAgent"
    cp $AGENTLOCATION/config.json.example $AGENTLOCATION/config.json
    sed -i "s/{SERVERID}/KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb/g" $AGENTLOCATION/config.json
    sed -i "s/{SERVERKEY}/wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf/g" $AGENTLOCATION/config.json
    sed -i "s/{ENVIRONMENT}/production/g" $AGENTLOCATION/config.json
    sed -i "s/{WEBSERVER}/nginx/g" $AGENTLOCATION/config.json

    chmod 600 $AGENTLOCATION/config.json

    mkdir -p $AGENTLOCATION/ssl/

    echo "-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAsfzEPPWWMy7eteDAJJzHp6xQWOX1Mp1UUOJZHGzoUou6n26x
aDq5COOKEgW8lnzVxQZgmSPU4SjfZYYRtA400OlQ/AeRvh9PJPVY2mvKlrVzAw0Q
qHOIs7eegQU5Uw2EwaN4yvDjFZoN7nDUjNXFOpozl6SC3tVF3ofWvWqfjdNU0kgQ
3yoSk5hjrBu+q8691dgLfT9xMZWT0jqdC6TSgkD9W52uVysaXGXq3XhrdjGUN+Se
1OdRpIUVCyfq0LYvmAHnmGLj44LGgUm18xIagFfPeZqbVHv1Q3lkVM012eiK8cTG
YDsLRvtw0DslXfIthpx8uqg5i82FFlb/sFKbzwIDAQABAoIBAGg/ROzzZqrJy/W5
ErEfBq2FdnXrEkc38PeC63CDtTsLzh2tZslGg7PaGbdelsuJiGdiyddILlpGZzn+
YYYVQAgQb7d983XovqFF9mnP8pN86UUjNNuE989TP8oPtjiX1WbZCVnL5yVy2rAK
c+OdHWyqfodV+rTrM4YYB8Vfmt4kq92ZXkjF5jCpBvItVFSrdYRiakNdT5zZv6T4
Utk/ys/uvS1YY4Kv4+DT1iBsuGwj6gWvL5G/qEzPzhKV4j0NnSPsNkhUMP7kTQlK
LuW185RDAyuCPJiYIX6XEoJW9wxUERGZKEQx1wyZCUJpYKaZpGogiNMM/KEeZG2z
IPxDu8ECgYEA32VI2w/0Rz86AnfYDauwVIMywJy/eRl7gthpMlJrTcWV5tLJPY2q
rCDYduGNbg1Hjx9nZED5d4Wdc1geT179uyQJGeeNVAT5Oa4DcVZQ6UZjlYLcKqRS
h9J8k7Wmj8Ltr7y4B4KchVQfpZIOIeO+6Nq0buTh0MEGjVQb3Ni4iO8CgYEAy/bl
WPgIEenVD+Cwn7hrOhJ0UocwFbD48zgtCmHQHDmDboqo/cFIT8M6Oj8VzsClay9U
fcBOEAgwRiyhya7Fo4VqliimtUvzjwP6jO9C39VKbjiFLVfLuUC5lNJ+mb40V76p
eyTAwvugyrTTGRlp8V3/Ee0UJ7nZt9iyMP3kWyECgYAvq6xlWr006vAVEL/hAu8o
yapt4cUWMXLi1A12uJG/UdeQHxDkerOd8ZBfpfgJMPpBN2FXymmxsKiNsZMeOtYI
NkNe7MOC12Dbhx+i8tlnPicIA5m528DkzOzalFvLt7wC0VGwAJYn+XCbY1RytOfL
RshUFbF+W4JrbDRZ50FRrwKBgQDEzzpC/SKcVmu25HLJy+P7py8DK1tkst2lo0Ei
0XtEoOKH2dhy8vxZquIWriTW2eFEaek3ZkZtBdm+/PYobDJdNTHCLvud2OntyEMN
lxmKbn9hl7w6Iot7+E6aofpzU6uiN2HGZ5JxEuj2cEF56KHnu3GS1JcsNhM1aS2Y
RIUCwQKBgAsj2mbaIpK9rj7wgO5O2M5SXjr9I6fkG8QVNZeVrkNx0u3Up0iwRrPm
YgZhFYnRGS9LiPYv7sTAann+ZBk5CdxFAAPrKdGPO0YgTwRPqez21cQCQRAJZ9ZB
OkMmqD7AuJLTZewwuiYeQQVfNCslV8tfGa2PZaVtzrFOg9zMhG4E
-----END RSA PRIVATE KEY-----" > $AGENTLOCATION/ssl/server.key
    echo "-----BEGIN CERTIFICATE-----
MIIEKzCCAxOgAwIBAgIUDgXxNwUF3Hi34xMsS70FZ4H1taAwDQYJKoZIhvcNAQEL
BQAwgaoxCzAJBgNVBAYTAk1ZMQ4wDAYDVQQIDAVKb2hvcjEPMA0GA1UEBwwGU2t1
ZGFpMRwwGgYDVQQKDBNDb29sIENvZGUgU2RuLiBCaGQuMREwDwYDVQQLDAhSdW5D
bG91ZDEnMCUGA1UEAwweUnVuQ2xvdWQgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MSAw
HgYJKoZIhvcNAQkBFhFmaWtyaUBydW5jbG91ZC5pbzAgFw0yMTA2MTQwODQ4MDVa
GA85OTk5MTIzMTIzNTk1OVowfDELMAkGA1UEBgwCTVkxDjAMBgNVBAgMBUpvaG9y
MQ8wDQYDVQQHDAZTa3VkYWkxGzAZBgNVBAoMElJ1bkNsb3VkIFNkbi4gQmhkLjEY
MBYGA1UECwwPUnVuQ2xvdWQgU2VydmVyMRUwEwYDVQQDDAw2NS4yMS40OS4xNzcw
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCx/MQ89ZYzLt614MAknMen
rFBY5fUynVRQ4lkcbOhSi7qfbrFoOrkI44oSBbyWfNXFBmCZI9ThKN9lhhG0DjTQ
6VD8B5G+H08k9Vjaa8qWtXMDDRCoc4izt56BBTlTDYTBo3jK8OMVmg3ucNSM1cU6
mjOXpILe1UXeh9a9ap+N01TSSBDfKhKTmGOsG76rzr3V2At9P3ExlZPSOp0LpNKC
QP1bna5XKxpcZerdeGt2MZQ35J7U51GkhRULJ+rQti+YAeeYYuPjgsaBSbXzEhqA
V895mptUe/VDeWRUzTXZ6IrxxMZgOwtG+3DQOyVd8i2GnHy6qDmLzYUWVv+wUpvP
AgMBAAGjdDByMA4GA1UdDwEB/wQEAwIF4DAPBgNVHRMBAf8EBTADAgEAMB0GA1Ud
JQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAPBgNVHREECDAGhwRBFTGxMB8GA1Ud
IwQYMBaAFHq6We761kAAeZeMy5OuerSqODBFMA0GCSqGSIb3DQEBCwUAA4IBAQBN
8YUlddD+k3nG9z8i9CiIcC5ywj+OAk1NvOPfa1zvlZsgXliD9VMRTRkrqTqw0LCz
z/qP0PptewKjMDG4G3GSQ5Bs6om2USenUhwXyMNgCMfbUslYceJVXpPkklyFbnfn
RYMj5yoy2vesSZA8p87J6TYKBnZ8LqjkpnJx5/cNDxQ6Eo2USM2dVOIwmjkNadNh
boxqQemaVHXDE+GmWWt2rHgTTyREK5nQekqScXn+n111xnNguGAIa1L3lRt5ec4D
LYGmJdM7UbqQXRLelnGRUlUcMoV0xtEwFYpMiWvpBY5h81XbGgztqVmAZlLCpIeK
TTvozYQgSUsa0xYs6qCU
-----END CERTIFICATE-----" > $AGENTLOCATION/ssl/server.crt
    echo "-----BEGIN CERTIFICATE-----
MIIEOzCCAyOgAwIBAgIJAKUwNSAp1Rc0MA0GCSqGSIb3DQEBCwUAMIGqMQswCQYD
VQQGEwJNWTEOMAwGA1UECAwFSm9ob3IxDzANBgNVBAcMBlNrdWRhaTEcMBoGA1UE
CgwTQ29vbCBDb2RlIFNkbi4gQmhkLjERMA8GA1UECwwIUnVuQ2xvdWQxJzAlBgNV
BAMMHlJ1bkNsb3VkIENlcnRpZmljYXRlIEF1dGhvcml0eTEgMB4GCSqGSIb3DQEJ
ARYRZmlrcmlAcnVuY2xvdWQuaW8wIBcNMTYwOTE2MTQyMTU3WhgPMjExNjA4MjMx
NDIxNTdaMIGqMQswCQYDVQQGEwJNWTEOMAwGA1UECAwFSm9ob3IxDzANBgNVBAcM
BlNrdWRhaTEcMBoGA1UECgwTQ29vbCBDb2RlIFNkbi4gQmhkLjERMA8GA1UECwwI
UnVuQ2xvdWQxJzAlBgNVBAMMHlJ1bkNsb3VkIENlcnRpZmljYXRlIEF1dGhvcml0
eTEgMB4GCSqGSIb3DQEJARYRZmlrcmlAcnVuY2xvdWQuaW8wggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQC5Dhcl1VuuJcERr/Pz2Y9TNwI92/HGhNeib9+U
+vgYccKrWlzS477JOnDbeWq6COS6oCNgVugJwHPgd5jBs8qbe4L9LcvdHvGiBQ/j
s+Gbq0x0/DIAqYVot5G9T2EW9Nao6YTbXaNs8fEWHaWiQsDK9jVYLaHmCFdVk13t
PkG/0i2qc52PO1911fQ+iXNpt3HiOThWpUawPIV/IpFXjWar7wsZhEp9S5VdbsQL
iyluEDSlElBBj8FylaACc45gYn1m/YClGQPNdaOXK/O1F8TvOjRqkkUKLy5en4D7
YImjnnYkYNqOw+IBbylUytq0XdbT9QvBUzT6xbNwUqB6adM9AgMBAAGjYDBeMB0G
A1UdDgQWBBR6ulnu+tZAAHmXjMuTrnq0qjgwRTAfBgNVHSMEGDAWgBR6ulnu+tZA
AHmXjMuTrnq0qjgwRTAMBgNVHRMEBTADAQH/MA4GA1UdDwEB/wQEAwIBhjANBgkq
hkiG9w0BAQsFAAOCAQEAQK1lDleSMV/VCWaMQXK+R7IqY3dl2yYX12Vd9iF+0/Be
TiLgROoHWA527lHVZzaDm73F3ciayS3cnl8+pER8l0QSjGB4a2SD/Wn8FJ1Tsl+j
S6M++lSjeP358nVXjGkDFCmhTjEO5CNgZkb7w6IbjDfh6FkFAoY5F2SASoZpqxLV
w6KrK6vqdTmd+yfwFDtcheyUJvPM3l6hHVzjDOvROT4DMvZ9EictQrDYugDlBwW+
DjdGBnzCDaozBMND0sS/1IDm9fM6jaABjC1mNw9cAV6yvVQn4Jn/scKt6McgpGew
xmR8AAA7gTrrNnEkeRR8JxLiRTipWjykUwFIkRkreg==
-----END CERTIFICATE-----
" > $AGENTLOCATION/ssl/ca.crt
    sleep 1
    cat $AGENTLOCATION/ssl/server.crt $AGENTLOCATION/ssl/ca.crt > $AGENTLOCATION/ssl/bundle.crt

    chmod 600 $AGENTLOCATION/ssl/server.key

    echo "#!/bin/sh
if [ \"\$PAM_TYPE\" != \"close_session\" ]; then
    url=\"https://manage.runcloud.io/webhooks/sshlogin\"
    curl -4 -X POST  \\
        -H \"X-Server-ID: KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb\" \\
        -H \"X-Server-Key: wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf\" \\
        -H \"Content-Type: application/json\" \\
        --data '{\"user\": \"'\$PAM_USER'\", \"ipAddress\": \"'\$PAM_RHOST'\"}' \"\$url\" &
fi
exit
" > /usr/sbin/notifysshlogin

    chmod 700 /usr/sbin/notifysshlogin

    echo "session optional pam_exec.so seteuid /usr/sbin/notifysshlogin" >> /etc/pam.d/sshd
}

function setup_firewall {
    # Stop iptables
    systemctl stop iptables
    systemctl stop ip6tables
    systemctl mask iptables
    systemctl mask ip6tables


    # remove ufw
    apt-get remove ufw -y
    # Start firewalld
    systemctl enable firewalld
    systemctl start firewalld

    # Add litegix service to firewalld
    echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<service>
  <short>Litegix Agent</short>
  <description>Allow your server and Litegix service to communicate to each other.</description>
  <port protocol=\"tcp\" port=\"21000\"/>
</service>" > /etc/firewalld/services/litegix.xml

    echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<zone>
  <short>Litegix</short>
  <description>litegix zone to use with Litegix Server</description>
  <service name=\"rcsa\"/>
  <service name=\"dhcpv6-client\"/>
  <port protocol=\"tcp\" port=\"22\"/>
  <port protocol=\"tcp\" port=\"80\"/>
  <port protocol=\"tcp\" port=\"443\"/>
</zone>" > /etc/firewalld/zones/litegix.xml

    sleep 3

    firewall-cmd --reload # reload to get litegix
    firewall-cmd --set-default-zone=litegix
    firewall-cmd --reload # reload to enable new config
}

function install_composer {
    ln -s /Litegix/Packages/$PHP_CLI_VERSION/bin/php /usr/bin/php

    source /etc/profile.d/litegixpath.sh
    # php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    wget -4 https://getcomposer.org/installer -O composer-setup.php
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    mv composer.phar /usr/sbin/composer

}

function register_path {
    echo "#!/bin/sh
export PATH=/Litegix/Packages/apache2-rc/bin:\$PATH" > /etc/profile.d/litegixpath.sh

    echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p
    echo net.core.somaxconn = 65536 | tee -a /etc/sysctl.conf && sysctl -p
    echo net.ipv4.tcp_max_tw_buckets = 1440000 | tee -a /etc/sysctl.conf && sysctl -p
    echo vm.swappiness=10 | tee -a /etc/sysctl.conf && sysctl -p
    echo vm.vfs_cache_pressure=50 | tee -a /etc/sysctl.conf && sysctl -p
    echo vm.overcommit_memory=1 | tee -a /etc/sysctl.conf && sysctl -p


    /usr/bin/augtool <<EOF
set /files/etc/ssh/sshd_config/UseDNS no
set /files/etc/ssh/sshd_config/PasswordAuthentication yes
set /files/etc/ssh/sshd_config/PermitRootLogin yes
save
EOF
    systemctl restart sshd

}

function system_service {
    #systemctl enable litegix-agent
    #systemctl start litegix-agent

    systemctl disable supervisord
    systemctl stop supervisord

    systemctl disable redis-server
    systemctl stop redis-server

    systemctl disable memcached
    systemctl stop memcached

    systemctl disable beanstalkd
    systemctl stop beanstalkd


    # Fix fail2ban
    touch /var/log/litegix.log

    systemctl enable fail2ban
    systemctl start fail2ban
    systemctl restart fail2ban

    systemctl enable mysql
    systemctl restart mysql

}

locale-gen en_US en_US.UTF-8

export LANGUAGE=en_US.utf8
export LC_ALL=en_US.utf8
export DEBIAN_FRONTEND=noninteractive

# Checker
if [[ $EUID -ne 0 ]]; then
    message="This installer must be run as root!"
    echo $message 1>&2
    send_data '{"status": "err", "message": "'"$message"'"}'
    exit 1
fi

if [[ "$OS_NAME" != "Ubuntu" ]]; then
    message="This installer only support $OS_NAME"
    echo $message
    send_data '{"status": "err", "message": "'"$message"'"}'
    exit 1
fi

if [[ $(uname -m) != "x86_64" ]]; then
    message="This installer only support x86_64 architecture"
    echo $message
    send_data '{"status": "err", "message": "'"$message"'"}'
    exit 1
fi

grep -q $OS_VERSION <<< $SUPPORTED_VERSIONS
if [[ $? -ne 0 ]]; then
    message="This installer does not support $OS_NAME $OS_VERSION"
    echo $message    
    send_data '{"status": "err", "message": "'"$message"'"}'
    exit 1
fi

# existing services checker

if [[ $SERVICES == *"nginx"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" Nginx"
fi

if [[ $SERVICES == *"apache2"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" Apache"
fi

if [[ $SERVICES == *"lshttpd"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" LiteSpeed"
fi

if [[ $SERVICES == *"mysql"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" MySQL"
fi

if [[ $SERVICES == *"mariadb"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" MariaDB"
fi

if [[ $SERVICES == *"php"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" PHP"
fi

if [[ $SERVICES == *"webmin"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" Webmin"
fi

if [[ $SERVICES == *"lscpd"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" CyberPanel"
fi

if [[ $SERVICES == *"psa"* ]]; then
  let "DETECTED_SERVICES_COUNT+=1"
  DETECTED_SERVICES_NAME+=" Plesk Panel"
fi

if [[ $DETECTED_SERVICES_COUNT -ne 0 ]]; then
    message="Installer detected $DETECTED_SERVICES_COUNT existing services;$DETECTED_SERVICES_NAME. Installation will not proceed."
    echo $message
    curl -4 -H "Content-Type: application/json" -X POST https://manage.runcloud.io/webhooks/serverinstallation/status/KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb/wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf -d '{"status": "err", "message": "'"$message"'"}'
    exit 1
fi

# end services checker

# Checking open port
send_state "start"
#check_port

# Bootstrap the server
send_state "config"
bootstrap_server

# Bootstrap the installer
send_state "update"
bootstrap_installer

# Enabling Swap if Not Enabled
send_state "swap"
enable_swap

# Install The Packages
send_state "packages"
install_packages

# Supervisor
send_state "supervisor"
install_supervisor

# Fail2Ban
send_state "fail2ban"
install_fail2ban

# MariaDB
send_state "mariadb"
install_mariadb

# Web Application
send_state "webapp"
#install_webapp

# Auto Update
send_state "autoupdate"
fix_auto_update

# Agent
send_state "agent"
#install_agent

# Firewall
send_state "firewall"
setup_firewall

# Composer
send_state "composer"
install_composer

# Tweak
send_state "tweak"
register_path

# Systemd Service
send_state "systemd"
system_service

send_state "finish"

## CLEANUP
# This will only run coming from direct installation
if [ -f /tmp/installer.sh ]; then
    rm /tmp/installer.sh
fi
if [ -f /tmp/installation.log ]; then
    rm /tmp/installation.log
fi

echo "
Litegix
- Do not use \"root\" user to create/modify any web app files
- Do not edit any config commented with \"Do not edit\"
" > /etc/motd


# Try register as installed
# Don't attempt to try spam this link. Rate limit in action. 1 query per minute and will be block for a minute
# curl -4 -H "Content-Type: application/json" -X POST https://manage.runcloud.io/webhooks/serverinstallation/firstregistration/KxT0TXo7ABGpH5zxHB3JcKknZe1623833285bNTdK7P7MYEy48xlIdJemQxlqLrtgD6O2SCUtMGy2TiDxyemfVIzZ7rF8xq0QrRb/wjJBIt5dhHfjLqfqeVPkNA0KVAw1EwZgjM5NlVmSJeh1olj2yWBQgEqDSdCbIbg4Ju8yviM4k4dJkgj8jgca5UoX5ag0Qbsjkzsno3BN7ughUIyV0UC1euuaZTzbvAqf 
# systemctl restart litegix-agent

fixHostName=`hostname`
echo 127.0.0.1 $fixHostName | tee -a /etc/hosts

#clear
echo -ne "\n
#################################################
# Finished installation. Do not lose any of the
# data below.
##################################################
\n
\n
\nMySQL ROOT PASSWORD: $ROOTPASS
User: $USER
Password: $LITEGIX_PASSWORD
\n
\n
You can now manage your server using $LITEGIX_URL
"
