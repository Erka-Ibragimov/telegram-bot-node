const TelegramApi = require("node-telegram-bot-api");
const token = "5872614035:AAHSCk9b9IOutumdws1XefI2x-simRpGCL8";
const bot = new TelegramApi(token, {
  polling: true,
  request: { proxy: "http://10.8.88.123:8080" },
});
const { gameOptions, againOptions } = require("./options.js");
const chats = {};

const startGame = async (id) => {
  await bot.sendMessage(
    id,
    "Сейчас я загадаю число от 0 до 9, ты должен его отгадать!"
  );
  const randomInt = Math.floor(Math.random() * 10);
  chats[id] = randomInt;
  await bot.sendMessage(id, "Отгадай число!", gameOptions);
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "О себе" },
    { command: "/game", description: "Поиграй со мной)" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const id = msg.chat.id;
    if (text == "/start") {
      await bot.sendSticker(
        id,
        "https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/1"
      );
      return await bot.sendMessage(id, "Добро пожаловать на мой канал!");
    }
    if (text == "/info") {
      return await bot.sendMessage(
        id,
        `Вас зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text == "/game") {
      return startGame(id);
    }
    return await bot.sendMessage(id, "Я вас не понимаю, попробуйте еше раз!");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const id = msg.message.chat.id;
    if (data == "/again") {
      return startGame(id);
    }
    if (data == chats[id]) {
      return await bot.sendMessage(
        id,
        `Поздравляю, ты отгадал цифру ${chats[id]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        id,
        `К сожалению ты не отгадал, бот загадал цифру ${chats[id]}`,
        againOptions
      );
    }
  });
};
start();
