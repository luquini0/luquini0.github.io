  /* ---------------- shared icon set: dev stack, social, AI, crypto ---------------- */
  // Used by BOTH the footer icon-rain and the full-page animated background
  // grid, so they draw from the exact same set instead of drifting apart.
  // Glyphs covering the tools/stack from Skills & Services (dev, automation,
  // data/cloud, 3D/design, security, SEO/marketing, blockchain/AI) — drawn in
  // the site's own stroke-icon style rather than literal brand marks.
  var ICON_PATHS = [
    { d:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' }, // code / dev
    { d:'<path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 3 21 9 15 9"/>' }, // automation
    { d:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>' }, // database
    { d:'<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5"/><line x1="12" y1="12" x2="12" y2="22"/>' }, // 3D / package
    { d:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>' }, // security shield
    { d:'<polyline points="3 17 9 11 13 15 21 6"/><polyline points="14 6 21 6 21 13"/>' }, // SEO / trending
    { d:'<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l4.5 2.5M21 7l-4.5 2.5M12 12v10M3 7v10l9 5M21 7v10l-9 5"/>' }, // blockchain
    { d:'<rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="7 9 10 12 7 15"/><line x1="12" y1="15" x2="16" y2="15"/>' }, // terminal
    { d:'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>' }, // git branch
    { d:'<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4 2A4 4 0 0 0 6.5 19h11z"/>' }, // cloud
    { d:'<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>' }, // mobile
    { d:'<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>' }, // lock
    { d:'<path d="M5 12.5a11 11 0 0 1 14 0"/><path d="M8.5 16a6 6 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>' }, // wifi
    { d:'<circle cx="12" cy="12" r="9"/><path d="M8.5 9.5c0-1.4 1.6-2.5 3.5-2.5s3.5 1.1 3.5 2.5-1.6 2-3.5 2-3.5.9-3.5 2.3 1.6 2.2 3.5 2.2 3.5-.8 3.5-2.2"/>' }, // token
    { d:'<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/>' }, // mail
    { d:'<circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.5" y2="15.5"/>' }, // search
    { d:'<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><line x1="6.5" y1="7" x2="8" y2="7"/><line x1="6.5" y1="17" x2="8" y2="17"/>' }, // server rack
    { d:'<path d="M9 15l6-6"/><path d="M8 12 5.5 14.5a3 3 0 0 0 4 4L12 16"/><path d="M16 12l2.5-2.5a3 3 0 0 0-4-4L12 8"/>' }, // link / API
    { d:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/>' }, // video
    { d:'<path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.8 2.8-2-2 2.8-2.8z"/>' }, // wrench
    { d:'<rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.3"/><circle cx="15" cy="14" r="1.3"/><line x1="12" y1="9" x2="12" y2="5"/><circle cx="12" cy="4" r="1.2"/><line x1="3" y1="14" x2="5" y2="14"/><line x1="19" y1="14" x2="21" y2="14"/>' }, // robot / AI
    { d:'<rect x="8" y="8" width="8" height="10" rx="4"/><line x1="12" y1="8" x2="12" y2="4"/><path d="M8 12H4M20 12h-4M9 8 7 5M15 8l2-3M9 18l-2 3M15 18l2 3"/>' }, // bug
    { d:'<polygon points="12 3 21 8 12 13 3 8"/><polyline points="3 14 12 19 21 14"/>' }, // layers
    { d:'<path d="M12 2a10 10 0 1 0 0 20c1.4 0 2.4-1 2.4-2.2 0-.6-.2-1.1-.6-1.4-.4-.4-.6-.9-.6-1.4 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-4.4-4-9-9-9z"/><circle cx="7.5" cy="10.5" r="1.1"/><circle cx="10.5" cy="7" r="1.1"/><circle cx="15" cy="8" r="1.1"/>' }, // palette
    // Herramientas / marcas puntuales, simplificadas al estilo de línea del sitio
    { d:'<path d="M8 4h5a3 3 0 0 1 3 3v3H9a3 3 0 0 0-3 3v2H4v-5a4 4 0 0 1 4-4z"/><path d="M16 20h-5a3 3 0 0 1-3-3v-3h7a3 3 0 0 0 3-3V9h2v5a4 4 0 0 1-4 4z"/><circle cx="10" cy="7" r="0.6"/><circle cx="14" cy="17" r="0.6"/>' }, // Python
    { d:'<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>' }, // React / React Native
    { d:'<path d="M9 3h4a5 5 0 0 1 5 5v3a7 7 0 0 1-7 7H9V3z"/><line x1="9" y1="3" x2="9" y2="18"/>' }, // Django
    { d:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 8v6.5c0 1-.6 1.5-1.5 1.5S6 15.3 6 14.3"/><path d="M13 14c0 1.2 1 2 2.3 2s2.2-.7 2.2-1.7c0-2.3-4.5-1.3-4.5-4 0-1.2 1-1.9 2.2-1.9 1.1 0 1.9.6 2.1 1.6"/>' }, // JavaScript
    { d:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 8h5M9.5 8v8"/><path d="M14 14c0 1.2 1 2 2.3 2s2.2-.7 2.2-1.7c0-2.3-4.5-1.3-4.5-4 0-1.2 1-1.9 2.2-1.9 1.1 0 1.9.6 2.1 1.6"/>' }, // TypeScript
    { d:'<circle cx="12" cy="12" r="9"/><path d="M12 5c3 2 5 4 5 7a5 5 0 0 1-10 0c0-2 1-3.5 2.5-5"/>' }, // Blender
    { d:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5.5-5.5L9 17"/>' }, // GIMP / image editing
    { d:'<path d="M7 21c-1-4 1-7 1-7s1 2 2 2c0-3 3-9 3-9s0 4 2 6c1-1 1-3 1-3s3 4 3 9c0 3-2.5 5-5 5s-6-1-7-3z"/>', fill:true }, // Firebase
    { d:'<rect x="2" y="10" width="5" height="5"/><rect x="8" y="10" width="5" height="5"/><rect x="14" y="10" width="5" height="5"/><rect x="8" y="4" width="5" height="5"/><path d="M2 15c0 3 4 5 10 5s10-3 10-6"/>' }, // Docker
    { d:'<path d="M17.5 15a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4 2A4 4 0 0 0 6.5 15h11z"/><path d="M6 18c3 1.5 9 1.5 12 0"/>' }, // AWS
    { d:'<path d="M12 2c3 3 5 7 5 11a5 5 0 0 1-10 0c0-4 2-8 5-11z"/><line x1="12" y1="13" x2="12" y2="22"/>' }, // MongoDB
    { d:'<polygon points="12 2 21 7 21 17 12 22 3 17 3 7"/>' }, // Node.js
    { d:'<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>' }, // GitHub (reused from social-row)
    { d:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>' }, // Instagram (reused from social-row)
    { d:'<path d="M18.24 3h3.31l-7.23 8.26L23 21h-6.66l-5.21-6.82L5.16 21H1.85l7.73-8.84L1 3h6.83l4.71 6.24zm-1.16 16.2h1.83L7 4.7H5.03z"/>', fill:true }, // X / Twitter (reused from social-row)
    { d:'<circle cx="12" cy="12" r="9"/><path d="M14.5 8.5h-1.8c-.9 0-1.2.4-1.2 1.2V11H14l-.3 2.2h-2.2V21"/>' }, // Facebook
    { d:'<rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7" y1="10" x2="7" y2="17"/><circle cx="7" cy="6.5" r="0.6"/><path d="M11 17v-7M11 12c0-1.5 1-2.5 2.5-2.5S16 10.5 16 12v5"/>' }, // LinkedIn
    { d:'<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5c.3 0 .7 0 1 .1"/><path d="M14 4c.5 2.5 2.5 4.5 5 4.8"/>' }, // TikTok
    { d:'<path d="M12 3c3 0 5 2.3 5 5.5v3c1 .3 2 1 2 2 0 .8-.7 1.3-1.5 1.6.3.8 1 1.4 2 1.7-.2.7-1 1-1.8 1.1-.1.6-.5 1-1.2 1.1-.5 1.2-1.8 1.9-3.5 1.9s-3-.7-3.5-1.9c-.7-.1-1.1-.5-1.2-1.1-.8-.1-1.6-.4-1.8-1.1 1-.3 1.7-.9 2-1.7-.8-.3-1.5-.8-1.5-1.6 0-1 1-1.7 2-2v-3C7 5.3 9 3 12 3z"/>' }, // Snapchat
    // Resto del stack técnico mencionado en Habilidades, mismo tratamiento de línea
    { d:'<ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M7 10h1.5a1.5 1.5 0 0 1 0 3H7v-3zm7 0h1.5a1.5 1.5 0 0 1 0 3H14v-3z"/>' }, // PHP
    { d:'<path d="M6 8h11v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M9 3c-1 1-1 2 0 3M13 3c-1 1-1 2 0 3"/>' }, // Java
    { d:'<polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5"/><circle cx="12" cy="3" r="1"/><circle cx="20" cy="7.5" r="1"/><circle cx="20" cy="16.5" r="1"/><circle cx="12" cy="21" r="1"/><circle cx="4" cy="16.5" r="1"/><circle cx="4" cy="7.5" r="1"/>' }, // GraphQL
    { d:'<path d="M4 20V9l6-3.5V16l6-3.5V4l6 3.5v10L10 21z"/>' }, // Laravel
    { d:'<path d="M14 3 5 12l4 4 9-9z"/><path d="M9 16l5 5h6l-8-8z"/>' }, // Flutter
    { d:'<path d="M5 3h14l-1.3 15L12 21l-5.7-3L5 3z"/><path d="M8 8h8M8 13h6l-.3 3.5L12 17.5l-3.5-1L8.3 14"/>' }, // HTML5
    { d:'<path d="M12 3 4 6l8 3 8-3-8-3z"/><path d="M4 11l8 3 8-3M4 16l8 3 8-3"/>' }, // Redis
    { d:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>' }, // Supabase
    { d:'<path d="M9 3h3v6H9a3 3 0 1 1 0-6z"/><path d="M12 3h3a3 3 0 1 1 0 6h-3V3z"/><path d="M9 9h3v6H9a3 3 0 1 1 0-6z"/><path d="M12 15a3 3 0 1 1 3-3h-3v3z"/><circle cx="12" cy="18" r="3"/>' }, // Figma
    { d:'<circle cx="12" cy="12" r="9"/><path d="M15.5 9a4 4 0 1 0 0 6.5"/>' }, // Canva
    { d:'<rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="8" x2="16" y2="16"/><line x1="16" y1="8" x2="8" y2="16"/>' }, // Adobe XD
    { d:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 15l3-7 3 7M8 12h4"/>' }, // After Effects
    { d:'<polygon points="12 2 19 12 12 16 5 12"/><polygon points="12 16 19 12 12 22 5 12"/>' }, // Ethereum
    { d:'<path d="M12 3c2 0 3 2 3 4 0 1-.3 2-1 2.7 2 1 3 3.3 3 6.3 0 3-2.2 5-5 5s-5-2-5-5c0-3 1-5.3 3-6.3-.7-.7-1-1.7-1-2.7 0-2 1-4 3-4z"/><circle cx="10.5" cy="8" r="0.6"/><circle cx="13.5" cy="8" r="0.6"/>' }, // Linux / Kali
    { d:'<circle cx="12" cy="12" r="9"/><path d="M12 12 12 4"/><path d="M12 12a8 8 0 0 1 6 2.8"/>' }, // network scan (Wireshark / Nmap)
    { d:'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>' }, // AI / prompt engineering (general)
    { d:'<path d="M15 3a9 9 0 1 0 0 18 7 7 0 0 1 0-18z"/>' }, // Midjourney
    { d:'<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M5 8v4a3 3 0 0 0 3 3h1M19 8v4a3 3 0 0 1-3 3h-1"/>' }, // Zapier / n8n workflows
    // IA generativa
    { d:'<path d="M12 2v20M4 6l16 12M20 6L4 18M2 12h20"/>' }, // Claude / Anthropic
    { d:'<path d="M12 12c-3-3-3-6 0-9 3 3 3 6 0 9zm0 0c3-3 6-3 9 0-3 3-6 3-9 0zm0 0c3 3 3 6 0 9-3-3-3-6 0-9zm0 0c-3 3-6 3-9 0 3-3 6-3 9 0z"/>' }, // OpenAI
    { d:'<path d="M3 14c2-4 6-6 10-6 5 0 8 3 8 7 0 1-1 2-2 2H8c-3 0-5-1-5-3z"/><path d="M17 9l3-3v5"/><circle cx="9" cy="13" r="0.7"/>' }, // DeepSeek
    { d:'<path d="M12 3c0 4 2 6 6 7-4 1-6 3-6 7 0-4-2-6-6-7 4-1 6-3 6-7z"/>' }, // Gemini
    // Criptomonedas
    { d:'<circle cx="12" cy="12" r="9"/><path d="M9 7v10M13 7v10M8 9h5.5a2 2 0 0 1 0 4H8m5.5 0H14a2 2 0 0 1 0 4H8"/><line x1="10" y1="5" x2="10" y2="7"/><line x1="10" y1="17" x2="10" y2="19"/>' }, // Bitcoin
    { d:'<polygon points="12 2 15 5 12 8 9 5"/><polygon points="12 16 15 19 12 22 9 19"/><polygon points="5 9 8 12 5 15 2 12"/><polygon points="19 9 22 12 19 15 16 12"/><polygon points="12 9 15 12 12 15 9 12"/>' }, // BNB / Binance
    { d:'<path d="M3 6h16l-3 3H0z"/><path d="M3 18h16l-3-3H0z"/><path d="M3 12h16l-3-3H0z"/>' } // Solana
  ];

  // Renders every ICON_PATHS entry to an Image (SVG data URI) tinted with
  // `colorHex`, then calls cb(images) once all have loaded (or failed —
  // failures just leave a gap, callers already check img.complete).
  function loadIconImages(colorHex, cb){
    var images = [];
    var loaded = 0, total = ICON_PATHS.length;
    ICON_PATHS.forEach(function(icon, i){
      var svg = icon.fill
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="' + colorHex + '" stroke="none">' + icon.d + '</svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + colorHex + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon.d + '</svg>';
      var img = new Image();
      img.onload = function(){ loaded++; if(loaded === total) cb(images); };
      img.onerror = function(){ loaded++; if(loaded === total) cb(images); };
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      images[i] = img;
    });
  }
