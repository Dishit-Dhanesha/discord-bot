import { Client, Intents } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Database from '@replit/database';

dotenv.config()
const db = new Database();


const sadDeclarations = ["sad" , "depressed" , "unhappy" , "angry"]

const encouragements = ["Cheer up!" , "Hang in there." , "You are a great person / bot!"]


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
})

client.login(process.env.TOKEN);