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
      if(onOpen) onOpen(bodyEl);
      cleanupFn = onClose || null;
    }
    function close(){
      if(!modal.classList.contains('open')) return;
      modal.classList.remove('open');
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

