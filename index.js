const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');

const token = '900890771:AAHwYVSifgMid9cy-_DNmqWtZKYpmF4PgmI';
const bot = new TelegramBot(token, { polling: true });

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

const complaint = {
  category: "",
  description: "",
  contact: "",
  timesloat: "",
  key: ""
}

function askContact(msg) {
  // var option = {
  //   "reply_markup": {
  //     "one_time_keyboard": true,
  //     "keyboard": [[{
  //       text: "My phone number",
  //       request_contact: true
  //     }], ["Cancel"]]
  //   }
  // };
  bot.sendMessage(msg.chat.id, "How can we contact you?").then((contact) => {
    console.log({ contact });
    // handle user phone
  });
}
function askTimeSlot(msg) {
  var option = {
    "parse_mode": "Markdown",
  };
  bot.sendMessage(msg.chat.id, "What time slot do u prefer (hh:mm - hh:mm)?", option).then(() => {
    // handle user phone
  })
}
bot.onText(/\/newcomplaints/, (msg, match) => {
  siteUrl = match[1];
  console.log("no", siteUrl)
  var option = {
    "parse_mode": "Markdown",
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Plumber',
          callback_data: 'plumber'
        }, {
          text: 'Electrition',
          callback_data: 'electrition'
        }, {
          text: 'Carpenter',
          callback_data: 'carpenter'
        }
      ]]
    }
  };
  bot.sendMessage(msg.chat.id, `Got it ${msg.chat.first_name}, in which category?`, option)
});

bot.onText(/\/mycomplaints/, (msg, match) => {
  siteUrl = match[1];
  console.log("sadasd");
 const j =  ref.child("sites").once('value').
 then(snapshot => {
  values  = Object.values(snapshot.val());
  val1 = values.filter(v => {
    v.name != 'Kavita';
  });
  console.log(val1)
  let str = "";
  val1.forEach(el => {
    el => str += el.description;
  });  
  console.log(val1);
  bot.sendMessage(msg.chat.id, `details ===> ${str}`)
 }
  );
 
  bot.sendMessage(msg.chat.id, `fetching details`)
});

bot.on("contact",(msg)=>{
  complaint.contact = msge.contact  
})
bot.on('message', (msg) => {
  console.log(msg.text);
  if (msg.text === 'mycomplaints') return;
  console.log({complaint});
  if (complaint.category && !complaint.description) {
    complaint.description = msg.text;
    console.log(complaint);
    askContact(msg);
    return;
  }

  if (complaint.category && complaint.description && !complaint.contact) {
    complaint.contact = msg.text;
    askTimeSlot(msg);
    return;
  }
 

  if (complaint.category && complaint.description && complaint.contact) {
    complaint.timesloat = msg.text;
    sitesRef.push().set({
      name: msg.chat.first_name,
      description: complaint.description,
      timesloat: complaint.timesloat,
      category: complaint.category,
      chatId: msg.chat.id,
     
    });
    bot.sendMessage(msg.chat.id, 'your complaint registered.');
    
    return;
  }
  else if (complaint.category && complaint.description && complaint.contact && !complaint.timesloat) {
    askTimeSlot(msg);
   // return;
  }
});


bot.on("callback_query", (callbackQuery) => {
  const msg = callbackQuery.message;
  if (['plumber', 'carpenter', 'electrition'].indexOf(callbackQuery.data) > -1) {
    complaint.category = callbackQuery.data;
  }
  bot.sendMessage(msg.chat.id, `Please endter briefly help u needed?`).then((msg) => {
      
    })
});