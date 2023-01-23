import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config()

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

var maxMessages = 30;

export const getDavinciResponse = async (clientText, conversation) => {

    let name = conversation.name;

    let previousMessages = conversation.messages
      .slice(-1 * maxMessages)
      .map(msg => msg.text)
      .join("\n");

    const options = {
        model: "text-davinci-003",
        prompt: `Person Name: ${name}\n
        Conversation History: ${previousMessages}\n
        Person Message: ${clientText}`,
        temperature: 1,
        max_tokens: 1000,
      };

    try {
      const response = await openai.createCompletion(options);
      let botResponse = "";
      response.data.choices.forEach(({ text }) => {
          botResponse += text;
      });
      return botResponse.trim();
    } catch (e) {
        if (e.response.data.error.message.includes("Please reduce your prompt")) {
          maxMessages -= 5;
          if (maxMessages < 0) {
              return "Error: Could not generate response due to token limit.";
          } else {
              console.log("Reducing max messages to: " + maxMessages)
              return getDavinciResponse(clientText, conversation, maxMessages);
          }
        } else {
          console.log("Error: " + e.response.data.error.message);
          return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
        }
    }
}