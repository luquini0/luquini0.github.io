  /* ---------------- access gate: dev-skill challenge ---------------- */
  (function(){
    function tr(es, en){ return (document.body.getAttribute('data-lang') === 'en') ? en : es; }

    var introEl = document.getElementById('gate-intro');
    var resultEl = document.getElementById('gate-result');
    var skipBtn = document.getElementById('gate-skip');
    var boot1 = document.getElementById('gtBoot1');
    var boot2 = document.getElementById('gtBoot2');
    var challengeEl = document.getElementById('gateChallenge');
    var promptEl = document.getElementById('gcPrompt');
    var codeEl = document.getElementById('gcCode');
    var choicesEl = document.getElementById('gcChoices');

    // A wide pool of one-liners spanning the actual skills on this site
    // (JS, Python/Django, React Native, web, networking, security,
    // blockchain/AI, SEO, 3D) so the gate doubles as a quick, honest
    // sample of the stack instead of a generic captcha, and repeats
    // rarely across visits.
    var CHALLENGES = [
      { es:{ prompt:'Completá el resultado:', code:'[1, 2, 3].map(n => n * 2)\n// → ___', choices:['[2, 4, 6]','[1, 2, 3]','undefined'] },
        en:{ prompt:'Complete the result:', code:'[1, 2, 3].map(n => n * 2)\n// → ___', choices:['[2, 4, 6]','[1, 2, 3]','undefined'] },
        correct:0 },
      { es:{ prompt:'¿Qué puerto usa HTTPS por defecto?', code:'GET https://sitio.com:___', choices:['80','443','8080'] },
        en:{ prompt:'What port does HTTPS use by default?', code:'GET https://site.com:___', choices:['80','443','8080'] },
        correct:1 },
      { es:{ prompt:'Comando para levantar el servidor de Django:', code:'$ ___', choices:['python manage.py runserver','npm run dev','django start'] },
        en:{ prompt:'Command to start the Django dev server:', code:'$ ___', choices:['python manage.py runserver','npm run dev','django start'] },
        correct:0 },
      { es:{ prompt:'¿Qué protocolo asigna IPs automáticamente en una red?', code:'net.config(mode = "___")', choices:['DNS','DHCP','FTP'] },
        en:{ prompt:'Which protocol auto-assigns IPs on a network?', code:'net.config(mode = "___")', choices:['DNS','DHCP','FTP'] },
        correct:1 },
      { es:{ prompt:'En blockchain, un grupo de transacciones confirmadas forma un:', code:'chain.push(___)', choices:['Wallet','Block','Node'] },
        en:{ prompt:'In blockchain, a confirmed group of transactions forms a:', code:'chain.push(___)', choices:['Wallet','Block','Node'] },
        correct:1 },
      { es:{ prompt:'¿Qué método HTTP se usa para crear un recurso nuevo?', code:'fetch(url, { method: "___" })', choices:['GET','POST','DELETE'] },
        en:{ prompt:'Which HTTP method creates a new resource?', code:'fetch(url, { method: "___" })', choices:['GET','POST','DELETE'] },
        correct:1 },
      { es:{ prompt:'Completá el resultado:', code:'let a = [1, 2];\na.push(3);\n// a.length → ___', choices:['2','3','4'] },
        en:{ prompt:'Complete the result:', code:'let a = [1, 2];\na.push(3);\n// a.length → ___', choices:['2','3','4'] },
        correct:1 },
      { es:{ prompt:'Completá el resultado:', code:'[x for x in range(3)]\n# → ___', choices:['[0, 1, 2]','[1, 2, 3]','[0, 1, 2, 3]'] },
        en:{ prompt:'Complete the result:', code:'[x for x in range(3)]\n# → ___', choices:['[0, 1, 2]','[1, 2, 3]','[0, 1, 2, 3]'] },
        correct:0 },
      { es:{ prompt:'¿Qué componente de React Native muestra texto en pantalla?', code:"import { ___ } from 'react-native';", choices:['Text','View','Label'] },
        en:{ prompt:'Which React Native component renders text?', code:"import { ___ } from 'react-native';", choices:['Text','View','Label'] },
        correct:0 },
      { es:{ prompt:'Completá para centrar ítems en un flex container:', code:'.box { display: flex; ___: center; }', choices:['align-items','flex-wrap','position'] },
        en:{ prompt:'Complete it to center items in a flex container:', code:'.box { display: flex; ___: center; }', choices:['align-items','flex-wrap','position'] },
        correct:0 },
      { es:{ prompt:'¿Qué comando deshace el último commit sin perder los cambios?', code:'$ git reset --soft ___', choices:['HEAD~1','--hard','commit'] },
        en:{ prompt:'Which command undoes the last commit but keeps the changes?', code:'$ git reset --soft ___', choices:['HEAD~1','--hard','commit'] },
        correct:0 },
      { es:{ prompt:'¿Cuál es más seguro para hashear contraseñas?', code:'hash(password) // usando ___', choices:['MD5','bcrypt','Base64'] },
        en:{ prompt:'Which is more secure for hashing passwords?', code:'hash(password) // using ___', choices:['MD5','bcrypt','Base64'] },
        correct:1 },
      { es:{ prompt:'VPN significa:', code:'// VPN = ___', choices:['Virtual Private Network','Verified Public Node','Virtual Protocol Node'] },
        en:{ prompt:'VPN stands for:', code:'// VPN = ___', choices:['Virtual Private Network','Verified Public Node','Virtual Protocol Node'] },
        correct:0 },
      { es:{ prompt:'¿Qué hace el DNS?', code:"dns.resolve('sitio.com')\n// → ___", choices:['Traduce dominios a IPs','Cifra el tráfico','Asigna IPs dinámicas'] },
        en:{ prompt:'What does DNS do?', code:"dns.resolve('site.com')\n// → ___", choices:['Translates domain names to IPs','Encrypts traffic','Assigns dynamic IPs'] },
        correct:0 },
      { es:{ prompt:'¿En qué lenguaje se escriben los smart contracts de Ethereum?', code:'// Ethereum smart contract', choices:['Solidity','Rust','Ruby'] },
        en:{ prompt:'What language are Ethereum smart contracts written in?', code:'// Ethereum smart contract', choices:['Solidity','Rust','Ruby'] },
        correct:0 },
      { es:{ prompt:'LLM significa:', code:'// LLM = ___', choices:['Large Language Model','Linear Logic Machine','Local Language Module'] },
        en:{ prompt:'LLM stands for:', code:'// LLM = ___', choices:['Large Language Model','Linear Logic Machine','Local Language Module'] },
        correct:0 },
      { es:{ prompt:'SEO significa:', code:'// SEO = ___', choices:['Search Engine Optimization','Site Export Options','Server Efficiency Overview'] },
        en:{ prompt:'SEO stands for:', code:'// SEO = ___', choices:['Search Engine Optimization','Site Export Options','Server Efficiency Overview'] },
        correct:0 },
      { es:{ prompt:'¿Qué mide el CTR en una campaña?', code:'campaign.ctr // = ___', choices:['Tasa de clics','Costo total','Tiempo de carga'] },
        en:{ prompt:'What does CTR measure in a campaign?', code:'campaign.ctr // = ___', choices:['Click-through rate','Total cost','Load time'] },
        correct:0 },
      { es:{ prompt:'En 3D, ¿para qué sirve el UV mapping?', code:'// UV mapping → ___', choices:['Proyectar texturas sobre un modelo','Animar huesos','Calcular iluminación'] },
        en:{ prompt:'In 3D, what is UV mapping for?', code:'// UV mapping → ___', choices:['Projecting textures onto a model','Animating bones','Calculating lighting'] },
        correct:0 },
      { es:{ prompt:'API significa:', code:'// API = ___', choices:['Application Programming Interface','Automated Process Integration','Advanced Protocol Interchange'] },
        en:{ prompt:'API stands for:', code:'// API = ___', choices:['Application Programming Interface','Automated Process Integration','Advanced Protocol Interchange'] },
        correct:0 },
      { es:{ prompt:'Completá el resultado:', code:"1 === '1'\n// → ___", choices:['false','true','undefined'] },
        en:{ prompt:'Complete the result:', code:"1 === '1'\n// → ___", choices:['false','true','undefined'] },
        correct:0 },
      { es:{ prompt:'Completá el resultado:', code:'3 / 2\n# → ___', choices:['1.5','1','1.0'] },
        en:{ prompt:'Complete the result:', code:'3 / 2\n# → ___', choices:['1.5','1','1.0'] },
        correct:0 },
      { es:{ prompt:'¿Qué código HTTP indica "no encontrado"?', code:'GET /ruta-inexistente\n// → ___', choices:['200','404','500'] },
        en:{ prompt:'Which HTTP code means "not found"?', code:'GET /missing-route\n// → ___', choices:['200','404','500'] },
        correct:1 },
      { es:{ prompt:'¿Para qué sirve un firewall?', code:'firewall.block(traffic) // ___', choices:['Filtrar tráfico de red no autorizado','Comprimir archivos','Acelerar el DNS'] },
        en:{ prompt:'What is a firewall for?', code:'firewall.block(traffic) // ___', choices:['Filtering unauthorized network traffic','Compressing files','Speeding up DNS'] },
        correct:0 },
      { es:{ prompt:'¿Qué comando crea y cambia a una rama nueva?', code:'$ git ___ feature-x', choices:['checkout -b','commit -b','branch -m'] },
        en:{ prompt:'Which command creates and switches to a new branch?', code:'$ git ___ feature-x', choices:['checkout -b','commit -b','branch -m'] },
        correct:0 },
      { es:{ prompt:'Completá para definir dos columnas iguales en un grid:', code:'.grid { display: grid; ___: 1fr 1fr; }', choices:['grid-template-columns','flex-direction','columns'] },
        en:{ prompt:'Complete it to define two equal grid columns:', code:'.grid { display: grid; ___: 1fr 1fr; }', choices:['grid-template-columns','flex-direction','columns'] },
        correct:0 },
      { es:{ prompt:'NFT significa:', code:'// NFT = ___', choices:['Non-Fungible Token','New Financial Transaction','Network File Transfer'] },
        en:{ prompt:'NFT stands for:', code:'// NFT = ___', choices:['Non-Fungible Token','New Financial Transaction','Network File Transfer'] },
        correct:0 },
      { es:{ prompt:'¿Qué devuelve siempre una función async?', code:'async function f() {}\n// f() → ___', choices:['Una Promise','Un objeto','Un array'] },
        en:{ prompt:'What does an async function always return?', code:'async function f() {}\n// f() → ___', choices:['A Promise','An object','An array'] },
        correct:0 },
      { es:{ prompt:'CDN significa:', code:'// CDN = ___', choices:['Content Delivery Network','Central Data Node','Client Domain Name'] },
        en:{ prompt:'CDN stands for:', code:'// CDN = ___', choices:['Content Delivery Network','Central Data Node','Client Domain Name'] },
        correct:0 },
      { es:{ prompt:'¿Qué expresión cron corre todos los días a medianoche?', code:'# crontab\n___ /run-backup.sh', choices:['0 0 * * *','* * * * *','0 24 * * *'] },
        en:{ prompt:'Which cron expression runs every day at midnight?', code:'# crontab\n___ /run-backup.sh', choices:['0 0 * * *','* * * * *','0 24 * * *'] },
        correct:0 },
      { es:{ prompt:'¿Qué flag de "ls" muestra también los archivos ocultos?', code:'$ ls ___', choices:['-a','-l','-r'] },
        en:{ prompt:'Which "ls" flag also shows hidden files?', code:'$ ls ___', choices:['-a','-l','-r'] },
        correct:0 },
      { es:{ prompt:'¿Qué palabra clave de SQL elimina duplicados?', code:'SELECT ___ nombre FROM clientes;', choices:['DISTINCT','UNIQUE','GROUP'] },
        en:{ prompt:'Which SQL keyword removes duplicates?', code:'SELECT ___ name FROM customers;', choices:['DISTINCT','UNIQUE','GROUP'] },
        correct:0 },
      { es:{ prompt:'¿Cuál es la complejidad de la búsqueda binaria?', code:'// binary search en array ordenado', choices:['O(log n)','O(n)','O(n²)'] },
        en:{ prompt:'What is the time complexity of binary search?', code:'// binary search on sorted array', choices:['O(log n)','O(n)','O(n²)'] },
        correct:0 },
      { es:{ prompt:'¿Qué comando construye una imagen de Docker?', code:'$ docker ___ -t myapp .', choices:['build','run','ps'] },
        en:{ prompt:'Which command builds a Docker image?', code:'$ docker ___ -t myapp .', choices:['build','run','ps'] },
        correct:0 },
      { es:{ prompt:'Completá para hacer opcional una propiedad en TypeScript:', code:'interface User { name: string; age___: number; }', choices:['?','!','*'] },
        en:{ prompt:'Complete it to make a TypeScript property optional:', code:'interface User { name: string; age___: number; }', choices:['?','!','*'] },
        correct:0 },
      { es:{ prompt:'¿Qué hook de React se usa para manejar estado local?', code:'const [count, setCount] = ___(0);', choices:['useState','useEffect','useRef'] },
        en:{ prompt:'Which React hook manages local state?', code:'const [count, setCount] = ___(0);', choices:['useState','useEffect','useRef'] },
        correct:0 },
      { es:{ prompt:'¿Qué header indica que el body es JSON?', code:"headers: { '___': 'application/json' }", choices:['Content-Type','Accept-Encoding','Authorization'] },
        en:{ prompt:'Which header indicates a JSON body?', code:"headers: { '___': 'application/json' }", choices:['Content-Type','Accept-Encoding','Authorization'] },
        correct:0 },
      { es:{ prompt:'¿Qué patrón regex matchea uno o más dígitos?', code:'/___/', choices:['\\d+','\\w+','\\s+'] },
        en:{ prompt:'Which regex pattern matches one or more digits?', code:'/___/', choices:['\\d+','\\w+','\\s+'] },
        correct:0 },
      { es:{ prompt:'¿Para qué se usa Base64 principalmente?', code:'btoa("hola")\n// → ___', choices:['Codificar binario como texto','Cifrar datos','Comprimir archivos'] },
        en:{ prompt:'What is Base64 mainly used for?', code:'btoa("hello")\n// → ___', choices:['Encoding binary as text','Encrypting data','Compressing files'] },
        correct:0 },
      { es:{ prompt:'¿Qué función de Jest verifica un resultado esperado?', code:'___(sum(1, 2)).toBe(3);', choices:['expect','assert','check'] },
        en:{ prompt:'Which Jest function checks an expected result?', code:'___(sum(1, 2)).toBe(3);', choices:['expect','assert','check'] },
        correct:0 },
      { es:{ prompt:'¿Cómo se accede a una variable de entorno en Node.js?', code:'const key = ___.API_KEY;', choices:['process.env','globalThis','system.env'] },
        en:{ prompt:'How do you access an environment variable in Node.js?', code:'const key = ___.API_KEY;', choices:['process.env','globalThis','system.env'] },
        correct:0 },
      { es:{ prompt:'¿Qué característica distingue a GraphQL de REST?', code:'// un endpoint, queries flexibles', choices:['Un solo endpoint para todas las consultas','Requiere XML','No soporta mutaciones'] },
        en:{ prompt:'What distinguishes GraphQL from REST?', code:'// one endpoint, flexible queries', choices:['A single endpoint for all queries','It requires XML','It has no mutations'] },
        correct:0 },
      { es:{ prompt:'¿Cuántas partes tiene un JWT?', code:'header.payload.signature', choices:['3','2','4'] },
        en:{ prompt:'How many parts does a JWT have?', code:'header.payload.signature', choices:['3','2','4'] },
        correct:0 },
      { es:{ prompt:'¿Para qué sirve OAuth?', code:'// authorization flow', choices:['Delegar acceso sin compartir contraseñas','Encriptar bases de datos','Comprimir tokens'] },
        en:{ prompt:'What is OAuth for?', code:'// authorization flow', choices:['Delegating access without sharing passwords','Encrypting databases','Compressing tokens'] },
        correct:0 },
      { es:{ prompt:'¿Qué etiqueta semántica se usa para el menú de navegación?', code:'<___>...</___>', choices:['nav','div','menu'] },
        en:{ prompt:'Which semantic tag is used for the nav menu?', code:'<___>...</___>', choices:['nav','div','menu'] },
        correct:0 },
      { es:{ prompt:'¿Qué atributo describe una imagen para lectores de pantalla?', code:'<img src="foto.jpg" ___="perro corriendo">', choices:['alt','title','aria-label'] },
        en:{ prompt:'Which attribute describes an image for screen readers?', code:'<img src="photo.jpg" ___="dog running">', choices:['alt','title','aria-label'] },
        correct:0 },
      { es:{ prompt:'¿Para qué sirve un índice en una base de datos?', code:'CREATE INDEX idx ON tabla(columna);', choices:['Acelerar las búsquedas','Encriptar la tabla','Borrar duplicados'] },
        en:{ prompt:'What is a database index for?', code:'CREATE INDEX idx ON table(column);', choices:['Speeding up lookups','Encrypting the table','Removing duplicates'] },
        correct:0 },
      { es:{ prompt:'Redis es principalmente una base de datos de tipo:', code:'// in-memory store', choices:['Clave-valor','Relacional','Documental'] },
        en:{ prompt:'Redis is mainly what type of database?', code:'// in-memory store', choices:['Key-value','Relational','Document'] },
        correct:0 },
      { es:{ prompt:'¿Qué comando instala las dependencias de un proyecto Node?', code:'$ ___', choices:['npm install','npm build','npm deploy'] },
        en:{ prompt:"Which command installs a Node project's dependencies?", code:'$ ___', choices:['npm install','npm build','npm deploy'] },
        correct:0 },
      { es:{ prompt:'¿Qué propiedad hace que padding y border no aumenten el ancho total?', code:'* { ___: border-box; }', choices:['box-sizing','box-model','box-fit'] },
        en:{ prompt:'Which property keeps padding/border from growing the total width?', code:'* { ___: border-box; }', choices:['box-sizing','box-model','box-fit'] },
        correct:0 },
      { es:{ prompt:'¿Qué comando crea un entorno virtual en Python?', code:'$ python -m ___ env', choices:['venv','pip','env'] },
        en:{ prompt:'Which command creates a Python virtual environment?', code:'$ python -m ___ env', choices:['venv','pip','env'] },
        correct:0 },
      { es:{ prompt:'¿Qué protocolo garantiza la entrega ordenada de paquetes?', code:'// entrega confiable y ordenada', choices:['TCP','UDP','ICMP'] },
        en:{ prompt:'Which protocol guarantees ordered packet delivery?', code:'// reliable, ordered delivery', choices:['TCP','UDP','ICMP'] },
        correct:0 },
      { es:{ prompt:'XSS significa:', code:'// XSS = ___', choices:['Cross-Site Scripting','Extended Server Security','XML Site Sync'] },
        en:{ prompt:'XSS stands for:', code:'// XSS = ___', choices:['Cross-Site Scripting','Extended Server Security','XML Site Sync'] },
        correct:0 },
      { es:{ prompt:'¿Qué técnica previene la inyección SQL?', code:'db.query("SELECT * FROM u WHERE id = ?", [id]);', choices:['Consultas parametrizadas','Concatenar strings','Desactivar logs'] },
        en:{ prompt:'Which technique prevents SQL injection?', code:'db.query("SELECT * FROM u WHERE id = ?", [id]);', choices:['Parameterized queries','String concatenation','Disabling logs'] },
        correct:0 },
      { es:{ prompt:'¿Qué comando muestra el historial de commits?', code:'$ git ___', choices:['log','history','show-all'] },
        en:{ prompt:'Which command shows the commit history?', code:'$ git ___', choices:['log','history','show-all'] },
        correct:0 }
    ];

    var current = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    var solved = false;

    // Shuffle once per challenge (not per render) so the correct answer
    // doesn't always land in the same button, but the layout stays put
    // if the visitor toggles language mid-challenge.
    var order = [0, 1, 2];
    for(var i = order.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }

    function unlock(){
      document.body.classList.add('unlocked');
      window.scrollTo(0,0);
    }

    // Anonymous, no personal data. Kept in localStorage for now; once the
    // Supabase project is wired up this same payload gets POSTed to a
    // `gate_sessions` table (ts, outcome, lang) for visit analytics.
    function logSession(outcome){
      try{
        var entry = { ts: new Date().toISOString(), outcome: outcome, lang: document.body.getAttribute('data-lang') || 'es' };
        var log = JSON.parse(localStorage.getItem('luq_gate_log') || '[]');
        log.push(entry);
        localStorage.setItem('luq_gate_log', JSON.stringify(log.slice(-50)));
        if(window.__logGateSession) window.__logGateSession(entry);
      } catch(e){}
    }

    function renderChallenge(){
      var c = current[document.body.getAttribute('data-lang') === 'en' ? 'en' : 'es'];
      promptEl.textContent = c.prompt;
      codeEl.textContent = c.code;
      choicesEl.innerHTML = '';
      order.forEach(function(origIdx){
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gc-choice';
        btn.textContent = c.choices[origIdx];
        btn.addEventListener('click', function(){ pick(origIdx, btn); });
        choicesEl.appendChild(btn);
      });
    }

    function pick(idx, btn){
      if(solved) return;
      if(idx === current.correct){
        solved = true;
        btn.classList.add('correct');
        Array.prototype.forEach.call(choicesEl.querySelectorAll('.gc-choice'), function(b){ b.disabled = true; });
        logSession('challenge');
        setTimeout(function(){
          introEl.style.display = 'none';
          resultEl.style.display = '';
          setTimeout(unlock, 700);
        }, 500);
      } else {
        btn.classList.add('wrong');
        btn.disabled = true;
        setTimeout(function(){ btn.classList.remove('wrong'); }, 400);
      }
    }

    function typeLine(el, text, cb){
      var i = 0;
      el.textContent = '';
      var iv = setInterval(function(){
        el.textContent += text.charAt(i);
        i++;
        if(i >= text.length){ clearInterval(iv); if(cb) cb(); }
      }, 16);
    }

    function bootSequence(){
      var t1 = tr('conectando con Luquini0...', 'connecting to Luquini0...');
      var t2 = tr('verificando identidad... token faltante', 'verifying identity... token missing');
      typeLine(boot1, t1, function(){
        typeLine(boot2, t2, function(){
          renderChallenge();
          challengeEl.style.display = 'block';
          requestAnimationFrame(function(){ challengeEl.classList.add('show'); });
        });
      });
    }

    window.__gateRerender = function(){
      if(solved) return;
      if(challengeEl.classList.contains('show')) renderChallenge();
    };

    skipBtn.addEventListener('click', function(){ logSession('skip'); unlock(); });

    bootSequence();
  })();
