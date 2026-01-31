        function initParticleSystem(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            let particles = [];

            function resizeCanvas() {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                initParticles();
            }
            window.addEventListener('resize', resizeCanvas);

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                    this.speedX = (Math.random() - 0.5) * 0.5;
                    this.speedY = (Math.random() - 0.5) * 0.5;
                    this.opacity = Math.random() * 0.5 + 0.2;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x > canvas.width) this.x = 0;
                    else if (this.x < 0) this.x = canvas.width;
                    if (this.y > canvas.height) this.y = 0;
                    else if (this.y < 0) this.y = canvas.height;
                }
                draw() {
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fillRect(this.x, this.y, this.size, this.size);
                }
            }

            function initParticles() {
                particles = [];
                const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
                for (let i = 0; i < particleCount; i++) {
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

            resizeCanvas();
            animateParticles();
        }

        initParticleSystem('particle-canvas');
        initParticleSystem('particle-canvas-2');

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate(
                { left: `${posX}px`, top: `${posY}px` },
                { duration: 500, fill: "forwards" }
            );
        });

        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({ paused: true });

        tl.to('.hero-title', {
            y: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.2
        })
        .to('.hero-subtitle', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        }, "-=1")
        .to('.hero-text', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8");

        // Preloader Logic
        function startPreloader() {
            const preloaderText = document.getElementById('preloader-text');
            const preloader = document.querySelector('.preloader');

            if (!preloaderText || !preloader) {
                // If preloader elements are missing, just play hero animation
                tl.play();
                return;
            }

            let progress = { value: 0 };
            
            gsap.to(progress, {
                value: 100,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    preloaderText.textContent = Math.round(progress.value) + '%';
                },
                onComplete: () => {
                    gsap.to(preloader, {
                        y: '-100%',
                        duration: 1,
                        ease: "power4.inOut",
                        onComplete: () => {
                            preloader.style.display = 'none';
                            tl.play(); // trigger hero animation
                        }
                    });
                }
            });
        }
        
        startPreloader();

        const rocketTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#rocket-scroll-section",
                start: "top top",
                end: "+=4000",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    gsap.to("#scrolling-rocket", {
                        rotation: self.direction === -1 ? 180 : 0,
                        duration: 0.5,
                        overwrite: "auto"
                    });
                }
            }
        });

        rocketTl
            .fromTo("#scrolling-rocket",
                { y: "120vh", scale: 0.5, opacity: 0 },
                { y: "0%", scale: 1, opacity: 1, duration: 1, ease: "power2.out" }
            )
            .to("#scrolling-rocket", {
                scale: 1.4,
                duration: 2,
                ease: "none"
            })
            .to("#scrolling-rocket", {
                y: "-150vh",
                scale: 1.2,
                duration: 1,
                ease: "power2.in"
            });

        gsap.fromTo('.reveal-text',
            { opacity: 0.2, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.reveal-text',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scrub: false
                }
            }
        );

        gsap.to('.footer-text', {
            y: 0,
            duration: 0.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 60%',
            }
        });

        // --- Our Progress Section Animation ---
        const progressSection = document.querySelector('#our-progress');
        if (progressSection) {
            const progressEvents = document.querySelectorAll('.progress-event');
            const yearMarkers = document.querySelectorAll('.year-marker');
            const progressLine = document.querySelector('#progress-line');
            
            // Set initial states for events
            gsap.set(progressEvents, { opacity: 0, y: 100, scale: 0.95, display: 'none' });

            const totalEvents = progressEvents.length;
            const isMobile = window.innerWidth < 768;
            
            // Main Timeline
            const progressTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#our-progress",
                    start: "top top",
                    end: isMobile ? "+=3000" : "+=6000", // Shorter scroll distance on mobile
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        // Update Bar Width
                        const progress = self.progress;
                        gsap.set(progressLine, { width: `${progress * 100}%` });

                        // Update Markers based on progress slice
                        // Divide progress 0-1 into 'totalEvents' segments
                        const activeIndex = Math.min(Math.floor(progress * totalEvents), totalEvents - 1);
                        
                        yearMarkers.forEach((marker, idx) => {
                            if (idx < activeIndex) {
                                // Past
                                gsap.to(marker, { 
                                    scale: 1, 
                                    backgroundColor: "#000", 
                                    borderColor: "#fff", 
                                    color: "#fff", 
                                    duration: 0.3,
                                    overwrite: 'auto'
                                });
                            } else if (idx === activeIndex) {
                                // Current
                                gsap.to(marker, { 
                                    scale: 1.5, 
                                    backgroundColor: "#fff", 
                                    borderColor: "#fff", 
                                    color: "#000", 
                                    duration: 0.3,
                                    overwrite: 'auto'
                                });
                            } else {
                                // Future
                                gsap.to(marker, { 
                                    scale: 1, 
                                    backgroundColor: "#000", 
                                    borderColor: "rgba(255,255,255,0.2)", 
                                    color: "#4b5563", 
                                    duration: 0.3,
                                    overwrite: 'auto'
                                });
                            }
                        });
                    }
                }
            });

            progressEvents.forEach((event, i) => {
                // Timeline Sequence
                // 1. Enter
                progressTl.set(event, { display: 'grid' }) // 'grid' because of Tailwind class
                          .to(event, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' })
                          
                // 2. Hold (Duration determines how long it stays pinned vs scrolling to next)
                          .to(event, { duration: 2 });
                
                // 3. Exit (except last item)
                if (i < progressEvents.length - 1) {
                    progressTl.to(event, { 
                        opacity: 0, 
                        y: -50, 
                        scale: 0.9, 
                        duration: 1, 
                        ease: 'power2.in',
                        display: 'none' 
                    });
                }
            });
        }
