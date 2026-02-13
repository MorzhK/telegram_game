import 'dotenv/config';
import express from 'express';
import TelegramApi from 'node-telegram-bot-api';
import { options } from './options.js';

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const bot = new TelegramApi(token);

const chats = {};

console.log('BOT STARTED');

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал число от 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, 'Отгадай число', options.gameOptions);
};

app.post(`/bot${token}`, async (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        return bot.sendMessage(chatId, 'Hello from Marzhan');
    }

    if (text === '/info') {
        return bot.sendMessage(
            chatId,
            `your name is ${msg.from.first_name} ${msg.from.last_name}`
        );
    }

    if (text === '/game') {
        return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'I dont understand you');
});

bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
        return startGame(chatId);
    }

    if (chats[chatId] === Number(data)) {
        await bot.sendMessage(chatId, 'You win!', options.againOptions);
    } else {
        await bot.sendMessage(
            chatId,
            `You lose! Number was ${chats[chatId]}`,
            options.againOptions
        );
    }
});

app.listen(PORT, async () => {
    console.log('SERVER STARTED');

    const url = process.env.RENDER_EXTERNAL_URL;
    await bot.setWebHook(`${url}/bot${token}`);

    console.log('WEBHOOK SET');
});