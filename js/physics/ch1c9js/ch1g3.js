/* =========================================================
   PHYSICS LAB
   KINEMATICS — GROUP 3

   Topics:
   1. Projectile Motion
   2. Uniform Circular Motion
   3. Pendulum
   4. SHM
   5. Challenge Lab
   ========================================================= */

"use strict";


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);


function setText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


function setupCanvas(canvas) {

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 300);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return {
        ctx,
        width,
        height
    };
}


function clearCanvas(ctx, width, height) {

    ctx.clearRect(0, 0, width, height);
}


/* =========================================================
   PROJECTILE MOTION
   ========================================================= */

const projectile = {

    running: false,

    time: 0,

    lastTime: 0,

    animationId: null
};


function calculateProjectile() {

    const u = Number($("projectile-speed")?.value || 20);

    const angle =
        Number($("projectile-angle")?.value || 45);

    const g =
        Number($("projectile-g")?.value || 9.8);

    const theta = angle * Math.PI / 180;

    const ux = u * Math.cos(theta);

    const uy = u * Math.sin(theta);

    const timeOfFlight =
        (2 * uy) / g;

    const maxHeight =
        (uy * uy) / (2 * g);

    const range =
        (u * u * Math.sin(2 * theta)) / g;


    setText(
        "projectile-time",
        `${timeOfFlight.toFixed(2)} s`
    );

    setText(
        "projectile-height",
        `${maxHeight.toFixed(2)} m`
    );

    setText(
        "projectile-range",
        `${range.toFixed(2)} m`
    );

    return {
        u,
        angle,
        g,
        theta,
        ux,
        uy,
        timeOfFlight,
        maxHeight,
        range
    };
}


function drawProjectile(time) {

    const canvas = $("projectile-canvas");

    const setup = setupCanvas(canvas);

    if (!setup) return;

    const {
        ctx,
        width,
        height
    } = setup;

    clearCanvas(ctx, width, height);


    const data = calculateProjectile();

    const {
        ux,
        uy,
        g,
        timeOfFlight,
        maxHeight,
        range
    } = data;


    /* Ground */

    const groundY = height - 55;

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(35, groundY);

    ctx.lineTo(width - 25, groundY);

    ctx.stroke();


    /* Scale */

    const usableWidth = width - 75;

    const usableHeight = groundY - 35;


    const scaleX =
        range > 0
            ? usableWidth / range
            : 1;


    const scaleY =
        maxHeight > 0
            ? usableHeight / maxHeight
            : 1;


    const scale =
        Math.min(scaleX, scaleY);


    const originX = 45;


    /* Trajectory */

    ctx.beginPath();

    for (
        let t = 0;
        t <= timeOfFlight;
        t += timeOfFlight / 150
    ) {

        const x = ux * t;

        const y =
            uy * t -
            0.5 * g * t * t;


        const px =
            originX + x * scale;

        const py =
            groundY - y * scale;


        if (t === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }

    ctx.strokeStyle = "#62d9ff";
    ctx.lineWidth = 3;

    ctx.stroke();


    /* Current particle */

    const currentT =
        Math.min(time, timeOfFlight);

    const currentX =
        ux * currentT;

    const currentY =
        uy * currentT -
        0.5 * g * currentT * currentT;


    const ballX =
        originX + currentX * scale;

    const ballY =
        groundY - currentY * scale;


    ctx.beginPath();

    ctx.arc(
        ballX,
        ballY,
        8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();


    /* Initial velocity vector */

    if (time === 0) {

        const arrowLength = 55;

        const arrowX =
            Math.cos(data.theta) * arrowLength;

        const arrowY =
            -Math.sin(data.theta) * arrowLength;


        ctx.strokeStyle = "#8b7cff";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            originX,
            groundY
        );

        ctx.lineTo(
            originX + arrowX,
            groundY + arrowY
        );

        ctx.stroke();

    }

}


function projectileAnimation(timestamp) {

    if (!projectile.running) return;


    if (!projectile.lastTime) {
        projectile.lastTime = timestamp;
    }


    const dt =
        (timestamp - projectile.lastTime) / 1000;


    projectile.lastTime = timestamp;

    projectile.time += dt;


    const data = calculateProjectile();


    if (projectile.time >= data.timeOfFlight) {

        projectile.time = 0;

        projectile.running = false;

        projectile.lastTime = 0;

        drawProjectile(0);

        return;
    }


    drawProjectile(projectile.time);

    projectile.animationId =
        requestAnimationFrame(projectileAnimation);
}


function startProjectile() {

    projectile.running = true;

    projectile.time = 0;

    projectile.lastTime = 0;

    cancelAnimationFrame(projectile.animationId);

    projectile.animationId =
        requestAnimationFrame(projectileAnimation);
}


/* =========================================================
   CIRCULAR MOTION
   ========================================================= */

const circular = {

    running: false,

    angle: 0,

    lastTime: 0,

    animationId: null
};


function drawCircle(timeStep = 0) {

    const canvas = $("circle-canvas");

    const setup = setupCanvas(canvas);

    if (!setup) return;

    const {
        ctx,
        width,
        height
    } = setup;


    clearCanvas(ctx, width, height);


    const radius =
        Number($("circle-radius")?.value || 100);

    const speed =
        Number($("circle-speed")?.value || 20);


    const acceleration =
        speed * speed / radius;


    setText(
        "circle-speed-output",
        `${speed.toFixed(1)} m/s`
    );


    setText(
        "circle-acceleration",
        `${acceleration.toFixed(2)} m/s²`
    );


    const cx = width / 2;

    const cy = height / 2;

    const visualRadius =
        Math.min(width, height) * 0.32;


    /* Circle */

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        visualRadius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.22)";

    ctx.lineWidth = 2;

    ctx.stroke();


    /* Centre */

    ctx.beginPath();

    ctx.arc(
        cx,
        cy,
        4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();


    /* Object */

    const x =
        cx +
        visualRadius *
        Math.cos(circular.angle);


    const y =
        cy +
        visualRadius *
        Math.sin(circular.angle);


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        9,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#62d9ff";

    ctx.fill();


    /* Radius vector */

    ctx.beginPath();

    ctx.moveTo(cx, cy);

    ctx.lineTo(x, y);

    ctx.strokeStyle =
        "rgba(139,124,255,0.7)";

    ctx.stroke();


    /* Centripetal acceleration arrow */

    const dx = cx - x;

    const dy = cy - y;

    const magnitude =
        Math.sqrt(dx * dx + dy * dy);

    const arrowLength = 55;

    const ax =
        dx / magnitude * arrowLength;

    const ay =
        dy / magnitude * arrowLength;


    ctx.beginPath();

    ctx.moveTo(x, y);

    ctx.lineTo(
        x + ax,
        y + ay
    );

    ctx.strokeStyle = "#59e391";

    ctx.lineWidth = 3;

    ctx.stroke();


    if (circular.running) {

        circular.angle +=
            speed / radius *
            timeStep;

    }

}


function circularAnimation(timestamp) {

    if (!circular.running) return;


    if (!circular.lastTime) {
        circular.lastTime = timestamp;
    }


    const dt =
        (timestamp - circular.lastTime) / 1000;


    circular.lastTime = timestamp;


    drawCircle(dt);


    circular.animationId =
        requestAnimationFrame(circularAnimation);
}


function startCircularMotion() {

    circular.running =
        !circular.running;


    if (circular.running) {

        circular.lastTime = 0;

        circular.animationId =
            requestAnimationFrame(
                circularAnimation
            );

    } else {

        cancelAnimationFrame(
            circular.animationId
        );

        drawCircle();

    }

}


/* =========================================================
   PENDULUM
   ========================================================= */

const pendulum = {

    running: false,

    time: 0,

    lastTime: 0,

    animationId: null
};


function calculatePendulumPeriod() {

    const L =
        Number($("pendulum-length")?.value || 1);

    const g =
        Number($("pendulum-g")?.value || 9.8);


    return 2 * Math.PI *
        Math.sqrt(L / g);
}


function drawPendulum(timeStep = 0) {

    const canvas = $("pendulum-canvas");

    const setup = setupCanvas(canvas);

    if (!setup) return;


    const {
        ctx,
        width,
        height
    } = setup;


    clearCanvas(ctx, width, height);


    const L =
        Number($("pendulum-length")?.value || 1);

    const g =
        Number($("pendulum-g")?.value || 9.8);

    const angle =
        Number($("pendulum-angle")?.value || 20);


    const period =
        calculatePendulumPeriod();


    setText(
        "pendulum-period",
        `${period.toFixed(2)} s`
    );


    setText(
        "pendulum-length-output",
        `${L.toFixed(1)} m`
    );


    setText(
        "pendulum-g-output",
        `${g.toFixed(1)} m/s²`
    );


    const pivotX =
        width / 2;

    const pivotY = 45;


    const visualLength =
        Math.min(
            height * 0.55,
            width * 0.38
        );


    const maxAngle =
        angle * Math.PI / 180;


    let currentAngle = 0;


    if (pendulum.running) {

        const omega =
            2 * Math.PI / period;


        currentAngle =
            maxAngle *
            Math.cos(
                omega *
                pendulum.time
            );

    }


    const bobX =
        pivotX +
        visualLength *
        Math.sin(currentAngle);


    const bobY =
        pivotY +
        visualLength *
        Math.cos(currentAngle);


    /* Pivot */

    ctx.beginPath();

    ctx.arc(
        pivotX,
        pivotY,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();


    /* String */

    ctx.beginPath();

    ctx.moveTo(
        pivotX,
        pivotY
    );

    ctx.lineTo(
        bobX,
        bobY
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.65)";

    ctx.lineWidth = 2;

    ctx.stroke();


    /* Bob */

    ctx.beginPath();

    ctx.arc(
        bobX,
        bobY,
        15,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#62d9ff";

    ctx.fill();


    if (pendulum.running) {

        pendulum.time += timeStep;

    }

}


function pendulumAnimation(timestamp) {

    if (!pendulum.running) return;


    if (!pendulum.lastTime) {

        pendulum.lastTime = timestamp;

    }


    const dt =
        (timestamp - pendulum.lastTime) / 1000;


    pendulum.lastTime = timestamp;


    drawPendulum(dt);


    pendulum.animationId =
        requestAnimationFrame(
            pendulumAnimation
        );
}


function startPendulum() {

    pendulum.running =
        !pendulum.running;


    if (pendulum.running) {

        pendulum.lastTime = 0;

        pendulum.animationId =
            requestAnimationFrame(
                pendulumAnimation
            );

    } else {

        cancelAnimationFrame(
            pendulum.animationId
        );

        drawPendulum();

    }

}


/* =========================================================
   SHM
   ========================================================= */

const shm = {

    running: false,

    time: 0,

    lastTime: 0,

    animationId: null
};


function drawSHM(timeStep = 0) {

    const canvas = $("shm-canvas");

    const setup = setupCanvas(canvas);

    if (!setup) return;


    const {
        ctx,
        width,
        height
    } = setup;


    clearCanvas(ctx, width, height);


    const A =
        Number($("shm-amplitude")?.value || 2);

    const omega =
        Number($("shm-frequency")?.value || 2);


    const x =
        A *
        Math.cos(
            omega *
            shm.time
        );


    const normalized =
        x / A;


    const PE =
        normalized *
        normalized;


    const KE =
        1 - PE;


    const peBar =
        $("shm-pe-bar");

    const keBar =
        $("shm-ke-bar");


    if (peBar) {
        peBar.style.width =
            `${PE * 100}%`;
    }


    if (keBar) {
        keBar.style.width =
            `${KE * 100}%`;
    }


    const centerX =
        width / 2;

    const centerY =
        height / 2;


    const visualAmplitude =
        Math.min(
            width * 0.38,
            220
        );


    const particleX =
        centerX +
        normalized *
        visualAmplitude;


    /* Equilibrium line */

    ctx.beginPath();

    ctx.moveTo(30, centerY);

    ctx.lineTo(width - 30, centerY);

    ctx.strokeStyle =
        "rgba(255,255,255,0.2)";

    ctx.stroke();


    /* Particle */

    ctx.beginPath();

    ctx.arc(
        particleX,
        centerY,
        14,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#62d9ff";

    ctx.fill();


    /* Centre */

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();


    if (shm.running) {

        shm.time += timeStep;

    }

}


function shmAnimation(timestamp) {

    if (!shm.running) return;


    if (!shm.lastTime) {

        shm.lastTime = timestamp;

    }


    const dt =
        (timestamp - shm.lastTime) / 1000;


    shm.lastTime = timestamp;


    drawSHM(dt);


    shm.animationId =
        requestAnimationFrame(
            shmAnimation
        );
}


function startSHM() {

    shm.running =
        !shm.running;


    if (shm.running) {

        shm.lastTime = 0;

        shm.animationId =
            requestAnimationFrame(
                shmAnimation
            );

    } else {

        cancelAnimationFrame(
            shm.animationId
        );

        drawSHM();

    }

}


/* =========================================================
   CHALLENGE QUESTIONS
   20 HARD QUESTIONS
   ========================================================= */

const challenges = [

    {
        q:
        "A projectile is launched at 20 m/s at an angle of 30° above horizontal. Ignoring air resistance, which quantity remains constant throughout its flight?",

        options: [
            "Vertical velocity",
            "Horizontal velocity",
            "Speed",
            "Direction of velocity"
        ],

        answer: 1,

        explanation:
        "Horizontal acceleration is zero, so horizontal velocity remains constant. Vertical velocity changes continuously because gravity acts downward."
    },


    {
        q:
        "A projectile reaches its highest point. Which statement is correct?",

        options: [
            "Both horizontal and vertical velocity are zero",
            "Horizontal velocity is zero but vertical velocity is non-zero",
            "Vertical velocity is zero but horizontal velocity is non-zero",
            "Acceleration becomes zero"
        ],

        answer: 2,

        explanation:
        "At the highest point, the vertical component becomes zero momentarily. The horizontal component remains u cosθ and gravity still acts downward."
    },


    {
        q:
        "Two projectiles are launched with the same speed at 30° and 60°. Ignoring air resistance, what can be said about their ranges?",

        options: [
            "30° has twice the range",
            "60° has twice the range",
            "Their ranges are equal",
            "Their ranges depend only on mass"
        ],

        answer: 2,

        explanation:
        "Range is R = u² sin(2θ)/g. For 30°, sin60°; for 60°, sin120°. These values are equal."
    },


    {
        q:
        "A projectile is launched horizontally from a cliff. If its horizontal speed is doubled while height remains unchanged, what happens to the time taken to reach the ground?",

        options: [
            "It doubles",
            "It becomes half",
            "It remains unchanged",
            "It becomes four times"
        ],

        answer: 2,

        explanation:
        "Vertical motion determines the time of fall. Horizontal speed does not affect the vertical equation."
    },


    {
        q:
        "A body moves around a circle at constant speed. Is its acceleration zero?",

        options: [
            "Yes, because speed is constant",
            "Yes, because displacement is constant",
            "No, because velocity direction changes",
            "No, because its mass changes"
        ],

        answer: 2,

        explanation:
        "Velocity is a vector. Even when its magnitude remains constant, changing direction means velocity changes, producing acceleration."
    },


    {
        q:
        "If the speed of an object moving in a circle is doubled while radius remains unchanged, its centripetal acceleration becomes:",

        options: [
            "Two times",
            "Four times",
            "Half",
            "Unchanged"
        ],

        answer: 1,

        explanation:
        "a = v²/r. Doubling v multiplies v² by four."
    },


    {
        q:
        "A car moves around a circular track at constant speed. At which point is its velocity changing?",

        options: [
            "Only at the starting point",
            "Only at the highest point",
            "Continuously",
            "Never"
        ],

        answer: 2,

        explanation:
        "The direction of velocity changes continuously as the car moves around the circle."
    },


    {
        q:
        "The centripetal acceleration of a particle points:",

        options: [
            "Away from the centre",
            "Tangentially forward",
            "Toward the centre",
            "Opposite to velocity always"
        ],

        answer: 2,

        explanation:
        "Centripetal acceleration is directed radially inward, toward the centre of circular motion."
    },


    {
        q:
        "A pendulum has length L. If its length becomes four times, its time period becomes:",

        options: [
            "Four times",
            "Two times",
            "Half",
            "Unchanged"
        ],

        answer: 1,

        explanation:
        "T = 2π√(L/g). Replacing L by 4L gives T' = 2T."
    },


    {
        q:
        "A pendulum is taken from Earth to a place where gravitational acceleration is smaller. What happens to its period?",

        options: [
            "It decreases",
            "It increases",
            "It becomes zero",
            "It remains exactly unchanged"
        ],

        answer: 1,

        explanation:
        "T = 2π√(L/g). Smaller g means a larger value of T."
    },


    {
        q:
        "At the extreme position of an ideal pendulum, which quantity is momentarily zero?",

        options: [
            "Potential energy",
            "Speed",
            "Mass",
            "Gravity"
        ],

        answer: 1,

        explanation:
        "The bob momentarily stops at the extreme position, so its instantaneous speed is zero."
    },


    {
        q:
        "For ideal SHM, acceleration is proportional to:",

        options: [
            "Velocity in the same direction",
            "Displacement in the opposite direction",
            "Mass only",
            "Time only"
        ],

        answer: 1,

        explanation:
        "SHM is defined by a = −ω²x. The negative sign indicates that acceleration is opposite to displacement."
    },


    {
        q:
        "At the equilibrium position of an ideal SHM particle, the magnitude of displacement is:",

        options: [
            "Maximum",
            "Zero",
            "Equal to amplitude",
            "Infinite"
        ],

        answer: 1,

        explanation:
        "Equilibrium is the reference position, so x = 0 there."
    },


    {
        q:
        "For x = A cos(ωt), where is the particle when t = 0?",

        options: [
            "At x = 0",
            "At x = A",
            "At x = −A",
            "At x = 2A"
        ],

        answer: 1,

        explanation:
        "Substituting t = 0 gives x = A cos0 = A."
    },


    {
        q:
        "A projectile has horizontal velocity 10 m/s and vertical velocity 10 m/s at some instant. Its speed at that instant is:",

        options: [
            "10 m/s",
            "14.14 m/s approximately",
            "20 m/s",
            "100 m/s"
        ],

        answer: 1,

        explanation:
        "Speed is the magnitude of the velocity vector: v = √(vx² + vy²) = √200 ≈ 14.14 m/s."
    },


    {
        q:
        "A particle moving in a circle suddenly loses the force responsible for circular motion. What path does it initially follow?",

        options: [
            "Radially inward",
            "Radially outward",
            "Along the tangent",
            "It immediately stops"
        ],

        answer: 2,

        explanation:
        "Without the inward force, there is no centripetal acceleration. The particle continues with its instantaneous velocity, which is tangent to the circle."
    },


    {
        q:
        "Two pendulums have the same length but are placed where g₁ > g₂. Which has the smaller time period?",

        options: [
            "The pendulum in g₁",
            "The pendulum in g₂",
            "Both have zero period",
            "Cannot be determined"
        ],

        answer: 0,

        explanation:
        "T = 2π√(L/g). Larger g produces a smaller time period."
    },


    {
        q:
        "A projectile's range is maximum for which launch angle when launched and landing at the same height?",

        options: [
            "30°",
            "45°",
            "60°",
            "90°"
        ],

        answer: 1,

        explanation:
        "R = u²sin2θ/g. The maximum value of sin2θ is 1, which occurs at 2θ = 90°, giving θ = 45°."
    },


    {
        q:
        "A particle in SHM has maximum displacement A. At x = A, which statement is correct?",

        options: [
            "Speed is maximum",
            "Speed is zero",
            "Acceleration is zero",
            "Kinetic energy is maximum"
        ],

        answer: 1,

        explanation:
        "At maximum displacement the particle momentarily stops before reversing direction, so its speed and kinetic energy are zero."
    },


    {
        q:
        "A particle travels in a circle with radius r and speed v. If both v and r are doubled, what happens to centripetal acceleration?",

        options: [
            "It becomes twice",
            "It becomes four times",
            "It becomes half",
            "It remains unchanged"
        ],

        answer: 0,

        explanation:
        "a = v²/r. New acceleration = (2v)²/(2r) = 2v²/r. Therefore it becomes twice the original value."
    }

];


/* =========================================================
   CHALLENGE RENDERING
   ========================================================= */

function renderChallenges() {

    const container =
        $("challenge-container");

    if (!container) return;


    const progress =
        document.createElement("div");

    progress.className =
        "challenge-progress";

    progress.id =
        "challenge-progress";

    progress.textContent =
        `Solved: 0 / ${challenges.length}`;


    container.appendChild(progress);


    challenges.forEach(
        (question, index) => {

            const card =
                document.createElement("article");

            card.className =
                "challenge-question";


            const title =
                document.createElement("h3");

            title.textContent =
                `${index + 1}. ${question.q}`;


            const options =
                document.createElement("div");

            options.className =
                "challenge-options";


            const feedback =
                document.createElement("div");

            feedback.className =
                "challenge-feedback";

            feedback.hidden = true;


            question.options.forEach(
                (option, optionIndex) => {

                    const button =
                        document.createElement("button");

                    button.className =
                        "challenge-option";

                    button.textContent =
                        `${String.fromCharCode(65 + optionIndex)}. ${option}`;


                    button.addEventListener(
                        "click",
                        () => {

                            if (
                                card.dataset.solved === "true"
                            ) {
                                return;
                            }


                            if (
                                optionIndex === question.answer
                            ) {

                                button.classList.add(
                                    "correct"
                                );

                                card.dataset.solved =
                                    "true";


                                feedback.hidden =
                                    false;


                                feedback.innerHTML =
                                    `<strong>Correct.</strong>
                                    You reached the answer through
                                    the physics, not memorisation.`;


                                updateChallengeProgress();

                            } else {

                                button.classList.add(
                                    "wrong"
                                );


                                feedback.hidden =
                                    false;


                                feedback.innerHTML =
                                    `<strong>Not quite.</strong><br>
                                    Think again. ${question.explanation}`;

                            }

                        }
                    );


                    options.appendChild(button);

                }
            );


            card.appendChild(title);

            card.appendChild(options);

            card.appendChild(feedback);

            container.appendChild(card);

        }
    );

}


function updateChallengeProgress() {

    const solved =
        document.querySelectorAll(
            '.challenge-question[data-solved="true"]'
        ).length;


    const progress =
        $("challenge-progress");


    if (progress) {

        progress.textContent =
            `Solved: ${solved} / ${challenges.length}`;

    }

}


/* =========================================================
   RANGE LISTENERS
   ========================================================= */

function updateProjectileLabels() {

    setText(
        "projectile-speed-value",
        $("projectile-speed")?.value
    );

    setText(
        "projectile-angle-value",
        $("projectile-angle")?.value
    );

    setText(
        "projectile-g-value",
        $("projectile-g")?.value
    );

    drawProjectile(0);
}


function updateCircleLabels() {

    setText(
        "circle-radius-value",
        $("circle-radius")?.value
    );

    setText(
        "circle-speed-value",
        $("circle-speed")?.value
    );

    drawCircle();
}


function updatePendulumLabels() {

    setText(
        "pendulum-length-value",
        $("pendulum-length")?.value
    );

    setText(
        "pendulum-g-value",
        $("pendulum-g")?.value
    );

    setText(
        "pendulum-angle-value",
        $("pendulum-angle")?.value
    );

    drawPendulum();
}


function updateSHMLabels() {

    setText(
        "shm-amplitude-value",
        $("shm-amplitude")?.value
    );

    setText(
        "shm-frequency-value",
        $("shm-frequency")?.value
    );

    drawSHM();
}


/* =========================================================
   INITIALISATION
   ========================================================= */

function initialiseKinematicsGroup3() {

    /* Projectile */

    [
        "projectile-speed",
        "projectile-angle",
        "projectile-g"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updateProjectileLabels
        );

    });


    $("projectile-start")
        ?.addEventListener(
            "click",
            startProjectile
        );


    /* Circular motion */

    [
        "circle-radius",
        "circle-speed"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updateCircleLabels
        );

    });


    $("circle-start")
        ?.addEventListener(
            "click",
            startCircularMotion
        );


    /* Pendulum */

    [
        "pendulum-length",
        "pendulum-g",
        "pendulum-angle"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updatePendulumLabels
        );

    });


    $("pendulum-start")
        ?.addEventListener(
            "click",
            startPendulum
        );


    /* SHM */

    [
        "shm-amplitude",
        "shm-frequency"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updateSHMLabels
        );

    });


    $("shm-start")
        ?.addEventListener(
            "click",
            startSHM
        );


    /* Initial drawings */

    updateProjectileLabels();

    updateCircleLabels();

    updatePendulumLabels();

    updateSHMLabels();


    /* Questions */

    renderChallenges();

}


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        drawProjectile(0);

        drawCircle();

        drawPendulum();

        drawSHM();

    }
);


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialiseKinematicsGroup3
    );

} else {

    initialiseKinematicsGroup3();

}
