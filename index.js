import { create } from 'venom-bot'
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { start } from './controller/botController.js';

dotenv.config()

mongoose.connect(
  process.env.DB_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB Connected')
  }).catch(err => console.log(err));

create({
    session: 'my-bot',
    multidevice: true
})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro)
    })

