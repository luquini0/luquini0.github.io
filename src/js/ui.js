  /* ---------------- content protection ---------------- */
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  document.addEventListener('dragstart', function(e){
    if(e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('selectstart', function(e){
    var tag = e.target && e.target.tagName;
    if(tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
  });
  ['copy','cut'].forEach(function(evt){
    document.addEventListener(evt, function(e){
      var tag = e.target && e.target.tagName;
      if(tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
    });
  });

  /* ---------------- mobile nav ---------------- */
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  if(burger){
    burger.addEventListener('click', function(){ links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ links.classList.remove('open'); });
    });
  }

  /* ---------------- light/dark theme toggle (nav logo) ---------------- */
  // Clicking the logo mark flips the whole platform between the default
  // dark theme and a light one (same accent colors, backgrounds/ink
  // flipped — see :root[data-theme="light"] in styles.css). The "Luquini0"
  // text next to it stays a plain link back to #hero.
  (function(){
    var btn = document.getElementById('themeToggleBtn');
    if(!btn) return;
    function tr(es, en){ return (document.body.getAttribute('data-lang') === 'en') ? en : es; }
    function current(){ return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
    function applyTitle(){
      btn.title = current() === 'light' ? tr('Cambiar a modo oscuro', 'Switch to dark mode') : tr('Cambiar a modo claro', 'Switch to light mode');
    }
    function setTheme(theme){
      if(theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      try{ localStorage.setItem('luq_theme', theme); }catch(e){}
      applyTitle();
    }
    function toggle(){ setTheme(current() === 'light' ? 'dark' : 'light'); }
    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
    });
    applyTitle();
    window.__updateThemeToggleLabel = applyTitle;
  })();

  /* ---------------- demo modal shell ---------------- */
  (function(){
    var modal = document.getElementById('demoModal');
    var titleEl = document.getElementById('demoModalTitle');
    var bodyEl = document.getElementById('demoModalBody');
    var closeBtn = document.getElementById('demoModalClose');
    var cleanupFn = null;

    function open(title, html, onOpen, onClose){
      if(cleanupFn){ try{ cleanupFn(); }catch(e){} cleanupFn = null; }
      titleEl.textContent = title;
      bodyEl.innerHTML = html;
      modal.classList.add('open');
      // Belt-and-suspenders against the background staying clickable/scrollable
      // behind the modal (reported: nav links still worked while a game was
      // open) — lock body scroll and hard-disable pointer events on the rest
      // of the page for as long as the modal is open, regardless of any
      // z-index/stacking quirk.
      document.body.classList.add('modal-open');
      if(onOpen) onOpen(bodyEl);
      cleanupFn = onClose || null;
    }
    function close(){
      if(!modal.classList.contains('open')) return;
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      if(cleanupFn){ try{ cleanupFn(); }catch(e){} cleanupFn = null; }
      bodyEl.innerHTML = '';
    }
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function(e){ if(e.target === modal) close(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });

    window.__openDemo = open;
    window.__closeDemo = close;
  })();

  /* ---------------- CV download gate (contact section button) ---------------- */
  (function(){
    var CV_CODE = 'gettoknowme';
    var gate = document.querySelector('.cv-gate');
    var btn = document.getElementById('cvGateBtn');
    var form = document.getElementById('cvGateForm');
    var input = document.getElementById('cvGateInput');
    var linksEl = document.getElementById('cvGateLinks');
    var errEl = document.getElementById('cvGateError');
    if(!gate || !btn) return;

    function tr(es, en){ return (document.body.getAttribute('data-lang') === 'en') ? en : es; }

    btn.addEventListener('click', function(){
      btn.style.display = 'none';
      form.style.display = 'flex';
      input.focus();
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var val = (input.value || '').trim().toLowerCase();
      if(val === CV_CODE){
        form.style.display = 'none';
        errEl.style.display = 'none';
        linksEl.innerHTML =
          '<a href="CV_Luquini0_ES.docx" class="btn btn-ghost" download>' +
            '<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
            tr('Descargar CV (ES)', 'Download CV (ES)') +
          '</a>' +
          '<a href="CV_Luquini0_EN.docx" class="btn btn-ghost" download>' +
            '<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
            tr('Descargar CV (EN)', 'Download CV (EN)') +
          '</a>';
        linksEl.style.display = 'flex';
      } else {
        errEl.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  })();

  /* ---------------- shared virtual joystick (touch devices only) ---------------- */
  // onDir(dir) fires repeatedly while dragging, same 4-direction vocabulary
  // ('up'/'down'/'left'/'right') the keyboard/D-pad handlers already use.
  window.__createJoystick = function(baseEl, knobEl, onDir){
    var active = false, cx = 0, cy = 0, radius = 40;
    function start(x, y){
      var r = baseEl.getBoundingClientRect();
      cx = r.left + r.width/2; cy = r.top + r.height/2;
      radius = r.width/2 - 26;
      active = true;
      move(x, y);
    }
    function move(x, y){
      if(!active) return;
      var dx = x - cx, dy = y - cy;
      var dist = Math.min(Math.sqrt(dx*dx + dy*dy), radius);
      var angle = Math.atan2(dy, dx);
      knobEl.style.transform = 'translate(calc(-50% + ' + (Math.cos(angle)*dist).toFixed(1) + 'px), calc(-50% + ' + (Math.sin(angle)*dist).toFixed(1) + 'px))';
      if(Math.sqrt(dx*dx + dy*dy) > 14){
        onDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
      }
    }
    function end(){ active = false; knobEl.style.transform = 'translate(-50%,-50%)'; }
    baseEl.addEventListener('touchstart', function(e){ var t=e.touches[0]; start(t.clientX,t.clientY); e.preventDefault(); }, {passive:false});
    baseEl.addEventListener('touchmove', function(e){ var t=e.touches[0]; move(t.clientX,t.clientY); e.preventDefault(); }, {passive:false});
    baseEl.addEventListener('touchend', end);
    baseEl.addEventListener('touchcancel', end);
  };

