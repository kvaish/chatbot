const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');

const token = '900890771:AAHwYVSifgMid9cy-_DNmqWtZKYpmF4PgmI';
const bot = new TelegramBot(token, {polling: true}); 

const app = firebase.initializeApp({
    apiKey: "AIzaSyC4vDkwKbxaYxELykJU73zv8w4SEYxOyME",
    authDomain: "chatbot-98e06.firebaseapp.com",
    databaseURL: "https://chatbot-98e06.firebaseio.com",
    projectId: "chatbot-98e06",
    storageBucket: "chatbot-98e06.appspot.com",
    messagingSenderId: "977296706537",
    appId: "1:977296706537:web:ab72fe0ced036a41"
});

const ref = firebase.database().ref();
const sitesRef = ref.child("sites");

let siteUrl;

bot.onText(/\/bookmark (.+)/, (msg, match) => {
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Development',
          callback_data: 'development'
        },{
          text: 'Music',
          callback_data: 'music'
        },{
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;
    ogs({'url': siteUrl}, function (error, results) {
      if(results.success) {
        sitesRef.push().set({
          name: results.data.ogSiteName,
          title: results.data.ogTitle,
          description: results.data.ogDescription,
          url: siteUrl,
          thumbnail: results.data.ogImage.url,
          category: callbackQuery.data
        });
        bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!')
  } else {
        sitesRef.push().set({
          url: siteUrl
        });
        bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
      }
    });
  });