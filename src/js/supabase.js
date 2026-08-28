  /* ---------------- Supabase: game leaderboard + gate analytics ---------------- */
  // Backend for the mini-games' high scores and the access gate's anonymous
  // completion stats. No accounts, no PII, no free-text fields anywhere.
  //
  //   - Score writes go through a Supabase Edge Function
  //     (supabase/functions/submit-score), which validates game/score and
  //     inserts with the service role — the `game_scores` table itself has
  //     no anon INSERT policy (see supabase/migrations), so a visitor can't
  //     just POST straight to PostgREST and fake a row.
  //   - Gate-session writes are low-stakes aggregate analytics (outcome +
  //     lang only), so those go straight to PostgREST under RLS.
  //   - Every call is best-effort: if the network/API is unreachable, the
  //     site keeps working exactly as it did before this file existed.
  (function(){
    var SUPABASE_URL = 'https://zqoxwfugrrzlqwehlauq.supabase.co';
    var SUPABASE_KEY = 'sb_publishable_aH8WKyxhigMEuJxP1Lw6Aw_4fcmD4Ez';

    function tr(es, en){ return (document.body.getAttribute('data-lang') === 'en') ? en : es; }

    function escapeHtml(str){
      return String(str).replace(/[&<>"']/g, function(c){
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
      });
    }

    // `name` is optional (nickname only, not an account — never required).
    function submitScore(game, score, name){
      try{
        fetch(SUPABASE_URL + '/functions/v1/submit-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'apikey': SUPABASE_KEY
          },
          body: JSON.stringify({ game: game, score: score, name: name || null })
        }).catch(function(){});
      } catch(e){}
    }

    function renderLeaderboard(game, containerId){
      var el = document.getElementById(containerId);
      if(!el) return;
      el.innerHTML = '<div class="leaderboard-loading mono">' + tr('cargando ranking…','loading ranking…') + '</div>';
      try{
        fetch(SUPABASE_URL + '/rest/v1/game_scores?select=score,name&game=eq.' + encodeURIComponent(game) + '&order=score.desc&limit=5', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        })
          .then(function(r){ return r.ok ? r.json() : []; })
          .then(function(rows){
            if(!rows || !rows.length){
              el.innerHTML = '<div class="leaderboard-empty mono">' + tr('sé el primero en sumar un puntaje','be the first to score') + '</div>';
              return;
            }
            var items = rows.map(function(row, i){
              var name = row.name ? escapeHtml(row.name).toUpperCase() : tr('ANÓNIMO','ANON');
              return '<li><span class="lb-rank">#' + (i + 1) + ' <span class="lb-name">' + name + '</span></span><span class="lb-score">' + row.score + '</span></li>';
            }).join('');
            el.innerHTML = '<span class="leaderboard-label mono">' + tr('top 5','top 5') + '</span><ol class="leaderboard-list mono">' + items + '</ol>';
          })
          .catch(function(){ el.innerHTML = ''; });
      } catch(e){ el.innerHTML = ''; }
    }

    function logGateSession(entry){
      try{
        fetch(SUPABASE_URL + '/rest/v1/gate_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ outcome: entry.outcome, lang: entry.lang })
        }).catch(function(){});
      } catch(e){}
    }

    window.__submitScore = submitScore;
    window.__renderLeaderboard = renderLeaderboard;
    window.__logGateSession = logGateSession;
  })();
