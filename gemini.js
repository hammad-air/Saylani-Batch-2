const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const express = require("express");
const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = "AIzaSyAwbaPFT8k16GmIOM3Xd-tbX-L8Q5N5Ss8";

async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // console.log(genAI)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 200,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}

const webApp = express();
const PORT = process.env.PORT || 5000;
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});
webApp.get('/', (req, res) => {
    res.sendStatus(200);
    res.send("Status Okay")
});

webApp.post('/dialogflow', async (req, res) => {

    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    async function fallback() {
        let action = req.body.queryResult.action;
        let queryText = req.body.queryResult.queryText;

        if (action === 'input.unknown') {
            let result = await runChat(queryText);
            agent.add(result);
            console.log(result)
        }else{
            agent.add(result);
            console.log(result)
        }
    }
    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add('Hi, I am your virtual assistant, Tell me how can I help you')
    }
    let intentMap = new Map();
    intentMap.set('hi', hi);
    intentMap.set('Fallback', fallback);
    agent.handleRequest(intentMap);
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});
