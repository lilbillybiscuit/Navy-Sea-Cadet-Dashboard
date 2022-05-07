#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd /etc/nginx
echo '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' | base64 --decode | tee /etc/nginx/nginxconfig.io-navysea.lilbillbiscuit.com.tar.gz > /dev/null
tar -czvf nginx_$(date +'%F_%H-%M-%S').tar.gz nginx.conf sites-available/ sites-enabled/ nginxconfig.io/
tar -xzvf nginxconfig.io-navysea.lilbillbiscuit.com.tar.gz | xargs chmod 0644
openssl dhparam -out /etc/nginx/dhparam.pem 2048
mkdir -p /var/www/_letsencrypt
chown www-data /var/www/_letsencrypt
sed -i -r 's/(listen .*443)/\1; #/g; s/(ssl_(certificate|certificate_key|trusted_certificate) )/#;#\1/g; s/(server \{)/\1\n    ssl off;/g' /etc/nginx/sites-available/navysea.lilbillbiscuit.com.conf
sudo nginx -t && sudo systemctl reload nginx
sudo snap install certbot --classic
certbot certonly --webroot -d navysea.lilbillbiscuit.com --email info@navysea.lilbillbiscuit.com -w /var/www/_letsencrypt -n --agree-tos --force-renewal
sed -i -r -z 's/#?; ?#//g; s/(server \{)\n    ssl off;/\1/g' /etc/nginx/sites-available/navysea.lilbillbiscuit.com.conf
sudo nginx -t && sudo systemctl reload nginx
echo -e '#!/bin/bash\nnginx -t && systemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
sudo chmod a+x /etc/letsencrypt/renewal-hooks/post/nginx-reload.sh
sudo nginx -t && sudo systemctl reload nginx