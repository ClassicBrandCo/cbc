// Elite Branding Main.js - Pro Features
document.addEventListener('DOMContentLoaded', () => {
    // GSAP Timeline for Hero Animations
    const heroTl = gsap.timeline();
    heroTl
        .from(".hero-bg", { opacity: 0, duration: 1 })
        .from("nav", { y: -100, opacity: 0, duration: 0.8 }, "-=0.5")
        .from("h1", { y: 50, opacity: 0, duration: 1 }, "-=0.3")
        .from("p", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from("a[href='#portfolio']", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3");

    // Scroll-triggered animations
    gsap.registerPlugin(ScrollTrigger);

    // Services section animation - trigger once
    gsap.from("#services .glass", {
        scrollTrigger: {
            trigger: "#services",
            start: "top 80%",
            toggleActions: "play none none none" // Only play once, no reverse
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Portfolio section animation - trigger once
    gsap.from("#portfolio .bento-item", {
        scrollTrigger: {
            trigger: "#portfolio",
            start: "top 80%",
            toggleActions: "play none none none" // Only play once, no reverse
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)"
    });

    // Footer animation - trigger once
    gsap.from("footer > div", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 90%",
            toggleActions: "play none none none" // Only play once, no reverse
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Magnetic hover effect for buttons
    document.querySelectorAll('.magnetic-hover').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    // Hover effect for Bento items (portfolio images)
    const portfolioItems = document.querySelectorAll('.bento-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('img'), { scale: 1.05, duration: 0.6 });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('img'), { scale: 1, duration: 0.6 });
        });
    });

    // Parallax effect for background elements
    gsap.to(".parallax-bg", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Enhanced glass hover effects
    document.querySelectorAll('.glass-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, {
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(246, 193, 78, 0.3)',
                duration: 0.3
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(246, 193, 78, 0.1)',
                duration: 0.3
            });
        });
    });

    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });

    // Performance optimization - throttle scroll events
    let scrollTimeout;
    const throttledScroll = () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                // Update scroll-based effects here
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
});
// Mobile menu toggle
const menuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}
