source ~/.nvm/nvm.sh
pm2 stop dwconnector
git pull origin main
npm install
npm run build
pm2 start build/src/main.js --name dwconnector