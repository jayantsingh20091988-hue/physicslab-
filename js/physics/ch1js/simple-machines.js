/* =========================================================
   PHYSICS LAB — CHAPTER 03
   SIMPLE MACHINES
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SPARK / CHINGARI BACKGROUND
       ===================================================== */

    const sparkCanvas = document.getElementById("spark-background");

    if (sparkCanvas) {

        const ctx = sparkCanvas.getContext("2d");

        let sparks = [];

        function resizeSparkCanvas() {
            const dpr = window.devicePixelRatio || 1;

            sparkCanvas.width = innerWidth * dpr;
            sparkCanvas.height = innerHeight * dpr;

            sparkCanvas.style.width = innerWidth + "px";
            sparkCanvas.style.height = innerHeight + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function createSpark() {

            return {
                x: Math.random() * innerWidth,
                y: innerHeight + Math.random() * 50,
                vx: (Math.random() - .5) * .5,
                vy: -(Math.random() * 1.5 + .5),
                size: Math.random() * 2 + .5,
                life: Math.random() * 120 + 60
            };
        }

        function initSparks() {

            sparks = [];

            const amount = Math.min(
                150,
                Math.max(60, Math.floor(innerWidth / 8))
            );

            for (let i = 0; i < amount; i++) {
                sparks.push(createSpark());
            }
        }

        function animateSparks() {

            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < sparks.length; i++) {

                const s = sparks[i];

                s.x += s.vx;
                s.y += s.vy;

                s.vy += .006;
                s.life--;

                const alpha = Math.max(0, s.life / 180);

                ctx.beginPath();
                ctx.arc(
                    s.x,
                    s.y,
                    s.size,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = `rgba(80,220,255,${alpha})`;
                ctx.fill();

                if (
                    s.life <= 0 ||
                    s.y < -20
                ) {
                    sparks[i] = createSpark();
                }
            }

            requestAnimationFrame(animateSparks);
        }

        resizeSparkCanvas();
        initSparks();
        animateSparks();

        window.addEventListener("resize", () => {
            resizeSparkCanvas();
            initSparks();
        });
    }


    /* =====================================================
       MECHANICAL ADVANTAGE
       ===================================================== */

    const loadSlider = document.getElementById("load-force");
    const effortSlider = document.getElementById("effort-force");

    const loadValue = document.getElementById("load-value");
    const effortValue = document.getElementById("effort-value");

    const maResult = document.getElementById("ma-result");
    const maWhy = document.getElementById("ma-why");

    const loadArrowLabel =
        document.getElementById("load-arrow-label");

    const effortArrowLabel =
        document.getElementById("effort-arrow-label");


    function updateMA() {

        if (!loadSlider || !effortSlider) return;

        const load = Number(loadSlider.value);
        const effort = Number(effortSlider.value);

        const ma = load / effort;

        loadValue.textContent = `${load} N`;
        effortValue.textContent = `${effort} N`;

        maResult.textContent = ma.toFixed(2);

        loadArrowLabel.textContent = `${load} N`;
        effortArrowLabel.textContent = `${effort} N`;

        if (ma > 1) {

            maWhy.textContent =
                `The machine gives a force advantage of ` +
                `${ma.toFixed(2)} times. The output force is greater ` +
                `than the applied effort, so a trade-off in distance ` +
                `is required.`;

        } else if (ma === 1) {

            maWhy.textContent =
                `The machine does not multiply the force. ` +
                `Its force output is approximately equal to the ` +
                `applied effort.`;

        } else {

            maWhy.textContent =
                `The mechanical advantage is below 1. ` +
                `This means the machine sacrifices force advantage ` +
                `to provide a different movement, speed or range.`;
        }
    }

    loadSlider?.addEventListener("input", updateMA);
    effortSlider?.addEventListener("input", updateMA);

    updateMA();


    /* =====================================================
       EFFICIENCY
       ===================================================== */

    const efficiencyFill =
        document.getElementById("efficiency-fill");

    const efficiencyResult =
        document.getElementById("efficiency-result");

    /*
       Example:
       MA = 3
       VR = 4
       efficiency = 75%
    */

    const exampleMA = 3;
    const exampleVR = 4;

    const efficiency =
        (exampleMA / exampleVR) * 100;

    if (efficiencyFill) {
        efficiencyFill.style.width = `${efficiency}%`;
    }

    if (efficiencyResult) {
        efficiencyResult.textContent =
            `${efficiency.toFixed(0)}%`;
    }


    /* =====================================================
       LEVER SIMULATOR
       ===================================================== */

    const leverCanvas =
        document.getElementById("lever-canvas");

    const leverEffort =
        document.getElementById("lever-effort");

    const leverLoad =
        document.getElementById("lever-load");

    const effortArm =
        document.getElementById("effort-arm");

    const loadArm =
        document.getElementById("load-arm");

    const leverEffortValue =
        document.getElementById("lever-effort-value");

    const leverLoadValue =
        document.getElementById("lever-load-value");

    const effortArmValue =
        document.getElementById("effort-arm-value");

    const loadArmValue =
        document.getElementById("load-arm-value");

    const effortMoment =
        document.getElementById("effort-moment");

    const loadMoment =
        document.getElementById("load-moment");

    const leverStatus =
        document.getElementById("lever-status");

    const leverWhy =
        document.getElementById("lever-why");


    function resizeCanvas(canvas) {

        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();

        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext("2d");

        context.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    function drawLever() {

        if (!leverCanvas) return;

        const ctx = leverCanvas.getContext("2d");

        const width = leverCanvas.clientWidth;
        const height = leverCanvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height * .58;

        const eArm = Number(effortArm.value);
        const lArm = Number(loadArm.value);

        const totalArm = eArm + lArm;

        const scale =
            Math.min(
                width * .34 / Math.max(totalArm, 1),
                75
            );

        const leftX =
            centerX - lArm * scale;

        const rightX =
            centerX + eArm * scale;


        /* beam */

        ctx.save();

        ctx.lineWidth = 15;
        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(leftX, centerY);
        ctx.lineTo(rightX, centerY);

        ctx.strokeStyle = "#3b82f6";
        ctx.stroke();

        ctx.restore();


        /* fulcrum */

        ctx.beginPath();

        ctx.moveTo(centerX, centerY + 5);
        ctx.lineTo(centerX - 35, centerY + 65);
        ctx.lineTo(centerX + 35, centerY + 65);
        ctx.closePath();

        ctx.fillStyle = "#22d3ee";
        ctx.fill();


        /* load */

        ctx.fillStyle = "#ec4899";

        ctx.fillRect(
            leftX - 30,
            centerY - 75,
            60,
            60
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(
            `${leverLoad.value} N`,
            leftX,
            centerY - 85
        );


        /* effort arrow */

        const arrowHeight = 80;

        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 7;

        ctx.beginPath();

        ctx.moveTo(
            rightX,
            centerY + 10
        );

        ctx.lineTo(
            rightX,
            centerY - arrowHeight
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            rightX,
            centerY - arrowHeight
        );

        ctx.lineTo(
            rightX - 12,
            centerY - arrowHeight + 20
        );

        ctx.lineTo(
            rightX + 12,
            centerY - arrowHeight + 20
        );

        ctx.closePath();

        ctx.fillStyle = "#fb923c";
        ctx.fill();


        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            `${leverEffort.value} N`,
            rightX,
            centerY - arrowHeight - 12
        );


        /* arm labels */

        ctx.font = "13px sans-serif";
        ctx.fillStyle = "#9fb2c7";

        ctx.fillText(
            `${lArm.toFixed(1)} m`,
            (leftX + centerX) / 2,
            centerY + 35
        );

        ctx.fillText(
            `${eArm.toFixed(1)} m`,
            (centerX + rightX) / 2,
            centerY + 35
        );
    }


    function updateLever() {

        if (!leverCanvas) return;

        const effort = Number(leverEffort.value);
        const load = Number(leverLoad.value);

        const eArm = Number(effortArm.value);
        const lArm = Number(loadArm.value);

        const eMoment = effort * eArm;
        const lMoment = load * lArm;

        const difference =
            Math.abs(eMoment - lMoment);

        leverEffortValue.textContent =
            `${effort} N`;

        leverLoadValue.textContent =
            `${load} N`;

        effortArmValue.textContent =
            `${eArm.toFixed(1)} m`;

        loadArmValue.textContent =
            `${lArm.toFixed(1)} m`;

        effortMoment.textContent =
            `${eMoment.toFixed(1)} Nm`;

        loadMoment.textContent =
            `${lMoment.toFixed(1)} Nm`;


        if (difference < 5) {

            leverStatus.textContent =
                "⚖️ Balanced";

            leverStatus.style.color =
                "#22c55e";

            leverWhy.textContent =
                "Both turning effects are nearly equal. " +
                "The clockwise and anticlockwise moments " +
                "balance each other, so the lever stays balanced.";

        } else if (eMoment > lMoment) {

            leverStatus.textContent =
                "↻ Effort side wins";

            leverStatus.style.color =
                "#fb923c";

            leverWhy.textContent =
                "The effort moment is larger than the load moment. " +
                "Therefore the effort side produces the greater " +
                "turning effect.";

        } else {

            leverStatus.textContent =
                "↺ Load side wins";

            leverStatus.style.color =
                "#ec4899";

            leverWhy.textContent =
                "The load moment is larger than the effort moment. " +
                "Therefore the load side produces the greater " +
                "turning effect.";
        }

        resizeCanvas(leverCanvas);
        drawLever();
    }


    [
        leverEffort,
        leverLoad,
        effortArm,
        loadArm
    ].forEach(input => {
        input?.addEventListener("input", updateLever);
    });

    window.addEventListener("resize", updateLever);

    updateLever();


    /* =====================================================
       PULLEY SIMULATOR
       ===================================================== */

    const pulleyCanvas =
        document.getElementById("pulley-canvas");

    const pulleyType =
        document.getElementById("pulley-type");

    const pulleyLoad =
        document.getElementById("pulley-load");

    const pulleyLoadValue =
        document.getElementById("pulley-load-value");

    const pulleyMA =
        document.getElementById("pulley-ma");

    const pulleyEffort =
        document.getElementById("pulley-effort");

    const pulleyWhy =
        document.getElementById("pulley-why");


    function getPulleySegments() {

        switch (pulleyType.value) {

            case "movable":
                return 2;

            case "two":
                return 2;

            case "three":
                return 3;

            case "fixed":
            default:
                return 1;
        }
    }


    function drawPulley() {

        if (!pulleyCanvas) return;

        const ctx = pulleyCanvas.getContext("2d");

        const width = pulleyCanvas.clientWidth;
        const height = pulleyCanvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height * .38;

        const segments =
            getPulleySegments();


        /* ceiling */

        ctx.fillStyle = "#334155";

        ctx.fillRect(
            width * .15,
            35,
            width * .7,
            15
        );


        /* pulley */

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            55,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#3b82f6";
        ctx.fill();

        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 7;
        ctx.stroke();


        /* rope */

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 5;

        if (segments === 1) {

            ctx.beginPath();

            ctx.moveTo(centerX - 55, centerY);
            ctx.lineTo(centerX - 55, height - 65);

            ctx.moveTo(centerX + 55, centerY);
            ctx.lineTo(centerX + 55, height - 65);

            ctx.stroke();

        } else {

            const left =
                centerX - 55;

            const right =
                centerX + 55;

            for (let i = 0; i < segments; i++) {

                const x =
                    left +
                    ((right - left) * i / Math.max(segments - 1, 1));

                ctx.beginPath();

                ctx.moveTo(x, centerY);
                ctx.lineTo(
                    x,
                    height - 65
                );

                ctx.stroke();
            }
        }


        /* load */

        ctx.fillStyle = "#ec4899";

        ctx.fillRect(
            centerX - 40,
            height - 65,
            80,
            45
        );

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";

        ctx.fillText(
            `${pulleyLoad.value} N`,
            centerX,
            height - 38
        );
    }


    function updatePulley() {

        if (!pulleyCanvas) return;

        const load = Number(pulleyLoad.value);

        const ma =
            getPulleySegments();

        const idealEffort =
            load / ma;

        pulleyLoadValue.textContent =
            `${load} N`;

        pulleyMA.textContent =
            ma;

        pulleyEffort.textContent =
            `${idealEffort.toFixed(1)} N`;


        switch (pulleyType.value) {

            case "fixed":

                pulleyWhy.textContent =
                    "A fixed pulley mainly changes the direction " +
                    "of the applied force. Ideally MA = 1, so " +
                    "the effort is approximately equal to the load.";

                break;

            case "movable":

                pulleyWhy.textContent =
                    "The movable pulley is supported by two rope " +
                    "segments. Ideally the load is shared between " +
                    "them, so the required effort is approximately " +
                    "half the load.";

                break;

            case "two":

                pulleyWhy.textContent =
                    "Two supporting rope segments share the load. " +
                    "Therefore the ideal mechanical advantage is 2.";

                break;

            case "three":

                pulleyWhy.textContent =
                    "Three supporting rope segments share the load. " +
                    "Ideally this gives MA = 3, but the effort must " +
                    "move through a greater distance.";

                break;
        }

        resizeCanvas(pulleyCanvas);
        drawPulley();
    }


    pulleyType?.addEventListener(
        "change",
        updatePulley
    );

    pulleyLoad?.addEventListener(
        "input",
        updatePulley
    );

    window.addEventListener(
        "resize",
        updatePulley
    );

    updatePulley();


    /* =====================================================
       PRACTICE QUESTION
       ===================================================== */

    const practiceButtons =
        document.querySelectorAll(
            ".practice-options button"
        );

    const practiceResult =
        document.getElementById("practice-result");


    practiceButtons.forEach(button => {

        button.addEventListener("click", () => {

            const isCorrect =
                button.dataset.answer === "correct";

            if (isCorrect) {

                practiceResult.textContent =
                    "✅ Correct! MA = Load / Effort = 400 / 100 = 4.";

                practiceResult.style.color =
                    "#22c55e";

            } else {

                practiceResult.textContent =
                    "❌ Not quite. Remember: MA = Load / Effort.";

                practiceResult.style.color =
                    "#fb7185";
            }
        });

    });


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealItems =
        document.querySelectorAll(
            ".map-card, .info-card, .lever-type, " +
            ".machine-grid article, .application-grid > div, " +
            ".misconception-grid article"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: .12
            }
        );


    revealItems.forEach(item => {

        item.style.opacity = "0";
        item.style.transform = "translateY(25px)";
        item.style.transition =
            "opacity .7s ease, transform .7s ease";

        observer.observe(item);

    });

});