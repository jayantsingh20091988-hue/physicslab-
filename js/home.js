/* =========================================================
   PHYSICS LAB — HOMEPAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const header =
        document.querySelector(".site-header");

    const mobileButton =
        document.getElementById("mobile-menu-button");

    const mainNav =
        document.getElementById("main-nav");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const revealElements =
        document.querySelectorAll(
            ".section-heading, .class-card, .feature-card, .why-card, .method-panel, .feedback-card, .share-panel, .creator-card, .faq-list"
        );


    /* =====================================================
       HEADER SCROLL
    ====================================================== */

    const updateHeader = () => {

        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    if (mobileButton && mainNav) {

        mobileButton.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            mobileButton.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                mobileButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id =
                        entry.target.getAttribute("id");

                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );

                        if (
                            link.getAttribute("href") ===
                            `#${id}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                });

            },
            {
                rootMargin:
                    "-35% 0px -55% 0px"
            }
        );


    sections.forEach(section => {

        navObserver.observe(section);

    });


    /* =====================================================
       COMING SOON CLASS BUTTONS
    ====================================================== */

    const comingSoonButtons =
        document.querySelectorAll(
            ".coming-soon"
        );


    comingSoonButtons.forEach(button => {

        button.addEventListener("click", () => {

            const classNumber =
                button.dataset.class;

            showMessage(
                `Class ${classNumber} is being built. More chapters are coming soon.`
            );

        });

    });


    /* =====================================================
       SHARE BUTTON
    ====================================================== */

    const shareButton =
        document.getElementById(
            "share-button"
        );


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            async () => {

                const shareData = {

                    title:
                        "Physics Lab",

                    text:
                        "Explore Physics Lab — understand physics through concepts, experiments and simulations.",

                    url:
                        window.location.href

                };


                try {

                    if (
                        navigator.share
                    ) {

                        await navigator.share(
                            shareData
                        );

                    } else {

                        await copyToClipboard(
                            window.location.href
                        );

                        showCopyStatus(
                            "Link copied!"
                        );

                    }

                } catch (error) {

                    /*
                     * The user may simply close
                     * the native share dialog.
                     */

                }

            }
        );

    }


    /* =====================================================
       COPY LINK
    ====================================================== */

    const copyButton =
        document.getElementById(
            "copy-link-button"
        );

    const copyStatus =
        document.getElementById(
            "copy-status"
        );


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            async () => {

                const success =
                    await copyToClipboard(
                        window.location.href
                    );


                if (success) {

                    if (copyStatus) {

                        copyStatus.textContent =
                            "Link copied.";

                        setTimeout(() => {

                            copyStatus.textContent =
                                "";

                        }, 2500);

                    }

                }

            }
        );

    }


    /* =====================================================
       FEEDBACK FORM
    ====================================================== */

    const feedbackForm =
        document.getElementById(
            "feedback-form"
        );


    if (feedbackForm) {

        feedbackForm.addEventListener(
            "submit",
            event => {

                const action =
                    feedbackForm.getAttribute(
                        "action"
                    );


                /*
                 * Prevent accidental submission
                 * while YOUR_FORM_ID is still
                 * being used.
                 */

                if (
                    !action ||
                    action.includes(
                        "YOUR_FORM_ID"
                    )
                ) {

                    event.preventDefault();

                    showMessage(
                        "Feedback form is ready. Connect it to your form service before publishing submissions."
                    );

                    return;

                }

            }
        );

    }


    /* =====================================================
       PHYSICS FIELD CANVAS
    ====================================================== */

    setupPhysicsField();


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    const yearElement =
        document.getElementById(
            "current-year"
        );


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       HELPERS
    ====================================================== */

    function showMessage(message) {

        let toast =
            document.querySelector(
                ".physics-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

            toast.className =
                "physics-toast";

            document.body.appendChild(
                toast
            );

        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3200);

    }


    async function copyToClipboard(text) {

        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    text
                );

                return true;

            }


            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.value = text;

            textarea.style.position =
                "fixed";

            textarea.style.opacity =
                "0";

            document.body.appendChild(
                textarea
            );

            textarea.focus();
            textarea.select();

            const success =
                document.execCommand(
                    "copy"
                );

            textarea.remove();

            return success;

        } catch (error) {

            return false;

        }

    }


    function showCopyStatus(message) {

        if (copyStatus) {

            copyStatus.textContent =
                message;

            setTimeout(() => {

                copyStatus.textContent =
                    "";

            }, 2500);

        }

    }


    /* =====================================================
       PHYSICS PARTICLE FIELD
    ====================================================== */

    function setupPhysicsField() {

        const canvas =
            document.getElementById(
                "physics-field"
            );


        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext("2d");


        let width = 0;
        let height = 0;
        let particles = [];


        const particleCount =
            window.innerWidth < 600
                ? 30
                : 55;


        function resize() {

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );


            width =
                canvas.clientWidth;

            height =
                canvas.clientHeight;


            canvas.width =
                width * dpr;

            canvas.height =
                height * dpr;


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );

        }


        function createParticles() {

            particles =
                [];


            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                particles.push({

                    x:
                        Math.random() * width,

                    y:
                        Math.random() * height,

                    vx:
                        (Math.random() - 0.5) *
                        0.15,

                    vy:
                        (Math.random() - 0.5) *
                        0.15,

                    radius:
                        Math.random() * 1.4 +
                        0.4

                });

            }

        }


        function draw() {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            particles.forEach(
                particle => {

                    particle.x +=
                        particle.vx;

                    particle.y +=
                        particle.vy;


                    if (
                        particle.x < 0 ||
                        particle.x > width
                    ) {

                        particle.vx *= -1;

                    }


                    if (
                        particle.y < 0 ||
                        particle.y > height
                    ) {

                        particle.vy *= -1;

                    }


                    ctx.beginPath();

                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.radius,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        "rgba(67,217,255,0.38)";

                    ctx.fill();

                }
            );


            for (
                let i = 0;
                i < particles.length;
                i++
            ) {

                for (
                    let j = i + 1;
                    j < particles.length;
                    j++
                ) {

                    const a =
                        particles[i];

                    const b =
                        particles[j];


                    const dx =
                        a.x - b.x;

                    const dy =
                        a.y - b.y;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance < 130
                    ) {

                        const opacity =
                            (1 -
                                distance / 130) *
                            0.08;


                        ctx.beginPath();

                        ctx.moveTo(
                            a.x,
                            a.y
                        );

                        ctx.lineTo(
                            b.x,
                            b.y
                        );

                        ctx.strokeStyle =
                            `rgba(79,140,255,${opacity})`;

                        ctx.lineWidth =
                            1;

                        ctx.stroke();

                    }

                }

            }


            requestAnimationFrame(
                draw
            );

        }


        resize();

        createParticles();

        draw();


        window.addEventListener(
            "resize",
            () => {

                resize();

                createParticles();

            }
        );

    }

});