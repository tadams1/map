#!/bin/sh

cd maps1
rm -rf node_modules
cd ..
tar cvf m.tar maps1
scp -P 4001 m.tar ecocenec@syd-s19e.hosting-service.net.au:/home/ecocenec/mapapp
cd maps1
npm install
