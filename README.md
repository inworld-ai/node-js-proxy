### node-js-proxy

#### Description
This project creates a Node.js based RESTful proxy of Inworld.ai's streaming SDK.

#### Requirements

+ Node v16.15.1
+ NPM v8.11.0
+ GIT
+ Inworld.ai Account API Key, Secret a Scene ID


#### Installation

```
git clone https://github.com/inworld-ai/node-js-proxy
cd node-js-proxy
npm i
cp .env-sample .env
```

Fill in the .env variables with the Inworld.ai account information.


#### Running
Development
```
npm run dev
```

Production
```
npm start
```

#### Linux Server Installation

To run the server as a stable daemon that will restart on boot. Use PM2 from the project directory.
```
sudo npm install -g pm2
pm2 startup
pm2 save
pm2 start pm2.sh --name inworld
pm2 save
```

#### RESTful Routes
Import the exported Postman workspace located in this project's folder at
`postman/Inworld AI.postman_collection.json`. The Postman Agent desktop application
is needed to run the calls via localhost. You may need to update the POST Body data for the
workspace scene id to your own as well as for any custom scenes/characters
