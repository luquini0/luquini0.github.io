  /* ---------------- interactive terminal ---------------- */
  (function(){
    var termOutput = document.getElementById('termOutput');
    var termInput = document.getElementById('termInput');
    if(!termOutput || !termInput) return;

    function tr(es, en){ return (document.body.getAttribute('data-lang') === 'en') ? en : es; }
    function escapeHtml(s){
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }
    function printRaw(html, cls){
      var d = document.createElement('div');
      if(cls) d.className = cls;
      d.innerHTML = html;
      termOutput.appendChild(d);
      termOutput.scrollTop = termOutput.scrollHeight;
    }
    function printText(text, cls){ printRaw(escapeHtml(text), cls); }
    function printCmdEcho(cmd){ printRaw(escapeHtml(cmd), 'prompt-line'); }
    function goSection(id){
      var el = document.getElementById(id);
      if(el) setTimeout(function(){ el.scrollIntoView({ behavior:'smooth', block:'start' }); }, 350);
    }
    function printSeq(lines, delay){
      delay = delay || 380;
      termInput.disabled = true;
      lines.forEach(function(line, i){
        setTimeout(function(){
          printRaw(line, 'cm');
          if(i === lines.length - 1){ termInput.disabled = false; termInput.focus(); }
        }, delay*(i+1));
      });
    }
    function triggerMatrixRain(){
      if(document.getElementById('matrixRain')) return;
      var canvas = document.createElement('canvas');
      canvas.id = 'matrixRain';
      canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;opacity:0;transition:opacity .4s;cursor:pointer;';
      document.body.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
      resize();
      requestAnimationFrame(function(){ canvas.style.opacity = '1'; });
      var chars = 'アイウエオカキクケコサシスセソ0123456789LUQUINI0';
      var fontSize = 15;
      var drops = new Array(Math.floor(canvas.width/fontSize)).fill(1);
      var raf;
      function draw(){
        ctx.fillStyle = 'rgba(8,8,7,0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#cbff3e';
        ctx.font = fontSize + 'px monospace';
        for(var i=0; i<drops.length; i++){
          var text = chars[Math.floor(Math.random()*chars.length)];
          ctx.fillText(text, i*fontSize, drops[i]*fontSize);
          if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        raf = requestAnimationFrame(draw);
      }
      draw();
      var autoTimer = setTimeout(cleanup, 5000);
      function cleanup(){
        cancelAnimationFrame(raf);
        clearTimeout(autoTimer);
        canvas.style.opacity = '0';
        window.removeEventListener('resize', resize);
        setTimeout(function(){ canvas.remove(); }, 400);
      }
      canvas.addEventListener('click', cleanup);
      window.addEventListener('resize', resize);
    }

    var LINKS_LIST = [
      ['GitHub', 'https://github.com/luquini0'],
      ['Instagram', 'https://www.instagram.com/luquini0/'],
      ['Twitter / X', 'https://twitter.com/luquinio'],
      ['Rie La Huerta', 'https://rielahuerta.com'],
      ['Arikaya', 'https://arikaya.com.au'],
      ['Tap Mundial 2026', 'https://tap-mundial.pages.dev/']
    ];

    /* CV downloads are code-gated: the file links never sit in the page
       source, they're only built once the visitor types the right code. */
    var CV_CODE = 'gettoknowme';
    function printCvLinks(){
      printRaw(tr('Descargar CV:', 'Download CV:'));
      printRaw('<a href="CV_Luquini0_ES.docx" download>CV (ES) &rarr;</a>');
      printRaw('<a href="CV_Luquini0_EN.docx" download>CV (EN) &rarr;</a>');
    }
    function startCvCode(){
      termState = 'cvcode';
      printRaw(tr('Los CV están protegidos. Ingresá el código de acceso (o escribí <span class="c2">cancel</span>).', "The CVs are protected. Enter the access code (or type <span class=\"c2\">cancel</span>)."));
      termInput.type = 'password';
      termInput.placeholder = tr('Código...', 'Code...');
    }
    function handleCvCode(raw){
      if(raw.toLowerCase() === 'cancel'){
        termState = 'idle';
        termInput.type = 'text';
        termInput.placeholder = tr("escribí 'help' y presioná Enter", "type 'help' and press Enter");
        printRaw(tr('Cancelado.', 'Cancelled.'));
        return;
      }
      if(raw.trim().toLowerCase() === CV_CODE){
        termState = 'idle';
        termInput.type = 'text';
        termInput.placeholder = tr("escribí 'help' y presioná Enter", "type 'help' and press Enter");
        printRaw('<span class="c1">✓</span> ' + tr('Código correcto.', 'Correct code.'));
        printCvLinks();
      } else {
        printRaw('<span class="c2">✕</span> ' + tr('Código incorrecto — probá de nuevo (o <span class="c2">cancel</span>).', "Incorrect code — try again (or <span class=\"c2\">cancel</span>)."));
      }
    }

    var guessTarget = null, guessTries = 0;
    function startGuess(){
      guessTarget = 1 + Math.floor(Math.random()*100);
      guessTries = 0;
      termState = 'guess';
      printRaw(tr('Pensé un número del 1 al 100. Adivinalo (escribí <span class="c2">cancel</span> para salir).', "I'm thinking of a number 1–100. Guess it (type <span class=\"c2\">cancel</span> to quit)."));
      termInput.placeholder = tr('Tu número...', 'Your guess...');
    }
    function handleGuess(raw){
      if(raw.toLowerCase() === 'cancel'){
        termState = 'idle';
        termInput.placeholder = tr("escribí 'help' y presioná Enter", "type 'help' and press Enter");
        printRaw(tr('Cancelado. Era el ' + guessTarget + '.', 'Cancelled. It was ' + guessTarget + '.'));
        return;
      }
      var n = parseInt(raw, 10);
      if(isNaN(n)){ printRaw(tr('Escribí un número.', 'Type a number.')); return; }
      guessTries++;
      if(n === guessTarget){
        termState = 'idle';
        termInput.placeholder = tr("escribí 'help' y presioná Enter", "type 'help' and press Enter");
        printRaw('<span class="c1">✓</span> ' + tr('¡Justo! Lo sacaste en ' + guessTries + ' intento(s).', 'Nailed it in ' + guessTries + ' guess(es).'));
      } else if(n < guessTarget){
        printRaw(tr('Más alto ↑', 'Higher ↑'));
      } else {
        printRaw(tr('Más bajo ↓', 'Lower ↓'));
      }
    }

    /* ---- demo popups: each shows one skill area as a small live tool ---- */

    /* shared arcade utilities: sound + vibration prefs (persisted), beep, control bar */
    var GAME_PREFS = {
      sound: (function(){ try{ return localStorage.getItem('game_sound') !== '0'; }catch(e){ return true; } })(),
      vibe:  (function(){ try{ return localStorage.getItem('game_vibe')  !== '0'; }catch(e){ return true; } })()
    };
    function gameSetPref(key, val){
      GAME_PREFS[key] = val;
      try{ localStorage.setItem('game_' + key, val ? '1' : '0'); }catch(e){}
    }
    var __gameAudioCtx = null;
    function gameBeep(freq, dur){
      if(!GAME_PREFS.sound) return;
      try{
        if(!__gameAudioCtx) __gameAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var actx = __gameAudioCtx;
        var osc = actx.createOscillator(), gain = actx.createGain();
        osc.type = 'square'; osc.frequency.value = freq;
        gain.gain.value = 0.05;
        osc.connect(gain); gain.connect(actx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
        osc.stop(actx.currentTime + dur);
      }catch(e){}
    }
    function gameVibrate(pattern){
      if(!GAME_PREFS.vibe) return;
      try{ if(navigator.vibrate) navigator.vibrate(pattern); }catch(e){}
    }
    function gameBackBtn(){
      return '<button type="button" class="game-btn game-back" title="' + tr('Elegir otro juego','Choose another game') + '">← ' + tr('Menú','Menu') + '</button>';
    }
    function gameControlBar(){
      return '<div class="game-bar">' +
        gameBackBtn() +
        '<span class="game-bar-spacer"></span>' +
        '<button type="button" class="game-btn game-sound" title="' + tr('Sonido','Sound') + '">' + (GAME_PREFS.sound ? '🔊' : '🔇') + '</button>' +
        '<button type="button" class="game-btn game-vibe" title="' + tr('Vibración','Vibration') + '">' + (GAME_PREFS.vibe ? '📳' : '📴') + '</button>' +
        '<button type="button" class="game-btn game-reset" title="' + tr('Reiniciar','Reset') + '">↺</button>' +
      '</div>';
    }
    function wireGameBar(body, onReset){
      body.querySelector('.game-back').addEventListener('click', openPlayDemo);
      var soundBtn = body.querySelector('.game-sound');
      soundBtn.addEventListener('click', function(){
        gameSetPref('sound', !GAME_PREFS.sound);
        soundBtn.textContent = GAME_PREFS.sound ? '🔊' : '🔇';
      });
      var vibeBtn = body.querySelector('.game-vibe');
      vibeBtn.addEventListener('click', function(){
        gameSetPref('vibe', !GAME_PREFS.vibe);
        vibeBtn.textContent = GAME_PREFS.vibe ? '📳' : '📴';
      });
      if(onReset) body.querySelector('.game-reset').addEventListener('click', onReset);
    }
    function livesDots(lives, max){
      var out = '';
      for(var i = 0; i < max; i++) out += '<span' + (i < lives ? '' : ' class="lost"') + '>●</span>';
      return out;
    }
    function gameOverPanel(idPrefix){
      return '<div class="game-over" id="' + idPrefix + 'Over" style="display:none;">' +
        '<div class="go-title mono">' + tr('GAME OVER','GAME OVER') + '</div>' +
        '<div class="go-score mono">' + tr('Puntos','Score') + ': <b id="' + idPrefix + 'FinalScore">0</b></div>' +
        '<form class="go-form" id="' + idPrefix + 'Form" autocomplete="off">' +
          '<input type="text" id="' + idPrefix + 'NameInput" class="mono" maxlength="12" data-es-placeholder="Tu nombre (opcional)" data-en-placeholder="Your name (optional)" placeholder="' + tr('Tu nombre (opcional)','Your name (optional)') + '">' +
          '<button type="submit" class="btn btn-primary">' + tr('Guardar','Save') + '</button>' +
        '</form>' +
        '<p class="go-saved mono" id="' + idPrefix + 'Saved" style="display:none;">' + tr('¡Guardado! →','Saved! →') + ' <a href="#" class="go-play-again">' + tr('jugar de nuevo','play again') + '</a></p>' +
      '</div>';
    }
    // Wires the name-entry form for a game-over panel. `getScore` reads the
    // final score at submit time; `onPlayAgain` should fully reset the game
    // (score + lives) and hide the panel.
    function wireGameOver(idPrefix, game, getScore, onPlayAgain){
      var panel = document.getElementById(idPrefix + 'Over');
      var form = document.getElementById(idPrefix + 'Form');
      var input = document.getElementById(idPrefix + 'NameInput');
      var saved = document.getElementById(idPrefix + 'Saved');
      var finalScoreEl = document.getElementById(idPrefix + 'FinalScore');

      function show(score){
        finalScoreEl.textContent = String(score);
        saved.style.display = 'none';
        form.style.display = '';
        input.value = '';
        panel.style.display = '';
        setTimeout(function(){ input.focus(); }, 50);
      }
      function hide(){ panel.style.display = 'none'; }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        var name = (input.value || '').trim().slice(0, 12) || null;
        if(window.__submitScore) window.__submitScore(game, getScore(), name);
        if(window.__renderLeaderboard) window.__renderLeaderboard(game, idPrefix + 'Board');
        form.style.display = 'none';
        saved.style.display = '';
      });
      saved.querySelector('.go-play-again').addEventListener('click', function(e){
        e.preventDefault();
        hide();
        onPlayAgain();
      });

      return { show: show, hide: hide };
    }
    // Shared "click-and-drag" mouse control: calls onDir('up'|'down'|'left'|'right')
    // continuously while the mouse is held and moved, same contract as the
    // touch joystick callback — so games can wire one handler to both.
    function wireMouseDrag(canvas, onDir){
      var dragging = false, lastX = 0, lastY = 0;
      var THRESHOLD = 12;
      function toLocal(e){
        var rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
      }
      canvas.addEventListener('mousedown', function(e){
        dragging = true;
        var p = toLocal(e);
        lastX = p.x; lastY = p.y;
      });
      window.addEventListener('mousemove', function(e){
        if(!dragging) return;
        var p = toLocal(e);
        var dx = p.x - lastX, dy = p.y - lastY;
        if(Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
        if(Math.abs(dx) > Math.abs(dy)) onDir(dx > 0 ? 'right' : 'left');
        else onDir(dy > 0 ? 'down' : 'up');
        lastX = p.x; lastY = p.y;
      });
      window.addEventListener('mouseup', function(){ dragging = false; });
    }
    // Absolute position drag: while the mouse is held over the canvas,
    // reports the local (x,y) on every move — used by Pong/Dodge, whose
    // player position can track the cursor directly instead of by direction.
    function wireMousePosition(canvas, onMove){
      var dragging = false;
      function toLocal(e){
        var rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
      }
      canvas.addEventListener('mousedown', function(e){ dragging = true; onMove(toLocal(e)); });
      window.addEventListener('mousemove', function(e){ if(dragging) onMove(toLocal(e)); });
      window.addEventListener('mouseup', function(){ dragging = false; });
    }
    function gameIntro(emoji, title, rules, onPlay){
      var html =
        gameBackBtn() +
        '<div class="game-intro" style="margin-top:14px;">' +
          '<div class="g-emoji">' + emoji + '</div>' +
          '<h3>' + title + '</h3>' +
          '<p class="demo-note">' + rules + '</p>' +
          '<button type="button" class="btn btn-primary game-play-btn" style="width:100%;justify-content:center;">▶ ' + tr('Jugar','Play') + '</button>' +
        '</div>';
      window.__openDemo(title, html, function(body){
        body.querySelector('.game-back').addEventListener('click', openPlayDemo);
        body.querySelector('.game-play-btn').addEventListener('click', onPlay);
      }, null);
    }

    function openPlayDemo(){
      var html =
        '<p class="demo-note" style="margin-bottom:14px;">' + tr('Elegí un juego:','Choose a game:') + '</p>' +
        '<button type="button" class="btn btn-ghost game-pick" data-game="snake" style="width:100%;justify-content:center;margin-bottom:8px;">🐍 Snake</button>' +
        '<button type="button" class="btn btn-ghost game-pick" data-game="pong" style="width:100%;justify-content:center;margin-bottom:8px;">🏓 Pong</button>' +
        '<button type="button" class="btn btn-ghost game-pick" data-game="dodge" style="width:100%;justify-content:center;">🚀 ' + tr('Esquivar','Dodge') + '</button>';

      window.__openDemo(tr('Elegí un juego','Choose a game'), html, function(body){
        body.querySelectorAll('.game-pick').forEach(function(btn){
          btn.addEventListener('click', function(){
            var g = btn.getAttribute('data-game');
            if(g === 'snake') openSnakeGame();
            else if(g === 'pong') openPongGame();
            else if(g === 'dodge') openDodgeGame();
          });
        });
      }, null);
    }

    function openSnakeGame(){
      gameIntro('🐍', tr('Snake','Snake'),
        tr('Comé los cuadrados rojos para crecer y sumar puntos. Si chocás contra el borde o contra vos mismo, arrancás de nuevo.','Eat the red squares to grow and score. Hit the wall or yourself and you start over.'),
        startSnakeGame);
    }

    function startSnakeGame(){
      var timer, keyHandler;
      var MAX_LIVES = 3;
      var html =
        gameControlBar() +
        '<div class="demo-hud"><span>' + tr('Puntos','Score') + ': <b id="dsScore">0</b></span><span class="game-lives mono" id="dsLives"></span></div>' +
        '<div class="game-canvas-wrap"><canvas id="demoSnakeCanvas" width="240" height="240"></canvas></div>' +
        gameOverPanel('ds') +
        '<div class="leaderboard" id="dsBoard"></div>' +
        '<div class="joystick only-touch" id="demoJoystick" aria-hidden="true">' +
          '<div class="joystick-base"><div class="joystick-knob" id="demoJoystickKnob"></div></div>' +
        '</div>' +
        '<p class="term-hint only-desktop">' + tr('Flechas / WASD, o hacé clic y arrastrá. 3 vidas.','Arrow keys / WASD, or click and drag. 3 lives.') + '</p>' +
        '<p class="term-hint only-touch">' + tr('Arrastrá el joystick. 3 vidas.','Drag the joystick. 3 lives.') + '</p>';

      window.__openDemo(tr('Snake — minijuego','Snake — mini game'), html, function(body){
        var canvas = document.getElementById('demoSnakeCanvas');
        var ctx = canvas.getContext('2d');
        var scoreEl = document.getElementById('dsScore');
        var livesEl = document.getElementById('dsLives');
        var CELL = 20, COLS = 12, ROWS = 12;
        var snake, dir, nextDir, food, score, lives;
        var over = false;
        var gameOver = wireGameOver('ds', 'snake', function(){ return score; }, newGame);

        function place(){
          var ok=false, fx, fy;
          while(!ok){ fx=Math.floor(Math.random()*COLS); fy=Math.floor(Math.random()*ROWS); ok=!snake.some(function(s){return s.x===fx&&s.y===fy;}); }
          food={x:fx,y:fy};
        }
        function resetRound(){
          snake=[{x:5,y:6},{x:4,y:6},{x:3,y:6}]; dir={x:1,y:0}; nextDir={x:1,y:0}; place();
        }
        function newGame(){
          score = 0; lives = MAX_LIVES; over = false;
          scoreEl.textContent = '0';
          livesEl.innerHTML = livesDots(lives, MAX_LIVES);
          resetRound();
          draw();
          clearInterval(timer);
          timer = setInterval(tick, 130);
        }
        function draw(){
          ctx.fillStyle='#171716'; ctx.fillRect(0,0,canvas.width,canvas.height);
          ctx.fillStyle='#cbff3e'; snake.forEach(function(s){ ctx.fillRect(s.x*CELL+1, s.y*CELL+1, CELL-2, CELL-2); });
          ctx.fillStyle='#ff4d1c'; ctx.fillRect(food.x*CELL+2, food.y*CELL+2, CELL-4, CELL-4);
        }
        function tick(){
          if(over) return;
          dir = nextDir;
          var head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
          var hit = head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(function(s){return s.x===head.x&&s.y===head.y;});
          if(hit){
            gameBeep(120,0.25); gameVibrate(120);
            lives--; livesEl.innerHTML = livesDots(lives, MAX_LIVES);
            if(lives <= 0){
              over = true; clearInterval(timer);
              gameOver.show(score);
              draw();
              return;
            }
            resetRound(); draw(); return;
          }
          snake.unshift(head);
          if(head.x===food.x && head.y===food.y){ score++; scoreEl.textContent=String(score); gameBeep(660,0.08); gameVibrate(15); place(); }
          else snake.pop();
          draw();
        }
        newGame();

        function handleDir(d){
          if(over) return;
          if(d==='up'&&dir.y!==1) nextDir={x:0,y:-1};
          else if(d==='down'&&dir.y!==-1) nextDir={x:0,y:1};
          else if(d==='left'&&dir.x!==1) nextDir={x:-1,y:0};
          else if(d==='right'&&dir.x!==-1) nextDir={x:1,y:0};
        }
        keyHandler = function(e){
          var k = e.key.toLowerCase();
          if(k==='arrowup'||k==='w'){ handleDir('up'); e.preventDefault(); }
          else if(k==='arrowdown'||k==='s'){ handleDir('down'); e.preventDefault(); }
          else if(k==='arrowleft'||k==='a'){ handleDir('left'); e.preventDefault(); }
          else if(k==='arrowright'||k==='d'){ handleDir('right'); e.preventDefault(); }
        };
        document.addEventListener('keydown', keyHandler);
        wireMouseDrag(canvas, handleDir);
        if(window.__createJoystick){
          window.__createJoystick(body.querySelector('#demoJoystick'), body.querySelector('#demoJoystickKnob'), handleDir);
        }

        wireGameBar(body, newGame);
        if(window.__renderLeaderboard) window.__renderLeaderboard('snake', 'dsBoard');
      }, function(){
        clearInterval(timer);
        document.removeEventListener('keydown', keyHandler);
      });
    }

    function openPongGame(){
      gameIntro('🏓', tr('Pong','Pong'),
        tr('Movete de izquierda a derecha para devolver la pelota. La CPU juega arriba. Cada rebote tuyo suma un punto.','Move left and right to return the ball. The CPU plays up top. Every return you make scores a point.'),
        startPongGame);
    }

    function startPongGame(){
      var raf, keyDownHandler, keyUpHandler;
      var MAX_LIVES = 3;
      var html =
        gameControlBar() +
        '<div class="demo-hud"><span>' + tr('Puntos','Score') + ': <b id="dpScore">0</b></span><span class="game-lives mono" id="dpLives"></span></div>' +
        '<div class="game-canvas-wrap"><canvas id="demoPongCanvas" width="240" height="240"></canvas></div>' +
        gameOverPanel('dp') +
        '<div class="leaderboard" id="dpBoard"></div>' +
        '<div class="joystick only-touch" id="pongJoystick" aria-hidden="true">' +
          '<div class="joystick-base"><div class="joystick-knob" id="pongJoystickKnob"></div></div>' +
        '</div>' +
        '<p class="term-hint only-desktop">' + tr('Flechas / A-D, o hacé clic y arrastrá. 3 vidas.','Arrow keys / A-D, or click and drag. 3 lives.') + '</p>' +
        '<p class="term-hint only-touch">' + tr('Arrastrá el joystick para mover la paleta. 3 vidas.','Drag the joystick to move the paddle. 3 lives.') + '</p>';

      window.__openDemo(tr('Pong — minijuego','Pong — mini game'), html, function(body){
        var canvas = document.getElementById('demoPongCanvas');
        var ctx = canvas.getContext('2d');
        var scoreEl = document.getElementById('dpScore');
        var livesEl = document.getElementById('dpLives');
        var W = canvas.width, H = canvas.height;
        var PW = 48, PH = 8;
        var player, cpu, ball, frame, speedMult, score, lives;
        var over = false;
        var keys = { left:false, right:false };
        var gameOver = wireGameOver('dp', 'pong', function(){ return score; }, newGame);

        function resetBall(dir){
          ball = { x: W/2, y: H/2, r: 5 };
          ball.vx = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random()) * speedMult;
          ball.vy = dir * (2.4 + Math.random()*0.6) * speedMult;
        }
        function newGame(){
          player = { x: (W-PW)/2 };
          cpu = { x: (W-PW)/2 };
          score = 0; scoreEl.textContent = '0';
          lives = MAX_LIVES; livesEl.innerHTML = livesDots(lives, MAX_LIVES);
          over = false;
          frame = 0; speedMult = 0.6;
          resetBall(-1);
          draw();
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(step);
        }

        function draw(){
          ctx.fillStyle='#171716'; ctx.fillRect(0,0,W,H);
          ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.setLineDash([4,6]);
          ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle='#cbff3e'; ctx.fillRect(player.x, H-16, PW, PH);
          ctx.fillStyle='#ff4d1c'; ctx.fillRect(cpu.x, 16-PH, PW, PH);
          ctx.fillStyle='#f3ede0'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
        }

        function step(){
          if(over) return;
          frame++;
          if(frame % 300 === 0 && speedMult < 1.3) speedMult = Math.min(1.3, speedMult + 0.05);

          var speed = 4.2;
          if(keys.left) player.x -= speed;
          if(keys.right) player.x += speed;
          player.x = Math.max(0, Math.min(W-PW, player.x));

          var cpuSpeed = 3.1, cpuCenter = cpu.x + PW/2;
          if(cpuCenter < ball.x - 4) cpu.x += cpuSpeed;
          else if(cpuCenter > ball.x + 4) cpu.x -= cpuSpeed;
          cpu.x = Math.max(0, Math.min(W-PW, cpu.x));

          ball.x += ball.vx; ball.y += ball.vy;
          if(ball.x - ball.r < 0){ ball.x = ball.r; ball.vx *= -1; }
          if(ball.x + ball.r > W){ ball.x = W-ball.r; ball.vx *= -1; }

          if(ball.vy > 0 && ball.y + ball.r >= H-16 && ball.y + ball.r <= H-16+PH+6 && ball.x >= player.x-ball.r && ball.x <= player.x+PW+ball.r){
            ball.y = H-16-ball.r; ball.vy *= -1;
            ball.vx += ((ball.x - (player.x+PW/2)) / PW) * 1.5;
            score++; scoreEl.textContent = String(score);
            gameBeep(520, 0.06); gameVibrate(12);
          }
          if(ball.vy < 0 && ball.y - ball.r <= 16 && ball.y - ball.r >= 16-PH-6 && ball.x >= cpu.x-ball.r && ball.x <= cpu.x+PW+ball.r){
            ball.y = 16+ball.r; ball.vy *= -1;
            gameBeep(300, 0.05);
          }

          if(ball.y - ball.r > H){
            gameBeep(150,0.2); gameVibrate(80);
            lives--; livesEl.innerHTML = livesDots(lives, MAX_LIVES);
            if(lives <= 0){ over = true; gameOver.show(score); draw(); return; }
            resetBall(-1);
          }
          if(ball.y + ball.r < 0) resetBall(1);

          draw();
          raf = requestAnimationFrame(step);
        }

        keyDownHandler = function(e){
          var k = e.key.toLowerCase();
          if(k==='arrowleft'||k==='a'){ keys.left=true; e.preventDefault(); }
          else if(k==='arrowright'||k==='d'){ keys.right=true; e.preventDefault(); }
        };
        keyUpHandler = function(e){
          var k = e.key.toLowerCase();
          if(k==='arrowleft'||k==='a') keys.left=false;
          else if(k==='arrowright'||k==='d') keys.right=false;
        };
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        if(window.__createJoystick){
          window.__createJoystick(body.querySelector('#pongJoystick'), body.querySelector('#pongJoystickKnob'), function(d){
            if(over) return;
            if(d==='left') player.x = Math.max(0, player.x - 5);
            else if(d==='right') player.x = Math.min(W-PW, player.x + 5);
          });
        }
        wireMousePosition(canvas, function(p){
          if(over) return;
          player.x = Math.max(0, Math.min(W-PW, p.x - PW/2));
        });

        newGame();

        wireGameBar(body, newGame);
        if(window.__renderLeaderboard) window.__renderLeaderboard('pong', 'dpBoard');
      }, function(){
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
      });
    }

    function openDodgeGame(){
      gameIntro('🚀', tr('Esquivar','Dodge'),
        tr('Subí y bajá para esquivar los obstáculos que vienen desde la derecha. Cada uno que pasás suma un punto, la velocidad sube con el tiempo.','Move up and down to dodge the obstacles coming from the right. Each one you pass scores a point, speed increases over time.'),
        startDodgeGame);
    }

    function startDodgeGame(){
      var raf, keyDownHandler, keyUpHandler;
      var MAX_LIVES = 3;
      var html =
        gameControlBar() +
        '<div class="demo-hud"><span>' + tr('Puntos','Score') + ': <b id="ddScore">0</b></span><span class="game-lives mono" id="ddLives"></span></div>' +
        '<div class="game-canvas-wrap"><canvas id="demoDodgeCanvas" width="240" height="240"></canvas></div>' +
        gameOverPanel('dd') +
        '<div class="leaderboard" id="ddBoard"></div>' +
        '<div class="joystick only-touch" id="dodgeJoystick" aria-hidden="true">' +
          '<div class="joystick-base"><div class="joystick-knob" id="dodgeJoystickKnob"></div></div>' +
        '</div>' +
        '<p class="term-hint only-desktop">' + tr('Flechas / W-S, o hacé clic y arrastrá. 3 vidas.','Arrow keys / W-S, or click and drag. 3 lives.') + '</p>' +
        '<p class="term-hint only-touch">' + tr('Arrastrá el joystick para esquivar. 3 vidas.','Drag the joystick to dodge. 3 lives.') + '</p>';

      window.__openDemo(tr('Esquivar — minijuego','Dodge — mini game'), html, function(body){
        var canvas = document.getElementById('demoDodgeCanvas');
        var ctx = canvas.getContext('2d');
        var scoreEl = document.getElementById('ddScore');
        var livesEl = document.getElementById('ddLives');
        var W = canvas.width, H = canvas.height;
        var player = { x: 26, y: H/2, size: 14 };
        var obstacles = [];
        var score, frame, speed, lives;
        var over = false;
        var keys = { up:false, down:false };
        var gameOver = wireGameOver('dd', 'dodge', function(){ return score; }, newGame);

        function newGame(){
          obstacles = []; score = 0; scoreEl.textContent = '0'; frame = 0; speed = 1.6; player.y = H/2;
          lives = MAX_LIVES; livesEl.innerHTML = livesDots(lives, MAX_LIVES);
          over = false;
          draw();
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(step);
        }
        function spawn(){
          var gapH = 46;
          var gapY = 20 + Math.random() * (H - 40 - gapH);
          obstacles.push({ x: W, gapY: gapY, gapH: gapH, w: 16, passed:false });
        }
        function draw(){
          ctx.fillStyle='#171716'; ctx.fillRect(0,0,W,H);
          ctx.fillStyle='#ff4d1c';
          obstacles.forEach(function(o){
            ctx.fillRect(o.x, 0, o.w, o.gapY);
            ctx.fillRect(o.x, o.gapY+o.gapH, o.w, H-(o.gapY+o.gapH));
          });
          ctx.fillStyle='#cbff3e';
          ctx.fillRect(player.x-player.size/2, player.y-player.size/2, player.size, player.size);
        }
        function step(){
          if(over) return;
          frame++;
          if(frame % 70 === 0) spawn();
          if(frame % 450 === 0 && speed < 4.2) speed = Math.min(4.2, speed + 0.25);

          var pspeed = 3.4;
          if(keys.up) player.y -= pspeed;
          if(keys.down) player.y += pspeed;
          player.y = Math.max(player.size/2, Math.min(H-player.size/2, player.y));

          for(var i=obstacles.length-1; i>=0; i--){
            var o = obstacles[i];
            o.x -= speed;
            if(!o.passed && o.x + o.w < player.x){ o.passed = true; score++; scoreEl.textContent = String(score); gameBeep(700,0.05); }
            if(o.x < -o.w) obstacles.splice(i,1);
          }

          var crashed = obstacles.some(function(o){
            var withinX = player.x + player.size/2 > o.x && player.x - player.size/2 < o.x + o.w;
            if(!withinX) return false;
            return (player.y - player.size/2 < o.gapY) || (player.y + player.size/2 > o.gapY + o.gapH);
          });
          if(crashed){
            gameBeep(120,0.25); gameVibrate(120);
            lives--; livesEl.innerHTML = livesDots(lives, MAX_LIVES);
            if(lives <= 0){ over = true; gameOver.show(score); draw(); return; }
            obstacles = []; frame = 0; player.y = H/2;
          }

          draw();
          raf = requestAnimationFrame(step);
        }

        keyDownHandler = function(e){
          var k = e.key.toLowerCase();
          if(k==='arrowup'||k==='w'){ keys.up=true; e.preventDefault(); }
          else if(k==='arrowdown'||k==='s'){ keys.down=true; e.preventDefault(); }
        };
        keyUpHandler = function(e){
          var k = e.key.toLowerCase();
          if(k==='arrowup'||k==='w') keys.up=false;
          else if(k==='arrowdown'||k==='s') keys.down=false;
        };
        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        if(window.__createJoystick){
          window.__createJoystick(body.querySelector('#dodgeJoystick'), body.querySelector('#dodgeJoystickKnob'), function(d){
            if(over) return;
            if(d==='up') player.y = Math.max(player.size/2, player.y - 6);
            else if(d==='down') player.y = Math.min(H-player.size/2, player.y + 6);
          });
        }
        wireMousePosition(canvas, function(p){
          if(over) return;
          player.y = Math.max(player.size/2, Math.min(H-player.size/2, p.y));
        });

        newGame();

        wireGameBar(body, newGame);
        if(window.__renderLeaderboard) window.__renderLeaderboard('dodge', 'ddBoard');
      }, function(){
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
      });
    }

    function openSandboxDemo(){
      var starter = "function fib(n){\n  return n < 2 ? n : fib(n-1) + fib(n-2);\n}\nprint('fib(10) =', fib(10));\nprint('2 + 2 =', 2 + 2);";
      var html =
        '<label>' + tr('Editá y ejecutá JavaScript real','Edit and run real JavaScript') + '</label>' +
        '<textarea id="sbCode" class="sb-code mono">' + starter.replace(/</g,'&lt;') + '</textarea>' +
        '<button type="button" id="sbRun" class="btn btn-primary" style="margin-top:10px;">' + tr('Ejecutar ▶','Run ▶') + '</button>' +
        '<pre id="sbOutput" class="sb-output mono"></pre>' +
        '<p class="demo-note">' + tr('Corre 100% en tu navegador — nada se envía a un servidor.','Runs 100% in your browser — nothing is sent to a server.') + '</p>';

      window.__openDemo(tr('Sandbox de código','Code sandbox'), html, function(){
        var codeEl = document.getElementById('sbCode');
        var outEl = document.getElementById('sbOutput');
        document.getElementById('sbRun').addEventListener('click', function(){
          var lines = [];
          function print(){ lines.push(Array.prototype.slice.call(arguments).join(' ')); }
          try{
            new Function('print', codeEl.value)(print);
            outEl.textContent = lines.length ? lines.join('\n') : tr('(sin salida — usá print() para mostrar algo)','(no output — use print() to show something)');
          } catch(err){
            outEl.textContent = 'Error: ' + err.message;
          }
        });
      });
    }

    function openHashDemo(){
      var html =
        '<label>' + tr('Texto a hashear (SHA-256)','Text to hash (SHA-256)') + '</label>' +
        '<input type="text" id="hashIn" placeholder="' + tr('Escribí cualquier cosa...','Type anything...') + '">' +
        '<div id="hashOut" class="hash-output"></div>' +
        '<p class="demo-note">' + tr('Así funciona el hashing detrás de blockchain, git y el guardado de contraseñas: cualquier cambio, por mínimo que sea, cambia todo el resultado.','This is how hashing works behind blockchain, git and password storage: any change, however small, changes the entire output.') + '</p>';

      window.__openDemo(tr('Generador de hash SHA-256','SHA-256 hash generator'), html, function(){
        var input = document.getElementById('hashIn');
        var out = document.getElementById('hashOut');
        function update(){
          var v = input.value;
          if(!v){ out.textContent = ''; return; }
          crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function(buf){
            out.textContent = Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
          }).catch(function(){ out.textContent = tr('(no disponible en este navegador)','(not available in this browser)'); });
        }
        input.addEventListener('input', update);
      });
    }

    function openPwCheckDemo(){
      var html =
        '<label>' + tr('Probá una contraseña (no se guarda ni se envía)','Try a password (not stored or sent anywhere)') + '</label>' +
        '<input type="text" id="pwIn" placeholder="••••••••" autocomplete="off">' +
        '<div class="pw-meter"><div id="pwBar" class="pw-bar"></div></div>' +
        '<div id="pwLabel" class="pw-label"></div>' +
        '<div id="pwCrack" class="pw-crack"></div>';

      window.__openDemo(tr('Analizador de contraseñas','Password strength checker'), html, function(){
        var input = document.getElementById('pwIn');
        var bar = document.getElementById('pwBar');
        var label = document.getElementById('pwLabel');
        var crackEl = document.getElementById('pwCrack');
        function fmtTime(seconds){
          if(seconds < 1) return tr('instantáneo','instant');
          var units = [[3153600000,tr('siglos','centuries')],[31536000,tr('años','years')],[86400,tr('días','days')],[3600,tr('horas','hours')],[60,tr('minutos','minutes')],[1,tr('segundos','seconds')]];
          for(var i=0;i<units.length;i++){
            if(seconds >= units[i][0]) return Math.round(seconds/units[i][0]) + ' ' + units[i][1];
          }
          return Math.round(seconds) + ' ' + tr('segundos','seconds');
        }
        function update(){
          var v = input.value;
          if(!v){ bar.style.width='0%'; label.textContent=''; crackEl.textContent=''; return; }
          var charset = 0;
          if(/[a-z]/.test(v)) charset += 26;
          if(/[A-Z]/.test(v)) charset += 26;
          if(/[0-9]/.test(v)) charset += 10;
          if(/[^a-zA-Z0-9]/.test(v)) charset += 32;
          var entropy = v.length * Math.log2(charset || 1);
          bar.style.width = Math.min(100, Math.round(entropy/80*100)) + '%';
          var lbl, color;
          if(entropy < 28){ lbl = tr('Muy débil','Very weak'); color = '#ff3b3b'; }
          else if(entropy < 45){ lbl = tr('Débil','Weak'); color = '#ff4d1c'; }
          else if(entropy < 65){ lbl = tr('Aceptable','Okay'); color = '#f5c542'; }
          else if(entropy < 85){ lbl = tr('Fuerte','Strong'); color = '#cbff3e'; }
          else { lbl = tr('Muy fuerte','Very strong'); color = '#7c8cff'; }
          bar.style.background = color;
          label.textContent = lbl + ' — ' + Math.round(entropy) + ' bits';
          var seconds = (Math.pow(2, entropy) / 2) / 10000000000;
          crackEl.textContent = tr('Tiempo estimado para crackearla (fuerza bruta offline): ','Estimated crack time (offline brute-force): ') + fmtTime(seconds);
        }
        input.addEventListener('input', update);
      });
    }

    function openSeoDemo(){
      var defTitle = tr('Luquini0 — Desarrollador Full-Stack','Luquini0 — Full-Stack Developer');
      var defDesc = tr('Desarrollo, ciberseguridad, automatización, diseño 3D y blockchain. Disponible para proyectos.','Development, cybersecurity, automation, 3D design and blockchain. Available for projects.');
      var html =
        '<label>Title tag</label><input type="text" id="seoTitle" value="' + defTitle + '">' +
        '<div class="char-count" id="seoTitleCount"></div>' +
        '<label>Meta description</label><input type="text" id="seoDesc" value="' + defDesc + '">' +
        '<div class="char-count" id="seoDescCount"></div>' +
        '<label>' + tr('Vista previa en Google','Google preview') + '</label>' +
        '<div class="serp-box"><div class="serp-url">luquini0.dev</div><div class="serp-title" id="serpTitle"></div><div class="serp-desc" id="serpDesc"></div></div>' +
        '<label>' + tr('Vista previa en redes (Open Graph)','Social preview (Open Graph)') + '</label>' +
        '<div class="og-card"><div class="og-card-media"></div><div class="og-card-body"><div class="og-card-domain">luquini0.dev</div><div class="og-card-title" id="ogTitle"></div><div class="og-card-desc" id="ogDesc"></div></div></div>';

      window.__openDemo(tr('Preview SEO / Social','SEO / Social preview'), html, function(){
        var titleIn = document.getElementById('seoTitle'), descIn = document.getElementById('seoDesc');
        var serpTitle = document.getElementById('serpTitle'), serpDesc = document.getElementById('serpDesc');
        var ogTitle = document.getElementById('ogTitle'), ogDesc = document.getElementById('ogDesc');
        var titleCount = document.getElementById('seoTitleCount'), descCount = document.getElementById('seoDescCount');
        function update(){
          var t = titleIn.value, d = descIn.value;
          serpTitle.textContent = t; serpDesc.textContent = d;
          ogTitle.textContent = t; ogDesc.textContent = d;
          titleCount.textContent = t.length + ' / 60';
          titleCount.className = 'char-count' + (t.length>60?' over':'');
          descCount.textContent = d.length + ' / 155';
          descCount.className = 'char-count' + (d.length>155?' over':'');
        }
        titleIn.addEventListener('input', update);
        descIn.addEventListener('input', update);
        update();
      });
    }

    function openCubeDemo(){
      var spin, onMouseMove, onUp;
      var labels = ['DEV','SEC','3D','AUTO','SQL','AI'];
      var facesHtml = ['f','bk','l','r','t','bo'].map(function(cls,i){ return '<div class="cf ' + cls + '">' + labels[i] + '</div>'; }).join('');
      var html =
        '<div class="cube-stage3d" id="cubeStage"><div class="cube3d" id="cube3d">' + facesHtml + '</div></div>' +
        '<p class="term-hint">' + tr('Arrastrá con el mouse (o el dedo) para rotar','Drag with your mouse (or finger) to rotate') + '</p>';

      window.__openDemo(tr('Cubo 3D interactivo','Interactive 3D cube'), html, function(){
        var stage = document.getElementById('cubeStage');
        var cube = document.getElementById('cube3d');
        var rx = -18, ry = 25, dragging = false, lastX = 0, lastY = 0;

        function apply(){ cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
        function autoSpin(){ if(!dragging){ ry += 0.35; apply(); } spin = requestAnimationFrame(autoSpin); }
        function down(x,y){ dragging = true; lastX = x; lastY = y; }
        function move(x,y){
          if(!dragging) return;
          ry += (x - lastX) * 0.5;
          rx = Math.max(-89, Math.min(89, rx - (y - lastY) * 0.5));
          lastX = x; lastY = y;
          apply();
        }
        apply();
        spin = requestAnimationFrame(autoSpin);
        onMouseMove = function(e){ move(e.clientX, e.clientY); };
        onUp = function(){ dragging = false; };
        stage.addEventListener('mousedown', function(e){ down(e.clientX, e.clientY); });
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onUp);
        stage.addEventListener('touchstart', function(e){ var t=e.touches[0]; down(t.clientX,t.clientY); }, {passive:true});
        stage.addEventListener('touchmove', function(e){ var t=e.touches[0]; move(t.clientX,t.clientY); e.preventDefault(); }, {passive:false});
        stage.addEventListener('touchend', onUp);
      }, function(){
        cancelAnimationFrame(spin);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onUp);
      });
    }

    var hasInteracted = false;

    function printWelcome(){
      termOutput.innerHTML = '';
      printRaw(tr(
        'Consola de Luquini0. Escribí <span class="c1">help</span> para ver los comandos disponibles.',
        'Luquini0\'s console. Type <span class="c1">help</span> to see the available commands.'
      ), 'cm');
    }
    printWelcome();
    window.__termWelcome = function(){ if(!hasInteracted) printWelcome(); };

    var HELP_CMDS = function(){ return [
      ['about', tr('quién soy', 'who I am')],
      ['skills', tr('stack técnico completo', 'full technical stack')],
      ['services', tr('servicios que ofrezco', 'services I offer')],
      ['experience', tr('experiencia laboral', 'work experience')],
      ['projects', tr('proyectos y ejemplos', 'projects &amp; examples')],
      ['education', tr('educación y certificaciones', 'education &amp; certifications')],
      ['cv', tr('descargar el CV (ES/EN)', 'download the CV (ES/EN)')],
      ['contact', tr('armar un mensaje de contacto', 'put together a contact message')],
      ['links', tr('links a mis redes y proyectos', 'links to my socials & projects')],
      ['guess', tr('jugar a adivinar el número', 'play guess-the-number')],
      ['play', tr('jugar Snake en una ventana', 'play Snake in a popup')],
      ['sandbox', tr('editor de JS que corre en vivo', 'live-running JS editor')],
      ['hash', tr('generador de hash SHA-256', 'SHA-256 hash generator')],
      ['pwcheck', tr('analizador de contraseñas', 'password strength checker')],
      ['seo', tr('preview de Google y redes sociales', 'Google & social preview')],
      ['cube', tr('cubo 3D que rotás con el mouse', '3D cube you can drag-rotate')],
      ['scrape', tr('demo de web scraping en vivo', 'live web scraping demo')],
      ['scan', tr('demo de escaneo de seguridad', 'security scan demo')],
      ['automate', tr('demo de flujo de automatización', 'workflow automation demo')],
      ['render', tr('demo 3D (CSS) — guiño a Blender', '3D demo (CSS) — a nod to Blender')],
      ['neofetch', tr('info del sistema, estilo dev', 'dev-style system info')],
      ['lang en / lang es', tr('cambiar idioma', 'switch language')],
      ['clear', tr('limpiar la consola', 'clear the console')],
      ['whoami', tr('¿quién sos vos?', 'who are you?')],
    ]; };

    var SKILL_CATS = function(){ return [
      tr('Desarrollo de Software (Python, Django, React Native, JS...)', 'Software Development (Python, Django, React Native, JS...)'),
      tr('Automatización & Datos (scraping, APIs, sync)', 'Automation & Data (scraping, APIs, sync)'),
      tr('Bases de Datos & Cloud (MySQL, MongoDB, AWS...)', 'Databases & Cloud (MySQL, MongoDB, AWS...)'),
      tr('Diseño & Contenido Digital (Blender, UI/UX...)', 'Design & Digital Content (Blender, UI/UX...)'),
      tr('Ciberseguridad & Infraestructura', 'Cybersecurity & Infrastructure'),
      tr('SEO/SEM & Marketing Digital', 'SEO/SEM & Digital Marketing'),
      tr('Blockchain & IA', 'Blockchain & AI'),
    ]; };

    var SERVICE_LIST = function(){ return [
      tr('Desarrollo Web & Apps', 'Web & App Development'),
      tr('Automatización & Integraciones', 'Automation & Integrations'),
      tr('Diseño & Contenido 3D', 'Design & 3D Content'),
      tr('Ciberseguridad & Infraestructura', 'Cybersecurity & Infrastructure'),
      tr('SEO/SEM & Marketing Digital', 'SEO/SEM & Digital Marketing'),
      tr('Consultoría Blockchain & IA', 'Blockchain & AI Consulting'),
    ]; };

    var EXPERIENCE_LIST = function(){ return [
      'IT Support — Remote Hero (' + tr('EE. UU., remoto, actual','USA, remote, current') + ')',
      tr('Consultor IT & Desarrollador Web — Ríe La Huerta (2024–2025)', 'IT Consultant & Web Developer — Ríe La Huerta (2024–2025)'),
      tr('Analista de Sistemas — Brader Hops (2016–2025)', 'Systems Analyst — Brader Hops (2016–2025)'),
      tr('CEO — Luquini0, España (2018–2025)', 'CEO — Luquini0, Spain (2018–2025)'),
      tr('Analista de Sistemas — Ríe La Huerta (2018–2025)', 'Systems Analyst — Ríe La Huerta (2018–2025)'),
      tr('Desarrollador Web & Community Manager — Arikaya (2020–2022)', 'Web Developer & Community Manager — Arikaya (2020–2022)'),
      tr('Desarrollador Web & Redes Sociales — Huerta Gourmet (2012–2018)', 'Web & Social Media Developer — Huerta Gourmet (2012–2018)'),
    ]; };

    var PROJECT_LIST = function(){ return [
      tr("Luquini0's Interactive (propio)", "Luquini0's Interactive (own build)"),
      tr('Portfolio, versión anterior (propio)', 'Old Portfolio (own build)'),
      tr('Rie La Huerta — rielahuerta.com (propio, en producción)', 'Rie La Huerta — rielahuerta.com (own build, live)'),
      tr('Arikaya — arikaya.com.au (propio, en producción)', 'Arikaya — arikaya.com.au (own build, live)'),
      tr('Tap Mundial 2026 — tap-mundial.pages.dev (propio, en producción)', 'Tap Mundial 2026 — tap-mundial.pages.dev (own build, live)'),
      tr('OneBlast (plantilla propia)', 'OneBlast (own template)'),
      tr('Guchini Mundial (plantilla propia)', 'Guchini Mundial (own template)'),
      tr('Sacred Circles — HTML/CSS/JS & Webflow (plantilla propia, dos versiones)', 'Sacred Circles — HTML/CSS/JS & Webflow (own template, two builds)'),
      tr('Tap — Cervecería (plantilla propia)', 'Tap — Brewery (own template)'),
      tr('Huerta Urbana — Landing (plantilla propia)', 'Huerta Urbana — Landing (own template)'),
      tr('Estrategia Financiera (plantilla propia)', 'Financial Strategy (own template)'),
      tr('Arte Orgánica (plantilla propia)', 'Arte Orgánica (own template)'),
    ]; };

    var EDUCATION_LIST = function(){ return [
      tr('2025 — Python: Backend con Django, CoderHouse', '2025 — Python: Django Backend, CoderHouse'),
      tr('2025 — React Native: Apps Nativas, CoderHouse', '2025 — React Native: Native Apps, CoderHouse'),
      tr('2025 — Diseño 3D con Blender, CoderHouse', '2025 — 3D Design with Blender, CoderHouse'),
      tr('2020–22 — Diplomatura Avanzada en Ciberseguridad, ACBI', '2020–22 — Advanced Diploma in Network Security, ACBI'),
      tr('2018–20 — Diplomatura en Tecnologías de Medios Digitales, ACBI', '2018–20 — Diploma in Digital Media Technologies, ACBI'),
    ]; };

    function printList(items){ items.forEach(function(it){ printRaw('&gt; ' + it); }); }

    var termState = 'idle';
    var draft = {};

    function startContact(){
      termState = 'name';
      draft = {};
      printRaw(tr('Vamos a armar tu mensaje (escribí <span class="c2">cancel</span> para salir en cualquier momento).', "Let's put together your message (type <span class=\"c2\">cancel</span> to exit anytime)."));
      printRaw(tr('¿Cuál es tu nombre?', "What's your name?"));
      termInput.placeholder = tr('Tu nombre...', 'Your name...');
    }

    function handleWizard(raw){
      if(raw.toLowerCase() === 'cancel'){
        termState = 'idle'; draft = {};
        termInput.placeholder = tr("escribí 'help' y presioná Enter", "type 'help' and press Enter");
        printRaw(tr('Cancelado.', 'Cancelled.'));
        return;
      }
      if(termState === 'name'){
        draft.name = raw; termState = 'email';
        printRaw(tr('¿Tu email de contacto?', 'Your contact email?'));
        termInput.placeholder = tr('tu@email.com', 'you@email.com');
        return;
      }
      if(termState === 'email'){
        draft.email = raw; termState = 'message';
        printRaw(tr('¿Qué querés contarme? (una línea)', 'What would you like to tell me? (one line)'));
        termInput.placeholder = tr('Tu mensaje...', 'Your message...');
        return;
      }
      if(termState === 'message'){
        draft.message = raw; termState = 'idle';
        termInput.placeholder = tr("escribí 'help' y presioná Enter", "type 'help' and press Enter");
        var subject = encodeURIComponent(tr('Contacto desde la plataforma — ', 'Contact from the platform — ') + draft.name);
        var body = encodeURIComponent(draft.message + '\n\n— ' + draft.name + ' (' + draft.email + ')');
        var href = 'mailto:luquini0.contact@gmail.com?subject=' + subject + '&body=' + body;
        printRaw(tr('Listo. Hacé clic para abrir tu cliente de correo:', 'Done. Click to open your email client:'));
        printRaw('<a href="' + href + '" target="_blank" rel="noopener">luquini0.contact@gmail.com &rarr;</a>');
        return;
      }
    }

    var JOKES = [
      tr('Bonito intento. Este usuario no tiene privilegios sudo (pero sí experiencia en pentesting).', 'Nice try. This user has no sudo privileges (but does have pentesting experience).'),
    ];

    function handleCommand(raw){
      var cmd = raw.trim();
      if(cmd === '') return;
      printCmdEcho(cmd);
      history.push(cmd); historyIdx = history.length;

      if(termState === 'guess'){ handleGuess(cmd); return; }
      if(termState === 'cvcode'){ handleCvCode(cmd); return; }
      if(termState !== 'idle'){ handleWizard(cmd); return; }

      var lower = cmd.toLowerCase();
      var parts = lower.split(/\s+/);
      var base = parts[0];

      switch(base){
        case 'help':
          printRaw(tr('Comandos disponibles:', 'Available commands:'));
          HELP_CMDS().forEach(function(pair){ printRaw('&nbsp;&nbsp;<span class="c1">' + pair[0] + '</span> — ' + pair[1]); });
          break;
        case 'about':
          printRaw(tr(
            'Desarrollador full-stack con base en Mendoza, Argentina. Combino desarrollo de software, ciberseguridad, diseño y automatización desde hace más de 15 años. En 2025 sumé Django, React Native y Blender a mi stack.',
            'Full-stack developer based in Mendoza, Argentina. I combine software development, cybersecurity, design and automation with 15+ years of experience. In 2025 I added Django, React Native and Blender to my stack.'
          ));
          break;
        case 'skills':
          printRaw(tr('Categorías del stack técnico:', 'Technical stack categories:'));
          printList(SKILL_CATS());
          goSection('skills');
          break;
        case 'services':
          printRaw(tr('Servicios que ofrezco:', 'Services I offer:'));
          printList(SERVICE_LIST());
          goSection('services');
          break;
        case 'experience': case 'exp':
          printRaw(tr('Experiencia profesional:', 'Professional experience:'));
          printList(EXPERIENCE_LIST());
          goSection('experience');
          break;
        case 'projects':
          printRaw(tr('Proyectos:', 'Projects:'));
          printList(PROJECT_LIST());
          goSection('projects');
          break;
        case 'education': case 'edu':
          printRaw(tr('Educación & certificaciones:', 'Education & certifications:'));
          printList(EDUCATION_LIST());
          goSection('education');
          break;
        case 'cv': case 'resume':
          startCvCode();
          break;
        case 'contact':
          startContact();
          break;
        case 'links':
          printRaw(tr('Links:', 'Links:'));
          LINKS_LIST.forEach(function(l){ printRaw('&gt; <a href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + '</a>'); });
          break;
        case 'guess':
          startGuess();
          break;
        case 'play':
          openPlayDemo();
          break;
        case 'sandbox': case 'code':
          openSandboxDemo();
          break;
        case 'hash':
          openHashDemo();
          break;
        case 'pwcheck': case 'crack':
          openPwCheckDemo();
          break;
        case 'seo':
          openSeoDemo();
          break;
        case 'cube':
          openCubeDemo();
          break;
        case 'scrape':
          printSeq([
            tr('Iniciando demo de scraping (simulado, sin requests reales)...', 'Starting scraping demo (simulated, no real requests)...'),
            '&gt; GET https://demo-shop.test/products <span class="c1">[200 OK]</span>',
            tr('&gt; Parseando DOM... 48 nodos <span class="c3">.product-card</span> encontrados', '&gt; Parsing DOM... found 48 <span class="c3">.product-card</span> nodes'),
            tr('&gt; Extrayendo: nombre, precio, stock, SKU', '&gt; Extracting: name, price, stock, SKU'),
            '&gt; <span class="c1">✓</span> 48 ' + tr('registros guardados → products.csv', 'records saved → products.csv'),
            tr('(demo ilustrativa — stack real: Selenium · BeautifulSoup · Scrapy · Playwright)', '(illustrative demo — real stack: Selenium · BeautifulSoup · Scrapy · Playwright)')
          ]);
          break;
        case 'scan':
          printSeq([
            tr('Simulando escaneo de puertos (demo educativa, ningún host real)...', 'Simulating a port scan (educational demo, no real host)...'),
            '&gt; 22/tcp&nbsp;&nbsp;<span class="c1">open</span>&nbsp;&nbsp;ssh',
            '&gt; 80/tcp&nbsp;&nbsp;<span class="c1">open</span>&nbsp;&nbsp;http',
            '&gt; 443/tcp&nbsp;<span class="c1">open</span>&nbsp;&nbsp;https',
            '&gt; 3306/tcp <span class="c2">closed</span>&nbsp;mysql',
            tr('&gt; Headers de seguridad: CSP <span class="c1">✓</span> HSTS <span class="c1">✓</span> X-Frame-Options <span class="c1">✓</span>', '&gt; Security headers: CSP <span class="c1">✓</span> HSTS <span class="c1">✓</span> X-Frame-Options <span class="c1">✓</span>'),
            tr('(demo ilustrativa — herramientas reales: Nmap · Wireshark · Kali Linux · OWASP Top 10)', '(illustrative demo — real tools: Nmap · Wireshark · Kali Linux · OWASP Top 10)')
          ], 340);
          break;
        case 'automate':
          printSeq([
            tr('Simulando flujo de automatización (estilo n8n)...', 'Simulating an automation workflow (n8n-style)...'),
            '&gt; trigger: ' + tr('nuevo email recibido', 'new email received'),
            '&gt; step 1 → ' + tr('extraer adjunto', 'extract attachment'),
            '&gt; step 2 → ' + tr('parsear datos (Python)', 'parse data (Python)'),
            '&gt; step 3 → ' + tr('insertar en base de datos (MySQL)', 'insert into database (MySQL)'),
            '&gt; step 4 → ' + tr('notificar por Slack', 'notify via Slack'),
            '&gt; <span class="c1">✓</span> ' + tr('flujo completado en 1.8s (simulado)', 'workflow completed in 1.8s (simulated)')
          ]);
          break;
        case 'render': case '3d': case 'blender':
          printRaw(tr('Blender &rarr; render_preview.py', 'Blender &rarr; render_preview.py'), 'cm');
          printRaw(tr('Generando mesh, materiales PBR, iluminación...', 'Generating mesh, PBR materials, lighting...'), 'cm');
          printRaw('<div class="term-cube-stage"><div class="term-cube"><div class="tc-face f"></div><div class="tc-face bk"></div><div class="tc-face l"></div><div class="tc-face r"></div><div class="tc-face t"></div><div class="tc-face bo"></div></div></div>');
          printRaw(tr('(demo CSS 3D — el modelado real lo hago en Blender)', '(CSS 3D demo — real modeling happens in Blender)'), 'cm');
          break;
        case 'neofetch': case 'sysinfo':
          printRaw(
            '<div class="neofetch"><pre class="nf-art">   /\\\n  /  \\\n / /\\ \\\n/_/  \\_\\</pre><div class="nf-info">' +
            '<div><b>luquini0</b>@platform</div><div>-------------------</div>' +
            '<div>OS: Human, 15+ ' + tr('años de uptime', 'years uptime') + '</div>' +
            '<div>Host: Mendoza, Argentina</div>' +
            '<div>' + tr('Idiomas', 'Langs') + ': ES(native) EN IT PT</div>' +
            '<div>Shell: curiosity &amp;&amp; cleanCode</div>' +
            '<div>Stack: Python · Django · JS · React Native</div>' +
            '<div>' + tr('Intereses', 'Interests') + ': Sec · 3D · Blockchain</div>' +
            '</div></div>'
          );
          break;
        case 'matrix':
          triggerMatrixRain();
          break;
        case 'whoami':
          printRaw(tr('visitante con acceso a la plataforma privada de Luquini0.', "visitor with access to Luquini0's private platform."));
          break;
        case 'clear':
          hasInteracted = false;
          printWelcome();
          break;
        case 'lang':
          if(parts[1] === 'en' || parts[1] === 'es'){
            window.__setLang(parts[1]);
            printRaw(parts[1] === 'en' ? 'Language switched to English.' : 'Idioma cambiado a español.');
          } else {
            printRaw(tr('Uso: lang en | lang es', 'Usage: lang en | lang es'));
          }
          break;
        case 'sudo':
          printRaw(JOKES[0]);
          break;
        case 'date':
          printRaw(new Date().toString());
          break;
        case 'pwd':
          printRaw('/home/luquini0/portfolio');
          break;
        case 'ls':
          printRaw('about.txt&nbsp;&nbsp;skills.txt&nbsp;&nbsp;experience.log&nbsp;&nbsp;projects/&nbsp;&nbsp;education.txt&nbsp;&nbsp;contact.sh');
          break;
        case 'echo':
          printText(cmd.slice(5));
          break;
        case 'cat':
          if(parts[1] && (parts[1].indexOf('resume') >= 0 || parts[1].indexOf('cv') >= 0)){
            startCvCode();
          } else {
            printRaw(tr('archivo no encontrado', 'file not found'));
          }
          break;
        default:
          printRaw(tr('Comando no reconocido: ', 'Command not recognized: ') + '<span class="c2">' + escapeHtml(cmd) + '</span>. ' +
            tr('Escribí ', 'Type ') + '<span class="c1">help</span>' + tr(' para ver las opciones.', ' to see the options.'));
      }
    }

    var history = [];
    var historyIdx = 0;

    termInput.addEventListener('keydown', function(e){
      hasInteracted = true;
      if(e.key === 'Enter'){
        var val = termInput.value;
        termInput.value = '';
        handleCommand(val);
      } else if(e.key === 'ArrowUp'){
        if(history.length){
          historyIdx = Math.max(0, historyIdx - 1);
          termInput.value = history[historyIdx] || '';
          e.preventDefault();
        }
      } else if(e.key === 'ArrowDown'){
        if(history.length){
          historyIdx = Math.min(history.length, historyIdx + 1);
          termInput.value = history[historyIdx] || '';
          e.preventDefault();
        }
      }
    });

    document.getElementById('liveTerminal').addEventListener('click', function(){ termInput.focus(); });
  })();

