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
4. [Documentation](#documentation)
5. [PM2 Server Installation & Setup (Optional)](#pm2)
<br/><br/>

## <a id="requirements" name="requirements"></a>Requirements
<br/>

+ Node v16.15.1+
+ NPM v8.11.0+
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
5. EMOTIONS - A boolean that sets if emotions are enabled for the sessions. true for on. false for off.
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

### Generating Documentation - If you contribute to this OpenSource project use this to update the code documentation.

```
npm run docs
```
<br/>

## <a id="documentation" name="documentation"></a>Documentation
<br/>

+ Route Documentation - Can be found on Postman [here](https://documenter.getpostman.com/view/8476904/2s935sn1cT) 
+ Code Documentation - The TSDocs code documentation can be found in this project at `docs/index.html`

Use the route documentation to open a session and generate a Session ID. Use that Session ID to send a chat message to the character and then get the events to retrieve the response messages. It is important to close the session after the chat has been completed to prevent conflicts and duplicate sessions. 

<b>Basic Route Flow:</b> 
1. <b>Session Open</b> - Opens a new chat session with a character
2. <b>Session Send Chat Message</b> - Sends a chat message to the character
3. <b>Service Get All Events</b> - Retrieves the response messages from the character
4. <b>Session Close</b> - End the chat session with the character

Included in this project is a Postman Collection file you can import and test the routes with. The file is located in this project at `postman/Inworld RESTful API Routes.postman_collection.json`. To change the default server host from `http://localhost:3000`, select the `Inworld RESTful API Routes` collection and click on the `Variables` tab. Update the `{{HOST}}` variable to reflect a new base url.

<b>Note:</b> The Postman Agent desktop application is needed to call the routes via `http://localhost:3000`.
<br/><br/>

## <a id="pm2" name="pm2"></a>PM2 Server Installation & Setup (Optional)
<br/>

PM2 can be used to run on a dedicated server in the background as a stable daemon that will restart on crashing and reboot. More documentation on PM2 can be found [here](https://pm2.keymetrics.io/docs/usage/quick-start/)

#### PM2 Terminal Installation Commands
```
sudo npm install -g pm2
pm2 startup
pm2 start pm2.sh --name inworld
pm2 save
```
<br /><br/>