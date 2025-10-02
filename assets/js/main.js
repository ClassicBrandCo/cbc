// assets/js/main.js - PRODUCTION READY
(function () {
  'use strict';

  // Simple logging (disabled in production)
  function log(msg, ok) {
    // Enable for debugging: console.log(ok ? '✔' : '✖', msg);
  }

  // Get base path for GitHub Pages
  function getBasePath() {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);

    // If we're at root like 'classicbrandco.github.io'
    if (parts.length === 0) return '/';

    // If we're in a repo like 'classicbrandco.github.io/cbc'
    const firstPart = parts[0];

    // Special case: if we're on a page like /cbc/contact.html
    if (path.includes('.html') && !path.endsWith('/')) {
      return '/' + firstPart + '/';
    }

    return path.endsWith('/') ? path : path + '/';
  }

  const repoBase = getBasePath();
  log('Base path detected: ' + repoBase, true);

  // Fetch helper with error handling
  async function tryFetch(path) {
    try {
      const response = await fetch(path, {
        cache: 'no-cache',
        headers: {
          'Accept': 'text/html'
        }
      });

      if (!response.ok) {
        log('Fetch failed: ' + path + ' (' + response.status + ')', false);
        return null;
      }

      const text = await response.text();
      if (!text || text.trim().length === 0) {
        log('Empty response: ' + path, false);
        return null;
      }

      log('Loaded: ' + path, true);
      return text;
    } catch (error) {
      log('Fetch error: ' + path + ' - ' + error.message, false);
      return null;
    }
  }

  // Generate possible file paths
  function candidatesFor(filename) {
    const basePaths = [
      '',              // current directory
      './',           // current directory
      repoBase,       // repository base
      repoBase + './', // repository base with current
      '/',            // root
      '/components/',  // root components
      '../'           // parent directory
    ];

    const paths = [];

    basePaths.forEach(base => {
      paths.push(
        base + filename,
        base + 'components/' + filename,
        base + 'assets/components/' + filename
      );
    });

    // Remove duplicates and empty strings
    return [...new Set(paths.filter(path => path && path.length > 0))];
  }

  // Load fragment into container
  async function loadFragment(containerId, filename) {
    const container = document.getElementById(containerId);
    if (!container) {
      log('Container not found: #' + containerId, false);
      return false;
    }

    const candidates = candidatesFor(filename);
    log('Trying ' + candidates.length + ' paths for ' + filename, true);

    for (const path of candidates) {
      const html = await tryFetch(path);
      if (html) {
        container.innerHTML = html;
        log('Successfully loaded: ' + path, true);

        // Re-initialize any dynamic content in the fragment
        initializeLoadedContent(containerId);
        return true;
      }
    }

    // Fallback content if all fetches fail
    log('All paths failed, using fallback for: ' + containerId, false);
    injectFallbackContent(containerId);
    return false;
  }

  // Initialize dynamic content in loaded fragments
  function initializeLoadedContent(containerId) {
    // Update copyright year in footer
    if (containerId === 'site-footer') {
      const yearElements = document.querySelectorAll('#year, #year-alt');
      const currentYear = new Date().getFullYear();
      yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
      });
    }

    // Re-attach event listeners for mobile menu
    if (containerId === 'site-header') {
      initializeMobileMenu();
    }
  }

  // Fallback content when fragments can't be loaded
  function injectFallbackContent(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (containerId === 'site-header') {
      container.innerHTML = `
        <header class="bg-gradient-to-r from-indigo-900 via-purple-700 to-black text-white fixed w-full z-40 shadow-lg">
          <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="${repoBase}index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div class="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <i class="fas fa-tshirt text-black text-lg"></i>
              </div>
              <div>
                <h1 class="text-lg font-bold">Classic Brand Co</h1>
                <p class="text-xs opacity-80">Embroidery · Printing · Labeling</p>
              </div>
            </a>
            <nav class="hidden md:flex items-center gap-6 text-sm">
              <a href="${repoBase}index.html" class="hover:text-yellow-400 transition-colors">Home</a>
              <a href="${repoBase}index.html#services" class="hover:text-yellow-400 transition-colors">Services</a>
              <a href="${repoBase}index.html#portfolio" class="hover:text-yellow-400 transition-colors">Portfolio</a>
              <a href="${repoBase}contact.html" class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-semibold">
                Contact
              </a>
            </nav>
            <button id="mobile-menu-toggle" class="md:hidden p-2 text-white">
              <i class="fas fa-bars text-lg"></i>
            </button>
          </div>
          
          <!-- Mobile Menu -->
          <div id="mobile-menu" class="md:hidden hidden bg-black/95 backdrop-blur-sm">
            <div class="px-4 py-4 flex flex-col gap-3">
              <a href="${repoBase}index.html" class="py-2 px-4 hover:bg-white/10 rounded transition-colors">Home</a>
              <a href="${repoBase}index.html#services" class="py-2 px-4 hover:bg-white/10 rounded transition-colors">Services</a>
              <a href="${repoBase}index.html#portfolio" class="py-2 px-4 hover:bg-white/10 rounded transition-colors">Portfolio</a>
              <a href="${repoBase}contact.html" class="bg-yellow-400 text-black py-2 px-4 rounded font-semibold text-center mt-2">
                Contact Us
              </a>
            </div>
          </div>
        </header>
        <div class="h-16"></div>
      `;
    }
    else if (containerId === 'site-footer') {
      const currentYear = new Date().getFullYear();
      container.innerHTML = `
        <footer class="bg-black text-gray-300 mt-16">
          <div class="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-xl font-semibold text-white mb-4">Classic Brand Co</h3>
              <p class="text-sm leading-relaxed">
                Matugga Center (near Lwadda School)<br>
                Professional T-shirt printing • Embroidery • Labeling • Digitizing
              </p>
            </div>
            <div>
              <h4 class="font-semibold text-white mb-4">Contact Info</h4>
              <div class="space-y-2 text-sm">
                <p class="flex items-center">
                  <i class="fab fa-whatsapp text-green-400 mr-3"></i>
                  <a href="https://wa.me/256785475049" class="hover:text-yellow-400 transition-colors">
                    WhatsApp: 0785 475 049
                  </a>
                </p>
                <p class="flex items-center">
                  <i class="fas fa-phone text-blue-400 mr-3"></i>
                  <a href="tel:+256759921866" class="hover:text-yellow-400 transition-colors">
                    Call: 0759 921 866
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-white mb-4">Follow Us</h4>
              <div class="flex gap-4">
                <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-800">
            <div class="max-w-6xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
              © ${currentYear} Classic Brand Co. All rights reserved.
            </div>
          </div>
        </footer>
      `;
    }

    // Re-initialize after injecting fallback
    initializeLoadedContent(containerId);
  }

  // Mobile menu functionality
  function initializeMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        menu.classList.toggle('hidden');
        menu.classList.toggle('block');

        // Update icon
        const icon = toggle.querySelector('i');
        if (icon) {
          if (menu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars';
          } else {
            icon.className = 'fas fa-times';
          }
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
          menu.classList.remove('block');
          const icon = toggle.querySelector('i');
          if (icon) icon.className = 'fas fa-bars';
        }
      });
    }
  }

  // Smooth scroll for anchor links
  function initializeSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const headerHeight = 80; // Approximate header height
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          const menuToggle = document.getElementById('mobile-menu-toggle');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('block');
            const icon = menuToggle?.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
          }
        }
      }
    });
  }

  // Initialize everything when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    log('DOM loaded, initializing fragments...', true);

    // Load header and footer
    Promise.all([
      loadFragment('site-header', 'header.html'),
      loadFragment('site-footer', 'footer.html')
    ]).then(() => {
      log('All fragments loaded successfully', true);
    }).catch(error => {
      log('Error loading fragments: ' + error.message, false);
    });

    // Initialize smooth scroll
    initializeSmoothScroll();

    // Update copyright year (fallback)
    const yearElements = document.querySelectorAll('#year, #year-alt');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
      if (el && !el.textContent) {
        el.textContent = currentYear;
      }
    });
  });

  // Handle page load completion
  window.addEventListener('load', function () {
    log('Page fully loaded', true);

    // Add fade-in animation to main content
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('fade-in');
    }
  });

})();