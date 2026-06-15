/**
 * VCA Systems - Visão, Clareza e Ação
 * Vanilla JS Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Intro / Splash — mostra a animação do logo e depois revela o site
    const intro = document.getElementById('intro');
    if (intro) {
        document.body.style.overflow = 'hidden';
        const finishIntro = () => {
            if (intro.classList.contains('hide')) return;
            intro.classList.add('hide');
            document.body.style.overflow = '';
            setTimeout(() => { if (intro.parentNode) intro.remove(); }, 900);
        };
        setTimeout(finishIntro, 2200);
        // Segurança: garante remoção mesmo se algo atrasar
        window.addEventListener('load', () => setTimeout(finishIntro, 2400));
    }

    // 1. Initialize Lucide Icons
    const initIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        } else {
            setTimeout(initIcons, 100);
        }
    };
    initIcons();

    // 2. Intelligent Video Playback (Play only when in viewport, pause when out)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(error => {
                    console.log("Auto-play prevented: ", error);
                });
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });

    // 3. Set Current Year in Footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 3. Scroll Reveal Animation with Dynamic Staggering
    const observerOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before entering viewport
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const parent = target.parentElement;
                
                // Automatically stagger reveal delay for elements inside grids/lists
                const staggerParents = [
                    'services-grid', 'portfolio-grid', 'dores-list', 'processo-grid',
                    'problems-grid', 'steps-grid', 'ninety-grid', 'testimonials-grid',
                    'pricing-grid', 'footer-grid', 'faq-list', 'trinity-list'
                ];
                if (parent && staggerParents.some(c => parent.classList.contains(c))) {
                    const siblings = Array.from(parent.children).filter(el => el.hasAttribute('data-animate'));
                    const index = siblings.indexOf(target);
                    if (index !== -1) {
                        target.style.transitionDelay = `${index * 0.09}s`;
                    }
                }
                
                target.classList.add('visible');
                revealObserver.unobserve(target); // Optimize: stop observing once animated
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. (Removido) Efeito Tilt 3D — substituído por hover/elevação suave via CSS

    // 5. Navbar Background Transition
    const navbar = document.querySelector('.navbar');
    const handleNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };
    window.addEventListener('scroll', handleNavbar, { passive: true });
    handleNavbar(); // Initial check

    // 6. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 7. Particle Network Effect - Disabled on Mobile for Performance
    const canvas = document.getElementById('particleCanvas');
    const isMobile = window.innerWidth <= 1024;
    
    if (canvas && !isMobile) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 35; // Optimized count for 60fps scroll performance
        const mouse = { x: null, y: null, radius: 150 };
        let pulseActive = false;
        let pulseIntensity = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 200);
        }, { passive: true });
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('click', () => {
            pulseActive = true;
            pulseIntensity = 1;
            const fadePulse = () => {
                pulseIntensity -= 0.05;
                if (pulseIntensity > 0) {
                    requestAnimationFrame(fadePulse);
                } else {
                    pulseActive = false;
                }
            };
            fadePulse();
        }, { passive: true });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.0 + 1.5;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
            }

            draw() {
                ctx.fillStyle = pulseActive ? `rgba(226, 185, 60, ${0.6 + pulseIntensity * 0.4})` : 'rgba(226, 185, 60, 0.6)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distSq = dx * dx + dy * dy;
                    let radSq = mouse.radius * mouse.radius;
                    
                    if (distSq < radSq) {
                        let distance = Math.sqrt(distSq);
                        if (distance > 0) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            this.x -= (dx / distance) * force * 3;
                            this.y -= (dy / distance) * force * 3;
                        }
                    }
                }
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;
                    const maxDist = pulseActive ? 200 + (pulseIntensity * 100) : 150;
                    const maxDistSq = maxDist * maxDist;

                    if (distSq < maxDistSq) {
                        const distance = Math.sqrt(distSq); // Only calculate sqrt when line is drawn
                        const opacity = (1 - (distance / maxDist)) * (pulseActive ? 0.6 + pulseIntensity * 0.4 : 0.4);
                        ctx.strokeStyle = `rgba(226, 185, 60, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    } else if (canvas) {
        canvas.remove(); // Remove from DOM on mobile
    }

    // 8. Typewriter Effect for Founders
    const typeElements = document.querySelectorAll('.typewriter');
    
    const typeWriter = (el) => {
        const text = el.getAttribute('data-text');
        if (!text) return;
        
        el.textContent = '';
        el.classList.add('typing');
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, Math.random() * 50 + 20); // Variable speed for realism
            } else {
                el.classList.remove('typing');
                el.classList.add('typed-done');
            }
        };
        setTimeout(type, 500); // Initial delay
    };

    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                entry.target.classList.add('typed');
                typeWriter(entry.target);
            }
        });
    }, { threshold: 0.2 });

    typeElements.forEach(el => typeObserver.observe(el));

    // Handle Hover States
    const interactiveElements = document.querySelectorAll('a, button, .tilt-surface, .social-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // 9. Premium Popup for Notion Form
    window.openNotionForm = () => {
        const url = 'https://mousy-bramble-971.notion.site/3566113b1f3780d29088c97182c8f0ec';
        const width = 800;
        const height = 900;
        
        // Calculate centered position
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);
        
        const popupOptions = `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`;
        
        const popup = window.open(url, 'VCA_Selection_Portal', popupOptions);
        
        if (popup) {
            popup.focus();
        } else {
            // Fallback for popup blockers
            window.open(url, '_blank');
        }
    };

    // 10. Mobile Menu Logic
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = (show) => {
        if (show) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
    }

    if (menuClose) {
        menuClose.addEventListener('click', () => toggleMenu(false));
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // 11. 90-Days Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === targetId);
            });
        });
    });

    // 12. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(other => {
                other.classList.remove('open');
                const a = other.querySelector('.faq-answer');
                if (a) a.style.maxHeight = null;
            });

            // Open clicked (if it was closed)
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
});
