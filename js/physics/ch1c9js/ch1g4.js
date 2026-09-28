/* ============================================================
   PHYSICS LAB
   KINEMATICS — GROUP 4
   Standalone JavaScript

   Includes:
   01 Sign Convention
   02 Gravity
   03 Free Fall
   04 Vertical Projection
   05 Maximum Height
   06 Time of Ascent / Descent / Flight
   07 Gravity Graphs
   08 Circular Motion
   09 Constant Speed + Acceleration
   10 Centripetal Acceleration
   11 v = rω
   12 Period + Frequency
   13 Concept Traps
   14 Graph Challenges
   15 Multi-step Numericals
   16 IIT/Olympiad-style Challenges
============================================================ */

(() => {

    "use strict";


    /* ========================================================
       HELPERS
    ======================================================== */

    const $ = (id) => document.getElementById(id);

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    const format = (value, digits = 2) =>
        Number(value).toFixed(digits);

    const signFormat = (value, digits = 0) => {

        const n = Number(value);

        if (Math.abs(n) < 1e-10) {
            return (0).toFixed(digits);
        }

        return n > 0
            ? `+${n.toFixed(digits)}`
            : n.toFixed(digits);
    };


    /* ========================================================
       CANVAS SETUP
    ======================================================== */

    function prepareCanvas(canvas) {

        if (!canvas) {
            return null;
        }

        const rect = canvas.getBoundingClientRect();

        const width =
            Math.max(1, Math.floor(rect.width));

        const height =
            Math.max(
                1,
                Math.floor(
                    rect.height || width * 0.55
                )
            );

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext("2d");

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        return {
            canvas,
            ctx,
            width,
            height
        };
    }


    function clearCanvas(ctx, width, height) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );
    }


    function drawArrow(
        ctx,
        x1,
        y1,
        x2,
        y2,
        color,
        width = 3
    ) {

        const angle =
            Math.atan2(
                y2 - y1,
                x2 - x1
            );

        const head = 9;

        ctx.save();

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(x2, y2);

        ctx.lineTo(
            x2 - head * Math.cos(angle - Math.PI / 6),
            y2 - head * Math.sin(angle - Math.PI / 6)
        );

        ctx.lineTo(
            x2 - head * Math.cos(angle + Math.PI / 6),
            y2 - head * Math.sin(angle + Math.PI / 6)
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();
    }


    function roundedRect(
        ctx,
        x,
        y,
        w,
        h,
        radius
    ) {

        const r =
            Math.min(
                radius,
                w / 2,
                h / 2
            );

        ctx.beginPath();

        ctx.moveTo(
            x + r,
            y
        );

        ctx.arcTo(
            x + w,
            y,
            x + w,
            y + h,
            r
        );

        ctx.arcTo(
            x + w,
            y + h,
            x,
            y + h,
            r
        );

        ctx.arcTo(
            x,
            y + h,
            x,
            y,
            r
        );

        ctx.arcTo(
            x,
            y,
            x + w,
            y,
            r
        );

        ctx.closePath();
    }


    /* ========================================================
       01 — SIGN CONVENTION LAB
    ======================================================== */

    const signSpeed =
        $("g4-sign-speed");

    const signAcc =
        $("g4-sign-acc");

    const signVelocity =
        $("g4-sign-velocity");

    const signAcceleration =
        $("g4-sign-acceleration");

    const signMotion =
        $("g4-sign-motion");

    const signMeaning =
        $("g4-sign-meaning");

    const signCanvas =
        $("g4-sign-canvas");


    function updateSignLab() {

        if (
            !signSpeed ||
            !signAcc ||
            !signCanvas
        ) {
            return;
        }

        const v =
            Number(signSpeed.value);

        const a =
            Number(signAcc.value);

        signVelocity.textContent =
            `${signFormat(v)} m/s`;

        signAcceleration.textContent =
            `${signFormat(a, 1)} m/s²`;


        if (v > 0) {

            signMotion.textContent =
                "Positive direction";

        } else if (v < 0) {

            signMotion.textContent =
                "Negative direction";

        } else {

            signMotion.textContent =
                "Instantaneously at rest";
        }


        if (v === 0) {

            signMeaning.textContent =
                "Acceleration decides future motion";

        } else if (v * a > 0) {

            signMeaning.textContent =
                "Velocity and acceleration same direction → speeding up";

        } else if (v * a < 0) {

            signMeaning.textContent =
                "Velocity and acceleration opposite → slowing down";

        } else {

            signMeaning.textContent =
                "No acceleration → constant velocity";
        }


        drawSignScene(v, a);
    }


    function drawSignScene(v, a) {

        const data =
            prepareCanvas(signCanvas);

        if (!data) {
            return;
        }

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );


        const centerY =
            height * 0.52;

        const left =
            30;

        const right =
            width - 30;


        /* axis */

        ctx.strokeStyle =
            "rgba(148,163,184,0.3)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            left,
            centerY
        );

        ctx.lineTo(
            right,
            centerY
        );

        ctx.stroke();


        drawArrow(
            ctx,
            left,
            centerY,
            right,
            centerY,
            "rgba(34,211,238,0.8)",
            2
        );


        /* zero */

        ctx.fillStyle =
            "rgba(148,163,184,0.8)";

        ctx.font =
            "12px system-ui";

        ctx.fillText(
            "0",
            width / 2 - 4,
            centerY + 25
        );


        /* object */

        const normalized =
            clamp(v / 20, -1, 1);

        const objectX =
            width / 2 +
            normalized *
            (width * 0.34);


        const gradient =
            ctx.createRadialGradient(
                objectX - 6,
                centerY - 6,
                2,
                objectX,
                centerY,
                25
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            0.2,
            "#22d3ee"
        );

        gradient.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            objectX,
            centerY,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* velocity */

        if (Math.abs(v) > 0.01) {

            const velocityLength =
                35 +
                Math.abs(v) * 3;

            const direction =
                Math.sign(v);

            drawArrow(
                ctx,
                objectX,
                centerY,
                objectX +
                direction *
                velocityLength,
                centerY,
                "#22d3ee",
                3
            );
        }


        /* acceleration */

        if (Math.abs(a) > 0.01) {

            const accelerationLength =
                30 +
                Math.abs(a) * 4;

            const direction =
                Math.sign(a);

            drawArrow(
                ctx,
                objectX,
                centerY + 40,
                objectX +
                direction *
                accelerationLength,
                centerY + 40,
                "#a855f7",
                3
            );
        }


        ctx.fillStyle =
            "#22d3ee";

        ctx.fillText(
            "velocity",
            objectX - 25,
            centerY - 35
        );

        ctx.fillStyle =
            "#a855f7";

        ctx.fillText(
            "acceleration",
            objectX - 30,
            centerY + 65
        );
    }


    if (signSpeed) {
        signSpeed.addEventListener(
            "input",
            updateSignLab
        );
    }

    if (signAcc) {
        signAcc.addEventListener(
            "input",
            updateSignLab
        );
    }


    /* ========================================================
       02 — GRAVITY FREE-FALL SIMULATOR
    ======================================================== */

    const gravityCanvas =
        $("g4-gravity-canvas");

    const gravityHeight =
        $("g4-gravity-height");

    const gravityG =
        $("g4-gravity-g");

    const gravityHeightValue =
        $("g4-gravity-height-value");

    const gravityGValue =
        $("g4-gravity-g-value");

    const gravityTime =
        $("g4-gravity-time");

    const gravityHeightLive =
        $("g4-gravity-height-live");

    const gravityVelocityLive =
        $("g4-gravity-velocity-live");

    const gravityAccLive =
        $("g4-gravity-acc-live");

    const gravityStart =
        $("g4-gravity-start");

    const gravityPause =
        $("g4-gravity-pause");

    const gravityReset =
        $("g4-gravity-reset");


    const gravityState = {

        running: false,

        t: 0,

        last: 0
    };


    function gravityInitialHeight() {

        return Number(
            gravityHeight?.value || 60
        );
    }


    function gravityValue() {

        return Number(
            gravityG?.value || 9.8
        );
    }


    function updateGravityLabels() {

        if (gravityHeightValue) {

            gravityHeightValue.textContent =
                `${gravityInitialHeight()} m`;
        }

        if (gravityGValue) {

            gravityGValue.textContent =
                `${gravityValue().toFixed(1)} m/s²`;
        }
    }


    function resetGravity() {

        gravityState.running = false;
        gravityState.t = 0;

        updateGravityLabels();

        drawGravity();
    }


    function drawGravity() {

        const data =
            prepareCanvas(gravityCanvas);

        if (!data) {
            return;
        }

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );


        const H =
            gravityInitialHeight();

        const g =
            gravityValue();


        /* ground */

        const groundY =
            height - 45;

        ctx.strokeStyle =
            "rgba(148,163,184,0.28)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            20,
            groundY
        );

        ctx.lineTo(
            width - 20,
            groundY
        );

        ctx.stroke();


        ctx.fillStyle =
            "rgba(148,163,184,0.6)";

        ctx.font =
            "12px system-ui";

        ctx.fillText(
            "ground",
            25,
            groundY + 25
        );


        /* building/reference line */

        const topY =
            30;

        const lineX =
            width * 0.35;

        ctx.strokeStyle =
            "rgba(34,211,238,0.16)";

        ctx.beginPath();

        ctx.moveTo(
            lineX,
            topY
        );

        ctx.lineTo(
            lineX,
            groundY
        );

        ctx.stroke();


        /* time */

        const t =
            gravityState.t;

        const drop =
            0.5 * g * t * t;

        const actualHeight =
            Math.max(
                0,
                H - drop
            );

        const velocity =
            g * t;


        const normalizedHeight =
            actualHeight / H;

        const ballY =
            groundY -
            normalizedHeight *
            (groundY - topY);


        /* ball */

        const gradient =
            ctx.createRadialGradient(
                lineX - 6,
                ballY - 6,
                2,
                lineX,
                ballY,
                24
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            0.25,
            "#22d3ee"
        );

        gradient.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            lineX,
            ballY,
            24,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* velocity arrow */

        if (t > 0) {

            drawArrow(
                ctx,
                lineX + 45,
                ballY - 20,
                lineX + 45,
                ballY +
                Math.min(
                    90,
                    20 + velocity * 2
                ),
                "#a855f7",
                3
            );
        }


        /* height label */

        ctx.fillStyle =
            "#d8e2f0";

        ctx.font =
            "12px system-ui";

        ctx.fillText(
            `h = ${actualHeight.toFixed(1)} m`,
            lineX + 70,
            ballY
        );


        if (gravityTime) {

            gravityTime.textContent =
                `${t.toFixed(2)} s`;
        }

        if (gravityHeightLive) {

            gravityHeightLive.textContent =
                `${actualHeight.toFixed(2)} m`;
        }

        if (gravityVelocityLive) {

            gravityVelocityLive.textContent =
                `${velocity.toFixed(2)} m/s`;
        }

        if (gravityAccLive) {

            gravityAccLive.textContent =
                `${g.toFixed(2)} m/s²`;
        }


        if (
            gravityState.running &&
            actualHeight <= 0
        ) {

            gravityState.running =
                false;

            gravityState.t =
                Math.sqrt(
                    (2 * H) / g
                );

            drawGravity();
        }
    }


    function gravityAnimation(timestamp) {

        if (!gravityState.running) {
            return;
        }

        if (!gravityState.last) {
            gravityState.last = timestamp;
        }

        const dt =
            Math.min(
                0.035,
                (timestamp -
                    gravityState.last) / 1000
            );

        gravityState.last =
            timestamp;

        gravityState.t += dt;

        drawGravity();

        if (gravityState.running) {

            requestAnimationFrame(
                gravityAnimation
            );
        }
    }


    if (gravityStart) {

        gravityStart.addEventListener(
            "click",
            () => {

                gravityState.running =
                    true;

                gravityState.last = 0;

                requestAnimationFrame(
                    gravityAnimation
                );
            }
        );
    }


    if (gravityPause) {

        gravityPause.addEventListener(
            "click",
            () => {

                gravityState.running =
                    false;

                gravityState.last = 0;
            }
        );
    }


    if (gravityReset) {

        gravityReset.addEventListener(
            "click",
            resetGravity
        );
    }


    if (gravityHeight) {

        gravityHeight.addEventListener(
            "input",
            () => {

                gravityState.t = 0;

                updateGravityLabels();
                drawGravity();
            }
        );
    }


    if (gravityG) {

        gravityG.addEventListener(
            "input",
            () => {

                gravityState.t = 0;

                updateGravityLabels();
                drawGravity();
            }
        );
    }


    /* ========================================================
       03-06 — VERTICAL PROJECTION
    ======================================================== */

    const projectionCanvas =
        $("g4-projection-canvas");

    const projectionV0 =
        $("g4-projection-v0");

    const projectionV0Value =
        $("g4-projection-v0-value");

    const projectionV =
        $("g4-projection-v");

    const projectionA =
        $("g4-projection-a");

    const projectionH =
        $("g4-projection-h");

    const projectionStatus =
        $("g4-projection-status");

    const projectionPlay =
        $("g4-projection-play");

    const projectionReset =
        $("g4-projection-reset");


    const projectionState = {

        running: false,

        t: 0,

        last: 0
    };


    function projectionInitialVelocity() {

        return Number(
            projectionV0?.value || 20
        );
    }


    function updateProjectionLabel() {

        if (projectionV0Value) {

            projectionV0Value.textContent =
                `${projectionInitialVelocity()} m/s`;
        }
    }


    function drawProjection() {

        const data =
            prepareCanvas(
                projectionCanvas
            );

        if (!data) {
            return;
        }

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );


        const u =
            projectionInitialVelocity();

        const g =
            9.8;

        const t =
            projectionState.t;

        const velocity =
            u - g * t;

        const y =
            Math.max(
                0,
                u * t -
                0.5 * g * t * t
            );


        const H =
            (u * u) /
            (2 * g);


        const timeAscent =
            u / g;


        const totalTime =
            2 * timeAscent;


        /* ground */

        const groundY =
            height - 35;

        ctx.strokeStyle =
            "rgba(148,163,184,0.28)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            20,
            groundY
        );

        ctx.lineTo(
            width - 20,
            groundY
        );

        ctx.stroke();


        /* scale */

        const scale =
            (groundY - 35) /
            Math.max(H, 1);


        const ballY =
            groundY -
            y * scale;


        const centerX =
            width / 2;


        /* trajectory guide */

        ctx.strokeStyle =
            "rgba(34,211,238,0.12)";

        ctx.setLineDash([
            5,
            8
        ]);

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            groundY
        );

        ctx.lineTo(
            centerX,
            35
        );

        ctx.stroke();

        ctx.setLineDash([]);


        /* ball */

        const gradient =
            ctx.createRadialGradient(
                centerX - 6,
                ballY - 6,
                2,
                centerX,
                ballY,
                25
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            0.25,
            "#22d3ee"
        );

        gradient.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            centerX,
            ballY,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* velocity */

        if (
            Math.abs(velocity) >
            0.1
        ) {

            const direction =
                Math.sign(velocity);

            const arrowLength =
                Math.min(
                    100,
                    30 +
                    Math.abs(velocity) * 2
                );

            drawArrow(
                ctx,
                centerX + 50,
                ballY,
                centerX + 50,
                ballY -
                direction *
                arrowLength,
                "#22d3ee",
                3
            );
        }


        /* gravity */

        drawArrow(
            ctx,
            centerX - 50,
            ballY - 35,
            centerX - 50,
            ballY + 45,
            "#a855f7",
            3
        );


        /* labels */

        ctx.fillStyle =
            "#d8e2f0";

        ctx.font =
            "12px system-ui";

        ctx.fillText(
            `H = ${H.toFixed(2)} m`,
            centerX + 70,
            40
        );

        ctx.fillText(
            `t = ${t.toFixed(2)} s`,
            25,
            30
        );


        if (projectionV) {

            projectionV.textContent =
                `${velocity.toFixed(2)} m/s`;
        }

        if (projectionA) {

            projectionA.textContent =
                "−9.80 m/s²";
        }

        if (projectionH) {

            projectionH.textContent =
                `${y.toFixed(2)} m`;
        }


        if (projectionStatus) {

            if (t < timeAscent) {

                projectionStatus.textContent =
                    "Moving upward";

            } else if (
                Math.abs(t - timeAscent) <
                0.05
            ) {

                projectionStatus.textContent =
                    "Maximum height";

            } else {

                projectionStatus.textContent =
                    "Falling downward";
            }
        }


        if (
            projectionState.running &&
            t >= totalTime
        ) {

            projectionState.running =
                false;

            projectionState.t =
                totalTime;

            drawProjection();
        }
    }


    function projectionAnimation(
        timestamp
    ) {

        if (!projectionState.running) {
            return;
        }

        if (!projectionState.last) {
            projectionState.last =
                timestamp;
        }

        const dt =
            Math.min(
                0.035,
                (timestamp -
                    projectionState.last) / 1000
            );

        projectionState.last =
            timestamp;

        projectionState.t += dt;

        drawProjection();

        if (projectionState.running) {

            requestAnimationFrame(
                projectionAnimation
            );
        }
    }


    if (projectionV0) {

        projectionV0.addEventListener(
            "input",
            () => {

                projectionState.t = 0;

                updateProjectionLabel();
                drawProjection();
            }
        );
    }


    if (projectionPlay) {

        projectionPlay.addEventListener(
            "click",
            () => {

                const total =
                    2 *
                    projectionInitialVelocity() /
                    9.8;

                if (
                    projectionState.t >=
                    total
                ) {

                    projectionState.t = 0;
                }

                projectionState.running =
                    true;

                projectionState.last = 0;

                requestAnimationFrame(
                    projectionAnimation
                );
            }
        );
    }


    if (projectionReset) {

        projectionReset.addEventListener(
            "click",
            () => {

                projectionState.running =
                    false;

                projectionState.t = 0;
                projectionState.last = 0;

                updateProjectionLabel();
                drawProjection();
            }
        );
    }


    /* ========================================================
       07 — GRAVITY GRAPHS
    ======================================================== */

    function drawGraphAxes(
        ctx,
        width,
        height,
        xLabel,
        yLabel
    ) {

        const left = 45;
        const right = width - 18;
        const top = 18;
        const bottom = height - 35;

        ctx.strokeStyle =
            "rgba(148,163,184,0.35)";

        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.moveTo(
            left,
            bottom
        );

        ctx.lineTo(
            right,
            bottom
        );

        ctx.moveTo(
            left,
            bottom
        );

        ctx.lineTo(
            left,
            top
        );

        ctx.stroke();


        ctx.fillStyle =
            "rgba(148,163,184,0.7)";

        ctx.font =
            "11px system-ui";

        ctx.fillText(
            xLabel,
            right - 25,
            bottom + 25
        );

        ctx.fillText(
            yLabel,
            12,
            top + 8
        );


        /* grid */

        ctx.strokeStyle =
            "rgba(148,163,184,0.07)";

        for (
            let i = 1;
            i < 5;
            i++
        ) {

            const x =
                left +
                (right - left) *
                i / 5;

            const y =
                bottom -
                (bottom - top) *
                i / 5;

            ctx.beginPath();

            ctx.moveTo(
                x,
                top
            );

            ctx.lineTo(
                x,
                bottom
            );

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(
                left,
                y
            );

            ctx.lineTo(
                right,
                y
            );

            ctx.stroke();
        }

        return {
            left,
            right,
            top,
            bottom
        };
    }


    function drawVTGraph() {

        const canvas =
            $("g4-vt-graph");

        const data =
            prepareCanvas(canvas);

        if (!data) return;

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );

        const axes =
            drawGraphAxes(
                ctx,
                width,
                height,
                "t",
                "v"
            );


        const {
            left,
            right,
            top,
            bottom
        } = axes;


        const u = 20;
        const g = 9.8;

        const total =
            2 * u / g;

        const vmax = 20;


        ctx.strokeStyle =
            "#22d3ee";

        ctx.lineWidth = 3;

        ctx.beginPath();

        for (
            let i = 0;
            i <= 100;
            i++
        ) {

            const t =
                total *
                i / 100;

            const v =
                u - g * t;

            const x =
                left +
                (right - left) *
                t / total;

            const y =
                bottom -
                (bottom - top) *
                (v + vmax) /
                (2 * vmax);

            if (i === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }
        }

        ctx.stroke();


        /* zero line */

        ctx.strokeStyle =
            "rgba(255,255,255,0.12)";

        const zeroY =
            bottom -
            (bottom - top) *
            0.5;

        ctx.beginPath();

        ctx.moveTo(
            left,
            zeroY
        );

        ctx.lineTo(
            right,
            zeroY
        );

        ctx.stroke();
    }


    function drawYTGraph() {

        const canvas =
            $("g4-yt-graph");

        const data =
            prepareCanvas(canvas);

        if (!data) return;

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );

        const axes =
            drawGraphAxes(
                ctx,
                width,
                height,
                "t",
                "y"
            );


        const {
            left,
            right,
            top,
            bottom
        } = axes;


        const u = 20;
        const g = 9.8;

        const total =
            2 * u / g;

        const H =
            u * u / (2 * g);


        ctx.strokeStyle =
            "#a855f7";

        ctx.lineWidth = 3;

        ctx.beginPath();

        for (
            let i = 0;
            i <= 100;
            i++
        ) {

            const t =
                total *
                i / 100;

            const y =
                Math.max(
                    0,
                    u * t -
                    0.5 * g * t * t
                );

            const x =
                left +
                (right - left) *
                t / total;

            const screenY =
                bottom -
                (bottom - top) *
                y / H;

            if (i === 0) {

                ctx.moveTo(
                    x,
                    screenY
                );

            } else {

                ctx.lineTo(
                    x,
                    screenY
                );
            }
        }

        ctx.stroke();
    }


    function drawATGraph() {

        const canvas =
            $("g4-at-graph");

        const data =
            prepareCanvas(canvas);

        if (!data) return;

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );

        const axes =
            drawGraphAxes(
                ctx,
                width,
                height,
                "t",
                "a"
            );


        const {
            left,
            right,
            top,
            bottom
        } = axes;


        const zeroY =
            (top + bottom) / 2;


        ctx.strokeStyle =
            "rgba(255,255,255,0.12)";

        ctx.beginPath();

        ctx.moveTo(
            left,
            zeroY
        );

        ctx.lineTo(
            right,
            zeroY
        );

        ctx.stroke();


        const g = 9.8;

        const scale =
            (bottom - top) /
            20;


        const y =
            zeroY +
            g * scale;


        ctx.strokeStyle =
            "#22d3ee";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            right,
            y
        );

        ctx.stroke();
    }


    /* ========================================================
       08-12 — CIRCULAR MOTION
    ======================================================== */

    const circularCanvas =
        $("g4-circular-canvas");

    const circularRadius =
        $("g4-circular-radius");

    const circularSpeed =
        $("g4-circular-speed");

    const circularRadiusValue =
        $("g4-circular-radius-value");

    const circularSpeedValue =
        $("g4-circular-speed-value");

    const circularSpeedLive =
        $("g4-circular-speed-live");

    const circularVelocityLive =
        $("g4-circular-velocity-live");

    const circularAccLive =
        $("g4-circular-acc-live");

    const circularPlay =
        $("g4-circular-play");

    const circularReset =
        $("g4-circular-reset");


    const circularState = {

        running: false,

        angle: 0,

        last: 0
    };


    function getRadius() {

        return Number(
            circularRadius?.value || 100
        );
    }


    function getCircularSpeed() {

        return Number(
            circularSpeed?.value || 10
        );
    }


    function updateCircularLabels() {

        if (circularRadiusValue) {

            circularRadiusValue.textContent =
                `${getRadius()} m`;
        }

        if (circularSpeedValue) {

            circularSpeedValue.textContent =
                `${getCircularSpeed()} m/s`;
        }
    }


    function drawCircular() {

        const data =
            prepareCanvas(
                circularCanvas
            );

        if (!data) {
            return;
        }

        const {
            ctx,
            width,
            height
        } = data;

        clearCanvas(
            ctx,
            width,
            height
        );


        const radius =
            getRadius();

        const speed =
            getCircularSpeed();


        const centerX =
            width / 2;

        const centerY =
            height / 2;


        const visualRadius =
            Math.min(
                radius,
                Math.min(
                    width,
                    height
                ) * 0.35
            );


        /* orbit */

        ctx.strokeStyle =
            "rgba(34,211,238,0.2)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            visualRadius,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        /* axes */

        ctx.strokeStyle =
            "rgba(148,163,184,0.09)";

        ctx.beginPath();

        ctx.moveTo(
            centerX -
            visualRadius -
            25,
            centerY
        );

        ctx.lineTo(
            centerX +
            visualRadius +
            25,
            centerY
        );

        ctx.moveTo(
            centerX,
            centerY -
            visualRadius -
            25
        );

        ctx.lineTo(
            centerX,
            centerY +
            visualRadius +
            25
        );

        ctx.stroke();


        const angle =
            circularState.angle;


        const x =
            centerX +
            visualRadius *
            Math.cos(angle);

        const y =
            centerY +
            visualRadius *
            Math.sin(angle);


        /* radius */

        ctx.strokeStyle =
            "rgba(139,92,246,0.55)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.lineTo(
            x,
            y
        );

        ctx.stroke();


        /* object */

        const gradient =
            ctx.createRadialGradient(
                x - 6,
                y - 6,
                2,
                x,
                y,
                25
            );

        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            0.25,
            "#22d3ee"
        );

        gradient.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* tangent velocity vector */

        const tx =
            -Math.sin(angle);

        const ty =
            Math.cos(angle);


        const velocityArrowLength =
            Math.min(
                100,
                35 +
                speed * 2
            );


        drawArrow(
            ctx,
            x,
            y,
            x +
            tx *
            velocityArrowLength,
            y +
            ty *
            velocityArrowLength,
            "#22d3ee",
            4
        );


        /* centripetal vector */

        const centerDirection =
            Math.atan2(
                centerY - y,
                centerX - x
            );


        const accArrowLength =
            Math.min(
                90,
                25 +
                (speed * speed /
                Math.max(radius, 1)) *
                4
            );


        drawArrow(
            ctx,
            x,
            y,
            x +
            Math.cos(centerDirection) *
            accArrowLength,
            y +
            Math.sin(centerDirection) *
            accArrowLength,
            "#a855f7",
            4
        );


        /* labels */

        ctx.fillStyle =
            "#22d3ee";

        ctx.font =
            "12px system-ui";

        ctx.fillText(
            "v",
            x +
            tx *
            (velocityArrowLength + 8),
            y +
            ty *
            (velocityArrowLength + 8)
        );


        ctx.fillStyle =
            "#a855f7";

        ctx.fillText(
            "a₍c₎",
            x +
            Math.cos(centerDirection) *
            (accArrowLength + 10),
            y +
            Math.sin(centerDirection) *
            (accArrowLength + 10)
        );


        ctx.fillStyle =
            "rgba(216,226,240,0.7)";

        ctx.fillText(
            "centre",
            centerX - 20,
            centerY + 25
        );


        /* live calculations */

        const centripetal =
            (speed * speed) /
            radius;

        const omega =
            speed /
            radius;

        const period =
            (2 * Math.PI) /
            omega;

        const frequency =
            1 / period;


        if (circularSpeedLive) {

            circularSpeedLive.textContent =
                `${speed.toFixed(2)} m/s`;
        }

        if (circularVelocityLive) {

            circularVelocityLive.textContent =
                "Tangential";
        }

        if (circularAccLive) {

            circularAccLive.textContent =
                `${centripetal.toFixed(2)} m/s²`;
        }


        /* additional information */

        ctx.fillStyle =
            "rgba(148,163,184,0.75)";

        ctx.font =
            "11px system-ui";

        ctx.fillText(
            `ω = ${omega.toFixed(3)} rad/s`,
            15,
            22
        );

        ctx.fillText(
            `T = ${period.toFixed(2)} s`,
            15,
            40
        );

        ctx.fillText(
            `f = ${frequency.toFixed(3)} Hz`,
            15,
            58
        );
    }


    function circularAnimation(
        timestamp
    ) {

        if (!circularState.running) {
            return;
        }

        if (!circularState.last) {

            circularState.last =
                timestamp;
        }

        const dt =
            Math.min(
                0.035,
                (timestamp -
                    circularState.last) / 1000
            );

        circularState.last =
            timestamp;


        const radius =
            getRadius();

        const speed =
            getCircularSpeed();


        const omega =
            speed /
            Math.max(radius, 1);


        circularState.angle +=
            omega *
            dt;


        drawCircular();

        requestAnimationFrame(
            circularAnimation
        );
    }


    if (circularRadius) {

        circularRadius.addEventListener(
            "input",
            () => {

                updateCircularLabels();
                drawCircular();
            }
        );
    }


    if (circularSpeed) {

        circularSpeed.addEventListener(
            "input",
            () => {

                updateCircularLabels();
                drawCircular();
            }
        );
    }


    if (circularPlay) {

        circularPlay.addEventListener(
            "click",
            () => {

                circularState.running =
                    !circularState.running;

                if (
                    circularState.running
                ) {

                    circularState.last = 0;

                    requestAnimationFrame(
                        circularAnimation
                    );
                }
            }
        );
    }


    if (circularReset) {

        circularReset.addEventListener(
            "click",
            () => {

                circularState.running =
                    false;

                circularState.angle =
                    0;

                circularState.last =
                    0;

                updateCircularLabels();
                drawCircular();
            }
        );
    }


    /* ========================================================
       14-16 — ADVANCED CHALLENGE ENGINE
    ======================================================== */

    const challenges = [

        {
            question:
                "A ball is thrown vertically upward. At its highest point, which statement is correct?",

            options: [
                "Velocity = 0 and acceleration = 0",
                "Velocity = 0 and acceleration = g downward",
                "Velocity = g and acceleration = 0",
                "Velocity and acceleration are both upward"
            ],

            answer: 1,

            hint:
                "Stopping for an instant does not mean the gravitational force disappears.",

            solution:
                "At maximum height, the instantaneous velocity becomes zero. Gravity is still acting downward, so acceleration remains g downward. Therefore the correct option is 2."
        },


        {
            question:
                "A car moves around a circular track at constant speed. Is its acceleration zero?",

            options: [
                "Yes, because speed is constant",
                "Yes, because distance per second is constant",
                "No, because the direction of velocity changes",
                "No, because its mass changes"
            ],

            answer: 2,

            hint:
                "Velocity is not only about magnitude.",

            solution:
                "Acceleration is the rate of change of velocity. During circular motion, speed can remain constant while velocity direction changes continuously. Hence acceleration is non-zero."
        },


        {
            question:
                "An object is moving downward with v < 0 and has a = −g, when upward is chosen positive. What happens to its speed?",

            options: [
                "It decreases",
                "It remains constant",
                "It increases",
                "It becomes zero immediately"
            ],

            answer: 2,

            hint:
                "Velocity and acceleration have the same sign here.",

            solution:
                "Both velocity and acceleration are negative, meaning both point downward. Acceleration acts in the same direction as motion, so the magnitude of velocity increases. The object speeds up."
        },


        {
            question:
                "A ball is projected upward with u = 19.6 m/s. Take g = 9.8 m/s². What is the time required to reach maximum height?",

            options: [
                "0.5 s",
                "1 s",
                "2 s",
                "4 s"
            ],

            answer: 2,

            hint:
                "At maximum height, v = 0. Use v = u − gt.",

            solution:
                "At maximum height, 0 = u − gt. Therefore t = u/g = 19.6/9.8 = 2 s."
        },


        {
            question:
                "For the same ball with u = 19.6 m/s and g = 9.8 m/s², what is the maximum height?",

            options: [
                "9.8 m",
                "19.6 m",
                "39.2 m",
                "4.9 m"
            ],

            answer: 0,

            hint:
                "Use H = u²/(2g).",

            solution:
                "H = u²/(2g) = (19.6)²/(19.6) = 19.6 m."
        },


        {
            question:
                "A particle moves in a circle of radius 2 m with speed 6 m/s. What is its centripetal acceleration?",

            options: [
                "3 m/s²",
                "12 m/s²",
                "18 m/s²",
                "36 m/s²"
            ],

            answer: 2,

            hint:
                "Use a_c = v²/r.",

            solution:
                "a_c = v²/r = 6²/2 = 36/2 = 18 m/s²."
        },


        {
            question:
                "A wheel rotates with angular speed 5 rad/s and has radius 0.4 m. What is the linear speed of a point on its rim?",

            options: [
                "0.8 m/s",
                "2 m/s",
                "5.4 m/s",
                "12.5 m/s"
            ],

            answer: 1,

            hint:
                "The bridge formula is v = rω.",

            solution:
                "v = rω = 0.4 × 5 = 2 m/s."
        },


        {
            question:
                "A rotating object completes 10 revolutions in 2 seconds. What is its frequency?",

            options: [
                "2 Hz",
                "5 Hz",
                "10 Hz",
                "20 Hz"
            ],

            answer: 1,

            hint:
                "Frequency means revolutions per second.",

            solution:
                "f = number of revolutions / time = 10/2 = 5 Hz."
        },


        {
            question:
                "Two objects are dropped from the same height in vacuum. One has mass 1 kg and the other 10 kg. Which reaches the ground first?",

            options: [
                "1 kg object",
                "10 kg object",
                "Both reach together",
                "It depends only on their mass"
            ],

            answer: 2,

            hint:
                "In ideal free fall, acceleration due to gravity does not depend on mass.",

            solution:
                "Ignoring air resistance, both objects have the same acceleration g. If they start from the same height with the same initial velocity, their motion is identical. They reach together."
        },


        {
            question:
                "A particle moves at constant speed around a circle. Which quantity definitely changes continuously?",

            options: [
                "Mass",
                "Speed",
                "Velocity",
                "Radius"
            ],

            answer: 2,

            hint:
                "Velocity is a vector quantity.",

            solution:
                "Speed is the magnitude of velocity and can remain constant. But velocity direction changes continuously in circular motion. Therefore velocity changes continuously."
        }

    ];


    let challengeIndex = 0;

    let score = 0;

    let answered =
        false;


    const questionNumber =
        $("g4-question-number");

    const questionText =
        $("g4-question");

    const optionsContainer =
        $("g4-options");

    const feedback =
        $("g4-feedback");

    const hintButton =
        $("g4-hint");

    const solutionButton =
        $("g4-solution");

    const nextButton =
        $("g4-next");

    const resetButton =
        $("g4-challenge-reset");

    const hintBox =
        $("g4-hint-box");

    const solutionBox =
        $("g4-solution-box");

    const scoreValue =
        $("g4-score-value");


    function loadChallenge() {

        const q =
            challenges[
                challengeIndex
            ];

        answered = false;

        if (questionNumber) {

            questionNumber.textContent =
                `Challenge ${challengeIndex + 1} / ${challenges.length}`;
        }

        if (questionText) {

            questionText.textContent =
                q.question;
        }

        if (feedback) {

            feedback.textContent = "";
            feedback.className =
                "g4-feedback";
        }

        if (hintBox) {

            hintBox.innerHTML = "";
            hintBox.classList.remove(
                "show"
            );
        }

        if (solutionBox) {

            solutionBox.innerHTML = "";
            solutionBox.classList.remove(
                "show"
            );
        }


        if (optionsContainer) {

            optionsContainer.innerHTML = "";

            q.options.forEach(
                (option, index) => {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.className =
                        "g4-option";

                    button.textContent =
                        `${String.fromCharCode(65 + index)}. ${option}`;

                    button.addEventListener(
                        "click",
                        () =>
                            checkAnswer(
                                index,
                                button
                            )
                    );

                    optionsContainer.appendChild(
                        button
                    );
                }
            );
        }
    }


    function checkAnswer(
        selected,
        button
    ) {

        if (answered) {
            return;
        }

        const q =
            challenges[
                challengeIndex
            ];


        if (selected === q.answer) {

            answered = true;

            button.classList.add(
                "correct"
            );

            score++;

            if (scoreValue) {

                scoreValue.textContent =
                    score;
            }

            if (feedback) {

                feedback.className =
                    "g4-feedback correct";

                feedback.textContent =
                    "✓ Correct! Your reasoning is on the right track.";
            }


            document
                .querySelectorAll(
                    ".g4-option"
                )
                .forEach(
                    btn => {
                        btn.disabled = true;
                    }
                );

        } else {

            button.classList.add(
                "wrong"
            );

            if (feedback) {

                feedback.className =
                    "g4-feedback wrong";

                feedback.textContent =
                    "✕ Not quite. Think about the concept before calculating.";
            }


            if (hintBox) {

                hintBox.innerHTML =
                    `<strong>Concept hint:</strong> ${q.hint}`;

                hintBox.classList.add(
                    "show"
                );
            }


            setTimeout(
                () => {
                    button.classList.remove(
                        "wrong"
                    );
                },
                900
            );
        }
    }


    if (hintButton) {

        hintButton.addEventListener(
            "click",
            () => {

                const q =
                    challenges[
                        challengeIndex
                    ];

                hintBox.innerHTML =
                    `<strong>Hint:</strong> ${q.hint}`;

                hintBox.classList.add(
                    "show"
                );
            }
        );
    }


    if (solutionButton) {

        solutionButton.addEventListener(
            "click",
            () => {

                const q =
                    challenges[
                        challengeIndex
                    ];

                solutionBox.innerHTML =
                    `<strong>Solution:</strong> ${q.solution}`;

                solutionBox.classList.add(
                    "show"
                );
            }
        );
    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                challengeIndex++;

                if (
                    challengeIndex >=
                    challenges.length
                ) {

                    challengeIndex = 0;
                }

                loadChallenge();
            }
        );
    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                challengeIndex = 0;

                score = 0;

                if (scoreValue) {

                    scoreValue.textContent =
                        "0";
                }

                loadChallenge();
            }
        );
    }


    /* ========================================================
       INITIALIZATION
    ======================================================== */

    function initializeGroup4() {

        updateSignLab();

        updateGravityLabels();

        resetGravity();

        updateProjectionLabel();

        drawProjection();

        drawVTGraph();

        drawYTGraph();

        drawATGraph();

        updateCircularLabels();

        drawCircular();

        loadChallenge();
    }


    initializeGroup4();


    /* ========================================================
       RESPONSIVE CANVAS REDRAW
    ======================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(
                    () => {

                        updateSignLab();

                        drawGravity();

                        drawProjection();

                        drawVTGraph();

                        drawYTGraph();

                        drawATGraph();

                        drawCircular();

                    },
                    150
                );
        }
    );

})();