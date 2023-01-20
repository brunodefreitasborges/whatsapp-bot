import { create } from 'venom-bot'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai"

dotenv.config()

create({
    session: 'my-bot',
    multidevice: true
})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro)
    })

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_KEY,
});
  
const openai = new OpenAIApi(configuration);

let conversation = {
    messages: []
};

async function start(client) {
    client.onAnyMessage((message) => {
        if (message.notifyName === "Daniela") {
            const question = message.text.trim();
            conversation.messages.push({
                text: question,
                timestamp: Date.now()
            });
            getDavinciResponse(question, conversation).then((response) => {
                client.sendText(message.from, response);
                conversation.messages.push({
                    text: response,
                    timestamp: Date.now()
                });
                console.log(conversation);
            });
        }
    });
}

const getDavinciResponse = async (clientText, conversation) => {
    const previousMessages = conversation.messages.map(msg => msg.text).join("\n");
    const options = {
        model: "text-davinci-003",
        prompt: `${previousMessages}\n${clientText}`,
        temperature: 1,
        max_tokens: 1000,
    }
  
    try {
        const response = await openai.createCompletion(options)
        let botResponse = ""
        response.data.choices.forEach(({ text }) => {
            botResponse += text;
        })
        return botResponse.trim();
    } catch (e) {
      console.log("Erro: " + e.response.data.error.message);
        return `❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
}

