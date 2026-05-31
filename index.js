const mineflayer = require('mineflayer');
const http = require('http');

// Render-in 7/24 aktiv qalması üçün sadə veb server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AFK Bot Hazirdir ve Aktivdir!\n');
});
server.listen(process.env.PORT || 3000, () => {
  console.log('Web server aktiv edildi.');
});

function createBot() {
  console.log('Bot kenanLo-ysC4.aternos.me serverinə qoşulur...');

  const bot = mineflayer.createBot({
    host: 'kenanLo-ysC4.aternos.me', // Sənin Server IP-n
    port: 38483,                     // Sənin Portun
    username: 'AFK_Bot_724',         // Botun oyundakı adı (istəsən dəyişə bilərsən)
    version: '1.21.4'                // Sənin Minecraft Versiyan
  });

  bot.on('login', () => {
    console.log(`[UĞURLU] ${bot.username} serverə problemsiz daxil oldu!`);
  });

  bot.on('spawn', () => {
    console.log('[AKTİV] Bot oyunda doğuldu. Tullanma və hərəkət mexanizmi işləyir.');
    
    if (global.afkInterval) clearInterval(global.afkInterval);

    // Aternos-un botu "hıyar" (AFK) sayıb atmaması üçün hər 30 saniyədən bir hərəkət
    global.afkInterval = setInterval(() => {
      if (!bot.entity) return;
      
      console.log('[ANTİ-AFK] Bot serverdən atılmamaq üçün tərpənir...');
      bot.setControlState('forward', true);
      
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400);
      }, 800);

    }, 30000); 
  });

  // Serverdən hər hansı səbəbdən atılsa, 15 saniyə gözləyib avtomatik geri qayıdır
  bot.on('end', (reason) => {
    console.log(`[BAĞLANTI KƏSİLDİ] Server botu atdı. Səbəb: ${reason}`);
    console.log('4 saniyə sonra avtomatik yenidən qoşulma başladılır...');
    setTimeout(createBot, 15000);
  });

  // Xətaların qarşısını almaq üçün
  bot.on('error', (err) => {
    console.log(`[XƏTA] Səhv baş verdi: ${err.message}`);
  });
}

// Botu start edirik
createBot();
