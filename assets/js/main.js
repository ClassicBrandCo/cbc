// assets/js/main.js (robust version for GitHub Pages project sites)
// Detect base path (works for root sites and project sites like /user/repo/)
(function(){
  function getBasePath(){
    // If served as https://host/<repo>/..., location.pathname starts with /<repo>/...
    const path = location.pathname; // e.g. /cbc/ or / or /cbc/index.html
    // If page is at root (single-site), base is '/'
    // Heuristic: if path has more than 1 segment, treat first segment as base
    const parts = path.split('/').filter(Boolean);
    if(parts.length === 0) return '/';
    // If repo name exists as first part and not index.html (project page), use '/repo/'
    // If you're on a page like /cbc/index.html or /cbc/, base '/cbc/'
    return '/' + parts[0] + '/';
  }

  const repoBase = getBasePath(); // e.g. '/' or '/cbc/'

  async function tryFetch(path){
    try{
      const res = await fetch(path);
      if(!res.ok) throw new Error('not-ok ' + res.status);
      console.log('[frag] loaded', path);
      return await res.text();
    }catch(e){
      console.warn('[frag] failed to load', path, e);
      return null;
    }
  }

  async function loadFragment(id, candidatePaths){
    for(const p of candidatePaths){
      const html = await tryFetch(p);
      if(html){
        document.getElementById(id).innerHTML = html;
        return true;
      }
    }
    // fallback minimal fragment if all fetches fail
    if(id === 'site-header'){
      document.getElementById(id).innerHTML = `
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
    } else if(id === 'site-footer'){
      document.getElementById(id).innerHTML = `
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
    return false;
  }

  // Build candidate paths to try (relative and repoBase variants)
  function candidatesFor(file){
    return [
      // relative to current doc
      'components/' + file,
      './components/' + file,
      // try with repo base (works for project pages on GitHub Pages)
      repoBase + 'components/' + file,
      // try root-level (safe fallback)
      '/' + 'components/' + file
    ];
  }

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