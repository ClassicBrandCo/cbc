// main.js - Updated for 2025
// Classic Brand Co - Main JavaScript
// Enhanced with smooth animations and better user experience

class ClassicBrandWebsite {
  constructor() {
      this.mobileMenuToggle = null;
      this.mobileMenu = null;
      this.isMobileMenuOpen = false;
      
      this.init();
  }
  
  init() {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
          this.setup();
      }
  }
  
  setup() {
      this.setupMobileMenu();
      this.setupSmoothScroll();
      this.updateCopyrightYear();
      this.setupAnimations();
      this.setupFormHandling();
      this.setupHoverEffects();
      this.setupPerformanceOptimizations();
      
      console.log('Classic Brand Co website initialized successfully!');
  }
  
  // Mobile Menu Functionality
  setupMobileMenu() {
      this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      this.mobileMenu = document.getElementById('mobile-menu');
      
      if (this.mobileMenuToggle && this.mobileMenu) {
          // Click event for mobile menu toggle
          this.mobileMenuToggle.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              this.toggleMobileMenu();
          });
          
          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
              if (this.isMobileMenuOpen && 
                  !this.mobileMenu.contains(e.target) && 
                  !this.mobileMenuToggle.contains(e.target)) {
                  this.closeMobileMenu();
              }
          });
          
          // Close menu when pressing Escape key
          document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape' && this.isMobileMenuOpen) {
                  this.closeMobileMenu();
              }
          });
          
          // Prevent body scroll when menu is open
          this.mobileMenu.addEventListener('touchmove', (e) => {
              if (this.isMobileMenuOpen) {
                  e.preventDefault();
              }
          }, { passive: false });
      }
  }
  
  toggleMobileMenu() {
      if (this.isMobileMenuOpen) {
          this.closeMobileMenu();
      } else {
          this.openMobileMenu();
      }
  }
  
  openMobileMenu() {
      this.mobileMenu.classList.remove('hidden');
      this.isMobileMenuOpen = true;
      
      // Update menu icon
      const icon = this.mobileMenuToggle.querySelector('i');
      if (icon) {
          icon.className = 'fas fa-times';
      }
      
      // Add animation class
      this.mobileMenu.style.animation = 'slideDown 0.3s ease-out';
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
  }
  
  closeMobileMenu() {
      this.mobileMenu.classList.add('hidden');
      this.isMobileMenuOpen = false;
      
      // Update menu icon
      const icon = this.mobileMenuToggle.querySelector('i');
      if (icon) {
          icon.className = 'fas fa-bars';
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
  }
  
  // Smooth Scroll Functionality
  setupSmoothScroll() {
      document.addEventListener('click', (e) => {
          const link = e.target.closest('a[href^="#"]');
          
          if (link && link.getAttribute('href') !== '#') {
              const targetId = link.getAttribute('href');
              const targetElement = document.querySelector(targetId);
              
              if (targetElement) {
                  e.preventDefault();
                  this.scrollToElement(targetElement);
                  
                  // Close mobile menu if open
                  if (this.isMobileMenuOpen) {
                      this.closeMobileMenu();
                  }
              }
          }
      });
  }
  
  scrollToElement(element) {
      const headerHeight = 84; // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
      });
  }
  
  // Update Copyright Year
  updateCopyrightYear() {
      const yearElements = document.querySelectorAll('#year');
      const currentYear = new Date().getFullYear();
      
      yearElements.forEach(element => {
          if (element) {
              element.textContent = currentYear;
          }
      });
  }
  
  // Setup Animations
  setupAnimations() {
      // Add fade-in animation to main content
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
          mainContent.classList.add('fade-in');
      }
      
      // Intersection Observer for scroll animations
      if ('IntersectionObserver' in window) {
          this.setupScrollAnimations();
      }
  }
  
  setupScrollAnimations() {
      const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.style.opacity = '1';
                  entry.target.style.transform = 'translateY(0)';
                  observer.unobserve(entry.target);
              }
          });
      }, observerOptions);
      
      // Observe elements for scroll animations
      const animatedElements = document.querySelectorAll('.service-card, .portfolio-card, .info-card');
      animatedElements.forEach(element => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          observer.observe(element);
      });
  }
  
  // Form Handling
  setupFormHandling() {
      const contactForm = document.querySelector('.contact-form');
      
      if (contactForm) {
          contactForm.addEventListener('submit', (e) => {
              this.handleFormSubmit(e, contactForm);
          });
          
          // Add input validation styles
          this.setupFormValidation(contactForm);
      }
  }
  
  setupFormValidation(form) {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
          input.addEventListener('blur', () => {
              this.validateField(input);
          });
          
          input.addEventListener('input', () => {
              this.clearFieldError(input);
          });
      });
  }
  
  validateField(field) {
      const value = field.value.trim();
      
      if (field.hasAttribute('required') && !value) {
          this.showFieldError(field, 'This field is required');
          return false;
      }
      
      if (field.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
              this.showFieldError(field, 'Please enter a valid email address');
              return false;
          }
      }
      
      this.clearFieldError(field);
      return true;
  }
  
  showFieldError(field, message) {
      this.clearFieldError(field);
      
      field.style.borderColor = '#ef4444';
      
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.style.color = '#ef4444';
      errorElement.style.fontSize = '14px';
      errorElement.style.marginTop = '5px';
      errorElement.textContent = message;
      
      field.parentNode.appendChild(errorElement);
  }
  
  clearFieldError(field) {
      field.style.borderColor = '';
      
      const existingError = field.parentNode.querySelector('.field-error');
      if (existingError) {
          existingError.remove();
      }
  }
  
  async handleFormSubmit(e, form) {
      e.preventDefault();
      
      // Validate all fields
      const inputs = form.querySelectorAll('input, textarea, select');
      let isValid = true;
      
      inputs.forEach(input => {
          if (!this.validateField(input)) {
              isValid = false;
          }
      });
      
      if (!isValid) {
          this.showFormMessage('Please fix the errors above', 'error');
          return;
      }
      
      // Show loading state
      const submitButton = form.querySelector('.form-submit');
      const originalText = submitButton.innerHTML;
      
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;
      
      try {
          // Simulate form submission (replace with actual Formspree or other service)
          await this.simulateFormSubmission(form);
          
          this.showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
          form.reset();
          
      } catch (error) {
          this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
          console.error('Form submission error:', error);
      } finally {
          // Restore button state
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
      }
  }
  
  simulateFormSubmission(form) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              // Simulate random success/failure for demo
              Math.random() > 0.2 ? resolve() : reject(new Error('Simulated network error'));
          }, 2000);
      });
  }
  
  showFormMessage(message, type) {
      // Remove existing messages
      const existingMessages = document.querySelectorAll('.form-message');
      existingMessages.forEach(msg => msg.remove());
      
      // Create new message
      const messageElement = document.createElement('div');
      messageElement.className = `form-message form-message-${type}`;
      messageElement.style.padding = '16px';
      messageElement.style.borderRadius = '8px';
      messageElement.style.marginBottom = '20px';
      messageElement.style.fontWeight = '500';
      messageElement.style.textAlign = 'center';
      
      if (type === 'success') {
          messageElement.style.background = 'rgba(34, 197, 94, 0.1)';
          messageElement.style.border = '1px solid rgba(34, 197, 94, 0.3)';
          messageElement.style.color = '#22c55e';
      } else {
          messageElement.style.background = 'rgba(239, 68, 68, 0.1)';
          messageElement.style.border = '1px solid rgba(239, 68, 68, 0.3)';
          messageElement.style.color = '#ef4444';
      }
      
      messageElement.textContent = message;
      
      // Insert message at the top of the form
      const form = document.querySelector('.contact-form');
      if (form) {
          form.insertBefore(messageElement, form.firstChild);
          
          // Auto-remove message after 5 seconds
          setTimeout(() => {
              messageElement.remove();
          }, 5000);
      }
  }
  
  // Hover Effects
  setupHoverEffects() {
      // Add hover class to interactive elements
      const interactiveElements = document.querySelectorAll('.service-card, .portfolio-card, .info-card, .btn-primary, .btn-secondary');
      
      interactiveElements.forEach(element => {
          element.addEventListener('mouseenter', () => {
              element.style.transform = 'translateY(-5px)';
          });
          
          element.addEventListener('mouseleave', () => {
              element.style.transform = 'translateY(0)';
          });
      });
  }
  
  // Performance Optimizations
  setupPerformanceOptimizations() {
      // Lazy load images
      this.setupLazyLoading();
      
      // Preload critical resources
      this.preloadResources();
  }
  
  setupLazyLoading() {
      if ('IntersectionObserver' in window) {
          const imageObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      imageObserver.unobserve(img);
                  }
              });
          });
          
          document.querySelectorAll('img[data-src]').forEach(img => {
              imageObserver.observe(img);
          });
      }
  }
  
  preloadResources() {
      // Preload critical images
      const criticalImages = [
          './assets/img/logo.svg'
      ];
      
      criticalImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
      });
  }
  
  // Utility Methods
  debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  }
  
  throttle(func, limit) {
      let inThrottle;
      return function() {
          const args = arguments;
          const context = this;
          if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
          }
      }
  }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ClassicBrandWebsite();
});

// Handle page load completion
window.addEventListener('load', () => {
  // Remove loading states if any
  document.body.classList.add('loaded');
  
  // Add loaded class to trigger any load animations
  setTimeout(() => {
      document.body.classList.add('fully-loaded');
  }, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
      document.body.classList.add('page-hidden');
  } else {
      document.body.classList.remove('page-hidden');
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('Website error:', e.error);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClassicBrandWebsite;
}