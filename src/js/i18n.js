  /* ---------------- i18n ---------------- */
  function applyLang(lang){
    document.documentElement.lang = lang;
    document.body.setAttribute('data-lang', lang);
    document.querySelectorAll('.t').forEach(function(el){
      var val = el.getAttribute('data-' + lang);
      if(val !== null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-es-placeholder]').forEach(function(el){
      var val = el.getAttribute('data-' + lang + '-placeholder');
      if(val !== null) el.setAttribute('placeholder', val);
    });
    var esBtn = document.getElementById('langEs');
    var enBtn = document.getElementById('langEn');
    if(esBtn && enBtn){
      esBtn.classList.toggle('active', lang === 'es');
      enBtn.classList.toggle('active', lang === 'en');
    }
    var gateLang = document.getElementById('gate-lang');
    if(gateLang) gateLang.textContent = lang === 'es' ? 'EN' : 'ES';
    if(window.__termWelcome) window.__termWelcome();
    if(window.__gateRerender) window.__gateRerender();
    if(window.__footerRetype) window.__footerRetype();
    if(window.__updateThemeToggleLabel) window.__updateThemeToggleLabel();
  }
  window.__setLang = applyLang;

  /* ---------------- language auto-detect (timezone + geolocation) ---------------- */
  var ES_TZ_HINTS = ['America/Argentina','America/Mexico_City','America/Bogota','America/Lima','America/Santiago','America/Caracas','America/Montevideo','America/Asuncion','America/La_Paz','America/Guayaquil','Europe/Madrid'];
  var ES_COUNTRIES = ['AR','MX','ES','CO','PE','CL','VE','UY','PY','BO','EC','GT','CU','HN','SV','NI','CR','PA','DO','PR'];

  function detectInitialLang(){
    try{
      var stored = localStorage.getItem('luq_lang');
      if(stored === 'es' || stored === 'en') return stored;
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if(ES_TZ_HINTS.some(function(h){ return tz.indexOf(h) === 0; })) return 'es';
      var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if(nav.indexOf('es') === 0) return 'es';
      if(nav) return 'en';
    } catch(e){}
    return 'es';
  }

  // Best-effort refinement: if geolocation permission is already granted from
  // a previous visit, this resolves silently (no prompt) per browser policy.
  // If not yet decided, the browser shows its native "allow location" prompt.
  function refineLangByGeo(){
    try{
      if(localStorage.getItem('luq_lang')) return; // user already made an explicit choice
      if(!('geolocation' in navigator)) return;
      navigator.geolocation.getCurrentPosition(function(pos){
        fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + pos.coords.latitude + '&longitude=' + pos.coords.longitude + '&localityLanguage=en')
          .then(function(r){ return r.json(); })
          .then(function(data){
            var cc = (data && data.countryCode) || '';
            window.__setLang(ES_COUNTRIES.indexOf(cc) >= 0 ? 'es' : 'en');
          })
          .catch(function(){});
      }, function(){ /* denied/unavailable: keep current guess, no error shown */ }, { timeout:6000, maximumAge:3600000 });
    } catch(e){}
  }

  applyLang(detectInitialLang());
  refineLangByGeo();

  document.getElementById('langEs').addEventListener('click', function(){ applyLang('es'); localStorage.setItem('luq_lang','es'); });
  document.getElementById('langEn').addEventListener('click', function(){ applyLang('en'); localStorage.setItem('luq_lang','en'); });
  document.getElementById('gate-lang').addEventListener('click', function(){
    var next = document.body.getAttribute('data-lang') === 'es' ? 'en' : 'es';
    applyLang(next); localStorage.setItem('luq_lang', next);
  });

