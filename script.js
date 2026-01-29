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

        const tl = gsap.timeline();

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

        const rocketTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#rocket-scroll-section",
                start: "top top",
                end: "+=4000",
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        rocketTl
            .fromTo("#scrolling-rocket",
                { y: "120vh", scale: 0.5, opacity: 0 },
                { y: "0%", scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
            )
            .to("#scrolling-rocket", {
                scale: 1.4,
                duration: 6,
                ease: "none"
            })
            .to("#scrolling-rocket", {
                y: "-150vh",
                scale: 1.2,
                duration: 2,
                ease: "power2.in"
            });

        gsap.fromTo('.reveal-text',
            { opacity: 0.2, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
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
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 60%',
            }
        });
