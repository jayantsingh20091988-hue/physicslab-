/* =========================================================
   KINEMATICS GROUP 01
   Motion → Distance → Speed → Velocity → Instantaneous Velocity
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);


    /* =====================================================
       HERO MOTION
    ===================================================== */

    const heroPosition = $("#heroPosition");
    const heroTime = $("#heroTime");
    const heroState = $("#heroState");

    let heroT = 0;

    function animateHero() {

        heroT += 0.016;

        const position =
            50 + Math.sin(heroT * 1.2) * 35;

        const time =
            heroT % 99;

        heroPosition.textContent =
            `${position.toFixed(1)} m`;

        heroTime.textContent =
            `${time.toFixed(1)} s`;

        heroState.textContent =
            Math.abs(Math.cos(heroT * 1.2)) < 0.08
                ? "TURNING"
                : "MOTION";

        requestAnimationFrame(animateHero);
    }

    animateHero();


    /* =====================================================
       TOPIC NAVIGATION
    ===================================================== */

    const topicNodes =
        $$(".topic-node");

    topicNodes.forEach(node => {

        node.addEventListener("click", () => {

            const topic =
                node.dataset.topic;

            const target =
                document.querySelector(
                    `#topic-${topic}`
                );

            if (!target) return;

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    const topicSections =
        $$(".topic-section");

    const progressText =
        $("#progressText");

    const progressFill =
        $("#progressFill");


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    const number =
                        entry.target.id.replace(
                            "topic-",
                            ""
                        );

                    topicNodes.forEach(node =>
                        node.classList.toggle(
                            "active",
                            node.dataset.topic === number
                        )
                    );

                    progressText.textContent =
                        `${String(number).padStart(2, "0")} / 05`;

                    progressFill.style.width =
                        `${Number(number) * 20}%`;

                });

            },
            {
                threshold: 0.3
            }
        );

    topicSections.forEach(section =>
        observer.observe(section)
    );


    /* =====================================================
       REFERENCE FRAME EXPERIMENT
    ===================================================== */

    const train =
        $("#referenceTrain");

    const trainSlider =
        $("#trainVelocity");

    const trainValue =
        $("#trainVelocityValue");

    const referenceToggle =
        $("#referenceToggle");

    let referenceRunning = false;
    let referenceX = 0;

    trainSlider.addEventListener(
        "input",
        () => {

            trainValue.textContent =
                `${trainSlider.value} km/h`;

        }
    );


    referenceToggle.addEventListener(
        "click",
        () => {

            referenceRunning =
                !referenceRunning;

            referenceToggle.textContent =
                referenceRunning
                    ? "Pause Motion"
                    : "Start Motion";

        }
    );


    function animateTrain() {

        if (referenceRunning) {

            const velocity =
                Number(trainSlider.value);

            referenceX +=
                velocity * 0.025;

            if (referenceX > 520) {
                referenceX = -320;
            }

            train.style.transform =
                `translateX(${referenceX}px)`;

        }

        requestAnimationFrame(
            animateTrain
        );
    }

    animateTrain();


    /* =====================================================
       DISTANCE & DISPLACEMENT LAB
    ===================================================== */

    const distanceCanvas =
        $("#distanceCanvas");

    const distanceCtx =
        distanceCanvas.getContext("2d");

    let pathPosition = 0;
    let totalDistance = 0;

    function resizeCanvas(canvas) {

        const rect =
            canvas.getBoundingClientRect();

        const ratio =
            window.devicePixelRatio || 1;

        canvas.width =
            rect.width * ratio;

        canvas.height =
            330 * ratio;

        const context =
            canvas.getContext("2d");

        context.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );

        return {
            width: rect.width,
            height: 330
        };
    }


    function drawDistanceLab() {

        const {
            width,
            height
        } = resizeCanvas(distanceCanvas);

        distanceCtx.clearRect(
            0,
            0,
            width,
            height
        );

        /* background grid */

        distanceCtx.strokeStyle =
            "rgba(148,163,184,0.08)";

        distanceCtx.lineWidth = 1;

        for (
            let x = 30;
            x < width;
            x += 50
        ) {

            distanceCtx.beginPath();

            distanceCtx.moveTo(x, 0);
            distanceCtx.lineTo(x, height);

            distanceCtx.stroke();

        }

        for (
            let y = 30;
            y < height;
            y += 50
        ) {

            distanceCtx.beginPath();

            distanceCtx.moveTo(0, y);
            distanceCtx.lineTo(width, y);

            distanceCtx.stroke();

        }


        /* central axis */

        const centerY =
            height / 2;

        distanceCtx.strokeStyle =
            "rgba(96,165,250,0.4)";

        distanceCtx.lineWidth = 2;

        distanceCtx.beginPath();

        distanceCtx.moveTo(
            30,
            centerY
        );

        distanceCtx.lineTo(
            width - 30,
            centerY
        );

        distanceCtx.stroke();


        /* position */

        const x =
            width / 2 +
            pathPosition *
            ((width - 80) / 200);

        /* particle */

        distanceCtx.beginPath();

        distanceCtx.arc(
            x,
            centerY,
            12,
            0,
            Math.PI * 2
        );

        distanceCtx.fillStyle =
            "#22d3ee";

        distanceCtx.shadowBlur = 20;
        distanceCtx.shadowColor =
            "#22d3ee";

        distanceCtx.fill();

        distanceCtx.shadowBlur = 0;


        /* zero */

        distanceCtx.fillStyle =
            "#91a0b8";

        distanceCtx.font =
            "12px system-ui";

        distanceCtx.fillText(
            "0 m",
            width / 2 - 10,
            centerY + 35
        );


        /* labels */

        distanceCtx.fillStyle =
            "#60a5fa";

        distanceCtx.fillText(
            `Position: ${pathPosition.toFixed(0)} m`,
            25,
            30
        );

        distanceCtx.fillStyle =
            "#a78bfa";

        distanceCtx.fillText(
            `Distance: ${totalDistance.toFixed(0)} m`,
            25,
            50
        );


        requestAnimationFrame(
            drawDistanceLab
        );
    }

    drawDistanceLab();


    function updatePathValues() {

        $("#pathPosition").textContent =
            `${pathPosition.toFixed(0)} m`;

        $("#pathDistance").textContent =
            `${totalDistance.toFixed(0)} m`;

        $("#pathDisplacement").textContent =
            `${pathPosition.toFixed(0)} m`;

    }


    $$("[data-move]").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.move;

                if (action === "right") {

                    pathPosition += 20;

                    totalDistance += 20;

                }

                if (action === "left") {

                    pathPosition -= 20;

                    totalDistance += 20;

                }

                if (action === "reset") {

                    pathPosition = 0;

                    totalDistance = 0;

                }

                pathPosition =
                    Math.max(
                        -100,
                        Math.min(100, pathPosition)
                    );

                updatePathValues();

            }
        );

    });


    /* =====================================================
       SPEED LAB
    ===================================================== */

    const speedSlider =
        $("#speedSlider");

    const speedValue =
        $("#speedValue");

    const speedCar =
        $("#speedCar");

    const speedToggle =
        $("#speedToggle");

    const liveSpeed =
        $("#liveSpeed");

    const liveSpeedDistance =
        $("#liveSpeedDistance");

    const liveSpeedTime =
        $("#liveSpeedTime");

    let speedRunning = false;

    let speedTime = 0;
    let speedDistance = 0;
    let lastSpeedTimestamp = null;


    speedSlider.addEventListener(
        "input",
        () => {

            const value =
                Number(speedSlider.value);

            speedValue.textContent =
                `${value} m/s`;

            liveSpeed.textContent =
                `${value} m/s`;

        }
    );


    speedToggle.addEventListener(
        "click",
        () => {

            speedRunning =
                !speedRunning;

            speedToggle.textContent =
                speedRunning
                    ? "Pause"
                    : "Start";

            lastSpeedTimestamp = null;

        }
    );


    function speedAnimation(timestamp) {

        if (
            speedRunning &&
            lastSpeedTimestamp !== null
        ) {

            const dt =
                (timestamp -
                    lastSpeedTimestamp) /
                1000;

            const v =
                Number(speedSlider.value);

            speedTime += dt;

            speedDistance +=
                v * dt;

        }

        lastSpeedTimestamp =
            timestamp;


        const trackWidth =
            speedCar.parentElement.clientWidth;

        const usableWidth =
            Math.max(
                0,
                trackWidth - 55
            );

        const position =
            Math.min(
                speedDistance * 2.2,
                usableWidth
            );

        speedCar.style.left =
            `${position}px`;

        liveSpeedDistance.textContent =
            `${speedDistance.toFixed(1)} m`;

        liveSpeedTime.textContent =
            `${speedTime.toFixed(1)} s`;

        requestAnimationFrame(
            speedAnimation
        );
    }

    requestAnimationFrame(
        speedAnimation
    );


    /* =====================================================
       VELOCITY VECTOR LAB
    ===================================================== */

    const velocityCanvas =
        $("#velocityCanvas");

    const velocityCtx =
        velocityCanvas.getContext("2d");

    let velocityPositionValue = 0;
    let velocityDistanceValue = 0;
    let velocityTimeValue = 0;


    function drawArrow(
        ctx,
        x1,
        y1,
        x2,
        y2,
        color
    ) {

        const angle =
            Math.atan2(
                y2 - y1,
                x2 - x1
            );

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(x2, y2);

        ctx.lineTo(
            x2 -
            14 *
            Math.cos(angle - Math.PI / 6),

            y2 -
            14 *
            Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            x2 -
            14 *
            Math.cos(angle + Math.PI / 6),

            y2 -
            14 *
            Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();

        ctx.fill();

    }


    function drawVelocityLab() {

        const {
            width,
            height
        } = resizeCanvas(
            velocityCanvas
        );

        velocityCtx.clearRect(
            0,
            0,
            width,
            height
        );


        /* grid */

        velocityCtx.strokeStyle =
            "rgba(148,163,184,0.07)";

        for (
            let x = 0;
            x < width;
            x += 50
        ) {

            velocityCtx.beginPath();

            velocityCtx.moveTo(x, 0);
            velocityCtx.lineTo(x, height);

            velocityCtx.stroke();

        }

        for (
            let y = 0;
            y < height;
            y += 50
        ) {

            velocityCtx.beginPath();

            velocityCtx.moveTo(0, y);
            velocityCtx.lineTo(width, y);

            velocityCtx.stroke();

        }


        const centerY =
            height / 2;

        const centerX =
            width / 2;


        velocityCtx.strokeStyle =
            "rgba(96,165,250,0.3)";

        velocityCtx.lineWidth = 2;

        velocityCtx.beginPath();

        velocityCtx.moveTo(
            30,
            centerY
        );

        velocityCtx.lineTo(
            width - 30,
            centerY
        );

        velocityCtx.stroke();


        const objectX =
            centerX +
            velocityPositionValue * 2;


        /* path */

        velocityCtx.setLineDash([5, 7]);

        velocityCtx.strokeStyle =
            "rgba(167,139,250,0.4)";

        velocityCtx.beginPath();

        velocityCtx.moveTo(
            centerX,
            centerY
        );

        velocityCtx.lineTo(
            objectX,
            centerY
        );

        velocityCtx.stroke();

        velocityCtx.setLineDash([]);


        /* displacement vector */

        drawArrow(
            velocityCtx,
            centerX,
            centerY - 35,
            objectX,
            centerY - 35,
            "#a78bfa"
        );


        /* object */

        velocityCtx.beginPath();

        velocityCtx.arc(
            objectX,
            centerY,
            12,
            0,
            Math.PI * 2
        );

        velocityCtx.fillStyle =
            "#22d3ee";

        velocityCtx.shadowBlur = 22;
        velocityCtx.shadowColor =
            "#22d3ee";

        velocityCtx.fill();

        velocityCtx.shadowBlur = 0;


        velocityCtx.fillStyle =
            "#91a0b8";

        velocityCtx.font =
            "12px system-ui";

        velocityCtx.fillText(
            "Initial position",
            centerX - 42,
            centerY + 40
        );

        velocityCtx.fillText(
            "Current position",
            objectX - 40,
            centerY + 40
        );


        requestAnimationFrame(
            drawVelocityLab
        );

    }

    drawVelocityLab();


    function updateVelocityValues() {

        velocityTimeValue += 1;

        const average =
            velocityTimeValue > 0
                ? velocityPositionValue /
                  velocityTimeValue
                : 0;

        $("#velocityPosition").textContent =
            `${velocityPositionValue.toFixed(0)} m`;

        $("#velocityDisplacement").textContent =
            `${velocityPositionValue.toFixed(0)} m`;

        $("#averageVelocity").textContent =
            `${average.toFixed(2)} m/s`;

    }


    $$("[data-velocity-action]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.velocityAction;

                    if (action === "forward") {

                        velocityPositionValue += 10;

                        velocityDistanceValue += 10;

                        updateVelocityValues();

                    }

                    if (action === "backward") {

                        velocityPositionValue -= 10;

                        velocityDistanceValue += 10;

                        updateVelocityValues();

                    }

                    if (action === "reset") {

                        velocityPositionValue = 0;

                        velocityDistanceValue = 0;

                        velocityTimeValue = 0;

                        updateVelocityValues();

                    }

                }
            );

        });


    /* =====================================================
       INSTANTANEOUS VELOCITY GRAPH
    ===================================================== */

    const instantCanvas =
        $("#instantaneousCanvas");

    const instantCtx =
        instantCanvas.getContext("2d");

    const deltaSlider =
        $("#deltaTimeSlider");

    const deltaValue =
        $("#deltaTimeValue");

    const instantAverage =
        $("#instantAverage");

    const instantVelocity =
        $("#instantVelocity");

    const instantError =
        $("#instantError");


    /*
        Position function used for visualization:

        x(t) = t²

        Therefore:

        v(t) = dx/dt
             = 2t

        This lets us visually show why
        tangent slope represents instantaneous velocity.
    */


    const selectedTime = 2;


    function positionFunction(t) {

        return t * t;

    }


    function velocityFunction(t) {

        return 2 * t;

    }


    function drawInstantaneousGraph() {

        const {
            width,
            height
        } = resizeCanvas(
            instantCanvas
        );

        instantCtx.clearRect(
            0,
            0,
            width,
            height
        );


        /* coordinate system */

        const padding = 50;

        const graphWidth =
            width - padding * 2;

        const graphHeight =
            height - padding * 2;


        /* grid */

        instantCtx.strokeStyle =
            "rgba(148,163,184,0.07)";

        instantCtx.lineWidth = 1;

        for (
            let i = 0;
            i <= 10;
            i++
        ) {

            const x =
                padding +
                graphWidth *
                (i / 10);

            instantCtx.beginPath();

            instantCtx.moveTo(
                x,
                padding
            );

            instantCtx.lineTo(
                x,
                height - padding
            );

            instantCtx.stroke();

        }


        for (
            let i = 0;
            i <= 8;
            i++
        ) {

            const y =
                padding +
                graphHeight *
                (i / 8);

            instantCtx.beginPath();

            instantCtx.moveTo(
                padding,
                y
            );

            instantCtx.lineTo(
                width - padding,
                y
            );

            instantCtx.stroke();

        }


        /* axes */

        instantCtx.strokeStyle =
            "rgba(148,163,184,0.35)";

        instantCtx.lineWidth = 2;

        instantCtx.beginPath();

        instantCtx.moveTo(
            padding,
            height - padding
        );

        instantCtx.lineTo(
            width - padding,
            height - padding
        );

        instantCtx.stroke();

        instantCtx.beginPath();

        instantCtx.moveTo(
            padding,
            padding
        );

        instantCtx.lineTo(
            padding,
            height - padding
        );

        instantCtx.stroke();


        /* position curve */

        instantCtx.strokeStyle =
            "#22d3ee";

        instantCtx.lineWidth = 3;

        instantCtx.beginPath();

        for (
            let i = 0;
            i <= 100;
            i++
        ) {

            const t =
                i / 10;

            const x =
                padding +
                graphWidth *
                (t / 10);

            const normalizedY =
                positionFunction(t) /
                100;

            const y =
                height -
                padding -
                normalizedY *
                graphHeight;

            if (i === 0)
                instantCtx.moveTo(x, y);
            else
                instantCtx.lineTo(x, y);

        }

        instantCtx.stroke();


        const dt =
            Number(deltaSlider.value);

        const t1 =
            Math.max(
                0,
                selectedTime - dt / 2
            );

        const t2 =
            selectedTime + dt / 2;


        const x1 =
            padding +
            graphWidth *
            (t1 / 10);

        const x2 =
            padding +
            graphWidth *
            (t2 / 10);


        const y1 =
            height -
            padding -
            (
                positionFunction(t1) /
                100
            ) *
            graphHeight;

        const y2 =
            height -
            padding -
            (
                positionFunction(t2) /
                100
            ) *
            graphHeight;


        /* secant */

        instantCtx.strokeStyle =
            "#a78bfa";

        instantCtx.lineWidth = 2;

        instantCtx.setLineDash([8, 6]);

        instantCtx.beginPath();

        instantCtx.moveTo(
            x1,
            y1
        );

        instantCtx.lineTo(
            x2,
            y2
        );

        instantCtx.stroke();

        instantCtx.setLineDash([]);


        /* selected point */

        const currentX =
            padding +
            graphWidth *
            (selectedTime / 10);

        const currentY =
            height -
            padding -
            (
                positionFunction(selectedTime) /
                100
            ) *
            graphHeight;


        instantCtx.beginPath();

        instantCtx.arc(
            currentX,
            currentY,
            7,
            0,
            Math.PI * 2
        );

        instantCtx.fillStyle =
            "#facc15";

        instantCtx.shadowBlur = 18;
        instantCtx.shadowColor =
            "#facc15";

        instantCtx.fill();

        instantCtx.shadowBlur = 0;


        /* tangent */

        const slope =
            velocityFunction(selectedTime);

        const tangentHalf =
            1.7;

        const tangentT1 =
            selectedTime -
            tangentHalf;

        const tangentT2 =
            selectedTime +
            tangentHalf;

        const tangentX1 =
            padding +
            graphWidth *
            (tangentT1 / 10);

        const tangentX2 =
            padding +
            graphWidth *
            (tangentT2 / 10);

        const tangentY1 =
            height -
            padding -
            (
                (
                    positionFunction(selectedTime) +
                    slope *
                    (
                        tangentT1 -
                        selectedTime
                    )
                ) / 100
            ) *
            graphHeight;

        const tangentY2 =
            height -
            padding -
            (
                (
                    positionFunction(selectedTime) +
                    slope *
                    (
                        tangentT2 -
                        selectedTime
                    )
                ) / 100
            ) *
            graphHeight;


        instantCtx.strokeStyle =
            "#4ade80";

        instantCtx.lineWidth = 3;

        instantCtx.beginPath();

        instantCtx.moveTo(
            tangentX1,
            tangentY1
        );

        instantCtx.lineTo(
            tangentX2,
            tangentY2
        );

        instantCtx.stroke();


        /* labels */

        instantCtx.fillStyle =
            "#91a0b8";

        instantCtx.font =
            "12px system-ui";

        instantCtx.fillText(
            "Position x(t)",
            padding + 10,
            padding + 15
        );

        instantCtx.fillStyle =
            "#4ade80";

        instantCtx.fillText(
            "Tangent = instantaneous velocity",
            padding + 10,
            padding + 35
        );


        /* calculations */

        const average =
            (
                positionFunction(t2) -
                positionFunction(t1)
            ) /
            (t2 - t1);

        const instantaneous =
            velocityFunction(selectedTime);

        const error =
            Math.abs(
                (
                    average -
                    instantaneous
                ) /
                instantaneous
            ) * 100;


        deltaValue.textContent =
            `${dt.toFixed(2)} s`;

        instantAverage.textContent =
            `${average.toFixed(3)} m/s`;

        instantVelocity.textContent =
            `${instantaneous.toFixed(3)} m/s`;

        instantError.textContent =
            `${error.toFixed(2)}%`;


        requestAnimationFrame(
            drawInstantaneousGraph
        );

    }

    deltaSlider.addEventListener(
        "input",
        drawInstantaneousGraph
    );

    drawInstantaneousGraph();


    /* =====================================================
       QUESTION ENGINE
    ===================================================== */

    const questions =
        $$(".question-card");


    questions.forEach(question => {

        const correctAnswer =
            question.dataset.answer;

        const buttons =
            question.querySelectorAll(
                ".options button"
            );

        const feedback =
            question.querySelector(
                ".question-feedback"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const selected =
                        button.dataset.option;


                    buttons.forEach(btn => {
                        btn.classList.remove(
                            "selected",
                            "correct-option",
                            "wrong-option"
                        );
                    });


                    button.classList.add(
                        "selected"
                    );


                    if (
                        selected ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct-option"
                        );

                        question.classList.add(
                            "correct"
                        );

                        question.classList.remove(
                            "wrong"
                        );

                        feedback.classList.add(
                            "show"
                        );

                        feedback.innerHTML =
                            `
                            <strong style="color:#4ade80;">
                                ✓ Correct.
                            </strong>
                            <br>
                            Your reasoning matches the
                            physical concept. Now try to
                            explain <em>why</em> this option
                            must be true rather than simply
                            remembering it.
                            `;

                    } else {

                        button.classList.add(
                            "wrong-option"
                        );

                        question.classList.add(
                            "wrong"
                        );

                        feedback.classList.add(
                            "show"
                        );

                        feedback.innerHTML =
                            `
                            <strong style="color:#fb7185;">
                                Not quite.
                            </strong>
                            <br>
                            Your selected option conflicts
                            with the underlying physics.
                            Re-check the definition and the
                            quantities involved before trying
                            again.
                            `;

                    }

                }
            );

        });

    });


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            drawDistanceLab();
            drawVelocityLab();
            drawInstantaneousGraph();

        }
    );

});