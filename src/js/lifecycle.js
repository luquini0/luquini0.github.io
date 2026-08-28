  /* ---------------- reveal on scroll ---------------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---------------- background grid: traveling data nodes ---------------- */
  (function(){
    var canvas = document.getElementById('bgGrid');
    if(!canvas) return;
    var ctx = canvas.getContext('2d');
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var GRID = 64;
    var accentRGB = '0,0,0';

    function hexToRgb(hex){
      hex = hex.trim().replace('#', '');
      if(hex.length === 3) hex = hex.split('').map(function(c){ return c + c; }).join('');
      var num = parseInt(hex, 16);
      return (num >> 16 & 255) + ',' + (num >> 8 & 255) + ',' + (num & 255);
    }
    try{
      var accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent');
      accentRGB = hexToRgb(accentHex);
    } catch(e){}

    var nodes = [], raf, last = null;

    function buildNodes(){
      var cols = Math.ceil(canvas.width / GRID);
      var rows = Math.ceil(canvas.height / GRID);
      var count = Math.min(18, Math.max(7, Math.round((cols + rows) / 2)));
      nodes = [];
      for(var i = 0; i < count; i++){
        var horizontal = Math.random() < 0.5;
        var lineCount = horizontal ? (rows + 1) : (cols + 1);
        var lineIndex = Math.floor(Math.random() * lineCount);
        var limit = horizontal ? canvas.width : canvas.height;
        nodes.push({
          horizontal: horizontal,
          pos: lineIndex * GRID,
          travel: Math.random() * limit,
          speed: 14 + Math.random() * 34,
          dir: Math.random() < 0.5 ? 1 : -1
        });
      }
    }

    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildNodes();
    }

    function drawGrid(){
      ctx.strokeStyle = 'rgba(' + accentRGB + ',0.06)';
      ctx.lineWidth = 1;
      var x, y;
      for(x = 0; x <= canvas.width; x += GRID){
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, canvas.height); ctx.stroke();
      }
      for(y = 0; y <= canvas.height; y += GRID){
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(canvas.width, y + 0.5); ctx.stroke();
      }
    }

    function drawNodes(dt){
      ctx.shadowColor = 'rgba(' + accentRGB + ',0.9)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(' + accentRGB + ',0.8)';
      nodes.forEach(function(n){
        var limit = n.horizontal ? canvas.width : canvas.height;
        n.travel += n.speed * n.dir * dt;
        if(n.travel < -12) n.travel = limit + 12;
        if(n.travel > limit + 12) n.travel = -12;
        var x = n.horizontal ? n.travel : n.pos;
        var y = n.horizontal ? n.pos : n.travel;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }

    function frame(ts){
      if(last === null) last = ts;
      var dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawNodes(dt);
      raf = requestAnimationFrame(frame);
    }

    resize();
    drawGrid();
    drawNodes(0);
    if(!reduceMotion) raf = requestAnimationFrame(frame);

    window.addEventListener('resize', function(){
      cancelAnimationFrame(raf);
      last = null;
      resize();
      drawGrid();
      drawNodes(0);
      if(!reduceMotion) raf = requestAnimationFrame(frame);
    });
  })();

  /* ---------------- footer year ---------------- */
  var y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();

