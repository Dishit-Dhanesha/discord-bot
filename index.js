import { Client, Intents } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Database from '@replit/database';

dotenv.config()
const db = new Database();


const sadDeclarations = ["sad" , "depressed" , "unhappy" , "angry"]

const encouragements = ["Cheer up!" , "Hang in there." , "You are a great person / bot!"]

//get All the encouragements in an array
db.get("encouragements").then(encouragements => {
    if(!encouragements || encouragements.length < 1){
      db.set("encouragements", startErencouragements)
    }
})

// update Encouragement
function updatencouragements(encoiragingMessage){
    db.get("encouragements").then(encouragements =>{
        encouragements.push([encoiragingMessage])
        db.set("encouragements", encouragements)
    })
}

// Delete Encouragement in an array
function deletencouragement(index){
    db.get("encouragements").then(encouragements =>{
       if(encouragements.length > index){
        encouragements.slice(index , 1)
        db.set("encouregements", encouregements)
       }
        db.set("encouragements", encouragements)
    })
}

//get quote from api data
function getQuote(){
    return fetch("https://zenquotes.io/api/random").then(res =>{
        return res.json();
    })
    .then(data =>{
        return data[0]["q"] + "-" + data[0]["a"]
    })
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("ready", ()=>{
    console.log(`Logged in as ${client.user.tag}`);
})

client.on("message", msg =>{
    if(msg.author.bot) return
    if(msg.content === "$inspire"){
        getQuote().then(quote => msg.channel.send(quote))
    }
    if(sadDeclarations.some(word => msg.content.includes(word))){
        db.get("encouragements").then(encouragement =>{
            const encouragment = encouragements[Math.floor(Math.random() * encouragements.length)]
            msg.reply(encouragment);
        })
    }

    //condition to add new data
    if(msg.content.startsWith("$new")){
        encoiragingMessage = msg.content.split("$new")[1];
        updatencouragements(encoiragingMessage)
        msg.channel.send("New encouraging message Added")
    }
    //condition to delete data
    if(msg.content.startsWith("$del")){
        index = parseInt(msg.content.split("$del")[1]);
        deletencouragement(index)
        msg.channel.send("New encouraging message Deleted")
    }
    //condition to list all the data
    if (msg.content.startsWith("$list")) {
        db.get("encouragements").then(encouragements => {
          msg.channel.send(encouragements)
        })
      }
})

client.login(process.env.TOKEN);