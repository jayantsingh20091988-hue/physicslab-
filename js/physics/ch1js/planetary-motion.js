/* =========================================================
   PLANETARY MOTION
   Physics Lab - Chapter 05
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       HELPERS
    ====================================================== */

    const $ = (id) => document.getElementById(id);

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));


    const TAU = Math.PI * 2;


    /* =====================================================
       SPARK / CHINGARI BACKGROUND
    ====================================================== */

    const sparkCanvas = $("spark-background");

    if (sparkCanvas) {

        const ctx = sparkCanvas.getContext("2d");

        let sparks = [];

        const resizeSparkCanvas = () => {

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            sparkCanvas.width = window.innerWidth * dpr;
            sparkCanvas.height = window.innerHeight * dpr;

            sparkCanvas.style.width = `${window.innerWidth}px`;
            sparkCanvas.style.height = `${window.innerHeight}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };


        const createSpark = () => {

            return {
                x: Math.random() * window.innerWidth,

                y:
                    window.innerHeight +
                    Math.random() * 80,

                size:
                    Math.random() * 2.2 + 0.5,

                speed:
                    Math.random() * 0.7 + 0.25,

                drift:
                    (Math.random() - 0.5) * 0.45,

                life:
                    Math.random() * 120 + 80,

                age: 0,

                hue:
                    Math.random() > 0.5
                        ? "34,211,238"
                        : "168,85,247"
            };
        };


        const resetSpark = (spark) => {

            spark.x =
                Math.random() *
                window.innerWidth;

            spark.y =
                window.innerHeight +
                Math.random() * 100;

            spark.size =
                Math.random() * 2.2 + 0.5;

            spark.speed =
                Math.random() * 0.7 + 0.25;

            spark.drift =
                (Math.random() - 0.5) * 0.45;

            spark.life =
                Math.random() * 120 + 80;

            spark.age = 0;
        };


        const initSparks = () => {

            sparks = [];

            const amount = Math.min(
                120,
                Math.floor(
                    (window.innerWidth * window.innerHeight) /
                    15000
                )
            );

            for (let i = 0; i < amount; i++) {

                const spark = createSpark();

                spark.y =
                    Math.random() *
                    window.innerHeight;

                sparks.push(spark);
            }
        };


        const animateSparks = () => {

            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );

            for (const spark of sparks) {

                spark.age++;

                spark.y -= spark.speed;
                spark.x += spark.drift;

                if (
                    spark.age > spark.life ||
                    spark.y < -20
                ) {
                    resetSpark(spark);
                }

                const lifeRatio =
                    1 -
                    spark.age / spark.life;

                ctx.beginPath();

                ctx.arc(
                    spark.x,
                    spark.y,
                    spark.size,
                    0,
                    TAU
                );

                ctx.fillStyle =
                    `rgba(${spark.hue},${0.12 + lifeRatio * 0.55})`;

                ctx.shadowBlur = 10;

                ctx.shadowColor =
                    `rgba(${spark.hue},0.7)`;

                ctx.fill();

                ctx.shadowBlur = 0;
            }

            requestAnimationFrame(animateSparks);
        };


        resizeSparkCanvas();
        initSparks();
        animateSparks();

        window.addEventListener(
            "resize",
            () => {
                resizeSparkCanvas();
                initSparks();
            }
        );
    }


    /* =====================================================
       KEPLER 1 ANIMATION
    ====================================================== */

    const kepler1Earth = $("kepler1-earth");

    if (kepler1Earth) {

        let angle = 0;

        const animateKepler1 = () => {

            angle += 0.008;

            const x =
                Math.cos(angle) * 180;

            const y =
                Math.sin(angle) * 95;

            kepler1Earth.style.transform =
                `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

            requestAnimationFrame(animateKepler1);
        };

        animateKepler1();
    }


    /* =====================================================
       KEPLER 2 — EQUAL AREA SIMULATOR
    ====================================================== */

    const areaCanvas = $("kepler-area-canvas");

    if (areaCanvas) {

        const ctx = areaCanvas.getContext("2d");

        let areaRunning = false;

        let areaAngle = 0;

        let areaLastTime = 0;

        let intervalStart = null;

        let intervalData = {
            a: null,
            b: null
        };

        const resizeAreaCanvas = () => {

            const rect =
                areaCanvas.getBoundingClientRect();

            const dpr =
                Math.min(window.devicePixelRatio || 1, 2);

            areaCanvas.width =
                Math.max(1, rect.width * dpr);

            areaCanvas.height =
                Math.max(1, rect.height * dpr);

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        };


        const ellipsePoint = (angle, width, height) => {

            return {
                x: Math.cos(angle) * width,
                y: Math.sin(angle) * height
            };
        };


        const drawAreaExperiment = () => {

            const width = areaCanvas.clientWidth;
            const height = areaCanvas.clientHeight;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            const cx = width * 0.46;
            const cy = height * 0.52;

            const rx = Math.min(width * 0.34, 220);
            const ry = Math.min(height * 0.34, 150);


            /* Background stars */

            for (let i = 0; i < 35; i++) {

                const sx =
                    (i * 73) % width;

                const sy =
                    (i * 47) % height;

                ctx.beginPath();

                ctx.arc(
                    sx,
                    sy,
                    0.8,
                    0,
                    TAU
                );

                ctx.fillStyle =
                    "rgba(255,255,255,0.25)";

                ctx.fill();
            }


            /* Ellipse */

            ctx.beginPath();

            ctx.ellipse(
                cx,
                cy,
                rx,
                ry,
                0,
                0,
                TAU
            );

            ctx.strokeStyle =
                "rgba(34,211,238,0.6)";

            ctx.lineWidth = 2;

            ctx.stroke();


            /* Sun at focus */

            const focusDistance =
                Math.sqrt(
                    Math.max(
                        0,
                        rx * rx - ry * ry
                    )
                );

            const sunX =
                cx - focusDistance;

            const sunY = cy;


            const sunGradient =
                ctx.createRadialGradient(
                    sunX,
                    sunY,
                    2,
                    sunX,
                    sunY,
                    35
                );

            sunGradient.addColorStop(
                0,
                "rgba(255,255,220,1)"
            );

            sunGradient.addColorStop(
                0.35,
                "rgba(250,204,21,0.95)"
            );

            sunGradient.addColorStop(
                1,
                "rgba(250,204,21,0)"
            );

            ctx.fillStyle = sunGradient;

            ctx.beginPath();

            ctx.arc(
                sunX,
                sunY,
                35,
                0,
                TAU
            );

            ctx.fill();


            ctx.fillStyle = "#facc15";

            ctx.beginPath();

            ctx.arc(
                sunX,
                sunY,
                10,
                0,
                TAU
            );

            ctx.fill();


            /* Planet */

            const p =
                ellipsePoint(
                    areaAngle,
                    rx,
                    ry
                );

            const px =
                cx + p.x;

            const py =
                cy + p.y;


            /* Swept area */

            if (intervalData.a) {

                drawSweptArea(
                    sunX,
                    sunY,
                    intervalData.a.start,
                    intervalData.a.end,
                    rx,
                    ry,
                    cx,
                    cy,
                    "rgba(34,211,238,0.18)"
                );
            }


            if (intervalData.b) {

                drawSweptArea(
                    sunX,
                    sunY,
                    intervalData.b.start,
                    intervalData.b.end,
                    rx,
                    ry,
                    cx,
                    cy,
                    "rgba(168,85,247,0.18)"
                );
            }


            /* Current radius line */

            ctx.beginPath();

            ctx.moveTo(
                sunX,
                sunY
            );

            ctx.lineTo(
                px,
                py
            );

            ctx.strokeStyle =
                "rgba(250,204,21,0.55)";

            ctx.lineWidth = 2;

            ctx.stroke();


            /* Planet glow */

            ctx.shadowBlur = 20;
            ctx.shadowColor =
                "rgba(34,211,238,0.8)";

            ctx.fillStyle =
                "#22d3ee";

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                9,
                0,
                TAU
            );

            ctx.fill();

            ctx.shadowBlur = 0;


            /* Labels */

            ctx.font =
                "600 13px system-ui";

            ctx.fillStyle =
                "rgba(255,255,255,0.65)";

            ctx.fillText(
                "Sun",
                sunX - 12,
                sunY + 30
            );

            ctx.fillStyle =
                "#22d3ee";

            ctx.fillText(
                "Planet",
                px + 14,
                py - 10
            );
        };


        const drawSweptArea = (
            sunX,
            sunY,
            start,
            end,
            rx,
            ry,
            cx,
            cy,
            fill
        ) => {

            const steps = 50;

            ctx.beginPath();

            ctx.moveTo(
                sunX,
                sunY
            );

            for (let i = 0; i <= steps; i++) {

                const t =
                    i / steps;

                const angle =
                    start +
                    (end - start) * t;

                const p =
                    ellipsePoint(
                        angle,
                        rx,
                        ry
                    );

                ctx.lineTo(
                    cx + p.x,
                    cy + p.y
                );
            }

            ctx.closePath();

            ctx.fillStyle = fill;
            ctx.fill();

            ctx.strokeStyle =
                fill.replace(
                    /0\.\d+\)/,
                    "0.7)"
                );

            ctx.stroke();
        };


        const updateAreaData = () => {

            if (
                !intervalData.a ||
                !intervalData.b
            ) {
                return;
            }

            const durationA =
                intervalData.a.duration;

            const durationB =
                intervalData.b.duration;

            $("area-time-a").textContent =
                `${durationA.toFixed(2)} s`;

            $("area-time-b").textContent =
                `${durationB.toFixed(2)} s`;

            /*
             * For the educational visualisation we compare
             * normalized swept areas.
             */

            const areaA =
                Math.abs(
                    intervalData.a.area
                );

            const areaB =
                Math.abs(
                    intervalData.b.area
                );

            $("area-value-a").textContent =
                areaA.toFixed(2);

            $("area-value-b").textContent =
                areaB.toFixed(2);

            const ratio =
                areaB === 0
                    ? 0
                    : areaA / areaB;

            if (
                Math.abs(ratio - 1) < 0.08
            ) {

                $("area-verdict").textContent =
                    "✓ Equal time → approximately equal swept area";

            } else {

                $("area-verdict").textContent =
                    "Watch the planet: its speed changes to preserve the equal-area pattern.";
            }
        };


        const angularSpeedAt = (angle) => {

            /*
             * Educational approximation of variable angular speed.
             * It is chosen so that the planet moves faster near
             * the perihelion and slower near the aphelion.
             */

            return 0.007 *
                (
                    1 +
                    0.7 *
                    Math.cos(angle)
                );
        };


        const calculateAreaApprox = (
            start,
            end,
            rx,
            ry,
            sunX,
            sunY,
            cx,
            cy
        ) => {

            const steps = 120;

            let area = 0;

            let previous = null;

            for (let i = 0; i <= steps; i++) {

                const t =
                    i / steps;

                const angle =
                    start +
                    (end - start) * t;

                const p =
                    ellipsePoint(
                        angle,
                        rx,
                        ry
                    );

                const x =
                    cx + p.x;

                const y =
                    cy + p.y;

                if (previous) {

                    const cross =
                        (
                            (previous.x - sunX) *
                            (y - sunY)
                        ) -
                        (
                            (previous.y - sunY) *
                            (x - sunX)
                        );

                    area += cross / 2;
                }

                previous = {
                    x,
                    y
                };
            }

            return Math.abs(area);
        };


        const animateArea = (time) => {

            if (!areaRunning) {

                drawAreaExperiment();

                requestAnimationFrame(
                    animateArea
                );

                return;
            }


            if (!areaLastTime) {
                areaLastTime = time;
            }

            const dt =
                Math.min(
                    50,
                    time - areaLastTime
                );

            areaLastTime = time;


            areaAngle +=
                angularSpeedAt(areaAngle) *
                dt;


            /*
             * Capture two equal time intervals.
             */

            if (
                intervalStart === null
            ) {

                intervalStart = {
                    angle: areaAngle,
                    time
                };
            }


            const elapsed =
                time -
                intervalStart.time;


            if (elapsed >= 2500) {

                const startAngle =
                    intervalStart.angle;

                const endAngle =
                    areaAngle;

                const width =
                    Math.min(
                        areaCanvas.clientWidth * 0.34,
                        220
                    );

                const height =
                    Math.min(
                        areaCanvas.clientHeight * 0.34,
                        150
                    );

                const cx =
                    areaCanvas.clientWidth * 0.46;

                const cy =
                    areaCanvas.clientHeight * 0.52;

                const focus =
                    Math.sqrt(
                        Math.max(
                            0,
                            width * width -
                            height * height
                        )
                    );

                const sunX =
                    cx - focus;

                const sunY = cy;


                const area =
                    calculateAreaApprox(
                        startAngle,
                        endAngle,
                        width,
                        height,
                        sunX,
                        sunY,
                        cx,
                        cy
                    );


                intervalData.a = {
                    start: startAngle,
                    end: endAngle,
                    duration: elapsed / 1000,
                    area
                };


                /*
                 * Start second interval from the current point.
                 */

                intervalStart = {
                    angle: areaAngle,
                    time
                };


                /*
                 * Next equal-time interval is collected
                 * automatically.
                 */

                if (intervalData.a) {

                    const secondElapsed =
                        time -
                        intervalStart.time;

                    if (secondElapsed >= 2500) {
                        // The following frame cycle will
                        // generate interval B.
                    }
                }
            }


            /*
             * More direct second-interval collection.
             */

            if (
                intervalData.a &&
                !intervalData.b &&
                intervalStart
            ) {

                const elapsedSecond =
                    time -
                    intervalStart.time;

                if (elapsedSecond >= 2500) {

                    const startAngle =
                        intervalStart.angle;

                    const endAngle =
                        areaAngle;

                    const width =
                        Math.min(
                            areaCanvas.clientWidth * 0.34,
                            220
                        );

                    const height =
                        Math.min(
                            areaCanvas.clientHeight * 0.34,
                            150
                        );

                    const cx =
                        areaCanvas.clientWidth * 0.46;

                    const cy =
                        areaCanvas.clientHeight * 0.52;

                    const focus =
                        Math.sqrt(
                            Math.max(
                                0,
                                width * width -
                                height * height
                            )
                        );

                    const sunX =
                        cx - focus;

                    const area =
                        calculateAreaApprox(
                            startAngle,
                            endAngle,
                            width,
                            height,
                            sunX,
                            cy,
                            cx,
                            cy
                        );

                    intervalData.b = {
                        start: startAngle,
                        end: endAngle,
                        duration: elapsedSecond / 1000,
                        area
                    };

                    areaRunning = false;

                    updateAreaData();
                }
            }


            drawAreaExperiment();

            requestAnimationFrame(
                animateArea
            );
        };


        const startButton =
            $("area-start");

        if (startButton) {

            startButton.addEventListener(
                "click",
                () => {

                    intervalData = {
                        a: null,
                        b: null
                    };

                    intervalStart = null;

                    areaAngle = 0;

                    areaLastTime = 0;

                    areaRunning = true;

                    startButton.textContent =
                        "Running…";

                    $("area-verdict").textContent =
                        "Collecting two equal time intervals…";
                }
            );
        }


        resizeAreaCanvas();
        drawAreaExperiment();

        window.addEventListener(
            "resize",
            () => {

                resizeAreaCanvas();

                drawAreaExperiment();
            }
        );

        requestAnimationFrame(
            animateArea
        );
    }


    /* =====================================================
       KEPLER 3
    ====================================================== */

    const distanceSlider =
        $("orbit-distance");

    if (distanceSlider) {

        const updateThirdLaw = () => {

            const a =
                Number(
                    distanceSlider.value
                );

            /*
             * Earth is the reference:
             * a = 1 AU
             * T = 1 year
             *
             * Kepler:
             * T = a^(3/2)
             */

            const T =
                Math.pow(a, 1.5);

            const T2 =
                T * T;

            const a3 =
                a * a * a;

            const ratio =
                T2 / a3;


            $("orbit-distance-value")
                .textContent =
                a.toFixed(1);

            $("period-value")
                .textContent =
                `${T.toFixed(2)} years`;

            $("period-square")
                .textContent =
                T2.toFixed(2);

            $("distance-cube")
                .textContent =
                a3.toFixed(2);

            $("kepler-ratio")
                .textContent =
                ratio.toFixed(2);


            let explanation = "";

            if (a < 1) {

                explanation =
                    `The orbit is smaller than Earth's. Because T ∝ a³ᐟ², ` +
                    `the orbital period becomes much shorter. ` +
                    `A smaller orbit means less distance to cover and, ` +
                    `in the circular approximation, a higher orbital speed.`;

            } else if (a > 1) {

                explanation =
                    `The orbit is larger than Earth's. The planet must ` +
                    `cover a larger path, and the circular-orbit speed ` +
                    `also decreases with radius. Therefore its orbital ` +
                    `period becomes much longer.`;

            } else {

                explanation =
                    `Earth is our reference: a = 1 AU and T = 1 year. ` +
                    `The ratio T²/a³ is 1 in these normalized units.`;
            }


            $("third-law-why").textContent =
                explanation;
        };


        distanceSlider.addEventListener(
            "input",
            updateThirdLaw
        );

        updateThirdLaw();
    }


    /* =====================================================
       THIRD LAW CANVAS
    ====================================================== */

    const thirdCanvas =
        $("third-law-canvas");

    if (thirdCanvas) {

        const ctx =
            thirdCanvas.getContext("2d");

        let angle = 0;

        const resizeThirdCanvas = () => {

            const rect =
                thirdCanvas.getBoundingClientRect();

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

            thirdCanvas.width =
                Math.max(
                    1,
                    rect.width * dpr
                );

            thirdCanvas.height =
                Math.max(
                    1,
                    rect.height * dpr
                );

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        };


        const drawThirdCanvas = () => {

            const width =
                thirdCanvas.clientWidth;

            const height =
                thirdCanvas.clientHeight;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            const cx =
                width * 0.5;

            const cy =
                height * 0.52;


            const a =
                Number(
                    distanceSlider
                        ? distanceSlider.value
                        : 1
                );


            const radius =
                clamp(
                    55 + a * 22,
                    55,
                    Math.min(
                        width,
                        height
                    ) * 0.42
                );


            /* Stars */

            for (let i = 0; i < 55; i++) {

                const x =
                    (i * 97) % width;

                const y =
                    (i * 53) % height;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    0.8,
                    0,
                    TAU
                );

                ctx.fillStyle =
                    "rgba(255,255,255,0.24)";

                ctx.fill();
            }


            /* Orbit */

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                radius,
                0,
                TAU
            );

            ctx.strokeStyle =
                "rgba(34,211,238,0.45)";

            ctx.lineWidth = 2;

            ctx.stroke();


            /* Sun */

            const gradient =
                ctx.createRadialGradient(
                    cx,
                    cy,
                    3,
                    cx,
                    cy,
                    32
                );

            gradient.addColorStop(
                0,
                "#fff7b2"
            );

            gradient.addColorStop(
                0.3,
                "#facc15"
            );

            gradient.addColorStop(
                1,
                "rgba(250,204,21,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                32,
                0,
                TAU
            );

            ctx.fill();


            /* Planet */

            angle +=
                0.004 /
                Math.sqrt(a);

            const px =
                cx +
                Math.cos(angle) *
                radius;

            const py =
                cy +
                Math.sin(angle) *
                radius;


            ctx.shadowBlur = 22;

            ctx.shadowColor =
                "rgba(168,85,247,0.85)";

            ctx.fillStyle =
                "#a855f7";

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                9,
                0,
                TAU
            );

            ctx.fill();

            ctx.shadowBlur = 0;


            ctx.font =
                "600 13px system-ui";

            ctx.fillStyle =
                "rgba(255,255,255,0.65)";

            ctx.fillText(
                "Sun",
                cx + 38,
                cy + 4
            );

            ctx.fillStyle =
                "#a855f7";

            ctx.fillText(
                "Planet",
                px + 13,
                py - 8
            );


            requestAnimationFrame(
                drawThirdCanvas
            );
        };


        resizeThirdCanvas();

        window.addEventListener(
            "resize",
            resizeThirdCanvas
        );

        drawThirdCanvas();
    }


    /* =====================================================
       SOLAR SYSTEM SIMULATOR
    ====================================================== */

    const solarCanvas =
        $("solar-system-canvas");

    if (solarCanvas) {

        const ctx =
            solarCanvas.getContext("2d");


        const planets = {

            mercury: {
                name: "Mercury",
                a: 0.387,
                period: 0.241,
                speed: 1.607,
                color: "#d1d5db",
                radius: 4
            },

            venus: {
                name: "Venus",
                a: 0.723,
                period: 0.615,
                speed: 1.176,
                color: "#fbbf24",
                radius: 6
            },

            earth: {
                name: "Earth",
                a: 1,
                period: 1,
                speed: 1,
                color: "#38bdf8",
                radius: 7
            },

            mars: {
                name: "Mars",
                a: 1.524,
                period: 1.881,
                speed: 0.809,
                color: "#fb7185",
                radius: 6
            },

            jupiter: {
                name: "Jupiter",
                a: 5.203,
                period: 11.86,
                speed: 0.438,
                color: "#f59e0b",
                radius: 12
            },

            saturn: {
                name: "Saturn",
                a: 9.537,
                period: 29.46,
                speed: 0.324,
                color: "#fde68a",
                radius: 10
            }

        };


        let selectedPlanet =
            "earth";

        let timeSpeed = 1;

        let paused = false;

        let trails = true;

        let simulationTime = 0;

        let lastTime = performance.now();

        const trailPoints = {};


        Object.keys(planets).forEach(
            key => {
                trailPoints[key] = [];
            }
        );


        const resizeSolarCanvas = () => {

            const rect =
                solarCanvas.getBoundingClientRect();

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

            solarCanvas.width =
                Math.max(
                    1,
                    rect.width * dpr
                );

            solarCanvas.height =
                Math.max(
                    1,
                    rect.height * dpr
                );

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        };


        const getSolarGeometry = () => {

            const width =
                solarCanvas.clientWidth;

            const height =
                solarCanvas.clientHeight;

            const cx =
                width * 0.5;

            const cy =
                height * 0.52;

            /*
             * We compress real astronomical distances so
             * outer planets remain visible.
             */

            const scale =
                Math.min(
                    width,
                    height
                ) /
                23;

            return {
                width,
                height,
                cx,
                cy,
                scale
            };
        };


        const drawStars = (
            width,
            height
        ) => {

            for (let i = 0; i < 100; i++) {

                const x =
                    (i * 137) % width;

                const y =
                    (i * 71) % height;

                const alpha =
                    0.12 +
                    (i % 5) * 0.04;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    i % 4 === 0
                        ? 1.3
                        : 0.7,
                    0,
                    TAU
                );

                ctx.fillStyle =
                    `rgba(255,255,255,${alpha})`;

                ctx.fill();
            }
        };


        const drawOrbit =
            (
                cx,
                cy,
                radius,
                selected
            ) => {

                ctx.beginPath();

                ctx.arc(
                    cx,
                    cy,
                    radius,
                    0,
                    TAU
                );

                ctx.strokeStyle =
                    selected
                        ? "rgba(34,211,238,0.45)"
                        : "rgba(148,163,184,0.13)";

                ctx.lineWidth =
                    selected ? 2 : 1;

                ctx.stroke();
            };


        const drawSun = (
            cx,
            cy
        ) => {

            const gradient =
                ctx.createRadialGradient(
                    cx,
                    cy,
                    3,
                    cx,
                    cy,
                    45
                );

            gradient.addColorStop(
                0,
                "#fff7b2"
            );

            gradient.addColorStop(
                0.25,
                "#facc15"
            );

            gradient.addColorStop(
                0.6,
                "rgba(251,146,60,0.45)"
            );

            gradient.addColorStop(
                1,
                "rgba(250,204,21,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                45,
                0,
                TAU
            );

            ctx.fill();


            ctx.shadowBlur = 20;

            ctx.shadowColor =
                "rgba(250,204,21,0.8)";

            ctx.fillStyle =
                "#facc15";

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                15,
                0,
                TAU
            );

            ctx.fill();

            ctx.shadowBlur = 0;


            ctx.font =
                "700 13px system-ui";

            ctx.fillStyle =
                "#facc15";

            ctx.fillText(
                "SUN",
                cx - 13,
                cy + 65
            );
        };


        const getPlanetPosition = (
            planet,
            geometry
        ) => {

            const radius =
                planet.a *
                geometry.scale;

            /*
             * Normalized period:
             * angle = time * 2π / T
             */

            const angle =
                simulationTime *
                TAU /
                planet.period;

            return {
                x:
                    geometry.cx +
                    Math.cos(angle) *
                    radius,

                y:
                    geometry.cy +
                    Math.sin(angle) *
                    radius,

                angle,
                radius
            };
        };


        const drawTrail = (
            points,
            planet
        ) => {

            if (
                !trails ||
                points.length < 2
            ) {
                return;
            }

            ctx.beginPath();

            points.forEach(
                (point, index) => {

                    if (index === 0) {

                        ctx.moveTo(
                            point.x,
                            point.y
                        );

                    } else {

                        ctx.lineTo(
                            point.x,
                            point.y
                        );
                    }
                }
            );

            ctx.strokeStyle =
                planet.color
                    .replace(
                        ")",
                        ",0.25)"
                    );

            /*
             * If color is hex, use a neutral
             * trail instead.
             */

            ctx.strokeStyle =
                "rgba(56,189,248,0.2)";

            ctx.lineWidth = 1.5;

            ctx.stroke();
        };


        const updateSolarData = () => {

            const planet =
                planets[selectedPlanet];

            $("solar-distance").textContent =
                `${planet.a.toFixed(3)} AU`;

            $("solar-speed").textContent =
                `${planet.speed.toFixed(3)} × Earth`;

            $("solar-period").textContent =
                `${planet.period.toFixed(3)} years`;

            const ratio =
                (
                    planet.period *
                    planet.period
                ) /
                (
                    planet.a *
                    planet.a *
                    planet.a
                );

            $("solar-ratio").textContent =
                ratio.toFixed(3);


            let why = "";


            if (
                selectedPlanet ===
                "mercury"
            ) {

                why =
                    "Mercury is close to the Sun. Its orbit is small, " +
                    "so its period is short. In the circular approximation, " +
                    "smaller orbital radius also corresponds to higher orbital speed.";

            } else if (
                selectedPlanet ===
                "earth"
            ) {

                why =
                    "Earth is our reference. Its orbital distance is 1 AU, " +
                    "its period is 1 year, and its normalized Kepler ratio is 1.";

            } else if (
                selectedPlanet ===
                "mars"
            ) {

                why =
                    "Mars is farther from the Sun than Earth. Its orbital " +
                    "period is therefore longer, while its average orbital " +
                    "speed is lower.";

            } else if (
                selectedPlanet ===
                "jupiter"
            ) {

                why =
                    "Jupiter's orbit is much larger than Earth's. Kepler's " +
                    "Third Law explains why Jupiter needs many Earth years " +
                    "to complete one orbit.";

            } else {

                why =
                    `${planet.name} has a much larger orbital distance than ` +
                    `Earth, so its orbital period is much longer.`;
            }


            $("solar-why").textContent =
                why;
        };


        const drawSolarSystem = (
            now
        ) => {

            const dt =
                Math.min(
                    60,
                    now - lastTime
                );

            lastTime = now;


            if (!paused) {

                /*
                 * Simulation years per real second.
                 * This is deliberately accelerated so
                 * planetary motion can be observed.
                 */

                simulationTime +=
                    (
                        dt / 1000
                    ) *
                    timeSpeed *
                    0.35;
            }


            const geometry =
                getSolarGeometry();


            ctx.clearRect(
                0,
                0,
                geometry.width,
                geometry.height
            );


            drawStars(
                geometry.width,
                geometry.height
            );


            /*
             * Draw orbits
             */

            Object.entries(
                planets
            ).forEach(
                ([key, planet]) => {

                    const radius =
                        planet.a *
                        geometry.scale;

                    drawOrbit(
                        geometry.cx,
                        geometry.cy,
                        radius,
                        key === selectedPlanet
                    );
                }
            );


            /*
             * Update planet positions
             */

            Object.entries(
                planets
            ).forEach(
                ([key, planet]) => {

                    const position =
                        getPlanetPosition(
                            planet,
                            geometry
                        );


                    if (
                        trails &&
                        key === selectedPlanet
                    ) {

                        trailPoints[key].push(
                            {
                                x: position.x,
                                y: position.y
                            }
                        );

                        if (
                            trailPoints[key].length >
                            180
                        ) {
                            trailPoints[key].shift();
                        }
                    }
                }
            );


            /*
             * Trails
             */

            if (trails) {

                Object.entries(
                    planets
                ).forEach(
                    ([key, planet]) => {

                        drawTrail(
                            trailPoints[key],
                            planet
                        );
                    }
                );
            }


            drawSun(
                geometry.cx,
                geometry.cy
            );


            /*
             * Planets
             */

            Object.entries(
                planets
            ).forEach(
                ([key, planet]) => {

                    const position =
                        getPlanetPosition(
                            planet,
                            geometry
                        );


                    ctx.shadowBlur =
                        key === selectedPlanet
                            ? 22
                            : 8;

                    ctx.shadowColor =
                        planet.color;


                    ctx.fillStyle =
                        planet.color;


                    ctx.beginPath();

                    ctx.arc(
                        position.x,
                        position.y,
                        planet.radius,
                        0,
                        TAU
                    );

                    ctx.fill();

                    ctx.shadowBlur = 0;


                    /*
                     * Saturn ring
                     */

                    if (
                        key === "saturn"
                    ) {

                        ctx.beginPath();

                        ctx.ellipse(
                            position.x,
                            position.y,
                            planet.radius * 1.8,
                            planet.radius * 0.65,
                            -0.2,
                            0,
                            TAU
                        );

                        ctx.strokeStyle =
                            "rgba(253,230,138,0.75)";

                        ctx.lineWidth = 2;

                        ctx.stroke();
                    }


                    /*
                     * Selected planet label
                     */

                    if (
                        key === selectedPlanet
                    ) {

                        ctx.font =
                            "700 13px system-ui";

                        ctx.fillStyle =
                            "#ffffff";

                        ctx.fillText(
                            planet.name,
                            position.x + 14,
                            position.y - 12
                        );
                    }

                }
            );


            requestAnimationFrame(
                drawSolarSystem
            );
        };


        const planetSelect =
            $("planet-select");

        if (planetSelect) {

            planetSelect.addEventListener(
                "change",
                () => {

                    selectedPlanet =
                        planetSelect.value;

                    trailPoints[
                        selectedPlanet
                    ] = [];

                    updateSolarData();
                }
            );
        }


        const speedSlider =
            $("time-speed");

        if (speedSlider) {

            speedSlider.addEventListener(
                "input",
                () => {

                    timeSpeed =
                        Number(
                            speedSlider.value
                        );

                    $("time-speed-value")
                        .textContent =
                        `${timeSpeed.toFixed(1)}×`;
                }
            );
        }


        const pauseButton =
            $("solar-pause");

        if (pauseButton) {

            pauseButton.addEventListener(
                "click",
                () => {

                    paused =
                        !paused;

                    pauseButton.textContent =
                        paused
                            ? "Resume"
                            : "Pause";
                }
            );
        }


        const resetButton =
            $("solar-reset");

        if (resetButton) {

            resetButton.addEventListener(
                "click",
                () => {

                    simulationTime = 0;

                    Object.keys(
                        trailPoints
                    ).forEach(
                        key => {
                            trailPoints[key] = [];
                        }
                    );
                }
            );
        }


        const trailButton =
            $("trail-toggle");

        if (trailButton) {

            trailButton.addEventListener(
                "click",
                () => {

                    trails =
                        !trails;

                    trailButton.textContent =
                        trails
                            ? "Trails: ON"
                            : "Trails: OFF";

                    if (!trails) {

                        Object.keys(
                            trailPoints
                        ).forEach(
                            key => {
                                trailPoints[key] = [];
                            }
                        );
                    }
                }
            );
        }


        resizeSolarCanvas();
        updateSolarData();

        window.addEventListener(
            "resize",
            resizeSolarCanvas
        );

        requestAnimationFrame(
            drawSolarSystem
        );
    }


    /* =====================================================
       CHALLENGE
    ====================================================== */

    const challengeButtons =
        document.querySelectorAll(
            ".challenge-options button"
        );

    challengeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const answer =
                        button.dataset.answer;

                    const result =
                        $("challenge-result");


                    /*
                     * T² ∝ a³
                     *
                     * If a becomes 4 times:
                     *
                     * T² becomes 4³ = 64
                     *
                     * T becomes √64 = 8
                     */

                    if (
                        answer === "8"
                    ) {

                        result.innerHTML =
                            "✓ Correct! If a becomes 4×, then T² becomes 64×, so T becomes 8×. That is Kepler's Third Law in action.";

                        result.style.color =
                            "#4ade80";

                    } else {

                        result.innerHTML =
                            "Not quite. Start from T² ∝ a³. If a = 4a, then T² becomes 4³ = 64 times larger. What happens when you take the square root?";

                        result.style.color =
                            "#facc15";
                    }

                }
            );
        });


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".concept-card, " +
            ".explanation-card, " +
            ".law-section, " +
            ".application-card, " +
            ".summary-card, " +
            ".misconception-grid article"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.style.opacity =
                                    "1";

                                entry.target.style.transform =
                                    "translateY(0)";

                                observer.unobserve(
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
            element => {

                element.style.opacity = "0";

                element.style.transform =
                    "translateY(24px)";

                element.style.transition =
                    "opacity 0.7s ease, transform 0.7s ease";

                observer.observe(
                    element
                );
            }
        );
    }


    /* =====================================================
       INITIAL MESSAGE
    ====================================================== */

    console.log(
        "Physics Lab — Planetary Motion loaded successfully."
    );

})();