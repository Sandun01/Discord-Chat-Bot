const { Client, Intents } = require('discord.js');
const fetch = require("node-fetch");

const keepAlive = require("./server")

// response array
const sadWords = ["sad", "depressed", "unhappy", "angry"];
const encouragements = [
  "Cheer up!", 
  "Hang in there!", 
  "You are a great person!",
]

// generate random quote
function getQuote(){
  return fetch("https://zenquotes.io/api/random")
  .then(res => {
    return res.json()
  })
  .then(data => {
    return data[0]["q"] + " -" + data[0]["a"] 
  })
}

//generate gif (TENOR)
function generateRandomGif(gifType){

  let url = `https://g.tenor.com/v1/search?q=${gifType}&key=${process.env.TENORKEY}&limit=8`
  
  return fetch(url)
  .then(res => {
    return res.json()
  })
  .then(data => {
    const index = Math.floor(Math.random() * data.results.length)
    const gifURL = data.results[index].url
    return gifURL
  })
  .catch(error => {
    console.log(error)
    return null;
  })
  
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {

  if(msg.author.bot) return

  if (msg.mentions.users.has(client.user.id) && !msg.author.bot)   {
    generateRandomGif('Hi').then(gif => {
      msg.reply(`Sandun's Manager is here to help you.😜 \n ${gif}`)
    })
  }

  if (msg.content.toLowerCase() === "sandun"){
    generateRandomGif('Busy').then(gif => {
      msg.reply(`Sorry, Sandun is busy at this moment. 🙃 \n ${gif}`)
    })
  }
  
  if (msg.content === "$inspire"){
    getQuote().then(quote => msg.channel.send(quote))
  }

  if(sadWords.some(word => msg.content.includes(word))){
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
    msg.reply(encouragement)
  }

})

keepAlive()
// login bot
client.login(process.env.TOKEN)
