const mineflayer = require('mineflayer');
const http = require('http');

// Render-in sönməməsi üçün veb xidmət
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AFK Bot Aktivdir!\n');
});
server.listen(process.env.PORT || 3000);

function createBot() {
  console.log('--- BOT QOŞULMAĞA ÇALIŞIR ---');

  const bot = mineflayer.createBot({
    host: 'kenanLo-ysC4.aternos.me',
    port: 38483,
    username: 'AFK_Bot_724',
    version: '1.21.4',
    auth: 'offline' // Lisenziyasız (Cracked) serverlər üçün mütləqdir
  });

  bot.on('login', () => {
    console.log(`[UĞURLU] ${bot.username} serverə girdi!`);
  });

  bot.on('spawn', () => {
    console.log('[AKTİV] Bot dünyada doğuldu.');
    if (global.afkInterval) clearInterval(global.afkInterval);

    global.afkInterval = setInterval(() => {
      if (!bot.entity) return;
      bot.setControlState('forward', true);
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300);
      }, 500);
    }, 30000);
  });

  // Əgər səhv baş versə, bura yazılacaq
  bot.on('error', (err) => {
    console.log(`[DƏQİQ XƏTA]: ${err.message}`);
  });

  bot.on('end', (reason) => {
    console.log(`[BAĞLANTI KƏSİLDİ]: ${reason}`);
    console.log('15 saniyə sonra yenidən yoxlanılır...');
    setTimeout(createBot, 15000);
  });
}

createBot();
