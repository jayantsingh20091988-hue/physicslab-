/* =========================================================
   MOTION & REFERENCE FRAME
   Physics Lab — Kinematics Module 01
   ========================================================= */

"use strict";


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

function setupCanvas(canvas) {

    if (!canvas) return null;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height, 200);

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


/* =========================================================
   REFERENCE FRAME SIMULATION
   ========================================================= */

const referenceCanvas = $("reference-canvas");
const referenceFrame = $("reference-frame");
const referenceObservation = $("reference-observation");

let referenceTime = 0;


function drawReferenceFrame() {

    const setup = setupCanvas(referenceCanvas);

    if (!setup) return;

    const { ctx, width, height } = setup;

    ctx.clearRect(0, 0, width, height);

    /*
     * Ground
     */

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(0, height * 0.72);
    ctx.lineTo(width, height * 0.72);
    ctx.stroke();


    /*
     * Train
     */

    const trainSpeed = 45;
    const trainX =
        ((referenceTime * trainSpeed) % (width + 220)) - 220;

    const trainY = height * 0.55;

    ctx.fillStyle = "#26364b";
    ctx.fillRect(trainX, trainY, 220, 65);


    /*
     * Train windows
     */

    ctx.fillStyle = "#38bdf8";

    for (let i = 0; i < 3; i++) {

        ctx.fillRect(
            trainX + 20 + i * 62,
            trainY + 12,
            42,
            28
        );
    }


    /*
     * Passenger
     */

    const passengerX = trainX + 105;
    const passengerY = trainY + 8;

    ctx.fillStyle = "#f8fafc";

    ctx.beginPath();
    ctx.arc(
        passengerX,
        passengerY,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillRect(
        passengerX - 6,
        passengerY + 8,
        12,
        25
    );


    /*
     * Observer frame
     */

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Arial";

    if (referenceFrame.value === "ground") {

        ctx.fillText(
            "GROUND REFERENCE FRAME",
            20,
            30
        );

        ctx.fillText(
            "Passenger changes position → MOTION",
            20,
            height - 25
        );

        referenceObservation.textContent =
            "From the ground, the passenger moves because the train changes its position.";

    } else {

        ctx.fillText(
            "TRAIN REFERENCE FRAME",
            20,
            30
        );

        ctx.fillText(
            "Passenger position remains fixed → REST",
            20,
            height - 25
        );

        referenceObservation.textContent =
            "From the train, the seated passenger remains at rest.";
    }


    referenceTime += 0.016;

    requestAnimationFrame(drawReferenceFrame);
}

if (referenceCanvas) {
    drawReferenceFrame();
}


/* =========================================================
   MOTION TYPE SIMULATION
   ========================================================= */

const motionCanvas = $("motion-canvas");
const motionMode = $("motion-mode");
const motionSpeed = $("motion-speed");
const motionSpeedValue = $("motion-speed-value");
const motionObservation = $("motion-observation");

let motionTime = 0;


function drawMotion() {

    const setup = setupCanvas(motionCanvas);

    if (!setup) return;

    const { ctx, width, height } = setup;

    ctx.clearRect(0, 0, width, height);

    const speed =
        Number(motionSpeed.value) * 0.7;

    motionTime += speed * 0.02;


    /*
     * Path
     */

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;

    ctx.beginPath();

    if (motionMode.value === "linear") {

        ctx.moveTo(
            30,
            height / 2
        );

        ctx.lineTo(
            width - 30,
            height / 2
        );

    } else if (motionMode.value === "circular") {

        ctx.arc(
            width / 2,
            height / 2,
            Math.min(width, height) * 0.30,
            0,
            Math.PI * 2
        );

    } else {

        ctx.moveTo(
            30,
            height / 2
        );

        for (let x = 30; x <= width - 30; x += 4) {

            const normalized =
                (x - 30) / (width - 60);

            const y =
                height / 2 +
                Math.sin(normalized * Math.PI * 4) *
                height * 0.25;

            if (x === 30) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    }

    ctx.stroke();


    /*
     * Object position
     */

    let x;
    let y;

    if (motionMode.value === "linear") {

        const usableWidth = width - 80;

        x =
            40 +
            ((motionTime * 80) % usableWidth);

        y = height / 2;

        motionObservation.textContent =
            "The object is undergoing rectilinear motion: its path is a straight line.";

    } else if (motionMode.value === "circular") {

        const radius =
            Math.min(width, height) * 0.30;

        const centerX = width / 2;
        const centerY = height / 2;

        x =
            centerX +
            Math.cos(motionTime) * radius;

        y =
            centerY +
            Math.sin(motionTime) * radius;

        motionObservation.textContent =
            "The object follows a circular path. Its direction changes continuously.";

    } else {

        const usableWidth = width - 80;

        x =
            40 +
            ((motionTime * 55) % usableWidth);

        y =
            height / 2 +
            Math.sin(
                x / width * Math.PI * 4
            ) * height * 0.25;

        motionObservation.textContent =
            "The object repeatedly moves to and fro about a mean position.";
    }


    /*
     * Object
     */

    ctx.fillStyle = "#38bdf8";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
     * Direction indicator
     */

    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(x, y);

    ctx.lineTo(
        x + 25,
        y
    );

    ctx.stroke();


    requestAnimationFrame(drawMotion);
}


if (motionCanvas) {
    drawMotion();
}


/* =========================================================
   SPEED CONTROL
   ========================================================= */

if (motionSpeed) {

    motionSpeed.addEventListener(
        "input",
        () => {

            motionSpeedValue.textContent =
                motionSpeed.value;
        }
    );
}


/* =========================================================
   MOTION CLASSIFIER
   ========================================================= */

const motionExample = $("motion-example");
const checkMotion = $("check-motion");
const motionAnswer = $("motion-answer");


const motionAnswers = {

    train:
        "Rectilinear translational motion — the train follows a straight path.",

    fan:
        "Rotational motion — the fan rotates about its fixed axis.",

    pendulum:
        "Oscillatory motion — the pendulum moves repeatedly about its mean position.",

    bat:
        "Curvilinear motion — the ball follows a curved trajectory.",

    dust:
        "Random motion — the particle does not follow a definite predictable path."
};


if (checkMotion) {

    checkMotion.addEventListener(
        "click",
        () => {

            const answer =
                motionAnswers[motionExample.value];

            motionAnswer.textContent =
                answer;
        }
    );
}


/* =========================================================
   CHALLENGE QUESTIONS
   ========================================================= */

const questionData = {

    q1: {
        correct: "b",

        hint:
            "Think about the velocities relative to the ground. " +
            "The train moves east while the passenger walks west " +
            "with exactly the same speed."
    },

    q2: {
        correct: "a",

        hint:
            "The observer is already moving at 72 km/h. " +
            "Use relative velocity: v(relative) = v(object) − v(observer)."
    },

    q3: {
        correct: "a",

        hint:
            "Speed may remain constant, but velocity is a vector. " +
            "Ask yourself: does the direction of velocity change?"
    }

};


document
    .querySelectorAll(".question-card button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question;

                const selected =
                    button.dataset.option;

                const data =
                    questionData[question];

                const hintElement =
                    $(`${question}-hint`);

                if (!data || !hintElement) {
                    return;
                }


                if (selected === data.correct) {

                    hintElement.textContent =
                        "✅ Correct! Excellent reasoning. " +
                        "Now explain WHY this option is correct before moving on.";

                } else {

                    hintElement.textContent =
                        "❌ Not quite. " +
                        data.hint;
                }

            }
        );
    });


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {
        /*
         * Animation loops automatically redraw the canvases.
         */
    }
);