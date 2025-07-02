docker build -t walaoe . && docker rm -f -v walaoe && docker run -d --name walaoe -p 3000:3000 walaoe
