const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.login(process.env.DISCORD_TOKEN);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`);

    setInterval(() => {
        io.emit('bot-stats', {
            botName: bot.user.tag,
            serverCount: bot.guilds.cache.size
        });
    }, 5000);
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('dashboard'); // Render your dashboard.ejs file
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running...');
});