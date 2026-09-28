/* =========================================================
   ROCKETS & SATELLITES
   INTERACTIVE SPACE ENGINE
========================================================= */

"use strict";


/* =========================================================
   CONSTANTS
========================================================= */

const G = 6.67430e-11;

const EARTH_MASS = 5.972e24;

const EARTH_RADIUS = 6.371e6;

const EARTH_MU = G * EARTH_MASS;

const EARTH_G = 9.81;

const TWO_PI = Math.PI * 2;


/* =========================================================
   HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: decimals
        }
    );
}


/* =========================================================
   SPACE BACKGROUND
========================================================= */

const backgroundCanvas = $("space-background");

if (backgroundCanvas) {

    const ctx = backgroundCanvas.getContext("2d");

    let stars = [];

    let particles = [];

    let width = 0;
    let height = 0;

    function resizeBackground() {

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        backgroundCanvas.width =
            width * dpr;

        backgroundCanvas.height =
            height * dpr;

        backgroundCanvas.style.width =
            width + "px";

        backgroundCanvas.style.height =
            height + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        createStars();
        createParticles();
    }


    function createStars() {

        stars = [];

        const count =
            Math.floor(
                (width * height) / 7500
            );

        for (let i = 0; i < count; i++) {

            stars.push({

                x: Math.random() * width,

                y: Math.random() * height,

                radius:
                    Math.random() * 1.6 + 0.25,

                alpha:
                    Math.random() * 0.8 + 0.15,

                speed:
                    Math.random() * 0.3 + 0.05,

                phase:
                    Math.random() * TWO_PI

            });
        }
    }


    function createParticles() {

        particles = [];

        for (let i = 0; i < 35; i++) {

            particles.push({

                x: Math.random() * width,

                y: Math.random() * height,

                size:
                    Math.random() * 2 + .5,

                speed:
                    Math.random() * .45 + .15,

                alpha:
                    Math.random() * .4 + .1,

                drift:
                    (Math.random() - .5) * .25

            });
        }
    }


    function drawBackground(time) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /* Stars */

        for (const star of stars) {

            const twinkle =
                star.alpha +
                Math.sin(
                    time * 0.001 * star.speed * 10 +
                    star.phase
                ) * .18;

            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.radius,
                0,
                TWO_PI
            );

            ctx.fillStyle =
                `rgba(220,240,255,${clamp(twinkle,0.05,1)})`;

            ctx.fill();
        }


        /* Floating cosmic dust */

        for (const p of particles) {

            p.y -= p.speed;
            p.x += p.drift;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                TWO_PI
            );

            ctx.fillStyle =
                `rgba(80,180,255,${p.alpha})`;

            ctx.fill();
        }


        requestAnimationFrame(drawBackground);
    }


    resizeBackground();

    window.addEventListener(
        "resize",
        resizeBackground
    );

    requestAnimationFrame(drawBackground);
}


/* =========================================================
   FALLING SATELLITE CONCEPT CANVAS
========================================================= */

const fallCanvas = $("fall-orbit-canvas");

if (fallCanvas) {

    const ctx =
        fallCanvas.getContext("2d");

    let fallAngle = 0;

    function resizeFallCanvas() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        const rect =
            fallCanvas.getBoundingClientRect();

        fallCanvas.width =
            rect.width * dpr;

        fallCanvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function drawFallOrbit() {

        const w =
            fallCanvas.clientWidth;

        const h =
            fallCanvas.clientHeight;

        ctx.clearRect(0,0,w,h);

        const cx = w / 2;
        const cy = h / 2;

        const earthRadius =
            Math.min(w,h) * .19;

        const orbitRadius =
            Math.min(w,h) * .36;


        /* Orbit */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            orbitRadius,
            0,
            TWO_PI
        );

        ctx.strokeStyle =
            "rgba(57,231,255,.24)";

        ctx.lineWidth = 2;

        ctx.setLineDash([8,12]);

        ctx.stroke();

        ctx.setLineDash([]);


        /* Earth */

        const gradient =
            ctx.createRadialGradient(
                cx - earthRadius * .3,
                cy - earthRadius * .4,
                5,
                cx,
                cy,
                earthRadius
            );

        gradient.addColorStop(
            0,
            "#4de4ff"
        );

        gradient.addColorStop(
            .55,
            "#2075c8"
        );

        gradient.addColorStop(
            1,
            "#092c65"
        );

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            earthRadius,
            0,
            TWO_PI
        );

        ctx.fillStyle = gradient;

        ctx.shadowBlur = 35;

        ctx.shadowColor =
            "rgba(57,231,255,.35)";

        ctx.fill();

        ctx.shadowBlur = 0;


        /* Satellite */

        fallAngle += .006;

        const sx =
            cx +
            Math.cos(fallAngle) *
            orbitRadius;

        const sy =
            cy +
            Math.sin(fallAngle) *
            orbitRadius;


        ctx.save();

        ctx.translate(
            sx,
            sy
        );

        ctx.rotate(
            fallAngle + Math.PI / 2
        );


        ctx.fillStyle =
            "#e9f4ff";

        ctx.fillRect(
            -10,
            -5,
            20,
            10
        );


        ctx.fillStyle =
            "#4de4ff";

        ctx.fillRect(
            -27,
            -5,
            13,
            10
        );

        ctx.fillRect(
            14,
            -5,
            13,
            10
        );


        ctx.restore();


        /* Velocity tangent */

        drawArrow(
            ctx,
            sx,
            sy,
            sx -
            Math.sin(fallAngle) * 70,
            sy +
            Math.cos(fallAngle) * 70,
            "#39e7ff",
            3
        );


        /* Gravity inward */

        drawArrow(
            ctx,
            sx,
            sy,
            sx +
            (cx - sx) * .27,
            sy +
            (cy - sy) * .27,
            "#ff9f43",
            3
        );


        requestAnimationFrame(
            drawFallOrbit
        );
    }


    resizeFallCanvas();

    window.addEventListener(
        "resize",
        resizeFallCanvas
    );

    drawFallOrbit();
}


/* =========================================================
   ARROW DRAWING
========================================================= */

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    lineWidth = 3
) {

    const angle =
        Math.atan2(
            y2-y1,
            x2-x1
        );

    const head = 9;

    ctx.save();

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.lineWidth = lineWidth;

    ctx.beginPath();

    ctx.moveTo(x1,y1);

    ctx.lineTo(x2,y2);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
        head * Math.cos(angle - Math.PI/6),
        y2 -
        head * Math.sin(angle - Math.PI/6)
    );

    ctx.lineTo(
        x2 -
        head * Math.cos(angle + Math.PI/6),
        y2 -
        head * Math.sin(angle + Math.PI/6)
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   ORBIT SIMULATOR
========================================================= */

const orbitCanvas = $("orbit-canvas");

const altitudeSlider =
    $("satellite-altitude");

const altitudeValue =
    $("altitude-value");

const orbitalSpeedOutput =
    $("orbital-speed");

const orbitalPeriodOutput =
    $("orbital-period");

const orbitGravityOutput =
    $("orbit-gravity");

const orbitRadiusOutput =
    $("orbit-radius");

const orbitTypeOutput =
    $("orbit-type");

const orbitStatusText =
    $("orbit-status-text");

const orbitWhy =
    $("orbit-why");

const orbitPause =
    $("orbit-pause");


let orbitPaused = false;

let orbitAngle = 0;


if (
    orbitCanvas &&
    altitudeSlider
) {

    const ctx =
        orbitCanvas.getContext("2d");


    function resizeOrbitCanvas() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        const rect =
            orbitCanvas.getBoundingClientRect();

        orbitCanvas.width =
            rect.width * dpr;

        orbitCanvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function getOrbitData() {

        const altitudeKm =
            Number(
                altitudeSlider.value
            );

        const r =
            EARTH_RADIUS +
            altitudeKm * 1000;

        const v =
            Math.sqrt(
                EARTH_MU / r
            );

        const period =
            TWO_PI *
            Math.sqrt(
                Math.pow(r,3) /
                EARTH_MU
            );

        const g =
            EARTH_MU /
            Math.pow(r,2);


        return {
            altitudeKm,
            r,
            v,
            period,
            g
        };
    }


    function classifyOrbit(altitude) {

        if (altitude < 2000) {

            return {
                short: "LEO",
                long: "Low Earth Orbit"
            };

        }

        if (altitude < 35786) {

            return {
                short: "MEO",
                long: "Medium Earth Orbit"
            };

        }

        if (
            Math.abs(
                altitude - 35786
            ) < 1500
        ) {

            return {
                short: "GEO",
                long: "Geostationary region"
            };
        }

        return {
            short: "HIGH",
            long: "High Earth orbit"
        };
    }


    function updateOrbitInfo() {

        const data =
            getOrbitData();

        const type =
            classifyOrbit(
                data.altitudeKm
            );


        altitudeValue.textContent =
            `${formatNumber(data.altitudeKm,0)} km`;


        orbitalSpeedOutput.textContent =
            `${(data.v/1000).toFixed(2)} km/s`;


        orbitalPeriodOutput.textContent =
            `${(data.period/60).toFixed(1)} min`;


        orbitGravityOutput.textContent =
            `${data.g.toFixed(2)} m/s²`;


        orbitRadiusOutput.textContent =
            `${formatNumber(data.r/1000,0)} km`;


        orbitTypeOutput.textContent =
            type.short;


        orbitStatusText.textContent =
            type.long;


        if (data.altitudeKm < 2000) {

            orbitWhy.textContent =
                "At this altitude, Earth’s gravity is still strong. "
                +
                "The satellite needs a high sideways orbital speed. "
                +
                "Gravity continuously bends its path toward Earth while "
                +
                "its forward motion carries it around the planet.";

        } else if (
            Math.abs(data.altitudeKm - 35786) < 1500
        ) {

            orbitWhy.textContent =
                "Near geostationary altitude, the orbital period approaches "
                +
                "Earth's rotation period. A suitable equatorial orbit can "
                +
                "therefore make the satellite appear nearly fixed over one region.";

        } else {

            orbitWhy.textContent =
                "As orbital radius increases, gravity becomes weaker and "
                +
                "the circular-orbit speed decreases. But the larger orbit "
                +
                "also takes much longer to complete.";
        }
    }


    function drawOrbit() {

        const w =
            orbitCanvas.clientWidth;

        const h =
            orbitCanvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        const cx =
            w / 2;

        const cy =
            h / 2;


        const data =
            getOrbitData();


        /* Background stars */

        for (let i=0; i<35; i++) {

            const x =
                (i * 97) % w;

            const y =
                (i * 53) % h;

            ctx.fillStyle =
                "rgba(180,220,255,.22)";

            ctx.fillRect(
                x,
                y,
                1.5,
                1.5
            );
        }


        const earthRadius =
            Math.min(w,h) * .15;


        /* Orbit visual radius */

        const visualRadius =
            Math.min(w,h) *
            (
                .28 +
                .15 *
                (
                    data.altitudeKm /
                    36000
                )
            );


        /* Orbit ring */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            visualRadius,
            0,
            TWO_PI
        );

        ctx.strokeStyle =
            "rgba(57,231,255,.25)";

        ctx.lineWidth = 2;

        ctx.setLineDash([
            7,
            10
        ]);

        ctx.stroke();

        ctx.setLineDash([]);


        /* Earth glow */

        const glow =
            ctx.createRadialGradient(
                cx,
                cy,
                earthRadius * .3,
                cx,
                cy,
                earthRadius * 2
            );

        glow.addColorStop(
            0,
            "rgba(57,231,255,.25)"
        );

        glow.addColorStop(
            1,
            "rgba(57,231,255,0)"
        );

        ctx.fillStyle = glow;

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            earthRadius * 2,
            0,
            TWO_PI
        );

        ctx.fill();


        /* Earth */

        const earthGradient =
            ctx.createRadialGradient(
                cx-earthRadius*.35,
                cy-earthRadius*.35,
                3,
                cx,
                cy,
                earthRadius
            );

        earthGradient.addColorStop(
            0,
            "#62edff"
        );

        earthGradient.addColorStop(
            .45,
            "#207ac9"
        );

        earthGradient.addColorStop(
            1,
            "#071d4b"
        );


        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            earthRadius,
            0,
            TWO_PI
        );

        ctx.fillStyle =
            earthGradient;

        ctx.fill();


        /* Continents-like shapes */

        ctx.fillStyle =
            "rgba(82,242,163,.45)";

        ctx.beginPath();

        ctx.arc(
            cx-earthRadius*.25,
            cy-earthRadius*.1,
            earthRadius*.28,
            0,
            4.2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            cx+earthRadius*.35,
            cy+earthRadius*.22,
            earthRadius*.18,
            0,
            TWO_PI
        );

        ctx.fill();


        /* Satellite */

        if (!orbitPaused) {

            orbitAngle +=
                0.008 *
                (
                    40000 /
                    (data.altitudeKm + 1000)
                );
        }


        const sx =
            cx +
            Math.cos(orbitAngle) *
            visualRadius;

        const sy =
            cy +
            Math.sin(orbitAngle) *
            visualRadius;


        ctx.save();

        ctx.translate(
            sx,
            sy
        );

        ctx.rotate(
            orbitAngle + Math.PI/2
        );


        /* Satellite glow */

        ctx.shadowBlur = 18;

        ctx.shadowColor =
            "#ffe66d";


        ctx.fillStyle =
            "#f4f8ff";

        ctx.fillRect(
            -11,
            -5,
            22,
            10
        );


        ctx.shadowBlur = 0;


        ctx.fillStyle =
            "#39e7ff";

        ctx.fillRect(
            -29,
            -5,
            14,
            10
        );

        ctx.fillRect(
            15,
            -5,
            14,
            10
        );


        ctx.fillStyle =
            "#ffcf4d";

        ctx.fillRect(
            -3,
            -11,
            6,
            22
        );


        ctx.restore();


        /* Radius line */

        ctx.beginPath();

        ctx.moveTo(
            cx,
            cy
        );

        ctx.lineTo(
            sx,
            sy
        );

        ctx.strokeStyle =
            "rgba(255,230,109,.45)";

        ctx.lineWidth = 1;

        ctx.stroke();


        /* Satellite label */

        ctx.fillStyle =
            "#eaf4ff";

        ctx.font =
            "700 12px system-ui";

        ctx.fillText(
            "Satellite",
            sx + 13,
            sy - 12
        );


        requestAnimationFrame(
            drawOrbit
        );
    }


    altitudeSlider.addEventListener(
        "input",
        updateOrbitInfo
    );


    orbitPause.addEventListener(
        "click",
        () => {

            orbitPaused =
                !orbitPaused;

            orbitPause.textContent =
                orbitPaused
                    ? "▶ Resume"
                    : "⏸ Pause";
        }
    );


    resizeOrbitCanvas();

    window.addEventListener(
        "resize",
        resizeOrbitCanvas
    );


    updateOrbitInfo();

    drawOrbit();
}


/* =========================================================
   GEO CANVAS
========================================================= */

const geoCanvas = $("geo-canvas");

if (geoCanvas) {

    const ctx =
        geoCanvas.getContext("2d");

    let geoAngle = 0;


    function resizeGeo() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        const rect =
            geoCanvas.getBoundingClientRect();

        geoCanvas.width =
            rect.width * dpr;

        geoCanvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function drawGeo() {

        const w =
            geoCanvas.clientWidth;

        const h =
            geoCanvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        const cx =
            w/2;

        const cy =
            h/2;

        const earthR =
            Math.min(w,h)*.18;

        const orbitR =
            Math.min(w,h)*.39;


        /* Earth */

        const earth =
            ctx.createRadialGradient(
                cx-earthR*.3,
                cy-earthR*.35,
                3,
                cx,
                cy,
                earthR
            );

        earth.addColorStop(
            0,
            "#55edff"
        );

        earth.addColorStop(
            1,
            "#07519e"
        );


        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            earthR,
            0,
            TWO_PI
        );

        ctx.fillStyle =
            earth;

        ctx.fill();


        /* Equator */

        ctx.beginPath();

        ctx.ellipse(
            cx,
            cy,
            earthR,
            earthR*.32,
            0,
            0,
            TWO_PI
        );

        ctx.strokeStyle =
            "rgba(82,242,163,.55)";

        ctx.stroke();


        /* GEO orbit */

        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            orbitR,
            0,
            TWO_PI
        );

        ctx.strokeStyle =
            "rgba(57,231,255,.22)";

        ctx.setLineDash([
            8,
            12
        ]);

        ctx.stroke();

        ctx.setLineDash([]);


        geoAngle += .004;


        const sx =
            cx +
            Math.cos(geoAngle) *
            orbitR;

        const sy =
            cy +
            Math.sin(geoAngle) *
            orbitR;


        /* Satellite */

        ctx.save();

        ctx.translate(
            sx,
            sy
        );

        ctx.rotate(
            geoAngle + Math.PI/2
        );


        ctx.fillStyle =
            "#f6faff";

        ctx.fillRect(
            -10,
            -5,
            20,
            10
        );

        ctx.fillStyle =
            "#4de4ff";

        ctx.fillRect(
            -27,
            -5,
            13,
            10
        );

        ctx.fillRect(
            14,
            -5,
            13,
            10
        );


        ctx.restore();


        /* Region on Earth */

        const regionAngle =
            0.25;

        const rx =
            cx +
            Math.cos(regionAngle) *
            earthR*.82;

        const ry =
            cy +
            Math.sin(regionAngle) *
            earthR*.82;


        ctx.beginPath();

        ctx.arc(
            rx,
            ry,
            6,
            0,
            TWO_PI
        );

        ctx.fillStyle =
            "#ffe66d";

        ctx.shadowBlur = 15;

        ctx.shadowColor =
            "#ffe66d";

        ctx.fill();

        ctx.shadowBlur = 0;


        /* Connection */

        ctx.beginPath();

        ctx.moveTo(
            rx,
            ry
        );

        ctx.lineTo(
            sx,
            sy
        );

        ctx.strokeStyle =
            "rgba(255,230,109,.18)";

        ctx.stroke();


        requestAnimationFrame(
            drawGeo
        );
    }


    resizeGeo();

    window.addEventListener(
        "resize",
        resizeGeo
    );

    drawGeo();
}


/* =========================================================
   ROCKET EXHAUST PARTICLES
========================================================= */

const exhaustCanvas =
    $("rocket-exhaust-canvas");

if (exhaustCanvas) {

    const ctx =
        exhaustCanvas.getContext("2d");

    let exhaustParticles = [];


    function resizeExhaust() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        const rect =
            exhaustCanvas.getBoundingClientRect();

        exhaustCanvas.width =
            rect.width * dpr;

        exhaustCanvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function createExhaustParticle() {

        exhaustParticles.push({

            x:
                exhaustCanvas.clientWidth/2 +
                (Math.random()-.5)*30,

            y:
                exhaustCanvas.clientHeight*.67,

            vx:
                (Math.random()-.5)*1.6,

            vy:
                Math.random()*4+2,

            size:
                Math.random()*5+2,

            life: 1,

            color:
                Math.random() > .5
                    ? "#ffb703"
                    : "#ff5d3d"

        });
    }


    function drawExhaust() {

        const w =
            exhaustCanvas.clientWidth;

        const h =
            exhaustCanvas.clientHeight;


        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        for (let i=0; i<4; i++) {
            createExhaustParticle();
        }


        exhaustParticles =
            exhaustParticles.filter(
                p => p.life > 0
            );


        for (const p of exhaustParticles) {

            p.x += p.vx;

            p.y += p.vy;

            p.size *= .97;

            p.life -= .025;


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                TWO_PI
            );

            ctx.fillStyle =
                p.color;

            ctx.globalAlpha =
                p.life;

            ctx.shadowBlur = 15;

            ctx.shadowColor =
                p.color;

            ctx.fill();
        }

        ctx.globalAlpha = 1;

        ctx.shadowBlur = 0;


        requestAnimationFrame(
            drawExhaust
        );
    }


    resizeExhaust();

    window.addEventListener(
        "resize",
        resizeExhaust
    );

    drawExhaust();
}


/* =========================================================
   ROCKET LAUNCH SIMULATOR
========================================================= */

const launchCanvas =
    $("rocket-launch-canvas");

const thrustSlider =
    $("rocket-thrust");

const massSlider =
    $("rocket-mass-slider");

const thrustValue =
    $("thrust-value");

const massValue =
    $("rocket-mass");

const rocketHeight =
    $("rocket-height");

const rocketSpeed =
    $("rocket-speed");

const launchButton =
    $("launch-button");

const launchReset =
    $("launch-reset");

const rocketWhy =
    $("rocket-why");


let launchRunning = false;

let launchTime = 0;

let launchVelocity = 0;

let launchAltitude = 0;


if (
    launchCanvas &&
    thrustSlider &&
    massSlider
) {

    const ctx =
        launchCanvas.getContext("2d");


    function resizeLaunch() {

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        const rect =
            launchCanvas.getBoundingClientRect();

        launchCanvas.width =
            rect.width * dpr;

        launchCanvas.height =
            rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function updateRocketControls() {

        const thrust =
            Number(
                thrustSlider.value
            );

        const mass =
            Number(
                massSlider.value
            );


        thrustValue.textContent =
            `${formatNumber(thrust,0)} kN`;


        massValue.textContent =
            `${formatNumber(mass,0)} kg`;


        if (!launchRunning) {

            const netForce =
                thrust * 1000 -
                mass * EARTH_G;


            if (netForce > 0) {

                rocketWhy.textContent =
                    "Thrust is greater than weight, so the net force is upward. "
                    +
                    "That means the rocket can begin accelerating upward.";

            } else {

                rocketWhy.textContent =
                    "The rocket's current thrust is not greater than its weight. "
                    +
                    "For upward acceleration, thrust must exceed weight.";
            }
        }
    }


    function resetRocket() {

        launchRunning = false;

        launchTime = 0;

        launchVelocity = 0;

        launchAltitude = 0;

        rocketHeight.textContent =
            "0 km";

        rocketSpeed.textContent =
            "0 m/s";

        rocketWhy.textContent =
            "The rocket is ready. When thrust becomes greater than "
            +
            "its weight, the net force becomes upward.";

        drawLaunch();
    }


    function launchRocket() {

        if (launchRunning) return;

        launchRunning = true;

        launchTime = 0;

        launchVelocity = 0;

        launchAltitude = 0;

        rocketWhy.textContent =
            "🚀 Liftoff! Thrust is exceeding the rocket's weight, "
            +
            "so the net force is upward.";

        requestAnimationFrame(
            launchAnimation
        );
    }


    function launchAnimation(timestamp) {

        if (!launchRunning) return;


        if (!launchAnimation.lastTime) {

            launchAnimation.lastTime =
                timestamp;
        }


        const dt =
            Math.min(
                (timestamp -
                launchAnimation.lastTime)
                / 1000,
                .04
            );


        launchAnimation.lastTime =
            timestamp;


        const thrust =
            Number(
                thrustSlider.value
            ) * 1000;


        const initialMass =
            Number(
                massSlider.value
            );


        /*
           Educational model:
           Mass slowly decreases to represent fuel consumption.
        */

        const currentMass =
            Math.max(
                initialMass * .45,
                initialMass -
                launchTime * 120
            );


        const gravityForce =
            currentMass *
            EARTH_G;


        const netForce =
            thrust -
            gravityForce;


        const acceleration =
            netForce /
            currentMass;


        launchVelocity +=
            acceleration * dt;


        launchVelocity =
            Math.max(
                0,
                launchVelocity
            );


        launchAltitude +=
            launchVelocity *
            dt;


        launchTime += dt;


        rocketHeight.textContent =
            `${(launchAltitude/1000).toFixed(2)} km`;


        rocketSpeed.textContent =
            `${launchVelocity.toFixed(1)} m/s`;


        if (
            launchTime > 12 ||
            launchAltitude > 120000
        ) {

            launchRunning = false;

            rocketWhy.textContent =
                "Simulation complete. In a real launch, the rocket's "
                +
                "mass, atmospheric drag, gravity variation, staging and "
                +
                "engine behaviour are much more complex.";
        }


        drawLaunch();

        if (launchRunning) {

            requestAnimationFrame(
                launchAnimation
            );
        }
    }


    function drawLaunch() {

        const w =
            launchCanvas.clientWidth;

        const h =
            launchCanvas.clientHeight;


        ctx.clearRect(
            0,
            0,
            w,
            h
        );


        /* Stars */

        for (let i=0; i<60; i++) {

            const x =
                (i * 83) % w;

            const y =
                (i * 47) % (h*.6);

            ctx.fillStyle =
                "rgba(220,240,255,.3)";

            ctx.fillRect(
                x,
                y,
                1.4,
                1.4
            );
        }


        /* Horizon */

        const ground =
            h * .84;


        const groundGradient =
            ctx.createLinearGradient(
                0,
                ground,
                0,
                h
            );

        groundGradient.addColorStop(
            0,
            "#24331c"
        );

        groundGradient.addColorStop(
            1,
            "#090e09"
        );


        ctx.fillStyle =
            groundGradient;

        ctx.fillRect(
            0,
            ground,
            w,
            h-ground
        );


        /* Launch platform */

        ctx.fillStyle =
            "#596273";

        ctx.fillRect(
            w/2-65,
            ground-9,
            130,
            9
        );


        /* Rocket position */

        const progress =
            clamp(
                launchAltitude / 120000,
                0,
                1
            );


        const rocketX =
            w/2;

        const rocketY =
            ground -
            35 -
            progress *
            (ground - 100);


        ctx.save();

        ctx.translate(
            rocketX,
            rocketY
        );


        /* Flame */

        const flameLength =
            launchRunning
                ? 30 +
                  Math.min(
                      launchVelocity/10,
                      70
                  )
                : 0;


        if (launchRunning) {

            const flame =
                ctx.createLinearGradient(
                    0,
                    20,
                    0,
                    20 + flameLength
                );

            flame.addColorStop(
                0,
                "#fff"
            );

            flame.addColorStop(
                .25,
                "#ffe66d"
            );

            flame.addColorStop(
                .65,
                "#ff8c42"
            );

            flame.addColorStop(
                1,
                "rgba(255,60,30,0)"
            );


            ctx.beginPath();

            ctx.moveTo(
                -13,
                15
            );

            ctx.lineTo(
                13,
                15
            );

            ctx.lineTo(
                0,
                15 + flameLength
            );

            ctx.closePath();

            ctx.fillStyle =
                flame;

            ctx.shadowBlur = 25;

            ctx.shadowColor =
                "#ff7b35";

            ctx.fill();

            ctx.shadowBlur = 0;
        }


        /* Rocket body */

        ctx.fillStyle =
            "#eaf2ff";

        ctx.fillRect(
            -16,
            -55,
            32,
            70
        );


        /* Nose */

        ctx.beginPath();

        ctx.moveTo(
            -16,
            -55
        );

        ctx.lineTo(
            0,
            -82
        );

        ctx.lineTo(
            16,
            -55
        );

        ctx.closePath();

        ctx.fillStyle =
            "#f4f7ff";

        ctx.fill();


        /* Window */

        ctx.beginPath();

        ctx.arc(
            0,
            -35,
            7,
            0,
            TWO_PI
        );

        ctx.fillStyle =
            "#27bde8";

        ctx.fill();

        ctx.strokeStyle =
            "#dffaff";

        ctx.lineWidth = 2;

        ctx.stroke();


        /* Fins */

        ctx.fillStyle =
            "#f04b58";

        ctx.beginPath();

        ctx.moveTo(
            -16,
            0
        );

        ctx.lineTo(
            -31,
            17
        );

        ctx.lineTo(
            -16,
            13
        );

        ctx.closePath();

        ctx.fill();


        ctx.beginPath();

        ctx.moveTo(
            16,
            0
        );

        ctx.lineTo(
            31,
            17
        );

        ctx.lineTo(
            16,
            13
        );

        ctx.closePath();

        ctx.fill();


        ctx.restore();
    }


    thrustSlider.addEventListener(
        "input",
        updateRocketControls
    );

    massSlider.addEventListener(
        "input",
        updateRocketControls
    );


    launchButton.addEventListener(
        "click",
        launchRocket
    );


    launchReset.addEventListener(
        "click",
        () => {

            launchAnimation.lastTime =
                null;

            resetRocket();
        }
    );


    resizeLaunch();

    window.addEventListener(
        "resize",
        resizeLaunch
    );


    updateRocketControls();

    resetRocket();
}


/* =========================================================
   FUN SPACE FACTS
========================================================= */

const facts = [

    "A satellite in orbit is continuously falling toward Earth, but its sideways velocity makes its path curve around Earth.",

    "Rockets do not need air to push against. They accelerate their own exhaust gases.",

    "For a circular orbit around the same central body, a higher orbit generally has a lower orbital speed but a longer orbital period.",

    "Geostationary satellites orbit above the equator and have an orbital period equal to Earth's rotation period.",

    "The International Space Station is in low Earth orbit and travels around Earth many times each day.",

    "Escape velocity is not a special engine setting. It is an ideal speed calculated from the gravitational field at a starting distance.",

    "A rocket becomes lighter during flight because propellant is expelled. This is one reason staging and mass management are so important.",

    "The Moon is also a natural satellite. Earth's gravity continuously bends the Moon's path around Earth.",

    "A satellite can experience substantial gravitational acceleration while astronauts inside experience apparent weightlessness because they are all in free-fall together.",

    "The same physics of force and motion learned on Earth becomes useful when designing spacecraft trajectories."
];


const factOutput =
    $("fun-fact");

const newFactButton =
    $("new-fact");


if (
    factOutput &&
    newFactButton
) {

    let factIndex = 0;


    newFactButton.addEventListener(
        "click",
        () => {

            factIndex =
                (
                    factIndex + 1
                ) %
                facts.length;


            factOutput.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(12px)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0)"
                    }
                ],
                {
                    duration: 450,
                    easing: "ease-out"
                }
            );


            factOutput.textContent =
                facts[factIndex];
        }
    );
}


/* =========================================================
   CHALLENGE
========================================================= */

const challengeButtons =
    document.querySelectorAll(
        ".challenge-options button"
    );

const challengeResult =
    $("challenge-result");


challengeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                challengeButtons.forEach(
                    b => {

                        b.classList.remove(
                            "correct-answer",
                            "wrong-answer"
                        );
                    }
                );


                if (
                    button.dataset.answer ===
                    "correct"
                ) {

                    button.classList.add(
                        "correct-answer"
                    );

                    challengeResult.textContent =
                        "✅ Correct! For a circular orbit, v = √(GM/r), so increasing r decreases orbital speed.";

                    challengeResult.style.color =
                        "#52f2a3";

                } else {

                    button.classList.add(
                        "wrong-answer"
                    );

                    challengeResult.textContent =
                        "❌ Think about v = √(GM/r). What happens when r increases?";

                    challengeResult.style.color =
                        "#ff8fa0";
                }
            }
        );
    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".info-card, .orbit-type-card, .use-card, " +
        ".logic-step, .rocket-step, .stage-card, " +
        ".misconception-grid article, .summary-grid div"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                (entry,index) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "reveal-space",
                            "visible"
                        );

                        entry.target.style.transitionDelay =
                            `${Math.min(index * 40, 300)}ms`;

                        revealObserver.unobserve(
                            entry.target
                        );
                    }
                }
            );
        },
        {
            threshold: .12
        }
    );


revealElements.forEach(
    element => {

        element.classList.add(
            "reveal-space"
        );

        revealObserver.observe(
            element
        );
    }
);


/* =========================================================
   SMALL MOUSE PARALLAX FOR HERO
========================================================= */

const heroSystem =
    document.querySelector(
        ".hero-space-system"
    );


if (heroSystem) {

    window.addEventListener(
        "mousemove",
        event => {

            const x =
                (
                    event.clientX /
                    window.innerWidth -
                    .5
                );

            const y =
                (
                    event.clientY /
                    window.innerHeight -
                    .5
                );


            heroSystem.style.transform =
                `translate(
                    ${x * 14}px,
                    ${y * 14}px
                )`;
        }
    );
}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.classList.add(
            "space-page-loaded"
        );

        console.log(
            "🚀 Physics Lab — Rockets & Satellites loaded."
        );
    }
);