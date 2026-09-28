/* =========================================================
   CIRCULAR MOTION — PHYSICS LAB
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SPARK / CHINGARI BACKGROUND
    ===================================================== */

    const sparkCanvas = document.getElementById("spark-background");
    const sparkCtx = sparkCanvas.getContext("2d");

    let sparks = [];
    let sparkWidth = 0;
    let sparkHeight = 0;

    function resizeSparkCanvas() {

        sparkWidth = window.innerWidth;
        sparkHeight = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        sparkCanvas.width = sparkWidth * dpr;
        sparkCanvas.height = sparkHeight * dpr;

        sparkCanvas.style.width = sparkWidth + "px";
        sparkCanvas.style.height = sparkHeight + "px";

        sparkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createSpark() {

        return {
            x: Math.random() * sparkWidth,
            y: Math.random() * sparkHeight,
            size: Math.random() * 2.5 + 0.4,
            speed: Math.random() * 0.6 + 0.15,
            drift: (Math.random() - 0.5) * 0.35,
            life: Math.random() * 100,
            hue: Math.random()
        };
    }

    function initSparks() {

        sparks = [];

        const count = Math.min(
            150,
            Math.floor(window.innerWidth / 7)
        );

        for (let i = 0; i < count; i++) {
            sparks.push(createSpark());
        }
    }

    function drawSparks() {

        sparkCtx.clearRect(0, 0, sparkWidth, sparkHeight);

        sparks.forEach((spark) => {

            spark.y -= spark.speed;
            spark.x += spark.drift;
            spark.life -= 0.4;

            if (
                spark.y < -10 ||
                spark.life <= 0
            ) {
                Object.assign(spark, createSpark());
                spark.y = sparkHeight + 10;
                spark.life = 100;
            }

            const alpha = Math.max(
                0,
                Math.min(1, spark.life / 100)
            );

            let color;

            if (spark.hue < 0.33) {
                color = `rgba(34,211,238,${alpha})`;
            } else if (spark.hue < 0.66) {
                color = `rgba(168,85,247,${alpha})`;
            } else {
                color = `rgba(251,146,60,${alpha})`;
            }

            sparkCtx.beginPath();
            sparkCtx.arc(
                spark.x,
                spark.y,
                spark.size,
                0,
                Math.PI * 2
            );

            sparkCtx.fillStyle = color;
            sparkCtx.shadowBlur = 10;
            sparkCtx.shadowColor = color;
            sparkCtx.fill();
        });

        requestAnimationFrame(drawSparks);
    }

    resizeSparkCanvas();
    initSparks();
    drawSparks();

    window.addEventListener("resize", () => {

        resizeSparkCanvas();
        initSparks();

    });


    /* =====================================================
       MAIN SIMULATOR
    ===================================================== */

    const canvas = document.getElementById("circular-canvas");
    const ctx = canvas.getContext("2d");

    const radiusSlider =
        document.getElementById("radius-slider");

    const massSlider =
        document.getElementById("mass-slider");

    const speedSlider =
        document.getElementById("speed-slider");

    const radiusValue =
        document.getElementById("radius-value");

    const massValue =
        document.getElementById("mass-value");

    const speedValue =
        document.getElementById("speed-value");

    const omegaOutput =
        document.getElementById("omega-output");

    const periodOutput =
        document.getElementById("period-output");

    const frequencyOutput =
        document.getElementById("frequency-output");

    const velocityOutput =
        document.getElementById("velocity-output");

    const accelerationOutput =
        document.getElementById("acceleration-output");

    const forceOutput =
        document.getElementById("force-output");

    const simulationWhy =
        document.getElementById("simulation-why");

    const pauseButton =
        document.getElementById("pause-simulation");

    const resetButton =
        document.getElementById("reset-simulation");


    let sim = {
        radius: 3,
        mass: 2,
        speed: 6,
        angle: 0,
        running: true,
        lastTime: performance.now()
    };


    function resizeSimulationCanvas() {

        const rect = canvas.getBoundingClientRect();

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function getPhysics() {

        const r = sim.radius;
        const v = sim.speed;
        const m = sim.mass;

        const omega = v / r;
        const period = 2 * Math.PI / omega;
        const frequency = 1 / period;
        const acceleration = (v * v) / r;
        const force = m * acceleration;

        return {
            r,
            v,
            m,
            omega,
            period,
            frequency,
            acceleration,
            force
        };
    }


    function updateOutputs() {

        const p = getPhysics();

        radiusValue.textContent =
            p.r.toFixed(1);

        massValue.textContent =
            p.m.toFixed(1);

        speedValue.textContent =
            p.v.toFixed(1);

        omegaOutput.textContent =
            `${p.omega.toFixed(2)} rad/s`;

        periodOutput.textContent =
            `${p.period.toFixed(2)} s`;

        frequencyOutput.textContent =
            `${p.frequency.toFixed(2)} Hz`;

        velocityOutput.textContent =
            `${p.v.toFixed(2)} m/s`;

        accelerationOutput.textContent =
            `${p.acceleration.toFixed(2)} m/s²`;

        forceOutput.textContent =
            `${p.force.toFixed(2)} N`;


        simulationWhy.innerHTML =
            createWhyText(p);
    }


    function createWhyText(p) {

        return `
            <strong>WHY?</strong>
            The object needs inward acceleration because its velocity
            direction keeps changing.
            <br>
            Since
            <strong>a<sub>c</sub> = v²/r</strong>,
            its speed and radius determine how much inward acceleration
            is required.
            The required net inward force is
            <strong>F<sub>c</sub> = ma<sub>c</sub> = ${p.force.toFixed(2)} N</strong>.
        `;
    }


    /* =====================================================
       DRAW SIMULATION
    ===================================================== */

    function drawArrow(
        startX,
        startY,
        endX,
        endY,
        color,
        width = 4
    ) {

        const angle =
            Math.atan2(
                endY - startY,
                endX - startX
            );

        const headLength = 13;

        ctx.save();

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(endX, endY);

        ctx.lineTo(
            endX -
            headLength * Math.cos(angle - Math.PI / 6),
            endY -
            headLength * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            endX -
            headLength * Math.cos(angle + Math.PI / 6),
            endY -
            headLength * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }


    function drawSimulation() {

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        const centerX = width / 2;
        const centerY = height / 2;

        const p = getPhysics();

        const maxRadius =
            Math.min(width, height) * 0.34;

        const scale =
            maxRadius / 6;

        const visualRadius =
            p.r * scale;

        const x =
            centerX +
            Math.cos(sim.angle) * visualRadius;

        const y =
            centerY +
            Math.sin(sim.angle) * visualRadius;


        /* ================================================
           GLOW
        ================================================= */

        const gradient =
            ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                visualRadius * 1.3
            );

        gradient.addColorStop(
            0,
            "rgba(34,211,238,0.10)"
        );

        gradient.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            visualRadius * 1.3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* ================================================
           CIRCULAR PATH
        ================================================= */

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            visualRadius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(34,211,238,0.35)";

        ctx.lineWidth = 2;

        ctx.setLineDash([8, 10]);

        ctx.stroke();

        ctx.setLineDash([]);


        /* ================================================
           RADIUS
        ================================================= */

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.lineTo(
            x,
            y
        );

        ctx.strokeStyle =
            "rgba(168,85,247,0.75)";

        ctx.lineWidth = 2;

        ctx.stroke();


        /* ================================================
           CENTRE
        ================================================= */

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            10,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#a855f7";

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#a855f7";

        ctx.fill();

        ctx.shadowBlur = 0;


        /* ================================================
           VELOCITY VECTOR
           Tangent to circle
        ================================================= */

        const tangentX =
            -Math.sin(sim.angle);

        const tangentY =
            Math.cos(sim.angle);

        const velocityLength =
            Math.min(
                90,
                35 + p.v * 4
            );

        drawArrow(
            x,
            y,
            x + tangentX * velocityLength,
            y + tangentY * velocityLength,
            "#fb923c",
            5
        );


        /* ================================================
           CENTRIPETAL FORCE / ACCELERATION
           INWARD
        ================================================= */

        const forceLength =
            Math.min(
                visualRadius * 0.65,
                45 + p.acceleration * 4
            );

        const dx =
            centerX - x;

        const dy =
            centerY - y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        const nx = dx / distance;
        const ny = dy / distance;

        drawArrow(
            x,
            y,
            x + nx * forceLength,
            y + ny * forceLength,
            "#22d3ee",
            5
        );


        /* ================================================
           OBJECT
        ================================================= */

        const objectGradient =
            ctx.createRadialGradient(
                x - 4,
                y - 4,
                2,
                x,
                y,
                24
            );

        objectGradient.addColorStop(
            0,
            "#fff7ed"
        );

        objectGradient.addColorStop(
            0.25,
            "#fb923c"
        );

        objectGradient.addColorStop(
            1,
            "#ea580c"
        );

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            18,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            objectGradient;

        ctx.shadowBlur = 25;
        ctx.shadowColor =
            "rgba(251,146,60,0.8)";

        ctx.fill();

        ctx.shadowBlur = 0;


        /* ================================================
           LABELS
        ================================================= */

        ctx.font =
            "bold 13px system-ui";

        ctx.fillStyle =
            "#94a3b8";

        ctx.fillText(
            "CENTRE",
            centerX - 25,
            centerY + 35
        );

        ctx.fillStyle =
            "#fb923c";

        ctx.fillText(
            "v",
            x + tangentX * velocityLength + 8,
            y + tangentY * velocityLength
        );

        ctx.fillStyle =
            "#22d3ee";

        ctx.fillText(
            "Fc",
            x + nx * forceLength + 8,
            y + ny * forceLength
        );


        /* ================================================
           RADIUS LABEL
        ================================================= */

        ctx.fillStyle =
            "#c4b5fd";

        ctx.fillText(
            `r = ${p.r.toFixed(1)} m`,
            centerX + (x - centerX) * 0.45,
            centerY + (y - centerY) * 0.45
        );
    }


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate(time) {

        const delta =
            Math.min(
                (time - sim.lastTime) / 1000,
                0.05
            );

        sim.lastTime = time;

        if (sim.running) {

            const p = getPhysics();

            sim.angle +=
                p.omega * delta;

            if (sim.angle > Math.PI * 2) {
                sim.angle -= Math.PI * 2;
            }
        }

        drawSimulation();

        requestAnimationFrame(animate);
    }


    /* =====================================================
       CONTROLS
    ===================================================== */

    radiusSlider.addEventListener(
        "input",
        () => {

            sim.radius =
                Number(radiusSlider.value);

            updateOutputs();
        }
    );


    massSlider.addEventListener(
        "input",
        () => {

            sim.mass =
                Number(massSlider.value);

            updateOutputs();
        }
    );


    speedSlider.addEventListener(
        "input",
        () => {

            sim.speed =
                Number(speedSlider.value);

            updateOutputs();
        }
    );


    pauseButton.addEventListener(
        "click",
        () => {

            sim.running =
                !sim.running;

            pauseButton.textContent =
                sim.running
                    ? "Pause"
                    : "Resume";
        }
    );


    resetButton.addEventListener(
        "click",
        () => {

            sim.radius = 3;
            sim.mass = 2;
            sim.speed = 6;
            sim.angle = 0;

            radiusSlider.value = 3;
            massSlider.value = 2;
            speedSlider.value = 6;

            sim.running = true;

            pauseButton.textContent =
                "Pause";

            updateOutputs();
        }
    );


    window.addEventListener(
        "resize",
        resizeSimulationCanvas
    );


    /* =====================================================
       SPEED EXPERIMENT
    ===================================================== */

    const experimentSpeed =
        document.getElementById("experiment-speed");

    const experimentSpeedValue =
        document.getElementById("experiment-speed-value");

    const expSpeed =
        document.getElementById("exp-speed");

    const expSpeedSquare =
        document.getElementById("exp-speed-square");

    const expForce =
        document.getElementById("exp-force");

    const speedWhy =
        document.getElementById("speed-why");


    function updateSpeedExperiment() {

        const v =
            Number(experimentSpeed.value);

        const m = 2;
        const r = 3;

        const v2 = v * v;

        const force =
            (m * v2) / r;

        experimentSpeedValue.textContent =
            v;

        expSpeed.textContent =
            `${v} m/s`;

        expSpeedSquare.textContent =
            v2;

        expForce.textContent =
            `${force.toFixed(2)} N`;


        speedWhy.innerHTML = `
            <strong>WHY?</strong>
            The formula is
            <strong>F<sub>c</sub> = mv²/r</strong>.
            Here mass and radius stay constant, so the force follows
            <strong>v²</strong>.
            <br><br>
            That means if speed doubles,
            <strong>the required centripetal force becomes 4×</strong>.
        `;
    }


    experimentSpeed.addEventListener(
        "input",
        updateSpeedExperiment
    );


    /* =====================================================
       RADIUS EXPERIMENT
    ===================================================== */

    const experimentRadius =
        document.getElementById("experiment-radius");

    const experimentRadiusValue =
        document.getElementById("experiment-radius-value");

    const expRadius =
        document.getElementById("exp-radius");

    const expRadiusAcc =
        document.getElementById("exp-radius-acc");

    const expRadiusForce =
        document.getElementById("exp-radius-force");

    const radiusWhy =
        document.getElementById("radius-why");


    function updateRadiusExperiment() {

        const r =
            Number(experimentRadius.value);

        const m = 2;
        const v = 6;

        const acceleration =
            (v * v) / r;

        const force =
            m * acceleration;

        experimentRadiusValue.textContent =
            r;

        expRadius.textContent =
            `${r} m`;

        expRadiusAcc.textContent =
            `${acceleration.toFixed(2)} m/s²`;

        expRadiusForce.textContent =
            `${force.toFixed(2)} N`;


        radiusWhy.innerHTML = `
            <strong>WHY?</strong>
            At constant speed,
            <strong>a<sub>c</sub> = v²/r</strong>.
            So increasing the radius gives the object a larger circle
            over which its direction can change.
            <br><br>
            Therefore the required inward acceleration and force decrease
            when radius increases at fixed speed.
        `;
    }


    experimentRadius.addEventListener(
        "input",
        updateRadiusExperiment
    );


    /* =====================================================
       CHALLENGE
    ===================================================== */

    const challengeButtons =
        document.querySelectorAll(
            ".challenge-options button"
        );

    const challengeFeedback =
        document.getElementById(
            "challenge-feedback"
        );


    challengeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const answer =
                        button.dataset.answer;

                    if (answer === "4") {

                        challengeFeedback.innerHTML =
                            "✅ Correct! Force depends on v². Doubling speed makes the force 4×.";

                        challengeFeedback.style.color =
                            "#4ade80";

                    } else {

                        challengeFeedback.innerHTML =
                            "❌ Not quite. Look at Fᶜ = mv²/r. What happens to v² when speed doubles?";

                        challengeFeedback.style.color =
                            "#fb7185";
                    }
                }
            );
        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    resizeSimulationCanvas();

    updateOutputs();

    updateSpeedExperiment();

    updateRadiusExperiment();

    requestAnimationFrame(animate);


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".concept-section, .simulation-section, .experiment-section, .summary-section"
        );

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (entry.isIntersecting) {

                            entry.target.style.opacity = "1";
                            entry.target.style.transform =
                                "translateY(0)";

                            revealObserver.unobserve(
                                entry.target
                            );
                        }
                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(
        (element) => {

            element.style.opacity = "0";
            element.style.transform =
                "translateY(35px)";
            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

            revealObserver.observe(element);
        }
    );

});