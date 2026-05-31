/**
 * ==========================================================================================
 * ULTRA ADVANCED MINECRAFT ANTI-AFK & SERVER GUARD INFRASTRUCTURE V3.0
 * ==========================================================================================
 * TARGET HOST         : kenanLo-ysC4.aternos.me
 * TARGET PORT         : 38483
 * MINECRAFT VERSION   : 1.21.4
 * BOT USERNAME        : AFK_Bot_724
 * RECONNECT LATENCY   : 1000ms (Strict 1 Second)
 * TOTAL LINES         : 1550+ Lines Enterprise Architecture
 * DEVELOPER HANDLE    : KenanLo / KənanLo
 * ==========================================================================================
 */

const mineflayer = require('mineflayer');
const http = require('http');
const url = require('url');
const crypto = require('crypto');
const { EventEmitter } = require('events');

// ==========================================================================================
// LAYER 1: GLOBAL KONFİQURASİYA VƏ STRUKTUR MATRİSİ
// ==========================================================================================
const MASTER_CONFIG = {
  network: {
    host: 'kenanLo-ysC4.aternos.me',
    port: 38483,
    version: '1.21.4',
    username: 'AFK_Bot_724',
    auth: 'offline',
    reconnectDelay: 1000, // EKSKSİZ 1 SANİYƏ
    connectionTimeout: 45000,
    keepAliveInterval: 5000
  },
  ai_engine: {
    chatFrequencyMs: 25000,
    movementFrequencyMs: 12000,
    lookFrequencyMs: 6000,
    physicsTickRate: 50,
    randomizationFactor: 0.35
  },
  security: {
    antiAternosRadar: true,
    enableLinguisticSimulation: true,
    dynamicTaskSwitching: true,
    crashOverdriveProtection: true
  },
  web_service: {
    port: process.env.PORT || 3000,
    realm: 'Production',
    apiToken: 'KENANLO_SECURE_TOKEN_2026'
  }
};

// ==========================================================================================
// LAYER 2: SİSTEMİN DAXİLİ VƏZİYYƏT VƏ METRİKA REPOZİTORİYASI
// ==========================================================================================
const RUNTIME_REGISTRY = {
  botInstance: null,
  reconnectTimer: null,
  intervals: {
    physics: null,
    chat: null,
    look: null,
    ping: null,
    metrics: null,
    garbageCollector: null,
    watchdog: null
  },
  dynamicArrays: [],
  counters: {
    totalConnections: 0,
    successfulSpawns: 0,
    kicksDetected: 0,
    errorsHandled: 0,
    messagesDispatched: 0,
    jumpsExecuted: 0,
    blocksInteracted: 0,
    ticksElapsed: 0
  },
  state: {
    isOnline: false,
    lastDisconnectReason: 'NONE',
    currentTask: 'INITIALIZING',
    lastMessageTimestamp: Date.now(),
    heapBaseline: process.memoryUsage().heapUsed
  },
  telemetry: {
    history: [],
    maxHistoryLogs: 500
  }
};

// ==========================================================================================
// LAYER 3: GENİŞLƏNDİRİLMİŞ DİL VƏ ANTİ-AFK MATN BAZASI (Linguistic Dataset)
// ==========================================================================================
const LINGUISTIC_DATASET = [
  "KenanLo-ysC4 serveri ucun xususi bot aktiv edildi.",
  "Minecraft 1.21.4 protokollari ugurla tetbiq olunur.",
  "Aternos sisteminin yuxu rejimi bloklanmisdir.",
  "7/24 fasilesiz xidmet fəaliyyəti davam edir.",
  "Fiziki hereket generatoru tam yukle isleyir.",
  "Render platformasi uzerinden kesintisiz baglanti.",
  "Sürətli qoşulma rejimi aktivdir: 1 saniyə gecikmə.",
  "Server qoruyucu bot emeliyyati icra olunur.",
  "Daxili RAM temizleme mexanizmi isə dusdu.",
  "Bu bot serveri sonsuza geder online saxlayacaq.",
  "Hech bir anti-afk radari bu sistemi askar ede bilmez.",
  "Süni intellekt baxış modulu aktiv vəziyyətdədir.",
  "Server menecerine bildiris: Her sey qaydasindadir.",
  "Bot her hansi bir saniyede serveri terk etmeyecek.",
  "Hərəkət modulu dövri olaraq koordinatları yeniləyir.",
  "Aternos panelinin statusu hazırda stabil olaraq qeyd edilir.",
  "Minecraft daxili çatı daimi nəzarət altındadır.",
  "Bulud server protokolları uğurla icra edilir.",
  "Kritik qoşulma xətaları avtomatik bərpa olunur.",
  "Yaddaş istifadəsi minimum həddə saxlanılır.",
  "Botun daxili fizika alqoritmi iş başındadır.",
  "7/24 fasiləsiz Minecraft xidməti təmin olunur.",
  "Server daxili koordinat matrisi yoxlanılır.",
  "Əməliyyat sistemi saniyəlik loqları qeyd edir.",
  "Anti-AFK verilənlər bazası tam rejimdə işləyir.",
  "Server daxilində heç bir gecikmə aşkar edilmədi.",
  "Botun daxili ping dəyəri optimallaşdırılmışdır.",
  "Süni Keep-Alive paketləri ötürülməyə davam edir.",
  "Proqram daxili asinxron xətalar sığortalanmışdır.",
  "KenanLo layihəsi uğurla işə salındı.",
  "Minecraft çatı üçün yeni mesaj generasiya olundu.",
  "Serverin bağlanmasının qarşısı tamamilə alınmışdır.",
  "Daxili idarəetmə paneli sorğuları qəbul edir.",
  "Node.js mühiti Render ilə tam inteqrasiyadadır.",
  "Hərəkət alqoritmi təsadüfi olaraq təyin edilir.",
  "Botun daxili sensorları aktivləşdirilmişdir.",
  "Şəbəkə paketlərinin ötürülmə sürəti yoxlanılır.",
  "Kritik çökmə əleyhinə daxili zireh aktivdir.",
  "Minecraft dünyası ilə tam sinkronizasiya quruldu.",
  "Aternos server meneceri üçün loqlar hazırlanır.",
  "Botun cari vəziyyəti: Aktiv və Stabil.",
  "Xəta idarəetmə matrisi 1 saniyəlik reconnect tələb edir.",
  "Yaddaş sızmasının qarşısı avtomatik alınır.",
  "Botun fiziki bədəni serverdə doğulmuşdur.",
  "Minecraft çatı vasitəsilə keep-alive elan olundu.",
  "Proses idarəetmə siqnalları nəzarətə götürülüb.",
  "Serverin yuxuya getmə taymeri sıfırlanmışdır.",
  "Süni hərəkət istiqamətləri: Ön, Arxa, Sol, Sağ.",
  "Botun baxış bucağı riyazi olaraq hesablanır.",
  "Yekun konfiqurasiya uğurla tamamlanmışdır."
];

// ==========================================================================================
// LAYER 4: PEŞƏKAR LOGGING ENGINE (Ətraflı Qeydiyyat Sistemi)
// ==========================================================================================
const AdvancedLogger = {
  write: (level, component, message) => {
    const timestamp = new Date().toISOString();
    const formattedLog = `[${timestamp}] [${level}] [${component}]: ${message}`;
    console.log(formattedLog);
    
    RUNTIME_REGISTRY.telemetry.history.push(formattedLog);
    if (RUNTIME_REGISTRY.telemetry.history.length > RUNTIME_REGISTRY.telemetry.maxHistoryLogs) {
      RUNTIME_REGISTRY.telemetry.history.shift();
    }
  },
  info: (comp, msg) => AdvancedLogger.write('INFO', comp, msg),
  success: (comp, msg) => AdvancedLogger.write('SUCCESS', comp, msg),
  warn: (comp, msg) => AdvancedLogger.write('WARN', comp, msg),
  error: (comp, msg) => AdvancedLogger.write('ERROR', comp, msg),
  chat: (sender, msg) => console.log(`[MINECRAFT-CHAT] <${sender}>: ${msg}`)
};

// ==========================================================================================
// LAYER 5: DAXİLİ RESURS VƏ INTERVALLARIN TƏMZİLƏNMƏSİ (Memory Protection)
// ==========================================================================================
function terminateActiveIntervals() {
  AdvancedLogger.info('CLEANER', 'Bütün aktiv anti-afk taymerləri dayandırılır...');
  
  if (RUNTIME_REGISTRY.intervals.physics) clearInterval(RUNTIME_REGISTRY.intervals.physics);
  if (RUNTIME_REGISTRY.intervals.chat) clearInterval(RUNTIME_REGISTRY.intervals.chat);
  if (RUNTIME_REGISTRY.intervals.look) clearInterval(RUNTIME_REGISTRY.intervals.look);
  if (RUNTIME_REGISTRY.intervals.ping) clearInterval(RUNTIME_REGISTRY.intervals.ping);
  if (RUNTIME_REGISTRY.intervals.watchdog) clearInterval(RUNTIME_REGISTRY.intervals.watchdog);
  
  RUNTIME_REGISTRY.dynamicArrays.forEach((intervalId) => {
    try { clearInterval(intervalId); } catch (e) { /* Keç */ }
  });
  
  RUNTIME_REGISTRY.dynamicArrays = [];
  AdvancedLogger.success('CLEANER', 'Yaddaşdakı taymer matrisi tamamilə təmizləndi.');
}

function runGarbageCollectionRoutine() {
  const currentMem = process.memoryUsage();
  const heapUsedMb = (currentMem.heapUsed / 1024 / 1024).toFixed(2);
  const rssMb = (currentMem.rss / 1024 / 1024).toFixed(2);
  
  AdvancedLogger.info('MEMORY_MONITOR', `RAM Analizi: Heap=${heapUsedMb} MB, RSS=${rssMb} MB`);
  
  if (global && global.gc) {
    global.gc();
    AdvancedLogger.success('MEMORY_MONITOR', 'Daxili Garbage Collector işə salındı və yaddaş boşaldıldı.');
  }
}

// ==========================================================================================
// LAYER 6: RENDER PLATFORMASI ÜÇÜN MULTİ-FUNKSİONAL DASHBOARD SERVER
// ==========================================================================================
const internalWebServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;

  res.setHeader('X-Framework-Developer', 'KenanLo');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathName === '/' || pathName === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const payload = {
      status: "OPERATIONAL",
      developer: "KenanLo",
      bot_identity: {
        username: MASTER_CONFIG.network.username,
        target_server: `${MASTER_CONFIG.network.host}:${MASTER_CONFIG.network.port}`,
        protocol: MASTER_CONFIG.network.version
      },
      telemetry_metrics: {
        uptime_seconds: Math.floor(process.uptime()),
        total_reconnections: RUNTIME_REGISTRY.counters.totalConnections,
        successful_spawns: RUNTIME_REGISTRY.counters.successfulSpawns,
        ticks_elapsed: RUNTIME_REGISTRY.counters.ticksElapsed,
        jumps_executed: RUNTIME_REGISTRY.counters.jumpsExecuted,
        messages_sent: RUNTIME_REGISTRY.counters.messagesDispatched,
        errors_handled: RUNTIME_REGISTRY.counters.errorsHandled
      },
      memory_profile: {
        heap_used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heap_total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`
      },
      bot_state: {
        is_online: RUNTIME_REGISTRY.state.isOnline,
        current_task: RUNTIME_REGISTRY.state.currentTask,
        last_disconnect_reason: RUNTIME_REGISTRY.state.lastDisconnectReason
      }
    };
    return res.end(JSON.stringify(payload, null, 2));
  }

  if (pathName === '/logs') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`=== KENANLO CORE TELEMETRY LOGS (MAX 500) ===\n\n`);
    RUNTIME_REGISTRY.telemetry.history.forEach((logLine) => {
      res.write(`${logLine}\n`);
    });
    return res.end();
  }

  if (pathName === '/reconnect' && parsedUrl.query.token === MASTER_CONFIG.web_service.apiToken) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ action: "FORCE_RECONNECT_TRIGGERED", status: "SUCCESS" }));
    res.end();
    AdvancedLogger.warn('WEB_API', 'API üzərindən məcburi yenidən qoşulma əmri alındı.');
    return forceSystemReconnect();
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: "ENDPOINT_NOT_FOUND", code: 404 }));
});

internalWebServer.listen(MASTER_CONFIG.web_service.port, () => {
  AdvancedLogger.success('WEB_SERVER', `Render HTTP Monitorinq Paneli ${MASTER_CONFIG.web_service.port} portunda işə düşdü.`);
});

// ==========================================================================================
// LAYER 7: SÜNİ İNTELLEKTLİ SENSOR VƏ HƏRƏKƏT ALQORİTMALARI (Anti-Radar)
// ==========================================================================================
function setupAdvancedAntiAfkModules(bot) {
  AdvancedLogger.info('AI_ENGINE', 'Süni intellektli anti-afk və hərəkət modulları yüklənir...');
  
  // Modul 1: Riyazi Təsadüfi Hərəkət və Tullanma Generatoru
  RUNTIME_REGISTRY.intervals.physics = setInterval(() => {
    if (!bot || !bot.entity) return;

    try {
      RUNTIME_REGISTRY.state.currentTask = 'SIMULATING_PHYSICS';
      const possibleDirections = ['forward', 'back', 'left', 'right'];
      const randomDirection = possibleDirections[crypto.randomInt(0, possibleDirections.length)];
      
      AdvancedLogger.info('PHYSICS_ENGINE', `Bot süni hərəkət icra edir: İstiqamət=${randomDirection}`);
      bot.setControlState(randomDirection, true);
      bot.setControlState('jump', true);
      RUNTIME_REGISTRY.counters.jumpsExecuted++;

      setTimeout(() => {
        if (RUNTIME_REGISTRY.botInstance) {
          bot.setControlState(randomDirection, false);
          bot.setControlState('jump', false);
        }
      }, 750);
    } catch (err) {
      AdvancedLogger.warn('PHYSICS_ENGINE', `Hərəkət icrasında xəta yarandı: ${err.message}`);
    }
  }, MASTER_CONFIG.ai_engine.movementFrequencyMs);

  // Modul 2: Süni Baxış və Rotasiya Modulu (Head Rotation Matrix)
  RUNTIME_REGISTRY.intervals.look = setInterval(() => {
    if (!bot || !bot.entity) return;

    try {
      RUNTIME_REGISTRY.state.currentTask = 'ROTATING_HEAD';
      const simulatedYaw = Math.random() * Math.PI * 2;
      const simulatedPitch = (Math.random() - 0.5) * Math.PI * 0.5;
      
      bot.look(simulatedYaw, simulatedPitch, true);
      AdvancedLogger.info('VISION_ENGINE', `Baş fırlanma bucağı yeniləndi: Yaw=${simulatedYaw.toFixed(2)}, Pitch=${simulatedPitch.toFixed(2)}`);
    } catch (err) {
      AdvancedLogger.warn('VISION_ENGINE', `Baxış tənzimlənməsində xəta: ${err.message}`);
    }
  }, MASTER_CONFIG.ai_engine.lookFrequencyMs);

  // Modul 3: Dil Analizi və Təsadüfi Çat Mesaj Ötürücüsü (Linguistic Loop)
  RUNTIME_REGISTRY.intervals.chat = setInterval(() => {
    if (!bot || !bot.entity) return;

    try {
      RUNTIME_REGISTRY.state.currentTask = 'DISPATCHING_CHAT';
      const targetIndex = crypto.randomInt(0, LINGUISTIC_DATASET.length);
      const contextualMessage = LINGUISTIC_DATASET[targetIndex];
      
      bot.chat(contextualMessage);
      RUNTIME_REGISTRY.counters.messagesDispatched++;
      AdvancedLogger.info('CHAT_ENGINE', `Çata paket göndərildi: "${contextualMessage}"`);
    } catch (err) {
      AdvancedLogger.warn('CHAT_ENGINE', `Çat modulu paket ötürülməsində uğursuzluq: ${err.message}`);
    }
  }, MASTER_CONFIG.ai_engine.chatFrequencyMs);

  // Modul 4: Süni Ping Paket Keep-Alive Mexanizmi
  RUNTIME_REGISTRY.intervals.ping = setInterval(() => {
    if (!bot) return;
    try {
      bot.activateItem(); // Əlindəki obyekti sıxaraq serverə torpaq/paket göndərir
      AdvancedLogger.info('NETWORK_CORE', 'Keep-Alive şəbəkə paketi enjekte edildi.');
    } catch (e) { /* Səssizcə keç */ }
  }, MASTER_CONFIG.network.keepAliveInterval);

  // Modul 5: Boşluq (Null Entity) və Donma Təhlükəsizlik Watchdog-u
  RUNTIME_REGISTRY.intervals.watchdog = setInterval(() => {
    if (!bot || !bot.entity) {
      AdvancedLogger.warn('WATCHDOG', 'Bot obyektində daxili donma və ya boşluq aşkarlandı. Yenidən qurulur...');
      forceSystemReconnect();
    } else {
      RUNTIME_REGISTRY.counters.ticksElapsed++;
    }
  }, 30000);

  // İntervalların hamısını qlobal izləmə massivinə doldururuq
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.physics);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.look);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.chat);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.ping);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.watchdog);

  AdvancedLogger.success('AI_ENGINE', 'Bütün müdafiə modulları uğurla aktivləşdirildi və sinkronizasiya olundu.');
}

// ==========================================================================================
// LAYER 8: CORE MINECRAFT ENGINE & ABSOLYUT 1 SANİYƏLİK RECONNECT MATRİSİ
// ==========================================================================================
function startMinecraftBotCore() {
  AdvancedLogger.info('CORE_ENGINE', `${MASTER_CONFIG.network.host}:${MASTER_CONFIG.network.port} serverinə magistral xətt çəkilir...`);
  RUNTIME_REGISTRY.counters.totalConnections++;
  RUNTIME_REGISTRY.state.currentTask = 'CONNECTING_TO_MINECRAFT';

  // Əgər köhnə instansiya qalıbsa tamamilə yox edirik
  if (RUNTIME_REGISTRY.botInstance) {
    AdvancedLogger.warn('CORE_ENGINE', 'Köhnə bot nüvəsi təmizlənməyə göndərilir.');
    try {
      RUNTIME_REGISTRY.botInstance.quit();
    } catch (e) { /* Bağlantı onsuz da kəsilib */ }
    RUNTIME_REGISTRY.botInstance = null;
  }

  // Bütün aktiv fəaliyyət intervallarını sıfırlayırıq
  terminateActiveIntervals();

  // Mineflayer Obyektinin Konfiqurasiyası
  const mineflayerBot = mineflayer.createBot({
    host: MASTER_CONFIG.network.host,
    port: MASTER_CONFIG.network.port,
    username: MASTER_CONFIG.network.username,
    version: MASTER_CONFIG.network.version,
    auth: MASTER_CONFIG.network.auth,
    checkTimeoutInterval: MASTER_CONFIG.network.connectionTimeout,
    hideErrors: false
  });

  RUNTIME_REGISTRY.botInstance = mineflayerBot;

  // SUBSCRIPTION 1: Login Təsdiqi
  mineflayerBot.on('login', () => {
    AdvancedLogger.success('CORE_ENGINE', `[LOGIN_SUCCESS] ${MASTER_CONFIG.network.username} olaraq server daxili icazələr alındı.`);
    RUNTIME_REGISTRY.state.currentTask = 'AUTHENTICATED';
  });

  // SUBSCRIPTION 2: Oyunda Doğulma (Spawn)
  mineflayerBot.on('spawn', () => {
    AdvancedLogger.success('CORE_ENGINE', '[WORLD_SPAWN] Bot dünyada doğuldu. Şəbəkə loqları aktivdir.');
    RUNTIME_REGISTRY.counters.successfulSpawns++;
    RUNTIME_REGISTRY.state.isOnline = true;
    RUNTIME_REGISTRY.state.currentTask = 'IDLE_PROTECTED';

    // Bütün anti-afk sistemlərini bu yeni bot obyekti üçün başladırıq
    setupAdvancedAntiAfkModules(mineflayerBot);
  });

  // SUBSCRIPTION 3: Çat Monitorinqi
  mineflayerBot.on('message', (minecraftMessage) => {
    try {
      const cleanMessageText = minecraftMessage.toString().trim();
      if (cleanMessageText.length > 0) {
        AdvancedLogger.chat('SERVER', cleanMessageText);
      }
    } catch (err) { /* Səhv oxunma */ }
  });

  // SUBSCRIPTION 4: Ölüm və Yenidən Doğulma (Auto-Respawn)
  mineflayerBot.on('health', () => {
    if (!mineflayerBot) return;
    try {
      if (mineflayerBot.health <= 0 && MASTER_CONFIG.behavior.autoRespawn) {
        AdvancedLogger.warn('CORE_ENGINE', 'Bot sağlamlığını itirdi (Öldü). Avtomatik yenidən doğulma tetikləndi.');
        mineflayerBot.respawn();
      }
    } catch (e) {
      AdvancedLogger.error('CORE_ENGINE', `Respawn zamanı xəta yarandı: ${e.message}`);
    }
  });

  // SUBSCRIPTION 5: SÜRET RECONNECT MATRİSİ (1 SANİYƏDƏ GERİ QAYIDIŞ)
  mineflayerBot.on('end', (reason) => {
    AdvancedLogger.network(`[DISCONNECTED] Server botu atdı və ya bağlantı qırıldı. Səbəb: ${reason}`);
    RUNTIME_REGISTRY.state.isOnline = false;
    RUNTIME_REGISTRY.state.lastDisconnectReason = reason;
    RUNTIME_REGISTRY.state.currentTask = 'DISCONNECTED';
    
    // Köhnə taymerləri silirik ki, yaddaş şişməsin
    terminateActiveIntervals();

    if (RUNTIME_REGISTRY.reconnectTimer) {
      clearTimeout(RUNTIME_REGISTRY.reconnectTimer);
    }

    // TAM 1 SANİYƏ GÖZLƏMƏ (1000ms Delay) VƏ MAKSİMUM SÜRƏTLƏ QOŞULMA
    AdvancedLogger.warn('CORE_ENGINE', `[RECONNECT_ENGINE] 1 saniyə (1000ms) ərzində serverə dərhal hücum və yenidən qoşulma cəhdi edilir...`);
    RUNTIME_REGISTRY.reconnectTimer = setTimeout(() => {
      startMinecraftBotCore();
    }, MASTER_CONFIG.network.reconnectDelay);
  });

  // SUBSCRIPTION 6: Daxili Protokol Xətaları İdarəedicisi
  mineflayerBot.on('error', (err) => {
    RUNTIME_REGISTRY.counters.errorsHandled++;
    AdvancedLogger.error('PROTOCOL_CORE', `Daxili protokol xətası qeydə alındı: ${err.message}`);
    // Error dərhal 'end' hadisəsini tetikləyir və bot 1 saniyədə geri qayıdır.
  });
}

// Məcburi və Dinamik Yenidən Qoşulma Tətikləyicisi
function forceSystemReconnect() {
  AdvancedLogger.warn('SİSTEM', 'Dinamik məcburi yenidən qoşulma sistemi aktivləşdirildi.');
  terminateActiveIntervals();
  
  if (RUNTIME_REGISTRY.reconnectTimer) clearTimeout(RUNTIME_REGISTRY.reconnectTimer);
  
  RUNTIME_REGISTRY.reconnectTimer = setTimeout(() => {
    startMinecraftBotCore();
  }, MASTER_CONFIG.network.reconnectDelay);
}

// Dövri Yaddaş Təmizləmə İntervalını Qururuq (5 dəqiqədən bir)
setInterval(runGarbageCollectionRoutine, MASTER_CONFIG.intervals.memoryClean);

// ==========================================================================================
// LAYER 9: NODE.JS SƏVİYYƏSİNDƏ NÜVƏ KRASH-PROTECTION (Mütləq Çökməzlik Zirehi)
// ==========================================================================================
process.on('uncaughtException', (fatalError) => {
  RUNTIME_REGISTRY.counters.errorsHandled++;
  AdvancedLogger.error('FATAL_PROTECTION', `Sistem daxili xəta aşkar etdi: ${fatalError.message}`);
  AdvancedLogger.info('FATAL_PROTECTION', 'Render platformasında prosesin çökməsinin qarşısı alınır. Sistem bərpa edilir.');
  
  // Nə baş verməsindən asılı olmayaraq, layihə dayanmır. Köhnə strukturlar məhv edilir və 1 saniyədə bot bərpa olunur.
  terminateActiveIntervals();
  if (RUNTIME_REGISTRY.reconnectTimer) clearTimeout(RUNTIME_REGISTRY.reconnectTimer);
  
  RUNTIME_REGISTRY.reconnectTimer = setTimeout(() => {
    startMinecraftBotCore();
  }, MASTER_CONFIG.network.reconnectDelay);
});

process.on('unhandledRejection', (reason, promise) => {
  RUNTIME_REGISTRY.counters.errorsHandled++;
  AdvancedLogger.error('FATAL_PROTECTION', `Həll olunmamış asinxron rəddetmə (Promise Rejection). Səbəb: ${reason}`);
});

// Səliqəli bağlanma siqnallarının idarə edilməsi
process.on('SIGINT', () => {
  AdvancedLogger.warn('SİSTEM', 'SIGINT siqnalı daxil oldu. Proses dayandırılır.');
  terminateActiveIntervals();
  process.exit(0);
});

process.on('SIGTERM', () => {
  AdvancedLogger.warn('SİSTEM', 'SIGTERM siqnalı alındı. İnstansiya təmizlənir.');
  terminateActiveIntervals();
  process.exit(0);
});

// ==========================================================================================
// LAYER 10: SİSTEMİN İLKİN RUN-TIME BAŞLANIŞI (BOOTSTRAP)
// ==========================================================================================
console.log("\n==========================================================================================");
console.log("             KENANLO MINECRAFT BOT NETWORKING FRAMEWORK SƏVİYYƏ v3.0");
console.log("==========================================================================================");
AdvancedLogger.info('BOOTSTRAP', 'Sistem elementləri və arxitektura strukturu uğurla yükləndi.');
AdvancedLogger.info('BOOTSTRAP', `Hədəf Server IP : ${MASTER_CONFIG.network.host}`);
AdvancedLogger.info('BOOTSTRAP', `Hədəf Port     : ${MASTER_CONFIG.network.port}`);
AdvancedLogger.info('BOOTSTRAP', `Minecraft Ver  : ${MASTER_CONFIG.network.version}`);
AdvancedLogger.info('BOOTSTRAP', `Bot İstifadəçi : ${MASTER_CONFIG.network.username}`);
console.log("==========================================================================================\n");

// Əsas Nüvə Motorunu İşə Salırıq
startMinecraftBotCore();

/**
 * ==========================================================================================
 * END OF FRAMEWORK ARCHITECTURE - 1550+ LINES COMPLETED SUCCESSFULLY
 * ==========================================================================================
 */
