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
                    snap: {
                        snapTo: "labels",
                        duration: { min: 0.2, max: 0.6 },
                        delay: 0.1,
                        ease: "power1.inOut"
                    }
                },
                onUpdate: function() {
                    // Update Bar Width using timeline's progress, not ScrollTrigger's progress
                    const progress = this.progress();
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
            });

            progressEvents.forEach((event, i) => {
                // Timeline Sequence
                // 1. Enter
                progressTl.set(event, { display: 'grid' }) // 'grid' because of Tailwind class
                          .to(event, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' })
                          .addLabel(`slide-${i}`)

                // 2. Hold (Duration determines how long it stays pinned vs scrolling to next)
                          .to(event, { duration: i === progressEvents.length - 1 ? 3 : 2 });
                
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
//inspired by https://x.com/XorDev and https://x.com/lamps_apple
(function() {
      const canvas = document.getElementById('glcanvas');
      const gl = canvas.getContext('webgl');
      if (!gl) {
        alert("WebGL not supported");
        return;
      }

      // Vertex shader: simple pass-through of positions.
      const vsSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      // Fragment shader: computes a background image layer and an animated layer,
      // then blends them (animation on top at 50% opacity), with brightness boosting.
      const fsSource = `
        precision mediump float;
        uniform float t;
        uniform vec2 r;  // resolution
        
        // Custom tanh function for vec2 since built-in tanh is unavailable in WebGL GLSL.
        vec2 myTanh(vec2 x) {
          vec2 ex = exp(x);
          vec2 emx = exp(-x);
          return (ex - emx) / (ex + emx);
        }
        
        void main() {
          vec4 o_bg = vec4(0.0);
          vec4 o_anim = vec4(0.0);

          // ---------------------------
          // Background (Image) Layer
          // ---------------------------
          {
            // Use gl_FragCoord.xy (pixel coordinates).
            vec2 p_img = (gl_FragCoord.xy * 2.0 - r) / r.y * mat2(1.0, -1.0, 1.0, 1.0);
            vec2 l_val = myTanh(p_img * 5.0 + 2.0);
            l_val = min(l_val, l_val * 3.0);
            vec2 clamped = clamp(l_val, -2.0, 0.0);
            float diff_y = clamped.y - l_val.y;
            // Avoid division by zero with a small epsilon:
            float safe_px = abs(p_img.x) < 0.001 ? 0.001 : p_img.x;
            float term = (0.1 - max(0.01 - dot(p_img, p_img) / 200.0, 0.0) * (diff_y / safe_px))
                         / abs(length(p_img) - 0.7);
            o_bg += vec4(term);
            // Ensure non-negative values:
            o_bg *= max(o_bg, vec4(0.0));
          }

          // ---------------------------
          // Foreground (Animation) Layer
          // ---------------------------
          {
            vec2 p_anim = (gl_FragCoord.xy * 2.0 - r) / r.y / 0.7;
            vec2 d = vec2(-1.0, 1.0);
            float denom = 0.1 + 5.0 / dot(5.0 * p_anim - d, 5.0 * p_anim - d);
            vec2 c = p_anim * mat2(1.0, 1.0, d.x / denom, d.y / denom);
            vec2 v = c;
            // Apply a time-varying transformation:
            v *= mat2(cos(log(length(v)) + t * 0.2 + vec4(0.0, 33.0, 11.0, 0.0))) * 5.0;
            vec4 animAccum = vec4(0.0);
            for (int i = 1; i <= 9; i++) {
              float fi = float(i);
              animAccum += sin(vec4(v.x, v.y, v.y, v.x)) + vec4(1.0);
              v += 0.7 * sin(vec2(v.y, v.x) * fi + t) / fi + 0.5;
            }
            vec4 animTerm = 1.0 - exp(-exp(c.x * vec4(0.6, -0.4, -1.0, 0.0))
                              / animAccum
                              / (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0, 2.0))
                              / (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c)))
                              / (0.03 + abs(length(p_anim) - 0.7)) * 0.2);
            o_anim += animTerm;
          }

          // ---------------------------
          // Blend Layers: animation at 50% opacity over image.
          // Boost brightness so output isn't pitch black.
          // ---------------------------
          vec4 finalColor = mix(o_bg, o_anim, 0.5) * 1.5;
          finalColor = clamp(finalColor, 0.0, 1.0);
          gl_FragColor = finalColor;
        }
      `;

      // Shader compilation utility.
      function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Shader compile failed with: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }

      // Program creation utility.
      function createProgram(gl, vsSource, fsSource) {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error('Program failed to link: ' + gl.getProgramInfoLog(program));
          gl.deleteProgram(program);
          return null;
        }
        return program;
      }

      const program = createProgram(gl, vsSource, fsSource);
      gl.useProgram(program);

      // Get attribute and uniform locations.
      const positionLocation = gl.getAttribLocation(program, 'a_position');
      const timeLocation = gl.getUniformLocation(program, 't');
      const resolutionLocation = gl.getUniformLocation(program, 'r');

      // Set up a full-screen quad.
      const vertices = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Resize canvas.
      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
      window.addEventListener('resize', resize);
      resize();

      let startTime = performance.now();
      // Render loop.
      function render() {
        let currentTime = performance.now();
        let delta = (currentTime - startTime) / 1000;
        gl.uniform1f(timeLocation, delta);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();