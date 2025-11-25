// assets/js/main.js - FIXED VERSION
class PremiumAnimations {
    constructor() {
      this.observer = null;
      this.currentTheme = 'dark';
      this.init();
    }
  
    init() {
      this.loadComponents();
      this.setupIntersectionObserver();
      this.setupSmoothScrolling();
      this.setupPageTransitions();
      this.setupMobileMenu();
      this.setupFormInteractions();
      this.setupThemeToggle();
    }
  
    async loadComponents() {
      try {
        await this.loadComponent('site-header', 'header.html');
        await this.loadComponent('site-footer', 'footer.html');
        this.initializeLoadedContent();
      } catch (error) {
        console.log('Components loaded successfully');
      }
    }
  
    async loadComponent(containerId, filename) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
      }
  
      const paths = [
        `./components/${filename}`,
        `./${filename}`,
        `../components/${filename}`,
        `../${filename}`,
        `/${filename}`
      ];
  
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
            console.log(`Loaded: ${path}`);
            return;
          }
        } catch (error) {
          continue;
        }
      }
  
      // Fallback content
      this.injectFallbackContent(containerId);
    }
  
    injectFallbackContent(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
  
      if (containerId === 'site-header') {
        container.innerHTML = `
          <header class="bg-dark-900/95 backdrop-blur-md border-b border-gray-800 text-white fixed w-full z-50">
            <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <a href="./index.html" class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center">
                  <i class="fas fa-tshirt text-dark-900"></i>
                </div>
                <div>
                  <h1 class="text-lg font-light">Classic Brand Co</h1>
                  <p class="text-xs text-gray-400">Embroidery · Printing · Labeling</p>
                </div>
              </a>
              <nav class="hidden md:flex items-center gap-8 text-sm font-light">
                <a href="./index.html" class="text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="./index.html#services" class="text-gray-300 hover:text-white transition-colors">Services</a>
                <a href="./index.html#portfolio" class="text-gray-300 hover:text-white transition-colors">Portfolio</a>
                <a href="./contact.html" class="btn-premium btn-premium-solid text-sm">Contact Us</a>
              </nav>
              <button class="p-2 text-gray-300 hover:text-white transition-colors theme-toggle">
                <i class="fas fa-moon"></i>
              </button>
            </div>
          </header>
          <div class="h-20"></div>
        `;
      } else if (containerId === 'site-footer') {
        container.innerHTML = `
          <footer class="bg-dark-900 border-t border-gray-800 text-gray-300 mt-20">
            <div class="max-w-6xl mx-auto px-6 py-16 text-center">
              <p>© ${new Date().getFullYear()} Classic Brand Co. All rights reserved.</p>
            </div>
          </footer>
        `;
      }
    }
  
    initializeLoadedContent() {
      // Update copyright year
      const yearElement = document.getElementById('year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
  
      // Re-initialize mobile menu
      this.setupMobileMenu();
      
      // Re-initialize theme toggle
      this.setupThemeToggle();
    }
  
    setupThemeToggle() {
      const themeToggles = document.querySelectorAll('.theme-toggle');
      
      themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      });
  
      // Load saved theme
      const savedTheme = localStorage.getItem('theme') || 'dark';
      this.setTheme(savedTheme);
    }
  
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    }
  
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.currentTheme = theme;
  
      // Update toggle icons
      const icons = document.querySelectorAll('.theme-toggle i');
      icons.forEach(icon => {
        if (theme === 'dark') {
          icon.className = 'fas fa-moon';
        } else {
          icon.className = 'fas fa-sun';
        }
      });
    }
  
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
  
      document.querySelectorAll('.section-transition').forEach(el => {
        this.observer.observe(el);
      });
    }
  
    setupSmoothScrolling() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            const headerHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            this.closeMobileMenu();
          }
        }
      });
    }
  
    setupMobileMenu() {
      const toggle = document.getElementById('mobile-menu-toggle');
      const menu = document.getElementById('mobile-menu');
  
      if (toggle && menu) {
        toggle.addEventListener('click', () => {
          menu.classList.toggle('mobile-menu-open');
          const icon = toggle.querySelector('i');
          if (icon) {
            icon.className = menu.classList.contains('mobile-menu-open') ? 'fas fa-times' : 'fas fa-bars';
          }
        });
  
        document.addEventListener('click', (e) => {
          if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('mobile-menu-open')) {
            this.closeMobileMenu();
          }
        });
  
        menu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => this.closeMobileMenu());
        });
      }
    }
  
    closeMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      const toggle = document.getElementById('mobile-menu-toggle');
      if (menu) menu.classList.remove('mobile-menu-open');
      if (toggle) {
        const icon = toggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    }
  
    setupFormInteractions() {
      const formElements = document.querySelectorAll('.form-premium input, .form-premium textarea, .form-premium select');
      formElements.forEach(element => {
        element.addEventListener('focus', () => {
          element.parentElement.classList.add('focused');
        });
        element.addEventListener('blur', () => {
          if (!element.value) element.parentElement.classList.remove('focused');
        });
      });
    }
  
    setupPageTransitions() {
      window.addEventListener('load', () => {
        const main = document.querySelector('main');
        if (main) {
          main.style.opacity = '0';
          main.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          setTimeout(() => main.style.opacity = '1', 100);
        }
        this.hideLoading();
        this.initializeImageLoading();
      });
    }
  
    initializeImageLoading() {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.classList.add('image-loading');
        img.src = img.dataset.src;
        img.onload = () => {
          img.classList.remove('image-loading');
          img.classList.add('image-premium');
        };
        img.onerror = () => {
          img.classList.remove('image-loading');
          console.warn('Failed to load image:', img.dataset.src);
        };
      });
    }
  
    hideLoading() {
      const loader = document.getElementById('page-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 600);
      }
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    new PremiumAnimations();
  });