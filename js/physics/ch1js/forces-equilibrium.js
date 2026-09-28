/* =========================================================
   FORCES & EQUILIBRIUM
   Physics Lab — Interactive Engine
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BASIC HELPERS
    ====================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);


    /* =====================================================
       SPARK / CHINGARI BACKGROUND
    ====================================================== */

    const sparkCanvas = $("#spark-background");

    if (sparkCanvas) {

        const ctx = sparkCanvas.getContext("2d");

        let sparks = [];

        const resizeSparkCanvas = () => {

            sparkCanvas.width = window.innerWidth;
            sparkCanvas.height = window.innerHeight;

            sparks = [];

            const count =
                Math.min(
                    110,
                    Math.floor(
                        window.innerWidth *
                        window.innerHeight /
                        14000
                    )
                );

            for (let i = 0; i < count; i++) {

                sparks.push({
                    x: Math.random() * sparkCanvas.width,
                    y: Math.random() * sparkCanvas.height,

                    vx:
                        (Math.random() - 0.5) *
                        0.35,

                    vy:
                        -(
                            Math.random() *
                            0.7 +
                            0.15
                        ),

                    size:
                        Math.random() *
                        2.3 +
                        0.5,

                    life:
                        Math.random(),

                    speed:
                        Math.random() *
                        0.015 +
                        0.006,

                    phase:
                        Math.random() *
                        Math.PI *
                        2
                });

            }

        };


        const animateSparks = (time) => {

            ctx.clearRect(
                0,
                0,
                sparkCanvas.width,
                sparkCanvas.height
            );

            for (const spark of sparks) {

                spark.x += spark.vx;

                spark.y += spark.vy;

                spark.life += spark.speed;

                if (
                    spark.y < -20 ||
                    spark.life > 1
                ) {

                    spark.x =
                        Math.random() *
                        sparkCanvas.width;

                    spark.y =
                        sparkCanvas.height +
                        Math.random() * 50;

                    spark.life = 0;

                }

                const alpha =
                    Math.sin(
                        spark.life *
                        Math.PI
                    ) * 0.7;

                ctx.beginPath();

                ctx.arc(
                    spark.x,
                    spark.y,
                    spark.size,
                    0,
                    Math.PI * 2
                );

                /*
                 * Warm spark-like particles.
                 * The background remains dark enough for
                 * physics objects to stay highly visible.
                 */

                const glow =
                    Math.sin(
                        time * 0.002 +
                        spark.phase
                    );

                if (glow > 0.15) {

                    ctx.fillStyle =
                        `rgba(251,146,60,${alpha})`;

                } else {

                    ctx.fillStyle =
                        `rgba(34,211,238,${alpha})`;

                }

                ctx.shadowBlur = 12;

                ctx.shadowColor =
                    ctx.fillStyle;

                ctx.fill();

            }

            ctx.shadowBlur = 0;

            requestAnimationFrame(
                animateSparks
            );

        };


        resizeSparkCanvas();

        window.addEventListener(
            "resize",
            resizeSparkCanvas
        );

        requestAnimationFrame(
            animateSparks
        );

    }


    /* =====================================================
       NEWTON SECOND LAW SIMULATOR
    ====================================================== */

    const forceSlider =
        $("#applied-force");

    const massSlider =
        $("#object-mass");

    const opposingSlider =
        $("#opposing-force");

    const forceValue =
        $("#applied-force-value");

    const massValue =
        $("#mass-value");

    const opposingValue =
        $("#opposing-force-value");

    const netForceResult =
        $("#net-force-result");

    const accelerationResult =
        $("#acceleration-result");

    const forceWhy =
        $("#force-why");

    const forceStatus =
        $("#force-status");

    const forceCanvas =
        $("#force-simulation");


    if (
        forceSlider &&
        massSlider &&
        opposingSlider &&
        forceCanvas
    ) {

        const ctx =
            forceCanvas.getContext("2d");

        let objectX = 0;

        let velocity = 0;

        let lastTime = performance.now();


        const resizeForceCanvas = () => {

            const rect =
                forceCanvas.getBoundingClientRect();

            forceCanvas.width =
                Math.max(400, rect.width * devicePixelRatio);

            forceCanvas.height =
                Math.max(350, rect.height * devicePixelRatio);

            ctx.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0
            );

        };


        const getForceData = () => {

            const applied =
                Number(forceSlider.value);

            const mass =
                Number(massSlider.value);

            const opposing =
                Number(opposingSlider.value);

            const net =
                applied - opposing;

            const acceleration =
                net / mass;

            return {
                applied,
                mass,
                opposing,
                net,
                acceleration
            };

        };


        const updateForceUI = () => {

            const {
                applied,
                mass,
                opposing,
                net,
                acceleration
            } = getForceData();


            forceValue.textContent =
                `${applied} N`;

            massValue.textContent =
                `${mass} kg`;

            opposingValue.textContent =
                `${opposing} N`;

            netForceResult.textContent =
                `${net.toFixed(1)} N`;

            accelerationResult.textContent =
                `${acceleration.toFixed(2)} m/s²`;


            if (Math.abs(net) < 0.001) {

                forceStatus.textContent =
                    "Balanced";

                forceStatus.style.color =
                    "#4ade80";

                forceStatus.style.borderColor =
                    "rgba(74,222,128,.25)";

                forceWhy.innerHTML = `
                    <strong>WHY?</strong>
                    The applied force and opposing force are equal.
                    Therefore they cancel each other:
                    <strong>ΣF = 0</strong>.
                    Since <strong>a = ΣF/m</strong>, acceleration is zero.
                `;

            } else if (net > 0) {

                forceStatus.textContent =
                    "Accelerating →";

                forceStatus.style.color =
                    "#fb923c";

                forceWhy.innerHTML = `
                    <strong>WHY?</strong>
                    The applied force is greater than the opposing force.
                    Therefore the net force points to the right.
                    A non-zero net force produces acceleration:
                    <strong>a = ΣF/m</strong>.
                `;

            } else {

                forceStatus.textContent =
                    "Accelerating ←";

                forceStatus.style.color =
                    "#a78bfa";

                forceWhy.innerHTML = `
                    <strong>WHY?</strong>
                    The opposing force is greater than the applied force.
                    Therefore the net force points to the left,
                    producing acceleration in that direction.
                `;

            }

        };


        const drawArrow = (
            startX,
            startY,
            endX,
            endY,
            color,
            label
        ) => {

            const head = 13;

            ctx.strokeStyle = color;
            ctx.fillStyle = color;

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.moveTo(
                startX,
                startY
            );

            ctx.lineTo(
                endX,
                endY
            );

            ctx.stroke();


            const angle =
                Math.atan2(
                    endY - startY,
                    endX - startX
                );

            ctx.beginPath();

            ctx.moveTo(
                endX,
                endY
            );

            ctx.lineTo(
                endX -
                head * Math.cos(angle - Math.PI / 6),
                endY -
                head * Math.sin(angle - Math.PI / 6)
            );

            ctx.lineTo(
                endX -
                head * Math.cos(angle + Math.PI / 6),
                endY -
                head * Math.sin(angle + Math.PI / 6)
            );

            ctx.closePath();

            ctx.fill();


            ctx.font =
                "700 15px system-ui";

            ctx.fillText(
                label,
                (startX + endX) / 2 - 30,
                startY - 12
            );

        };


        const drawForceScene = () => {

            const rect =
                forceCanvas.getBoundingClientRect();

            const width =
                rect.width;

            const height =
                rect.height;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            /*
             * Background grid
             */

            ctx.strokeStyle =
                "rgba(148,163,184,.07)";

            ctx.lineWidth = 1;

            for (
                let x = 0;
                x < width;
                x += 45
            ) {

                ctx.beginPath();

                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);

                ctx.stroke();

            }


            for (
                let y = 0;
                y < height;
                y += 45
            ) {

                ctx.beginPath();

                ctx.moveTo(0, y);
                ctx.lineTo(width, y);

                ctx.stroke();

            }


            const {
                applied,
                mass,
                opposing,
                acceleration
            } = getForceData();


            const groundY =
                height * 0.68;

            const boxWidth = 110;
            const boxHeight = 80;

            const boxX =
                clamp(
                    width * 0.5 +
                    objectX,
                    100,
                    width - 100
                );

            const boxY =
                groundY - boxHeight;


            /*
             * Ground
             */

            ctx.strokeStyle =
                "rgba(148,163,184,.35)";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                30,
                groundY
            );

            ctx.lineTo(
                width - 30,
                groundY
            );

            ctx.stroke();


            /*
             * Object shadow
             */

            ctx.fillStyle =
                "rgba(0,0,0,.25)";

            ctx.beginPath();

            ctx.ellipse(
                boxX,
                groundY + 8,
                70,
                10,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /*
             * Bright object
             */

            const gradient =
                ctx.createLinearGradient(
                    boxX,
                    boxY,
                    boxX + boxWidth,
                    boxY + boxHeight
                );

            gradient.addColorStop(
                0,
                "#67e8f9"
            );

            gradient.addColorStop(
                1,
                "#2563eb"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.roundRect(
                boxX - boxWidth / 2,
                boxY,
                boxWidth,
                boxHeight,
                18
            );

            ctx.fill();


            ctx.strokeStyle =
                "rgba(255,255,255,.55)";

            ctx.lineWidth = 2;

            ctx.stroke();


            /*
             * Mass label
             */

            ctx.fillStyle = "white";

            ctx.font =
                "700 16px system-ui";

            ctx.textAlign = "center";

            ctx.fillText(
                `${mass} kg`,
                boxX,
                boxY + 47
            );


            /*
             * Force vectors
             */

            const maxArrow =
                Math.max(
                    55,
                    Math.min(
                        width * 0.27,
                        210
                    )
                );

            if (applied > 0) {

                const length =
                    maxArrow *
                    (applied / 100);

                drawArrow(
                    boxX + 60,
                    boxY + 30,
                    boxX + 60 + length,
                    boxY + 30,
                    "#fb923c",
                    `${applied} N`
                );

            }


            if (opposing > 0) {

                const length =
                    maxArrow *
                    (opposing / 100);

                drawArrow(
                    boxX - 60,
                    boxY + 52,
                    boxX - 60 - length,
                    boxY + 52,
                    "#a78bfa",
                    `${opposing} N`
                );

            }


            ctx.textAlign = "left";

            ctx.fillStyle =
                "rgba(220,234,255,.7)";

            ctx.font =
                "500 14px system-ui";

            ctx.fillText(
                `Acceleration: ${acceleration.toFixed(2)} m/s²`,
                25,
                30
            );

        };


        const animateForce = (time) => {

            const dt =
                Math.min(
                    0.04,
                    (time - lastTime) / 1000
                );

            lastTime = time;


            const {
                acceleration
            } = getForceData();


            /*
             * Educational simulation:
             * acceleration changes velocity,
             * velocity changes position.
             */

            velocity +=
                acceleration *
                dt;

            velocity *=
                Math.pow(0.985, dt * 60);

            objectX +=
                velocity *
                dt *
                25;


            const width =
                forceCanvas.getBoundingClientRect()
                    .width;


            if (
                objectX > width * 0.35 ||
                objectX < -width * 0.35
            ) {

                objectX =
                    clamp(
                        objectX,
                        -width * 0.35,
                        width * 0.35
                    );

                velocity *= -0.25;

            }


            drawForceScene();

            requestAnimationFrame(
                animateForce
            );

        };


        [
            forceSlider,
            massSlider,
            opposingSlider
        ].forEach(slider => {

            slider.addEventListener(
                "input",
                updateForceUI
            );

        });


        resizeForceCanvas();

        window.addEventListener(
            "resize",
            resizeForceCanvas
        );

        updateForceUI();

        requestAnimationFrame(
            animateForce
        );

    }


    /* =====================================================
       FREE BODY DIAGRAM
    ====================================================== */

    const fbdCanvas =
        $("#fbd-canvas");


    if (fbdCanvas) {

        const ctx =
            fbdCanvas.getContext("2d");


        const resizeFBD = () => {

            const rect =
                fbdCanvas.getBoundingClientRect();

            fbdCanvas.width =
                Math.max(
                    400,
                    rect.width *
                    devicePixelRatio
                );

            fbdCanvas.height =
                Math.max(
                    350,
                    rect.height *
                    devicePixelRatio
                );

            ctx.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0
            );

            drawFBD();

        };


        const drawArrow = (
            x1,
            y1,
            x2,
            y2,
            color,
            label
        ) => {

            const head = 12;

            ctx.strokeStyle =
                color;

            ctx.fillStyle =
                color;

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            ctx.stroke();


            const angle =
                Math.atan2(
                    y2 - y1,
                    x2 - x1
                );

            ctx.beginPath();

            ctx.moveTo(
                x2,
                y2
            );

            ctx.lineTo(
                x2 -
                head *
                Math.cos(
                    angle - Math.PI / 6
                ),
                y2 -
                head *
                Math.sin(
                    angle - Math.PI / 6
                )
            );

            ctx.lineTo(
                x2 -
                head *
                Math.cos(
                    angle + Math.PI / 6
                ),
                y2 -
                head *
                Math.sin(
                    angle + Math.PI / 6
                )
            );

            ctx.closePath();

            ctx.fill();


            ctx.font =
                "700 15px system-ui";

            ctx.fillText(
                label,
                x2 + 10,
                y2 - 10
            );

        };


        const drawFBD = () => {

            const rect =
                fbdCanvas.getBoundingClientRect();

            const width =
                rect.width;

            const height =
                rect.height;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            /*
             * Soft grid
             */

            ctx.strokeStyle =
                "rgba(148,163,184,.06)";

            ctx.lineWidth = 1;

            for (
                let x = 0;
                x < width;
                x += 40
            ) {

                ctx.beginPath();

                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);

                ctx.stroke();

            }


            for (
                let y = 0;
                y < height;
                y += 40
            ) {

                ctx.beginPath();

                ctx.moveTo(0, y);
                ctx.lineTo(width, y);

                ctx.stroke();

            }


            const cx =
                width / 2;

            const cy =
                height / 2;


            /*
             * Table
             */

            ctx.fillStyle =
                "#64748b";

            ctx.fillRect(
                cx - 170,
                cy + 75,
                340,
                22
            );


            /*
             * Table legs
             */

            ctx.fillRect(
                cx - 145,
                cy + 95,
                18,
                100
            );

            ctx.fillRect(
                cx + 127,
                cy + 95,
                18,
                100
            );


            /*
             * Object
             */

            const gradient =
                ctx.createLinearGradient(
                    cx - 55,
                    cy - 25,
                    cx + 55,
                    cy + 55
                );

            gradient.addColorStop(
                0,
                "#67e8f9"
            );

            gradient.addColorStop(
                1,
                "#2563eb"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.roundRect(
                cx - 55,
                cy - 25,
                110,
                80,
                18
            );

            ctx.fill();


            ctx.strokeStyle =
                "rgba(255,255,255,.5)";

            ctx.lineWidth = 2;

            ctx.stroke();


            ctx.fillStyle = "white";

            ctx.font =
                "700 16px system-ui";

            ctx.textAlign = "center";

            ctx.fillText(
                "OBJECT",
                cx,
                cy + 20
            );


            /*
             * Weight
             */

            drawArrow(
                cx,
                cy + 55,
                cx,
                cy + 145,
                "#fb7185",
                "Weight"
            );


            /*
             * Normal
             */

            drawArrow(
                cx,
                cy - 25,
                cx,
                cy - 115,
                "#4ade80",
                "Normal"
            );


            /*
             * Applied
             */

            drawArrow(
                cx + 55,
                cy + 5,
                cx + 170,
                cy + 5,
                "#fb923c",
                "Applied"
            );


            /*
             * Friction
             */

            drawArrow(
                cx - 55,
                cy + 38,
                cx - 165,
                cy + 38,
                "#a78bfa",
                "Friction"
            );


            ctx.textAlign = "left";

        };


        resizeFBD();

        window.addEventListener(
            "resize",
            resizeFBD
        );

    }


    /* =====================================================
       EQUILIBRIUM SIMULATOR
    ====================================================== */

    const leftSlider =
        $("#left-force");

    const rightSlider =
        $("#right-force");

    const leftValue =
        $("#left-force-value");

    const rightValue =
        $("#right-force-value");

    const balanceStatus =
        $("#balance-status");

    const balanceExplanation =
        $("#balance-explanation");

    const leftArrow =
        $("#left-arrow");

    const rightArrow =
        $("#right-arrow");


    if (
        leftSlider &&
        rightSlider
    ) {

        const updateBalance = () => {

            const left =
                Number(leftSlider.value);

            const right =
                Number(rightSlider.value);

            const net =
                right - left;


            leftValue.textContent =
                `${left} N`;

            rightValue.textContent =
                `${right} N`;


            /*
             * Arrow sizes
             */

            leftArrow.style.transform =
                `scaleX(${Math.max(
                    0.5,
                    left / 50
                )})`;

            rightArrow.style.transform =
                `scaleX(${Math.max(
                    0.5,
                    right / 50
                )})`;


            if (net === 0) {

                balanceStatus.textContent =
                    "EQUILIBRIUM";

                balanceStatus.style.color =
                    "#4ade80";

                balanceExplanation.textContent =
                    "Both forces are equal. Net force is zero, so acceleration is zero.";

            } else if (net > 0) {

                balanceStatus.textContent =
                    "ACCELERATION →";

                balanceStatus.style.color =
                    "#fb923c";

                balanceExplanation.textContent =
                    `The right force is larger by ${net} N. Therefore the net force points right and the object accelerates right.`;

            } else {

                balanceStatus.textContent =
                    "ACCELERATION ←";

                balanceStatus.style.color =
                    "#a78bfa";

                balanceExplanation.textContent =
                    `The left force is larger by ${Math.abs(net)} N. Therefore the net force points left and the object accelerates left.`;

            }

        };


        leftSlider.addEventListener(
            "input",
            updateBalance
        );

        rightSlider.addEventListener(
            "input",
            updateBalance
        );

        updateBalance();

    }


    /* =====================================================
       PRACTICE QUESTION
    ====================================================== */

    const answerButtons =
        document.querySelectorAll(
            ".answers button"
        );

    const practiceFeedback =
        $("#practice-feedback");


    answerButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                answerButtons.forEach(btn => {

                    btn.classList.remove(
                        "correct-answer",
                        "wrong-answer"
                    );

                });


                const isCorrect =
                    button.dataset.answer ===
                    "correct";


                if (isCorrect) {

                    button.classList.add(
                        "correct-answer"
                    );

                    practiceFeedback.innerHTML = `
                        <strong style="color:#4ade80;">
                            ✓ Correct!
                        </strong>
                        <br>
                        The two forces are equal and opposite:
                        40 N − 40 N = 0 N.
                        Therefore the net force is zero.
                    `;

                } else {

                    button.classList.add(
                        "wrong-answer"
                    );

                    practiceFeedback.innerHTML = `
                        <strong style="color:#fb7185;">
                            ✕ Not quite.
                        </strong>
                        <br>
                        Equal and opposite forces cancel.
                        Therefore:
                        <strong>ΣF = 40 − 40 = 0 N</strong>.
                    `;

                }

            }
        );

    });


    /* =====================================================
       SMALL INTERSECTION ANIMATIONS
    ====================================================== */

    const animatedCards =
        document.querySelectorAll(
            ".info-card, .force-type-card, .why-grid article, .real-grid article, .misconception-grid article"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

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

                });

            },
            {
                threshold: 0.08
            }
        );


    animatedCards.forEach(card => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(18px)";

        card.style.transition =
            "opacity .65s ease, transform .65s ease";

        observer.observe(card);

    });


    /* =====================================================
       CONSOLE MESSAGE
    ====================================================== */

    console.log(
        "Physics Lab — Forces & Equilibrium loaded successfully."
    );

});