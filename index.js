const express = require("express");
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import the appropriate class
const {
    WebhookClient
} = require('dialogflow-fulfillment');

app.get("/api", async (req, res) => {
    await axios.get("http://api.openweathermap.org/data/2.5/weather?zip=45130,th&appid=8efa2195cd4a7f31779eebab3943035f")
        .then(result => {
            const { name, main: { temp } } = result.data;

            res.send(`อุณหภูมิ ${name} ตอนนี่อยู่ที่ ${parseInt(temp) - 273} °`)
        })
})

app.post('/webhook', (req, res) => {
    console.log('POST: /');
    console.log('Body: ', req.body);

    //Create an instance
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    //Test get value of WebhookClient
    console.log('agentVersion: ' + agent.agentVersion);
    console.log('intent: ' + agent.intent);
    console.log('locale: ' + agent.locale);
    console.log('query: ', agent.query);
    console.log('session: ', agent.session);

    //Function Location
    function hi(agent) {
        agent.add('Welcome to Thailand.');
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Hi', hi);  // "Location" is once Intent Name of Dialogflow Agent
    agent.handleRequest(intentMap);
});

app.listen(3000)