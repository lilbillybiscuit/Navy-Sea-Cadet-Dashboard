#!/bin/bash
#Install nodejs 16.x LTS on Ubuntu
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install nginx-full

#Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
echo "Setting up the database administrator account"
sudo mongo --eval 'db.createUser({user: "administrator",pwd: passwordPrompt(),roles: [{role:"userAdminAnyDatabase", db:"admin"}]})'

echo "Setting up the cfc account"
echo "Please set a password"
sudo mongo --eval 'db.createUser({user:"cfc",pwd: passwordPrompt(),roles: [{role: "readWrite", db: "navysea"}]})'

# sudo apt update
# sudo apt install mysql-server
# sudo systemctl start mysql.service
# sudo mysql_secure_installation
# sudo mysql
# CREATE USER 'cfc'@'localhost' IDENTIFIED BY 'carmelcfc';
# CREATE DATABASE navysea;
# GRANT ALL PRIVILEGES ON navysea.* TO 'cfc'@'localhost' WITH GRANT OPTION;
# FLUSH PRIVILEGES;
