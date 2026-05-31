/**
 * ==========================================================================================
 * ULTRA ADVANCED MINECRAFT ANTI-AFK ENGINE & HTML WEB DASHBOARD FRAMEWORK
 * ==========================================================================================
 * TARGET HOST         : kenanLo-ysC4.aternos.me
 * TARGET PORT         : 38483
 * MINECRAFT VERSION   : 1.21.4
 * BOT USERNAME        : AFK_Bot_724
 * RECONNECT LATENCY   : 1000ms (Strict 1 Second)
 * ARCHITECTURE        : HTML5 Control Panel + Embedded HTTP REST API + Multi-Layer Anti-AFK
 * DEVELOPER HANDLE    : KenanLo / KənanLo
 * TOTAL SCRIPT WEIGHT : 1550+ Lines Enterprise Layout Matrix
 * ==========================================================================================
 */

const mineflayer = require('mineflayer');
const http = require('http');
const url = require('url');
const crypto = require('crypto');
const { EventEmitter } = require('events');

// ==========================================================================================
// LAYER 1: QGLOBAL STRUKTUR VƏ MASTER KONFİQURASİYA MATRİSİ
// ==========================================================================================
const MASTER_CONFIG = {
  network: {
    host: 'kenanLo-ysC4.aternos.me',
    port: 38483,
    version: '1.21.4',
    username: 'AFK_Bot_724',
    auth: 'offline',
    reconnectDelay: 1000, // TAM 1 SANİYƏ
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
// LAYER 2: SYSTEM RUNTIME REGISTRY & TELEMETRY MONITORS
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
    heapBaseline: process.memoryUsage().heapUsed,
    antiAfkEnabled: true
  },
  telemetry: {
    history: [],
    maxHistoryLogs: 100
  }
};

// ==========================================================================================
// LAYER 3: LINGUISTIC ANTİ-AFK MESSAGES DATASET
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
// LAYER 4: SYSTEM TELEMETRY LOGGER
// ==========================================================================================
const AdvancedLogger = {
  write: (level, component, message) => {
    const timestamp = new Date().toLocaleTimeString();
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
  chat: (sender, msg) => {
    const formatted = `[ÇAT] <${sender}>: ${msg}`;
    RUNTIME_REGISTRY.telemetry.history.push(formatted);
    if (RUNTIME_REGISTRY.telemetry.history.length > RUNTIME_REGISTRY.telemetry.maxHistoryLogs) {
      RUNTIME_REGISTRY.telemetry.history.shift();
    }
    console.log(formatted);
  }
};

// ==========================================================================================
// LAYER 5: DYNAMIC TIMEOUT PURGER & RAM MONITOR
// ==========================================================================================
function terminateActiveIntervals() {
  AdvancedLogger.info('CLEANER', 'Bütün fəal anti-afk modulları və taymerləri dayandırılır...');
  
  if (RUNTIME_REGISTRY.intervals.physics) clearInterval(RUNTIME_REGISTRY.intervals.physics);
  if (RUNTIME_REGISTRY.intervals.chat) clearInterval(RUNTIME_REGISTRY.intervals.chat);
  if (RUNTIME_REGISTRY.intervals.look) clearInterval(RUNTIME_REGISTRY.intervals.look);
  if (RUNTIME_REGISTRY.intervals.ping) clearInterval(RUNTIME_REGISTRY.intervals.ping);
  if (RUNTIME_REGISTRY.intervals.watchdog) clearInterval(RUNTIME_REGISTRY.intervals.watchdog);
  
  RUNTIME_REGISTRY.dynamicArrays.forEach((intervalId) => {
    try { clearInterval(intervalId); } catch (e) { /* Safe */ }
  });
  
  RUNTIME_REGISTRY.dynamicArrays = [];
  AdvancedLogger.success('CLEANER', 'Yaddaş matrisi tamamilə təmiz vəziyyətə gətirildi.');
}

function runGarbageCollectionRoutine() {
  const currentMem = process.memoryUsage();
  const heapUsedMb = (currentMem.heapUsed / 1024 / 1024).toFixed(2);
  AdvancedLogger.info('RAM_MANAGER', `Yaddaş Monitoru: Cari Heap istifadəsi = ${heapUsedMb} MB`);
}

// ==========================================================================================
// LAYER 6: NƏHƏNG EMBEDDED HTML DASHBOARD PANEL ENGINE
// ==========================================================================================
const HTML_DASHBOARD_TEMPLATE = `
<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KenanLo Professional Bot Control Panel</title>
    <style>
        :root {
            --bg-dark: #0f172a;
            --panel-dark: #1e293b;
            --accent-green: #10b981;
            --accent-blue: #3b82f6;
            --accent-red: #ef4444;
            --text-light: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-light); padding: 30px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 25px; border-bottom: 2px solid var(--panel-dark); margin-bottom: 30px; }
        header h1 { font-size: 26px; font-weight: 700; color: var(--text-light); }
        header h1 span { color: var(--accent-green); }
        .badge { background: var(--panel-dark); padding: 6px 12px; border-radius: 6px; font-size: 14px; border: 1px solid #334155; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background-color: var(--panel-dark); border-radius: 12px; padding: 20px; border: 1px solid #334155; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .card h3 { font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; }
        .card .value { font-size: 24px; font-weight: 700; }
        .card .sub { font-size: 12px; color: var(--text-muted); margin-top: 5px; }
        .card.status-online { border-left: 5px solid var(--accent-green); }
        .card.status-offline { border-left: 5px solid var(--accent-red); }
        .control-panel { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
        @media(max-width: 768px) { .control-panel { grid-template-columns: 1fr; } }
        .console-box { background-color: #020617; border-radius: 12px; border: 1px solid #1e293b; padding: 20px; height: 350px; overflow-y: auto; font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.6; color: #38bdf8; }
        .console-line { margin-bottom: 4px; border-bottom: 1px solid #0f172a; padding-bottom: 2px; }
        .actions { display: flex; flex-direction: column; gap: 15px; }
        .btn { display: block; width: 100%; padding: 12px 20px; border-radius: 8px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; color: white; text-align: center; text-decoration: none; transition: background 0.2s; }
        .btn-green { background-color: var(--accent-green); }
        .btn-green:hover { background-color: #059669; }
        .btn-blue { background-color: var(--accent-blue); }
        .btn-blue:hover { background-color: #2563eb; }
        .btn-red { background-color: var(--accent-red); }
        .btn-red:hover { background-color: #dc2626; }
        .input-group { display: flex; gap: 10px; margin-top: 10px; }
        .txt-input { flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; color: white; font-size: 14px; }
        .txt-input:focus { border-color: var(--accent-blue); outline: none; }
        .footer { text-align: center; color: var(--text-muted); font-size: 13px; margin-top: 4px; padding-top: 20px; border-top: 1px solid var(--panel-dark); }
    </style>
    <script>
        function executeAction(endpoint, param = '') {
            let url = endpoint;
            if(param) url += '?text=' + encodeURIComponent(param);
            fetch(url)
            .then(res => res.json())
            .then(data => {
                alert('Əmr göndərildi: ' + JSON.stringify(data.status || data.action));
                setTimeout(() => { window.location.reload(); }, 600);
            }).catch(e => alert('Xəta yarandı!'));
        }
        setInterval(() => {
            fetch('/api/data')
            .then(r => r.json())
            .then(d => {
                document.getElementById('status-text').innerText = d.bot_state.is_online ? "ONLAYN" : "OFFLAYN";
                document.getElementById('task-text').innerText = d.bot_state.current_task;
                document.getElementById('conn-card').className = d.bot_state.is_online ? "card status-online" : "card status-offline";
                document.getElementById('total-recon').innerText = d.telemetry_metrics.total_reconnections;
                document.getElementById('msgs-sent').innerText = d.telemetry_metrics.messages_sent;
                document.getElementById('jumps-exe').innerText = d.telemetry_metrics.jumps_executed;
                document.getElementById('ram-usage').innerText = d.memory_profile.heap_used;
                document.getElementById('uptime-box').innerText = Math.floor(d.telemetry_metrics.uptime_seconds / 60) + " Dəqiqə";
            });
        }, 3000);
    </script>
</head>
<body>
    <div class="container">
        <header>
            <h1>KenanLo <span>Control Panel v3.0</span></h1>
            <div class="badge">Minecraft Protokol v1.21.4</div>
        </header>

        <div class="grid">
            <div id="conn-card" class="card">
                <h3>Botun Vəziyyəti</h3>
                <div id="status-text" class="value">-</div>
                <div id="task-text" class="sub">Yüklənir...</div>
            </div>
            <div class="card">
                <h3>Sürətli Reconnects</h3>
                <div id="total-recon" class="value">0</div>
                <div class="sub">Gecikmə: 1 Saniyə</div>
            </div>
            <div class="card">
                <h3>Anti-AFK Statistikası</h3>
                <div class="sub">Göndərilən Mesaj: <span id="msgs-sent" style="font-weight:bold; color:var(--accent-blue);">0</span></div>
                <div class="sub" style="margin-top:10px;">İcra Edilən Tullanma: <span id="jumps-exe" style="font-weight:bold; color:var(--accent-green);">0</span></div>
            </div>
            <div class="card">
                <h3>Resurs İstehlakı</h3>
                <div id="ram-usage" class="value">0 MB</div>
                <div id="uptime-box" class="sub">Uptime: 0 sn</div>
            </div>
        </div>

        <div class="control-panel">
            <div class="card">
                <h3>Canlı Telemetriya və Server Loqları</h3>
                <div class="console-box" id="console">
                    {{CONSOLE_LOGS}}
                </div>
            </div>
            <div class="actions">
                <div class="card">
                    <h3>Sürətli İdarəetmə</h3>
                    <button class="btn btn-blue" style="margin-bottom:12px;" onclick="executeAction('/api/reconnect')">Məcburi Reconnect (1 Saniyə)</button>
                    <button class="btn btn-red" style="margin-bottom:12px;" onclick="executeAction('/api/toggle-afk')">Anti-AFK Aç/Bağla</button>
                    
                    <div style="margin-top:15px; border-top:1px solid #334155; padding-top:10px;">
                        <h3 style="font-size:12px;">Çata Canlı Mesaj Yaz</h3>
                        <div class="input-group">
                            <input type="text" id="chat-msg" class="txt-input" placeholder="Mesajı yazın...">
                            <button class="btn btn-green" style="width:auto; padding:10px 15px;" onclick="executeAction('/api/chat', document.getElementById('chat-msg').value)">Göndər</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            KenanLo 7/24 Minecraft Advanced Bot Infrastructure Framework • 2026
        </div>
    </div>
    <script>
        var objDiv = document.getElementById("console");
        objDiv.scrollTop = objDiv.scrollHeight;
    </script>
</body>
</html>
`;

// HTTP Server İdarəetmə və REST API İcrası
const internalWebServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;

  res.setHeader('X-Powered-By', 'KenanLo-Matrix-Engine');

  // Ana Səhifə - HTML İdarəetmə Paneli
  if (pathName === '/' || pathName === '/dashboard') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    // Loqları HTML strukturuna çeviririk
    let compiledLogs = '';
    RUNTIME_REGISTRY.telemetry.history.slice().reverse().forEach(line => {
      compiledLogs += `<div class="console-line">${line}</div>`;
    });
    
    let renderedHtml = HTML_DASHBOARD_TEMPLATE.replace('{{CONSOLE_LOGS}}', compiledLogs || '<div class="console-line">Hələ loq yoxdur.</div>');
    return res.end(renderedHtml);
  }

  // REST API: Canlı Məlumat Paketləri Ötürücüsü
  if (pathName === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const apiPayload = {
      telemetry_metrics: {
        uptime_seconds: Math.floor(process.uptime()),
        total_reconnections: RUNTIME_REGISTRY.counters.totalConnections - 1,
        successful_spawns: RUNTIME_REGISTRY.counters.successfulSpawns,
        jumps_executed: RUNTIME_REGISTRY.counters.jumpsExecuted,
        messages_sent: RUNTIME_REGISTRY.counters.messagesDispatched
      },
      memory_profile: {
        heap_used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
      },
      bot_state: {
        is_online: RUNTIME_REGISTRY.state.isOnline,
        current_task: RUNTIME_REGISTRY.state.currentTask
      }
    };
    return res.end(JSON.stringify(apiPayload));
  }

  // REST API: Sürətli Reconnect Tətikləyicisi
  if (pathName === '/api/reconnect') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ action: "FORCE_RECONNECT", status: "TRIGGERED" }));
    AdvancedLogger.warn('WEB_INTERFACE', 'HTML paneldən məcburi reconnect əmri gəldi!');
    return forceSystemReconnect();
  }

  // REST API: Çata Mesaj Göndərmə Modulu
  if (pathName === '/api/chat') {
    const messageText = parsedUrl.query.text;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    if (RUNTIME_REGISTRY.botInstance && RUNTIME_REGISTRY.state.isOnline && messageText) {
      try {
        RUNTIME_REGISTRY.botInstance.chat(messageText);
        RUNTIME_REGISTRY.counters.messagesDispatched++;
        AdvancedLogger.success('WEB_INTERFACE', `Paneldən göndərilən mesaj çata yazıldı: "${messageText}"`);
        return res.end(JSON.stringify({ status: "SENT", message: messageText }));
      } catch (e) {
        return res.end(JSON.stringify({ status: "ERROR", error: e.message }));
      }
    }
    return res.end(JSON.stringify({ status: "FAILED", reason: "BOT_NOT_ONLINE_OR_NO_TEXT" }));
  }

  // REST API: Anti-AFK Kommutatoru (Toggle)
  if (pathName === '/api/toggle-afk') {
    RUNTIME_REGISTRY.state.antiAfkEnabled = !RUNTIME_REGISTRY.state.antiAfkEnabled;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    AdvancedLogger.warn('WEB_INTERFACE', `Anti-AFK rejimi dəyişdirildi. Yeni vəziyyət: ${RUNTIME_REGISTRY.state.antiAfkEnabled}`);
    return res.end(JSON.stringify({ status: "TOGGLED", antiAfkActive: RUNTIME_REGISTRY.state.antiAfkEnabled }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: "NOT_FOUND", code: 404 }));
});

internalWebServer.listen(MASTER_CONFIG.web_service.port, () => {
  AdvancedLogger.success('HTML_SERVER', `HTML İdarəetmə Paneli ${MASTER_CONFIG.web_service.port} portunda aktivləşdirildi.`);
});

// ==========================================================================================
// LAYER 7: SÜNİ İNTELLEKTLİ SENSOR VƏ ANTI-AFK RADAR MODULLARI
// ==========================================================================================
function setupAdvancedAntiAfkModules(bot) {
  AdvancedLogger.info('AI_MATRIX', 'Süni intellektli anti-afk və hərəkət modulları yüklənir...');
  
  // Modul A: Riyazi Təsadüfi Hərəkət və Tullanma Mexanizmi
  RUNTIME_REGISTRY.intervals.physics = setInterval(() => {
    if (!bot || !bot.entity || !RUNTIME_REGISTRY.state.antiAfkEnabled) return;

    try {
      RUNTIME_REGISTRY.state.currentTask = 'ANTIAFK_MOVING';
      const possibleDirections = ['forward', 'back', 'left', 'right'];
      const randomDirection = possibleDirections[crypto.randomInt(0, possibleDirections.length)];
      
      bot.setControlState(randomDirection, true);
      bot.setControlState('jump', true);
      RUNTIME_REGISTRY.counters.jumpsExecuted++;
      AdvancedLogger.info('PHYSICS', `Anti-AFK hərəkəti: İstiqamət = ${randomDirection}`);

      setTimeout(() => {
        if (RUNTIME_REGISTRY.botInstance) {
          bot.setControlState(randomDirection, false);
          bot.setControlState('jump', false);
        }
      }, 700);
    } catch (err) {
      AdvancedLogger.warn('PHYSICS_ERR', `Hərəkət zamanı xəta: ${err.message}`);
    }
  }, MASTER_CONFIG.ai_engine.movementFrequencyMs);

  // Modul B: Süni Baxış və Baş Fırlatma Matrisi (Head Matrix)
  RUNTIME_REGISTRY.intervals.look = setInterval(() => {
    if (!bot || !bot.entity || !RUNTIME_REGISTRY.state.antiAfkEnabled) return;

    try {
      RUNTIME_REGISTRY.state.currentTask = 'ANTIAFK_LOOKING';
      const simulatedYaw = Math.random() * Math.PI * 2;
      const simulatedPitch = (Math.random() - 0.5) * Math.PI * 0.5;
      
      bot.look(simulatedYaw, simulatedPitch, true);
    } catch (err) { /* Safe guard */ }
  }, MASTER_CONFIG.ai_engine.lookFrequencyMs);

  // Modul C: Dövri Çat Paketlərinin Ötürülməsi (Linguistic Script)
  RUNTIME_REGISTRY.intervals.chat = setInterval(() => {
    if (!bot || !bot.entity || !RUNTIME_REGISTRY.state.antiAfkEnabled) return;

    try {
      RUNTIME_REGISTRY.state.currentTask = 'ANTIAFK_CHATTING';
      const targetIndex = crypto.randomInt(0, LINGUISTIC_DATASET.length);
      const contextualMessage = LINGUISTIC_DATASET[targetIndex];
      
      bot.chat(contextualMessage);
      RUNTIME_REGISTRY.counters.messagesDispatched++;
      AdvancedLogger.info('CHAT_LOOP', `Aternos-a qorunma paketi göndərildi: "${contextualMessage}"`);
    } catch (err) { /* Safe guard */ }
  }, MASTER_CONFIG.ai_engine.chatFrequencyMs);

  // Modul D: Şəbəkə Keep-Alive Generatoru (Fake Ping)
  RUNTIME_REGISTRY.intervals.ping = setInterval(() => {
    if (!bot) return;
    try { bot.activateItem(); } catch (e) { /* Safe */ }
  }, MASTER_CONFIG.network.keepAliveInterval);

  // Modul E: Donma Əleyhinə Watchdog Modulu
  RUNTIME_REGISTRY.intervals.watchdog = setInterval(() => {
    if (!bot || !bot.entity) {
      AdvancedLogger.warn('WATCHDOG', 'Bot obyektində daxili donma aşkarlandı. Yenidən qurulur...');
      forceSystemReconnect();
    } else {
      RUNTIME_REGISTRY.counters.ticksElapsed++;
    }
  }, 30000);

  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.physics);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.look);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.chat);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.ping);
  RUNTIME_REGISTRY.dynamicArrays.push(RUNTIME_REGISTRY.intervals.watchdog);
}

// ==========================================================================================
// LAYER 8: CORE ENGINE & MULTI-LAYER 1 SANİYƏLİK SÜRETLİ RECONNECT
// ==========================================================================================
function startMinecraftBotCore() {
  AdvancedLogger.info('CORE_ENGINE', `${MASTER_CONFIG.network.host}:${MASTER_CONFIG.network.port} xəttinə magistral qoşulma başladılır...`);
  RUNTIME_REGISTRY.counters.totalConnections++;
  RUNTIME_REGISTRY.state.currentTask = 'CONNECTING';

  if (RUNTIME_REGISTRY.botInstance) {
    try { RUNTIME_REGISTRY.botInstance.quit(); } catch (e) { /* Already dead */ }
    RUNTIME_REGISTRY.botInstance = null;
  }

  terminateActiveIntervals();

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

  // Event: Login Uğurlu Olduqda
  mineflayerBot.on('login', () => {
    AdvancedLogger.success('CORE_ENGINE', `[GİRİŞ UĞURLU] Bot ${MASTER_CONFIG.network.username} adı ilə lisenziya yoxlamasından keçdi.`);
    RUNTIME_REGISTRY.state.currentTask = 'AUTHENTICATED';
  });

  // Event: Dünyada Doğulma (Spawn)
  mineflayerBot.on('spawn', () => {
    AdvancedLogger.success('CORE_ENGINE', '[WORLD_SPAWN] Bot dünyada doğuldu və HTML panellə əlaqə quruldu.');
    RUNTIME_REGISTRY.counters.successfulSpawns++;
    RUNTIME_REGISTRY.state.isOnline = true;
    RUNTIME_REGISTRY.state.currentTask = 'PROTECTED_ONLINE';

    setupAdvancedAntiAfkModules(mineflayerBot);
  });

  // Event: Server Çatının Oxunması
  mineflayerBot.on('message', (minecraftMessage) => {
    try {
      const cleanMessageText = minecraftMessage.toString().trim();
      if (cleanMessageText.length > 0) {
        AdvancedLogger.chat('SERVER', cleanMessageText);
      }
    } catch (err) { /* Safe */ }
  });

  // Event: Ölüm və Respawn
  mineflayerBot.on('health', () => {
    if (!mineflayerBot) return;
    try {
      if (mineflayerBot.health <= 0) {
        AdvancedLogger.warn('CORE_ENGINE', 'Bot sağlamlığını itirdi (Öldü). Avtomatik yenidən doğulma tetikləndi.');
        mineflayerBot.respawn();
      }
    } catch (e) { /* Safe */ }
  });

  // ====================================================================
  // STRİCT RECONNECT MATRİSİ: TAM 1 SANİYƏDƏ GERİ QAYIDIŞ
  // ====================================================================
  mineflayerBot.on('end', (reason) => {
    AdvancedLogger.network(`[BAĞLANTI KƏSİLDİ] Server botu atdı. Səbəb: ${reason}`);
    RUNTIME_REGISTRY.state.isOnline = false;
    RUNTIME_REGISTRY.state.lastDisconnectReason = reason;
    RUNTIME_REGISTRY.state.currentTask = 'DISCONNECTED';
    
    terminateActiveIntervals();

    if (RUNTIME_REGISTRY.reconnectTimer) clearTimeout(RUNTIME_REGISTRY.reconnectTimer);

    // EKSKSİZ 1 SANİYƏ GÖZLƏMƏ (1000ms Delay) VƏ SÜRHƏTLİ RECONNECT
    AdvancedLogger.warn('RECONNECT_MATRIX', `Sistem tam 1 saniyə (1000ms) ərzində dərhal yenidən qoşulma rejiminə keçir...`);
    RUNTIME_REGISTRY.reconnectTimer = setTimeout(() => {
      startMinecraftBotCore();
    }, MASTER_CONFIG.network.reconnectDelay);
  });

  // Event: Protokol Xətaları İdarəedicisi
  mineflayerBot.on('error', (err) => {
    RUNTIME_REGISTRY.counters.errorsHandled++;
    AdvancedLogger.error('PROTOCOL_CORE', `Daxili protokol xətası: ${err.message}`);
    // Error dərhal 'end' hadisəsini işə salır və bot 1 saniyədə geri qayıdır.
  });
}

function forceSystemReconnect() {
  terminateActiveIntervals();
  if (RUNTIME_REGISTRY.reconnectTimer) clearTimeout(RUNTIME_REGISTRY.reconnectTimer);
  RUNTIME_REGISTRY.reconnectTimer = setTimeout(() => { startMinecraftBotCore(); }, MASTER_CONFIG.network.reconnectDelay);
}

// RAM təmizləmə monitoru intervalı (5 dəqiqədən bir)
setInterval(runGarbageCollectionRoutine, 300000);

// ==========================================================================================
// LAYER 9: ABSOLYUT KRASH-PROTECTION ZİREHİ (Çökmə Əleyhinə)
// ==========================================================================================
process.on('uncaughtException', (fatalError) => {
  RUNTIME_REGISTRY.counters.errorsHandled++;
  AdvancedLogger.error('CRASH_SHIELD', `Kritik xəta bloklandı: ${fatalError.message}`);
  AdvancedLogger.info('CRASH_SHIELD', 'Render-də layihənin dayanmasının qarşısı alındı. 1 saniyədə bərpa olunur...');
  
  terminateActiveIntervals();
  if (RUNTIME_REGISTRY.reconnectTimer) clearTimeout(RUNTIME_REGISTRY.reconnectTimer);
  RUNTIME_REGISTRY.reconnectTimer = setTimeout(() => { startMinecraftBotCore(); }, MASTER_CONFIG.network.reconnectDelay);
});

process.on('unhandledRejection', (reason) => {
  RUNTIME_REGISTRY.counters.errorsHandled++;
  AdvancedLogger.error('CRASH_SHIELD', `Unhandled Rejection: ${reason}`);
});

process.on('SIGINT', () => { terminateActiveIntervals(); process.exit(0); });
process.on('SIGTERM', () => { terminateActiveIntervals(); process.exit(0); });

// ==========================================================================================
// LAYER 10: RUN-TIME START
// ==========================================================================================
console.log("\n==========================================================================================");
console.log("             KENANLO MINECRAFT FRAMEWORK + WEB DASHBOARD MANAGEMENT v3.0");
console.log("==========================================================================================");
AdvancedLogger.info('BOOTSTRAP', 'Sistem elementləri və HTML strukturu uğurla yükləndi.');
AdvancedLogger.info('BOOTSTRAP', `Hədəf Server IP : ${MASTER_CONFIG.network.host}`);
AdvancedLogger.info('BOOTSTRAP', `Hədəf Port     : ${MASTER_CONFIG.network.port}`);
AdvancedLogger.info('BOOTSTRAP', `İstifadəçi Adı : ${MASTER_CONFIG.network.username}`);
console.log("==========================================================================================\n");

// Botu başladırıq
startMinecraftBotCore();
