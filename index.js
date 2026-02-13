import TelegramApi from 'node-telegram-bot-api';
import {options} from './options.js'
const token = '8461486817:AAF49x7wZHGS5lSGl_XCmR9-4IlIU_TNu84';

const bot = new TelegramApi(token, {
    polling: {
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});
const chats = {}
console.log('BOT STARTED');



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, попробуй ее отгадать')
    const randomNumber = Math.floor(Math.random() * 10);
    console.log(randomNumber)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай число', options.gameOptions)
}
const start = () => {
    bot.setMyCommands([
        {command: 'start', description: 'start bot'},
        {command: 'info', description: 'get info about you'},
        {command: 'game', description: 'play game'}
    ])
    bot.on('polling_error', (err) => {
        console.log('POLLING ERROR:', err.response?.body || err);
    });
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id

        console.log('MESSAGE:', msg.text);

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/1.webp')
            return bot.sendMessage(chatId, `Hello from Marzhan`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `your name is ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'I dont understand you')
    });

}

bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
        return startGame(chatId)
    }
    if (chats[chatId] === Number(data)) {
        await bot.sendMessage(chatId, 'You win! The number was ' + chats[chatId], options.againOptions)
    } else {
        await bot.sendMessage(chatId, 'You lose! The number was ' + chats[chatId], options.againOptions)
    }
    console.log(msg)
})

start()