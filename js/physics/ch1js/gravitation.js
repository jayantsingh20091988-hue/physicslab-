/* =========================================================
   GRAVITATION — CHAPTER 06
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONSTANTS
       ===================================================== */

    const G = 6.67430e-11;
    const EARTH_RADIUS_KM = 6371;
    const EARTH_RADIUS_M = EARTH_RADIUS_KM * 1000;
    const EARTH_MASS = 5.972e24;
    const EARTH_G = 9.81;

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (id) => document.getElementById(id);

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    const formatScientific = (value) => {

        if (!Number.isFinite(value)) {
            return "0";
        }

        if (value === 0) {
            return "0";
        }

        return value.toExponential(3);
    };

    const resizeCanvas = (canvas, ctx) => {

        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* =====================================================
       SPARK / CHINGARI BACKGROUND
       ===================================================== */

    const sparkCanvas = $("spark-background");

    if (sparkCanvas) {

        const ctx = sparkCanvas.getContext("2d");

        let sparks = [];

        const createSparks = () => {

            sparks = [];

            const count = Math.min(
                120,
                Math.max(45, Math.floor(window.innerWidth / 12))
            );

            for (let i = 0; i < count; i++) {

                sparks.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 2.3 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.35,
                    speedY: -Math.random() * 0.45 - 0.08,
                    life: Math.random(),
                    glow: Math.random()
                });
            }
        };

        const resizeSparkCanvas = () => {

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            sparkCanvas.width = window.innerWidth * dpr;
            sparkCanvas.height = window.innerHeight * dpr;

            sparkCanvas.style.width = `${window.innerWidth}px`;
            sparkCanvas.style.height = `${window.innerHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createSparks();
        };

        const animateSparks = () => {

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );

            sparks.forEach((spark) => {

                spark.x += spark.speedX;
                spark.y += spark.speedY;
                spark.life += 0.003;

                if (
                    spark.y < -10 ||
                    spark.life > 1.2
                ) {
                    spark.x = Math.random() * window.innerWidth;
                    spark.y = window.innerHeight + 10;
                    spark.life = 0;
                }

                const alpha =
                    0.2 +
                    Math.sin(spark.life * Math.PI) * 0.7;

                ctx.beginPath();

                ctx.arc(
                    spark.x,
                    spark.y,
                    spark.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    spark.glow > 0.7
                        ? `rgba(34,211,238,${alpha})`
                        : spark.glow > 0.4
                            ? `rgba(168,85,247,${alpha})`
                            : `rgba(250,204,21,${alpha})`;

                ctx.shadowBlur = 12;
                ctx.shadowColor = ctx.fillStyle;

                ctx.fill();

                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animateSparks);
        };

        resizeSparkCanvas();
        animateSparks();

        window.addEventListener("resize", resizeSparkCanvas);
    }


    /* =====================================================
       GRAVITY FORCE SIMULATOR
       ===================================================== */

    const mass1Slider = $("mass1-slider");
    const mass2Slider = $("mass2-slider");
    const distanceSlider = $("distance-slider");

    const mass1Value = $("mass1-value");
    const mass2Value = $("mass2-value");
    const distanceValue = $("distance-value");

    const gravityForceResult = $("gravity-force-result");
    const massProductResult = $("mass-product-result");
    const distanceSquareResult = $("distance-square-result");

    const gravityCanvas = $("gravity-canvas");

    let gravityAnimation = 0;

    const updateGravitySimulator = () => {

        if (
            !mass1Slider ||
            !mass2Slider ||
            !distanceSlider
        ) {
            return;
        }

        const m1 = Number(mass1Slider.value);
        const m2 = Number(mass2Slider.value);
        const r = Number(distanceSlider.value);

        const force = G * m1 * m2 / (r * r);

        mass1Value.textContent = m1;
        mass2Value.textContent = m2;
        distanceValue.textContent = r;

        massProductResult.textContent =
            `${(m1 * m2).toFixed(0)} kg²`;

        distanceSquareResult.textContent =
            `${(r * r).toFixed(0)} m²`;

        gravityForceResult.textContent =
            `${formatScientific(force)} N`;

        const why = $("gravity-why");

        if (why) {

            if (r >= 20) {

                why.textContent =
                    "Distance is large, so the inverse-square effect makes the gravitational force very small.";

            } else if (m1 >= 70 && m2 >= 70) {

                why.textContent =
                    "Both masses are large. Because F is proportional to m₁m₂, increasing either mass increases the force.";

            } else {

                why.textContent =
                    `Current relationship: F = G × (${m1}) × (${m2}) / (${r})². ` +
                    "Try doubling the distance and notice how strongly the force falls.";
            }
        }

        drawGravityExperiment(m1, m2, r);
    };

    const drawArrow = (
        ctx,
        x1,
        y1,
        x2,
        y2,
        color,
        width = 3
    ) => {

        const angle = Math.atan2(y2 - y1, x2 - x1);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const size = 9;

        ctx.beginPath();

        ctx.moveTo(x2, y2);

        ctx.lineTo(
            x2 - size * Math.cos(angle - Math.PI / 6),
            y2 - size * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            x2 - size * Math.cos(angle + Math.PI / 6),
            y2 - size * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();
        ctx.fill();
    };

    const drawGravityExperiment = (m1, m2, r) => {

        if (!gravityCanvas) return;

        const ctx = gravityCanvas.getContext("2d");
        resizeCanvas(gravityCanvas, ctx);

        const width = gravityCanvas.clientWidth;
        const height = gravityCanvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        const centerY = height / 2;

        const leftX = width * 0.22;
        const rightX = width * 0.78;

        const minRadius = 18;
        const maxRadius = 65;

        const radius1 =
            minRadius +
            (m1 / 100) * (maxRadius - minRadius);

        const radius2 =
            minRadius +
            (m2 / 100) * (maxRadius - minRadius);

        /* distance guide */

        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = "rgba(148,163,184,0.35)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(leftX, centerY);
        ctx.lineTo(rightX, centerY);
        ctx.stroke();

        ctx.setLineDash([]);

        /* objects */

        const drawBody = (
            x,
            y,
            radius,
            color,
            label
        ) => {

            const gradient =
                ctx.createRadialGradient(
                    x - radius * 0.3,
                    y - radius * 0.3,
                    2,
                    x,
                    y,
                    radius
                );

            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(0.18, color);
            gradient.addColorStop(1, "rgba(2,6,23,0.9)");

            ctx.fillStyle = gradient;

            ctx.shadowBlur = 25;
            ctx.shadowColor = color;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 14px system-ui";
            ctx.textAlign = "center";
            ctx.fillText(label, x, y + radius + 24);
        };

        drawBody(
            leftX,
            centerY,
            radius1,
            "#22d3ee",
            `m₁ = ${m1} kg`
        );

        drawBody(
            rightX,
            centerY,
            radius2,
            "#fb923c",
            `m₂ = ${m2} kg`
        );

        /* attraction arrows */

        drawArrow(
            ctx,
            leftX + radius1 + 8,
            centerY - 10,
            leftX + radius1 + 55,
            centerY - 10,
            "#22d3ee",
            3
        );

        drawArrow(
            ctx,
            rightX - radius2 - 8,
            centerY + 10,
            rightX - radius2 - 55,
            centerY + 10,
            "#fb923c",
            3
        );

        /* distance label */

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";

        ctx.fillText(
            `r = ${r} m`,
            width / 2,
            centerY - 20
        );
    };

    [mass1Slider, mass2Slider, distanceSlider]
        .filter(Boolean)
        .forEach((slider) => {

            slider.addEventListener(
                "input",
                updateGravitySimulator
            );
        });

    const gravityReset = $("gravity-reset");

    if (gravityReset) {

        gravityReset.addEventListener("click", () => {

            mass1Slider.value = 10;
            mass2Slider.value = 10;
            distanceSlider.value = 10;

            updateGravitySimulator();
        });
    }

    updateGravitySimulator();


    /* =====================================================
       G / FREE-FALL SIMULATOR
       ===================================================== */

    const heightSlider = $("height-slider");
    const heightValue = $("height-value");
    const fallTimeValue = $("fall-time-value");
    const fallSpeedValue = $("fall-speed-value");
    const fallDistanceValue = $("fall-distance-value");

    const freefallCanvas = $("freefall-canvas");

    let freeFallRunning = false;
    let freeFallStart = 0;
    let freeFallHeight = 20;

    const drawFreeFall = (
        height,
        distance,
        speed
    ) => {

        if (!freefallCanvas) return;

        const ctx = freefallCanvas.getContext("2d");

        resizeCanvas(freefallCanvas, ctx);

        const width = freefallCanvas.clientWidth;
        const canvasHeight = freefallCanvas.clientHeight;

        ctx.clearRect(0, 0, width, canvasHeight);

        const groundY = canvasHeight - 65;
        const topY = 55;

        /* sky glow */

        const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            canvasHeight
        );

        gradient.addColorStop(0, "rgba(30,64,175,0.22)");
        gradient.addColorStop(1, "rgba(2,6,23,0.65)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, canvasHeight);

        /* ground */

        ctx.fillStyle = "#34d399";
        ctx.fillRect(
            0,
            groundY,
            width,
            canvasHeight - groundY
        );

        /* building / reference */

        const x = width / 2;

        ctx.strokeStyle = "rgba(148,163,184,0.3)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, groundY);
        ctx.stroke();

        /* height label */

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "14px system-ui";
        ctx.textAlign = "left";

        ctx.fillText(
            `Height = ${height.toFixed(1)} m`,
            20,
            30
        );

        /* object */

        const availableHeight = groundY - topY;

        const normalizedDistance =
            clamp(distance / height, 0, 1);

        const y =
            topY +
            normalizedDistance * availableHeight;

        const radius = 18;

        ctx.fillStyle = "#fb923c";
        ctx.shadowBlur = 25;
        ctx.shadowColor = "#fb923c";

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        /* velocity arrow */

        if (speed > 0.05) {

            drawArrow(
                ctx,
                x,
                y + radius + 10,
                x,
                y + radius + 55,
                "#facc15",
                4
            );
        }

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 14px system-ui";
        ctx.textAlign = "center";

        ctx.fillText(
            `${speed.toFixed(2)} m/s`,
            x,
            y - 30
        );
    };

    const updateFreeFallDisplay = (
        time,
        height
    ) => {

        const distance =
            0.5 * EARTH_G * time * time;

        const limitedDistance =
            Math.min(distance, height);

        const speed =
            Math.sqrt(
                2 * EARTH_G * limitedDistance
            );

        if (heightValue) {
            heightValue.textContent = height.toFixed(0);
        }

        if (fallTimeValue) {
            fallTimeValue.textContent = time.toFixed(2);
        }

        if (fallSpeedValue) {
            fallSpeedValue.textContent = speed.toFixed(2);
        }

        if (fallDistanceValue) {
            fallDistanceValue.textContent =
                limitedDistance.toFixed(2);
        }

        drawFreeFall(
            height,
            limitedDistance,
            speed
        );
    };

    if (heightSlider) {

        heightSlider.addEventListener("input", () => {

            freeFallHeight =
                Number(heightSlider.value);

            if (!freeFallRunning) {
                updateFreeFallDisplay(
                    0,
                    freeFallHeight
                );
            }
        });
    }

    const fallStart = $("fall-start");

    if (fallStart) {

        fallStart.addEventListener("click", () => {

            freeFallHeight =
                Number(heightSlider.value);

            freeFallRunning = true;
            freeFallStart = performance.now();

            const animateFall = (now) => {

                if (!freeFallRunning) return;

                const time =
                    (now - freeFallStart) / 1000;

                const fallTime =
                    Math.sqrt(
                        2 * freeFallHeight / EARTH_G
                    );

                const currentTime =
                    Math.min(time, fallTime);

                updateFreeFallDisplay(
                    currentTime,
                    freeFallHeight
                );

                if (time < fallTime) {

                    requestAnimationFrame(
                        animateFall
                    );

                } else {

                    freeFallRunning = false;
                }
            };

            requestAnimationFrame(animateFall);
        });
    }

    const fallReset = $("fall-reset");

    if (fallReset) {

        fallReset.addEventListener("click", () => {

            freeFallRunning = false;

            freeFallHeight = 20;

            if (heightSlider) {
                heightSlider.value = 20;
            }

            updateFreeFallDisplay(
                0,
                freeFallHeight
            );
        });
    }

    updateFreeFallDisplay(
        0,
        Number(heightSlider?.value || 20)
    );


    /* =====================================================
       MASS VS WEIGHT
       ===================================================== */

    const personMassSlider = $("person-mass-slider");
    const personMassValue = $("person-mass-value");
    const selectedWorld = $("selected-world");
    const weightResult = $("weight-result");
    const weightWhy = $("weight-why");

    const planetButtons =
        document.querySelectorAll(".planet-btn");

    let selectedG = 9.81;
    let selectedPlanet = "Earth";

    const updateWeight = () => {

        const mass =
            Number(personMassSlider?.value || 50);

        const weight =
            mass * selectedG;

        if (personMassValue) {
            personMassValue.textContent = mass;
        }

        if (selectedWorld) {
            selectedWorld.textContent =
                selectedPlanet;
        }

        if (weightResult) {
            weightResult.textContent =
                `${weight.toFixed(2)} N`;
        }

        if (weightWhy) {

            if (selectedPlanet === "Earth") {

                weightWhy.textContent =
                    `${mass} kg × 9.81 m/s² = ${weight.toFixed(2)} N. ` +
                    "Your mass stays the same, but Earth's g determines your weight.";

            } else {

                weightWhy.textContent =
                    `Your mass remains ${mass} kg. ` +
                    `${selectedPlanet} has g ≈ ${selectedG.toFixed(2)} m/s², ` +
                    `so your weight becomes ${weight.toFixed(2)} N.`;
            }
        }
    };

    planetButtons.forEach((button) => {

        button.addEventListener("click", () => {

            planetButtons.forEach((btn) =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            selectedG =
                Number(button.dataset.g);

            selectedPlanet =
                button.textContent.trim();

            updateWeight();
        });
    });

    if (personMassSlider) {

        personMassSlider.addEventListener(
            "input",
            updateWeight
        );
    }

    updateWeight();


    /* =====================================================
       ALTITUDE
       ===================================================== */

    const altitudeSlider = $("altitude-slider");

    const updateAltitude = () => {

        if (!altitudeSlider) return;

        const altitudeKm =
            Number(altitudeSlider.value);

        const altitudeM =
            altitudeKm * 1000;

        const r =
            EARTH_RADIUS_M + altitudeM;

        const g =
            G * EARTH_MASS / (r * r);

        const relative =
            (g / EARTH_G) * 100;

        $("altitude-value").textContent =
            altitudeKm.toFixed(0);

        $("earth-distance-result").textContent =
            `${(r / 1000).toFixed(0)} km`;

        $("altitude-g-result").textContent =
            `${g.toFixed(3)} m/s²`;

        $("relative-gravity-result").textContent =
            `${relative.toFixed(1)}%`;
    };

    if (altitudeSlider) {

        altitudeSlider.addEventListener(
            "input",
            updateAltitude
        );
    }

    updateAltitude();


    /* =====================================================
       DEPTH
       Educational simplified linear model
       ===================================================== */

    const depthSlider = $("depth-slider");
    const depthMarker = $("depth-marker");

    const updateDepth = () => {

        if (!depthSlider) return;

        const depth =
            Number(depthSlider.value);

        const fraction =
            depth / EARTH_RADIUS_KM;

        /*
            Simplified school-level model:
            g decreases approximately linearly
            toward the centre.
        */

        const g =
            EARTH_G * (1 - fraction);

        $("depth-value").textContent =
            depth.toFixed(0);

        $("depth-g-result").textContent =
            `${Math.max(g, 0).toFixed(3)} m/s²`;

        if (depthMarker) {

            const angle =
                -Math.PI / 2;

            const radius = 45;

            const normalized =
                clamp(fraction, 0, 1);

            /*
                Move marker from surface toward centre.
            */

            const x =
                50 + Math.cos(angle) * (45 * (1 - normalized));

            const y =
                50 + Math.sin(angle) * (45 * (1 - normalized));

            depthMarker.style.left = `${x}%`;
            depthMarker.style.top = `${y}%`;
        }

        const why = $("depth-why");

        if (why) {

            if (depth === 0) {

                why.textContent =
                    "At Earth's surface, gravitational acceleration is about 9.81 m/s².";

            } else if (depth < EARTH_RADIUS_KM / 2) {

                why.textContent =
                    "In this simplified model, the effective gravitational pull decreases as you move toward Earth's centre.";

            } else if (depth < EARTH_RADIUS_KM) {

                why.textContent =
                    "Closer to the centre, the net gravitational pull becomes smaller. At the exact centre, the pulls from all directions balance.";

            } else {

                why.textContent =
                    "At Earth's centre, the idealized net gravitational acceleration is zero.";
            }
        }
    };

    if (depthSlider) {

        depthSlider.addEventListener(
            "input",
            updateDepth
        );
    }

    updateDepth();


    /* =====================================================
       MOON ORBIT
       ===================================================== */

    const moonCanvas = $("moon-orbit-canvas");

    if (moonCanvas) {

        const ctx = moonCanvas.getContext("2d");

        let moonAngle = 0;

        const animateMoonOrbit = () => {

            resizeCanvas(moonCanvas, ctx);

            const width = moonCanvas.clientWidth;
            const height = moonCanvas.clientHeight;

            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            const orbitRadius =
                Math.min(width, height) * 0.31;

            /* orbit */

            ctx.strokeStyle =
                "rgba(34,211,238,0.25)";

            ctx.lineWidth = 2;

            ctx.setLineDash([7, 8]);

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                orbitRadius,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.setLineDash([]);

            /* Earth */

            const earthGradient =
                ctx.createRadialGradient(
                    cx - 20,
                    cy - 20,
                    5,
                    cx,
                    cy,
                    50
                );

            earthGradient.addColorStop(
                0,
                "#7dd3fc"
            );

            earthGradient.addColorStop(
                0.45,
                "#2563eb"
            );

            earthGradient.addColorStop(
                1,
                "#0f172a"
            );

            ctx.fillStyle = earthGradient;

            ctx.shadowBlur = 30;
            ctx.shadowColor =
                "rgba(34,211,238,0.5)";

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                50,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.shadowBlur = 0;

            /* Moon */

            const moonX =
                cx +
                Math.cos(moonAngle) *
                orbitRadius;

            const moonY =
                cy +
                Math.sin(moonAngle) *
                orbitRadius;

            ctx.fillStyle = "#e2e8f0";

            ctx.shadowBlur = 20;
            ctx.shadowColor =
                "rgba(226,232,240,0.6)";

            ctx.beginPath();

            ctx.arc(
                moonX,
                moonY,
                17,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.shadowBlur = 0;

            /* Gravity arrow */

            drawArrow(
                ctx,
                moonX,
                moonY,
                moonX + (cx - moonX) * 0.23,
                moonY + (cy - moonY) * 0.23,
                "#fb923c",
                3
            );

            /* Tangential velocity arrow */

            const tangentX =
                -Math.sin(moonAngle);

            const tangentY =
                Math.cos(moonAngle);

            drawArrow(
                ctx,
                moonX,
                moonY,
                moonX + tangentX * 55,
                moonY + tangentY * 55,
                "#facc15",
                3
            );

            ctx.fillStyle = "#cbd5e1";
            ctx.font = "13px system-ui";
            ctx.textAlign = "center";

            ctx.fillText(
                "Earth",
                cx,
                cy + 72
            );

            ctx.fillText(
                "Moon",
                moonX,
                moonY - 27
            );

            ctx.fillStyle = "#fb923c";

            ctx.fillText(
                "gravity",
                moonX + (cx - moonX) * 0.35,
                moonY + (cy - moonY) * 0.35
            );

            ctx.fillStyle = "#facc15";

            ctx.fillText(
                "forward motion",
                moonX + tangentX * 65,
                moonY + tangentY * 65
            );

            moonAngle += 0.006;

            requestAnimationFrame(
                animateMoonOrbit
            );
        };

        animateMoonOrbit();
    }


    /* =====================================================
       CHALLENGE
       ===================================================== */

    const challengeButtons =
        document.querySelectorAll(
            ".challenge-options button"
        );

    const challengeFeedback =
        $("challenge-feedback");

    challengeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const correct =
                button.dataset.answer === "correct";

            if (correct) {

                challengeFeedback.textContent =
                    "✓ Correct! If r becomes 3r, then F becomes F/3² = F/9.";

                challengeFeedback.style.color =
                    "#34d399";

            } else {

                challengeFeedback.textContent =
                    "Not quite. Remember: F ∝ 1/r². Try applying the square to 3.";

                challengeFeedback.style.color =
                    "#fb7185";
            }
        });
    });


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealItems =
        document.querySelectorAll(
            ".info-card, .law-card, .observation-box, " +
            ".application-grid article, .summary-card, " +
            ".orbit-step, .misconception, .compare-card"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.12
                }
            );

        revealItems.forEach((item) => {

            item.style.opacity = "0";
            item.style.transform =
                "translateY(22px)";
            item.style.transition =
                "opacity 0.65s ease, transform 0.65s ease";

            observer.observe(item);
        });
    }


    /* =====================================================
       RESIZE
       ===================================================== */

    window.addEventListener("resize", () => {

        updateGravitySimulator();

        updateFreeFallDisplay(
            0,
            Number(heightSlider?.value || 20)
        );
    });

});