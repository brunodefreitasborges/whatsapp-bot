import { getDavinciResponse } from "../services/davinciService.js";
import { Conversation } from "../models/Conversation.js";
import * as dotenv from 'dotenv';

dotenv.config()

const allowedContacts = ["Daniela", "Bruno Borges", "Mell", "Caetano Vasconcelos"];

export async function start(client) {
  client.onAnyMessage(async (message) => {
      let conversation = await Conversation.findOne({ contact: message.from });
      if (!conversation) {
        conversation = new Conversation({
        contact: message.from,
        name: message.notifyName,
        messages: []
        });
      await conversation.save();
      }
      if (message.text != undefined && message.text != null && message.text != ""
      && allowedContacts.includes(message.notifyName)) {
        console.log("Message from known contact: " + message.notifyName);
        let question = message.text.trim();
        const punctuationMarks = [".", "!", "?"];
        if (!punctuationMarks.some(mark => question.endsWith(mark))) {
          question += ".";
        }
        conversation.messages.push({
            speaker: "user",
            text: question,
            timestamp: Date.now()
        });
        const response = await getDavinciResponse(question, conversation);
        if(response.length > 0) {
          await client.sendText(message.from, response);
          conversation.messages.push({
              speaker: "bot",
              text: response,
              timestamp: Date.now()
          });
          await conversation.save();
        } else {
          await client.sendText(message.from, "...")
        }
       
      } else if(message.text == undefined || message.text == null){
      console.log("Media message received");
      } else {
        console.log("Message from unknown contact: " + message.notifyName);
      }
  });
  };