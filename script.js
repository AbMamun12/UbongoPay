// UbongoPay Premium Interactions
document.addEventListener('DOMContentLoaded', function() {
    // 1. Particle Background System
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    // 2. GSAP Reveal Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    const tl = gsap.timeline();
    tl.from(".logo-text", { y: -50, opacity: 0, duration: 1, ease: "expo.out" })
      .from(".hero h1", { y: 100, opacity: 0, duration: 1.2, ease: "expo.out" }, "-=0.6")
      .from(".hero p", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .from(".hero-btns", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8");

    // Section Reveals
    gsap.utils.toArray('.fade-in').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out"
        });
    });

    // Feature Items Stagger
    gsap.fromTo(".feature-item", 
        { y: 60, opacity: 0 },
        {
            scrollTrigger: {
                trigger: ".feature-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "expo.out",
            onComplete: () => ScrollTrigger.refresh()
        }
    );

    // 3. Carousel Logic
    const gallery = document.querySelector('.screenshot-gallery');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn && nextBtn && gallery) {
        nextBtn.addEventListener('click', () => {
            gallery.scrollBy({ left: 350, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            gallery.scrollBy({ left: -350, behavior: 'smooth' });
        });
    }

    // 4. Lightbox Refined with Expansion Animation
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    let lastClickedItem = null;

    document.querySelectorAll('.screenshot-item').forEach(item => {
        item.addEventListener('click', () => {
            lastClickedItem = item;
            const img = item.querySelector('img');
            const rect = img.getBoundingClientRect();
            
            // Set source and show container (initially transparent)
            lightboxImg.src = img.src;
            gsap.set(lightbox, { display: 'flex', opacity: 0 });
            
            // Get final centered position by showing it briefly
            gsap.set(lightboxImg, { clearProps: "all" });
            const finalRect = lightboxImg.getBoundingClientRect();
            
            // Shared Element Transition (FLIP)
            gsap.fromTo(lightboxImg, 
                {
                    x: rect.left - finalRect.left,
                    y: rect.top - finalRect.top,
                    width: rect.width,
                    height: rect.height,
                    borderRadius: "30px"
                },
                {
                    x: 0,
                    y: 0,
                    width: finalRect.width,
                    height: finalRect.height,
                    borderRadius: "40px",
                    duration: 0.8,
                    ease: "expo.out"
                }
            );

            gsap.to(lightbox, { opacity: 1, duration: 0.5 });
        });
    });

    const closeLightbox = () => {
        if (!lastClickedItem) return;
        
        const img = lastClickedItem.querySelector('img');
        const rect = img.getBoundingClientRect();
        const finalRect = lightboxImg.getBoundingClientRect();

        gsap.to(lightboxImg, {
            x: rect.left - finalRect.left,
            y: rect.top - finalRect.top,
            width: rect.width,
            height: rect.height,
            borderRadius: "30px",
            duration: 0.6,
            ease: "power3.inOut"
        });

        gsap.to(lightbox, { 
            opacity: 0, 
            duration: 0.5, 
            onComplete: () => {
                lightbox.style.display = 'none';
                gsap.set(lightboxImg, { clearProps: "all" });
            }
        });
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, { duration: 1.5, scrollTo: target.offsetTop, ease: "power4.inOut" });
            }
        });
    });
});