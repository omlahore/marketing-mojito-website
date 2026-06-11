# URGENT: Run these on Lightsail server (SSH)

## 1. Extract, install, build, start
```bash
cd /var/www/marketing-mojito
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# Full install (needed for build)
npm install

# Build
npm run build

# Start
pm2 delete marketing-mojito 2>/dev/null
pm2 start npm --name marketing-mojito -- start
pm2 save
pm2 status
```

## 2. If .env.local is missing, create it:
```bash
cat > /var/www/marketing-mojito/.env.local << 'ENVEOF'
RESEND_API_KEY=re_E1zafHQ6_DZ4RE2f64mwZ4fifAmKhxLrL
GOOGLE_SHEETS_CLIENT_EMAIL=marketing-mojito-sheets@charged-camera-422113.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqNSlhzSx9aO/R\nYl+jhu76udQJpyoJLXqAsPgu1x/g53O7tC021ax+Om4Tb0+jAvxnyxmcspEss3Ec\nIt5NNMRFBG0X8KqajxJ6OU7FDqHbHKZ7uISbE+2NcHJvDs9J2TYzRSWCmmkBNUb4\nmBBpt5R+sIjZa7hH75PmMbPbe02WnrPsOY/zX/xSFDGfwExgbbZYNRzgvymBF1FE\nXajzLsGXeBnIaE79QcU7ekaNH0Un0hA6LU++fK43fb6uOr6yY3Oh26S4TNn2vxXI\nBxWsTnSO+KoBhxz2oDaEDICZJY63eKTd3ughru7QFd1enUZs1Lw2nbzOFl+jI04+\nBA1xKitdAgMBAAECggEASAqmUFICYbZ3wx0rM9DZ99+NouRRQ38vWacN9O1y/cOZ\nVbpmZM4961OZ4bn8cBfEc74gQhXGoq/00R7lDrKl3DyKXFauLysdfAQjlf6ifVZ8\nFOO9pNHjezk8BkuzayN38G10+fmXNj6xomjikYx1WsYntjcE0dXSuN0SrnRbG8Ox\nd5F/Y9CTWbJK/RSBTBT0roElDV6D9H3lXW2nYrsRJHdKKf+omrijTPtUwSIO0/2e\nrfoUvfRzOHHw2R7qQnEYDUAe6ObmNtrLh7WLZel67epoH/5vdDYm+EXP1ldOwapK\ng0bCXnq4E9S3bp0Pn69uZaU6aOn3zvu2kz5weOB51QKBgQDe64JK0+IuWr7tC6YY\nNBTPI5Y27bhwunjCracisqiqQQxqh+Q6+/STgWqRfJarTFkeQIORX+rQ3kO0EvSi\nE+oOGTOZTDChuXjmKoAgLN+nUz0dns+hvsSwBumMcRUdBzcexW+w8r9HDewH4ogw\nSu6n41aCLmT0jc92l2YRcVn2PwKBgQDDdys/8VaNdoUFYonoHy8/A53u7J29gEAg\n3RCJEpGqVI/IO2CIOupMHZ3hc4Pd8Db/p/r88zxwwzD3e9VQGC50GmD/yzAdt8KD\nkzfD0t9NoZH7KlnLd3K6za3UNsO22ZnVVrCiFqnTDifrzmr8mTM0VJLgrYOxFbgz\nixGbP/3PYwKBgAt3W7VTnr+5pTZ2Me3ux987ul9K7QDHZqzE1+L+A5T2UZgtMz0h\ndpwbvQqMuQdInxDiSqIwp9hkhmD91J19nr1o6HGLLLk03BYiu4JsLHjj3DHo2E8+\ni8luIZc6vdZHZ7tqdmtIoTQbcDebnFu3jv0NwYZisoitvq0f7n0ZMoJrAoGAY7Vr\ni4+5viniS0/r10vpFvTqYJG1GZDNpbX/FF0zjzbZraOUZ4neMPu+qN37O4CpHZr7\n7oLJpx/635P8yYG8WJ+IMZPdtJsjj2jOvobYQEqWJBCDg8Yn8WCwNpvFFIZF8czq\nB5UWBkKnXKOMcdRYiW5HCnOYxQG2WByt24s2Fs8CgYEAnBdE0pVydOhzYJ0INHY4\ntyb1NwmZa/4kkaCR86mup+m93jxt3cNu9aESlGJtorHq8+ZQxdI+p6jUoxFMe5w+\nnTxD2pqJ2RZkMXYe3uR51eGZQ6BeLMG3cIhQQM+WtdKgjwu7Tw5q5CmZE4punixU\np7W+4cEUWvbAQQJBu78MMDM=\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1g9SOpyfqanxn41dRxSWe4oY4C5h0UoYwYdSxUzzVDqs
ENVEOF
```
## 3. Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/marketing-mojito << 'NGINX'
server {
    listen 80;
    server_name marketingmojito.com www.marketingmojito.com 13.232.187.181;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/marketing-mojito /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

## 4. Test
```bash
curl -I http://localhost:3000
curl -I http://13.232.187.181
```

## 5. DNS (AWS Route 53)
marketingmojito.com hosted zone: Z05400832FYVV487ELHT4
A records point to Lightsail: 13.232.187.181
To update: `aws route53 change-resource-record-sets --hosted-zone-id Z05400832FYVV487ELHT4`

## 6. SSL (after DNS propagates)
```bash
sudo certbot --nginx -d marketingmojito.com -d www.marketingmojito.com --non-interactive --agree-tos -m om.mojito@gmail.com
```
