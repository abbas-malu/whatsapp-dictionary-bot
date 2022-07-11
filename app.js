const qrcode = require("qrcode-terminal");
const { MessageMedia } = require("whatsapp-web.js");
const { Client } = require("whatsapp-web.js");
const fetch = require("node-fetch");

// client declaration
const client = new Client();


// qr code generation
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});



// client ready log
client.on("ready", () => {
  console.log("Client is ready!");
});



// misc functions and variable defination and declaration
let qry_word;


// client message function
client.on("message", async (message) => {
  // query word extraction
  qry_word = message.body
    .replace(/what/i, "")
    .replace(/meaning/i, "")
    .replaceAll(/ /g, "")
    .replace(/is/i, "")
    .replace(/the/i, "")
    .replace(/of/i, "");
  console.log(qry_word);
  message.reply(qry_word);



  // fetch meaning response
  let results = "";
  let defCount = 0;


  // api call
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${qry_word}`
  );
  const data = await response.json();
  

  // response proccesing and replying
  if (data.title == undefined) {
    let meanings = data[0].meanings[0].definitions;
    meanings.forEach((element) => {
      if (element.example == undefined) {
        results += `\nDefination ${++defCount} : ${element.definition}\n`;
      } else {
        results += `\nDefination ${++defCount} : ${element.definition}
Example ${defCount} : ${element.example}\n`;
      }
    });
    message.reply(results);
  } else {
    message.reply("No meaning found");
  }
});


// whatsapp client initilization
client.initialize();

