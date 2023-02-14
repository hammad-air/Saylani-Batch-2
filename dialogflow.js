const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add('Welcome to ABC solutions. Do you want to make reservation?')
    }

    function sendEmail(agent) {
        const { number , date , email} = agent.parameters;
       console.log(email)
       console.log(number)
       console.log(person)

       agent.add(``)
    }

    let intentMap = new Map();
    intentMap.set('hi', hi); 
    intentMap.set('sendEmail', sendEmail);
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});