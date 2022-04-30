#!/bin/bash
#Install nodejs 16.x LTS on Ubuntu
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install nginx-full

#Install MySQL
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql.service
sudo mysql_secure_installation
sudo mysql
# CREATE USER 'cfc'@'localhost' IDENTIFIED BY 'carmelcfc';
# CREATE DATABASE navysea;
# GRANT ALL PRIVILEGES ON navysea.* TO 'cfc'@'localhost' WITH GRANT OPTION;
# FLUSH PRIVILEGES;
