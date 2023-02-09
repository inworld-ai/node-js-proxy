# node-js-proxy
<br />

## Description
<br/>

This project is a Node.js based RESTful service of Inworld AI streaming SDK. The service allows
for creation, management and closure of multiple AI character sessions. The service can handle
multiple users as well as multiple servers automatically depending on how the Character session
is created. The service can access characters from many scenes contained within a single Inworld
Workspace.
<br/><br/>

## Table of Contents
<br/>

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Running](#running)
4. [HTTP RESTful Routes](#restfulroutes)
5. [PM2 Server Installation & Setup (Optional)](#pm2)
<br/><br/>

## <a id="requirements" name="requirements"></a>Requirements
<br/>

+ Node v16.15.1
+ NPM v8.11.0
+ GIT
+ Inworld.ai Account API Key, API Secret and a default Scene ID
<br /><br/>

## <a id="installation" name="installation"></a>Installation
<br/>

Copy and paste the following lines into your terminal and hit enter to install and setup the service.

```
git clone https://github.com/inworld-ai/node-js-proxy
cd node-js-proxy
npm i
cp .env-sample .env
```

Open the .env file in an editor and fill in the variables explained below
1. INWORLD_KEY - Located at [Inworld AI](https://studio.inworld.ai) under Integrations -> API Keys -> Key. Note: API Keys are unique for each Workspace.
2. INWORLD_SECRET - Located at [Inworld AI](https://studio.inworld.ai) under Integrations -> API Keys -> Secret. Note: API Secrets are unique for each Workspace.
3. INWORLD_SCENE - Located at [Inworld AI](https://studio.inworld.ai) under Scenes. Click the button to copy the machine readable id. Note: This is a default scene only used for testing upon starting the service.
4. PORT - The port to use to run the REST service on. Default is 3000. Note: HTTPS for port 443 is currently not implemented. 
<br /><br />

## <a id="running" name="running"></a>Running
<br/>

### Development - This will monitor the code for any changes and automatically restart when a file is saved.

```
npm run dev
```

### Production

```
npm start
```

### Generating Documentation - If you contribute to this OpenSource use this to update the code documentation.

```
npm run docs
```
<br/>

## <a id="restfulroutes" name="restfulroutes"></a>HTTP RESTful Routes
<br/>
The following is a list of the HTTP routes used in running this service. 

+ Checking if the server is active - GET /status
+ 

Included is a Postman Collection file you can import and test the routes with.
Import the exported Postman workspace located in this project's folder at
`postman/Inworld AI.postman_collection.json`. The Postman Agent desktop application
is needed to run the calls via localhost. You may need to update the POST Body data for the
workspace scene id to your own as well as for any custom scenes/characters
<br/><br/>

## <a id="pm2" name="pm2"></a>PM2 Server Installation & Setup (Optional)
<br/>

PM2 can be used to run on a dedicated server in the background as a stable daemon that will restart on crashing and reboot. More documentation on PM2 can be found [here](https://pm2.keymetrics.io/docs/usage/quick-start/)
```
sudo npm install -g pm2
pm2 startup
pm2 start pm2.sh --name inworld
pm2 save
```
<br /><br/>