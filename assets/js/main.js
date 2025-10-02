// assets/js/main.js
// Debuggable fragment loader — prints attempts to an on-page debug panel (useful on Android)
(function(){
  // --- simple on-page logger (visible) ---
  function makeLogPanel(){
    const panel = document.createElement('div');
    panel.id = 'frag-debug-panel';
    panel.style = [
      'position:fixed',
      'right:12px',
      'bottom:12px',
      'max-width:360px',
      'max-height:40vh',
      'overflow:auto',
      'background:rgba(0,0,0,0.75)',
      'color:#e6e6e6',
      'font-size:12px',
      'padding:10px',
      'border-radius:8px',
      'z-index:99999',
      'box-shadow:0 6px 20px rgba(0,0,0,0.6)'
    ].join(';');
    panel.innerHTML = '<strong style="display:block;margin-bottom:6px">Fragment loader debug</strong>';
    document.body.appendChild(panel);
    return panel;
  }
  const logPanel = makeLogPanel();
  function log(msg, ok){
    const line = document.createElement('div');
    line.textContent = (ok ? '✔ ' : '✖ ') + msg;
    line.style.opacity = ok ? '0.95' : '0.9';
    if(!ok) line.style.color = '#ff9b9b';
    logPanel.appendChild(line);
    // keep scroll bottom
    logPanel.scrollTop = logPanel.scrollHeight;
    // also console
    if(ok) console.log('[frag-ok]', msg); else console.warn('[frag-err]', msg);
  }

  // --- base detection ---
  function getBasePath(){
    // Detect repository/project base like '/cbc/' when site served at https://user.github.io/cbc/
    const path = location.pathname; // e.g. '/cbc/' or '/cbc/index.html' or '/'
    const parts = path.split('/').filter(Boolean);
    if(parts.length === 0) return '/';
    // If root index (e.g. /index.html) we still return '/'
    // Heuristic: if the first part is likely repo, return '/firstPart/'
    return '/' + parts[0] + '/';
  }
  const repoBase = getBasePath();
  log('repoBase = ' + repoBase, true);

  // --- fetch helper ---
  async function tryFetch(path){
    try{
      log('trying: ' + path, true);
      const r = await fetch(path, {cache: 'no-store'});
      if(!r.ok) {
        log('failed (' + r.status + '): ' + path, false);
        return null;
      }
      const text = await r.text();
      log('loaded: ' + path, true);
      return text;
    }catch(err){
      log('error fetching: ' + path + ' — ' + (err && err.message ? err.message : err), false);
      return null;
    }
  }

  // --- loader with candidate path building ---
  function candidatesFor(name){
    // try many variants: relative, ./, repoBase, repoBase+./, absolute root
    return [
      'components/' + name,
      './components/' + name,
      repoBase + 'components/' + name,
      repoBase + './components/' + name,
      '/' + 'components/' + name
    ];
  }

  async function loadFragment(id, name){
    const cands = candidatesFor(name);
    for(const p of cands){
      const html = await tryFetch(p);
      if(html){
        const container = document.getElementById(id);
        if(container){
          container.innerHTML = html;
          log('injected into #' + id, true);
        } else {
          log('no container #' + id + ' found', false);
        }
        return true;
      }
    }
    // fallback minimal injection
    log('all fetch attempts failed for ' + name + ', injecting fallback', false);
    if(id === 'site-header'){
      const container = document.getElementById(id);
      if(container){
        container.innerHTML = `
          <header style="background:#1f1133;color:#fff;padding:12px 16px;position:fixed;top:0;left:0;right:0;z-index:40">
            <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between">
              <a href="index.html" style="display:flex;gap:10px;align-items:center;color:inherit;text-decoration:none">
                <div style="width:40px;height:40px;background:#f6c14e;border-radius:6px;display:inline-block"></div>
                <div>
                  <div style="font-weight:700">Classic Brand</div>
                  <div style="font-size:12px;opacity:.8">Embroidery · Printing · Labeling</div>
                </div>
              </a>
              <nav><a href="contact.html" style="background:#f6c14e;color:#000;padding:6px 10px;border-radius:6px;text-decoration:none">Contact</a></nav>
            </div>
          </header>
          <div style="height:64px"></div>
        `;
      }
    } else if(id === 'site-footer'){
      const container = document.getElementById(id);
      if(container){
        container.innerHTML = `
          <footer style="background:#000;color:#ccc;padding:28px 16px;margin-top:36px">
            <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:24px">
              <div style="flex:1">
                <strong>Classic Brand</strong>
                <div style="margin-top:6px;font-size:13px">Matugga Center (near Lwadda School)</div>
              </div>
              <div style="flex:1">
                <div><strong>Contact</strong></div>
                <div style="margin-top:6px;font-size:13px">WhatsApp: <a href=\"https://wa.me/256785475049\" style=\"color:inherit\">0785475049</a></div>
              </div>
            </div>
            <div style="text-align:center;margin-top:18px;font-size:13px">© <span id="year-alt"></span> Classic Brand</div>
          </footer>
        `;
        const y = document.getElementById('year-alt');
        if(y) y.textContent = new Date().getFullYear();
      }
    }
    return false;
  }

  // Trigger the loads
  document.addEventListener('DOMContentLoaded', function(){
    loadFragment('site-header','header.html');
    loadFragment('site-footer','footer.html');
  });

  // Mobile toggle and smooth scroll
  window.addEventListener('click', e=>{
    const btn = e.target.closest('#mobile-menu-toggle');
    if(btn){
      const menu = document.getElementById('mobile-menu');
      if(menu) menu.classList.toggle('hidden');
    }
  });

  document.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="#"]');
    if(a){
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  });

  window.addEventListener('load', ()=>{
    const y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  });

})();          <div style="height:64px"></div>
        `;
      }
    } else if(id === 'site-footer'){
      const container = document.getElementById(id);
      if(container){
        container.innerHTML = `
          <footer style="background:#000;color:#ccc;padding:28px 16px;margin-top:36px">
            <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:24px">
              <div style="flex:1">
                <strong>Classic Brand</strong>
                <div style="margin-top:6px;font-size:13px">Matugga Center (near Lwadda School)</div>
              </div>
              <div style="flex:1">
                <div><strong>Contact</strong></div>
                <div style="margin-top:6px;font-size:13px">WhatsApp: <a href=\"https://wa.me/256785475049\" style=\"color:inherit\">0785475049</a></div>
              </div>
            </div>
            <div style="text-align:center;margin-top:18px;font-size:13px">© <span id="year-alt"></span> Classic Brand</div>
          </footer>
        `;
        const y = document.getElementById('year-alt');
        if(y) y.textContent = new Date().getFullYear();
      }
    }
    return false;
  }

  // Trigger the loads
  document.addEventListener('DOMContentLoaded', function(){
    loadFragment('site-header','header.html');
    loadFragment('site-footer','footer.html');
  });

  // Mobile toggle and smooth scroll
  window.addEventListener('click', e=>{
    const btn = e.target.closest('#mobile-menu-toggle');
    if(btn){
      const menu = document.getElementById('mobile-menu');
      if(menu) menu.classList.toggle('hidden');
    }
  });

  document.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="#"]');
    if(a){
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  });

  window.addEventListener('load', ()=>{
    const y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  });

})()   

  // Start loading
  loadFragment('site-header', candidatesFor('header.html'));
  loadFragment('site-footer', candidatesFor('footer.html'));

  // Rest of previously provided behavior: mobile toggle, smooth scroll, footer year
  window.addEventListener('click', e=>{
    const btn = e.target.closest('#mobile-menu-toggle');
    if(btn){
      const menu = document.getElementById('mobile-menu');
      if(menu) menu.classList.toggle('hidden');
    }
  });

  document.addEventListener('click', e=>{
    const a = e.target.closest('a[href^="#"]');
    if(a){
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  });

  window.addEventListener('load', ()=>{
    const y = document.getElementById('year');
    if(y) y.textContent = new Date().getFullYear();
  });

})();
