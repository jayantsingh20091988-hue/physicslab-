/* =========================================================
   PHYSICS LAB — MECHANICS UNIT HOME
   ========================================================= */


/* =========================================================
   BACKGROUND PARTICLES / SPARKS
   ========================================================= */

const backgroundCanvas =
    document.getElementById("mechanics-background");

const bgCtx =
    backgroundCanvas?.getContext("2d");

let particles = [];

function resizeBackground() {

    if (!backgroundCanvas) return;

    const dpr =
        Math.min(window.devicePixelRatio || 1, 2);

    backgroundCanvas.width =
        window.innerWidth * dpr;

    backgroundCanvas.height =
        window.innerHeight * dpr;

    backgroundCanvas.style.width =
        window.innerWidth + "px";

    backgroundCanvas.style.height =
        window.innerHeight + "px";

    bgCtx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


function createParticles() {

    particles = [];

    const amount =
        Math.min(
            150,
            Math.floor(window.innerWidth / 9)
        );

    for (let i = 0; i < amount; i++) {

        particles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            radius:
                Math.random() * 1.8 + 0.3,

            speed:
                Math.random() * 0.35 + 0.08,

            drift:
                (Math.random() - 0.5) * 0.35,

            alpha:
                Math.random() * 0.65 + 0.15,

            twinkle:
                Math.random() * Math.PI * 2

        });
    }
}


function animateParticles(time = 0) {

    if (!bgCtx || !backgroundCanvas) return;

    bgCtx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    for (const particle of particles) {

        particle.y -= particle.speed;

        particle.x += particle.drift;

        particle.twinkle += 0.025;


        if (particle.y < -10) {

            particle.y =
                window.innerHeight + 10;

            particle.x =
                Math.random() *
                window.innerWidth;
        }


        if (particle.x < -10) {
            particle.x =
                window.innerWidth + 10;
        }

        if (particle.x > window.innerWidth + 10) {
            particle.x = -10;
        }


        const alpha =
            particle.alpha +
            Math.sin(particle.twinkle) * 0.15;


        bgCtx.beginPath();

        bgCtx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        bgCtx.fillStyle =
            `rgba(110, 220, 255, ${Math.max(0, alpha)})`;

        bgCtx.fill();


        /*
         * Small glowing spark
         */

        if (particle.radius > 1.35) {

            bgCtx.beginPath();

            bgCtx.moveTo(
                particle.x - 4,
                particle.y
            );

            bgCtx.lineTo(
                particle.x + 4,
                particle.y
            );

            bgCtx.moveTo(
                particle.x,
                particle.y - 4
            );

            bgCtx.lineTo(
                particle.x,
                particle.y + 4
            );

            bgCtx.strokeStyle =
                `rgba(130, 190, 255, ${alpha * 0.35})`;

            bgCtx.lineWidth = 0.5;

            bgCtx.stroke();
        }
    }


    requestAnimationFrame(animateParticles);
}


function startBackground() {

    resizeBackground();

    createParticles();

    animateParticles();
}


window.addEventListener(
    "resize",
    () => {

        resizeBackground();

        createParticles();

    }
);


/* =========================================================
   COUNTERS
   ========================================================= */

function animateCounter(element) {

    const target =
        element.dataset.target;

    if (target === "∞") {
        element.textContent = "∞";
        return;
    }

    const finalValue =
        Number(target);

    const duration = 1300;

    const startTime =
        performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) /
                duration,
                1
            );

        const eased =
            1 -
            Math.pow(1 - progress, 3);

        const value =
            Math.floor(
                eased * finalValue
            );

        element.textContent =
            value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent =
                finalValue;
        }
    }


    requestAnimationFrame(update);
}


function setupCounters() {

    const counters =
        document.querySelectorAll(".counter");

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting &&
                        !entry.target.dataset.counted
                    ) {

                        entry.target.dataset.counted =
                            "true";

                        animateCounter(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.6
            }
        );


    counters.forEach(counter => {

        observer.observe(counter);

    });
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupReveal() {

    const elements =
        document.querySelectorAll(".reveal");

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });
}


/* =========================================================
   CHAPTER SEARCH
   ========================================================= */

function setupChapterSearch() {

    const input =
        document.getElementById(
            "chapter-search"
        );

    const cards =
        document.querySelectorAll(
            ".chapter-card"
        );

    const noResults =
        document.getElementById(
            "no-results"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        () => {

            const search =
                input.value
                    .trim()
                    .toLowerCase();


            let visibleCards = 0;


            cards.forEach(card => {

                const text =
                    (
                        card.dataset.search +
                        " " +
                        card.textContent
                    )
                    .toLowerCase();


                const match =
                    text.includes(search);


                card.style.display =
                    match
                        ? ""
                        : "none";


                if (match) {
                    visibleCards++;
                }

            });


            if (noResults) {

                noResults.style.display =
                    visibleCards === 0
                        ? "block"
                        : "none";

            }

        }
    );
}


/* =========================================================
   CHAPTER CARD MOUSE TILT
   ========================================================= */

function setupCardTilt() {

    /*
     * Disable on touch devices.
     */

    if (
        window.matchMedia(
            "(hover: none)"
        ).matches
    ) {
        return;
    }


    const cards =
        document.querySelectorAll(
            ".chapter-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "pointermove",
            event => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;


                const rotateY =
                    ((x / rect.width) - 0.5) *
                    4;

                const rotateX =
                    ((y / rect.height) - 0.5) *
                    -4;


                card.style.transform =
                    `translateY(-10px)
                     perspective(1000px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;
            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                card.style.transform =
                    "";
            }
        );

    });
}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function setupSmoothLinks() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );

                    const target =
                        document.querySelector(
                            id
                        );


                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });
}


/* =========================================================
   PARALLAX HERO VISUAL
   ========================================================= */

function setupHeroParallax() {

    if (
        window.matchMedia(
            "(hover: none)"
        ).matches
    ) {
        return;
    }


    const heroVisual =
        document.querySelector(
            ".hero-visual"
        );


    if (!heroVisual) return;


    window.addEventListener(
        "pointermove",
        event => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    0.5);

            const y =
                (event.clientY /
                    window.innerHeight -
                    0.5);


            heroVisual.style.transform =
                `translate(
                    ${x * 10}px,
                    ${y * 10}px
                )`;
        }
    );
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setupActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }


                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                    });


                    const active =
                        document.querySelector(
                            `.nav-links a[href="#${entry.target.id}"]`
                        );


                    if (active) {

                        active.classList.add(
                            "active"
                        );
                    }

                });

            },
            {
                threshold: 0.45
            }
        );


    sections.forEach(section => {

        observer.observe(section);

    });
}


/* =========================================================
   TOPIC CLICK MICRO EFFECT
   ========================================================= */

function setupTopicEffects() {

    const topics =
        document.querySelectorAll(
            ".topic-list a"
        );


    topics.forEach(topic => {

        topic.addEventListener(
            "click",
            () => {

                topic.classList.add(
                    "topic-clicked"
                );

                setTimeout(
                    () => {

                        topic.classList.remove(
                            "topic-clicked"
                        );

                    },
                    250
                );

            }
        );

    });
}


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startBackground();

        setupCounters();

        setupReveal();

        setupChapterSearch();

        setupCardTilt();

        setupSmoothLinks();

        setupHeroParallax();

        setupActiveNavigation();

        setupTopicEffects();

    }
);