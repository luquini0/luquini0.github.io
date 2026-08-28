  /* ---------------- footer: skill-icon rain + terminal sign-off ---------------- */
  (function(){
    function tr(es, en){ return (document.body.getAttribute('data-lang') === 'en') ? en : es; }
    var footer = document.getElementById('siteFooter');
    var canvas = document.getElementById('footerRain');
    var signText = document.getElementById('footerSignText');
    if(!footer || !canvas || !signText) return;

    var ctx = canvas.getContext('2d');
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // ICON_PATHS + loadIconImages come from icons.js (shared with the
    // full-page background grid), loaded earlier in the concatenated script.
    var ICON_SIZE = 20;
    var iconImages = [];
    var iconsReady = false;

    var drops = [];
    var raf = null;
    var sized = false;
    var typed = false;
    var last = null;

    function buildDrops(){
      var colWidth = 58;
      var cols = Math.max(3, Math.floor(canvas.width / colWidth));
      drops = [];
      for(var i = 0; i < cols; i++){
        drops.push({
          // Start already scattered through the visible height (not all
          // above it) so the footer reads as populated the moment it's
          // scrolled into view, instead of needing to "stream in" first.
          x: i * colWidth + colWidth / 2 + (Math.random() * 12 - 6),
          y: Math.random() * canvas.height,
          icon: Math.floor(Math.random() * ICON_PATHS.length),
          speed: 18 + Math.random() * 20
        });
      }
    }

    function resize(){
      canvas.width = footer.clientWidth;
      canvas.height = footer.clientHeight;
      buildDrops();
    }

    function render(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(!iconsReady) return;
      ctx.globalAlpha = 0.5;
      drops.forEach(function(d){
        var img = iconImages[d.icon];
        if(img && img.complete) ctx.drawImage(img, d.x - ICON_SIZE / 2, d.y - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE);
      });
      ctx.globalAlpha = 1;
    }

    function frame(ts){
      if(last === null) last = ts;
      var dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      drops.forEach(function(d){
        d.y += d.speed * dt;
        if(d.y - ICON_SIZE > canvas.height){
          d.y = -ICON_SIZE;
          d.icon = Math.floor(Math.random() * ICON_PATHS.length);
        }
      });
      render();
      raf = requestAnimationFrame(frame);
    }

    function signOffText(){ return tr('EOF — ¿hablamos?', "EOF — let's talk?"); }

    function typeSign(){
      if(typed) return;
      typed = true;
      var text = signOffText();
      var i = 0;
      signText.textContent = '';
      var iv = setInterval(function(){
        signText.textContent += text.charAt(i);
        i++;
        if(i >= text.length) clearInterval(iv);
      }, 40);
    }

    window.__footerRetype = function(){
      if(typed) signText.textContent = signOffText();
    };

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          if(!sized){
            sized = true;
            resize();
            var accentHex = '#cbff3e';
            try{ accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || accentHex; } catch(e){}
            loadIconImages(accentHex, function(images){ iconImages = images; iconsReady = true; render(); });
          }
          if(!raf && !reduceMotion) raf = requestAnimationFrame(frame);
          typeSign();
        } else if(raf){
          cancelAnimationFrame(raf);
          raf = null;
          last = null;
        }
      });
    }, { threshold: 0.15 });
    io.observe(footer);

    window.addEventListener('resize', function(){ if(sized) resize(); });
  })();

