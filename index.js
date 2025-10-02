const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set EJS view engine and views folder
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Discord bot
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error('Failed to login Discord bot:', err);
});

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`);

    // Send bot stats every 5 seconds
    setInterval(() => {
        io.emit('bot-stats', {
            botName: bot.user.tag,
            serverCount: bot.guilds.cache.size
        });
    }, 5000);
});

// Route for dashboard
app.get('/', (req, res) => {
    res.render('dashboard'); // Make sure views/dashboard.ejs exists
});

// Listen on Render's port and host
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Dashboard running on port ${PORT}`);
});