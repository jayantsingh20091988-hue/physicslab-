/* =========================================================
   WORK • ENERGY • POWER
   Interactive Physics Lab
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    const $ = (id) => document.getElementById(id);


    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);


    const setText = (id, value) => {

        const element = $(id);

        if (element) {
            element.textContent = value;
        }
    };


    const setupCanvas = (canvas) => {

        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        const width =
            Math.max(rect.width, 300);

        const height =
            Math.max(rect.height, 260);

        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);

        const ctx =
            canvas.getContext("2d");

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        return {
            ctx,
            width,
            height
        };
    };


    const round = (value, decimals = 1) =>
        Number(value.toFixed(decimals));


    /* =====================================================
       COLORS
    ===================================================== */

    const COLORS = {

        cyan: "#22d3ee",
        cyanBright: "#67e8f9",

        blue: "#38bdf8",

        purple: "#a78bfa",

        orange: "#fb923c",

        amber: "#fbbf24",

        green: "#34d399",

        red: "#fb7185",

        white: "#f8fbff",

        muted: "#94a9bf",

        grid: "rgba(103,232,249,0.09)",

        dark:
            "rgba(3,9,21,0.92)"
    };


    /* =====================================================
       GLOW HELPER
    ===================================================== */

    const glow = (
        ctx,
        color,
        blur = 18
    ) => {

        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
    };


    const clearGlow = (ctx) => {

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
    };


    /* =====================================================
       ARROW
    ===================================================== */

    const drawArrow = (
        ctx,
        x1,
        y1,
        x2,
        y2,
        color,
        width = 4
    ) => {

        const angle =
            Math.atan2(
                y2 - y1,
                x2 - x1
            );

        const head = 12;

        ctx.save();

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        ctx.lineWidth = width;

        glow(ctx, color, 14);

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

        clearGlow(ctx);

        ctx.restore();
    };


    /* =====================================================
       GRID
    ===================================================== */

    const drawGrid = (
        ctx,
        width,
        height
    ) => {

        ctx.save();

        ctx.strokeStyle = COLORS.grid;

        ctx.lineWidth = 1;

        const step = 40;

        for (
            let x = 0;
            x <= width;
            x += step
        ) {

            ctx.beginPath();

            ctx.moveTo(x, 0);

            ctx.lineTo(x, height);

            ctx.stroke();
        }


        for (
            let y = 0;
            y <= height;
            y += step
        ) {

            ctx.beginPath();

            ctx.moveTo(0, y);

            ctx.lineTo(width, y);

            ctx.stroke();
        }

        ctx.restore();
    };


    /* =====================================================
       WORK EXPERIMENT
    ===================================================== */

    const workCanvas =
        $("work-canvas");


    let workAnimationTime = 0;


    const drawWorkExperiment = () => {

        if (!workCanvas) return;

        const result =
            setupCanvas(workCanvas);

        if (!result) return;

        const {
            ctx,
            width,
            height
        } = result;


        const force =
            Number($("work-force")?.value || 50);

        const displacement =
            Number($("work-displacement")?.value || 5);

        const angle =
            Number($("work-angle")?.value || 0);


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.fillStyle =
            COLORS.dark;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        drawGrid(
            ctx,
            width,
            height
        );


        const groundY =
            height * 0.68;


        /* ground */

        ctx.strokeStyle =
            "rgba(148,163,184,.35)";

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


        /* object movement */

        const maxDistance =
            Math.max(
                width - 160,
                200
            );


        const movement =
            (displacement / 10) *
            maxDistance;


        const startX =
            70;


        const objectX =
            startX +
            movement +
            Math.sin(workAnimationTime) * 2;


        const objectY =
            groundY - 35;


        /* shadow */

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,.45)";

        ctx.beginPath();

        ctx.ellipse(
            objectX + 35,
            groundY + 3,
            42,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();


        /* glowing object */

        ctx.save();

        glow(
            ctx,
            COLORS.cyan,
            25
        );

        const gradient =
            ctx.createLinearGradient(
                objectX,
                objectY,
                objectX + 70,
                objectY + 70
            );

        gradient.addColorStop(
            0,
            COLORS.cyanBright
        );

        gradient.addColorStop(
            1,
            "#2563eb"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.roundRect(
            objectX,
            objectY,
            70,
            55,
            12
        );

        ctx.fill();

        clearGlow(ctx);

        ctx.strokeStyle =
            "rgba(255,255,255,.5)";

        ctx.stroke();

        ctx.restore();


        /* object label */

        ctx.fillStyle =
            COLORS.white;

        ctx.font =
            "600 13px system-ui";

        ctx.fillText(
            "object",
            objectX + 18,
            objectY + 32
        );


        /* force arrow */

        const forceAngle =
            -angle *
            Math.PI /
            180;


        const forceLength =
            80 +
            force * 1.15;


        const fx =
            objectX + 35;


        const fy =
            objectY + 22;


        const forceEndX =
            fx +
            Math.cos(forceAngle) *
            forceLength;


        const forceEndY =
            fy +
            Math.sin(forceAngle) *
            forceLength;


        drawArrow(
            ctx,
            fx,
            fy,
            forceEndX,
            forceEndY,
            COLORS.orange,
            4
        );


        ctx.fillStyle =
            COLORS.orange;

        ctx.font =
            "700 13px system-ui";

        ctx.fillText(
            `F = ${force} N`,
            forceEndX - 20,
            forceEndY - 10
        );


        /* displacement arrow */

        drawArrow(
            ctx,
            startX,
            groundY + 35,
            objectX + 35,
            groundY + 35,
            COLORS.green,
            3
        );


        ctx.fillStyle =
            COLORS.green;

        ctx.font =
            "700 13px system-ui";

        ctx.fillText(
            `s = ${displacement} m`,
            startX + 10,
            groundY + 58
        );


        /* angle indicator */

        if (angle > 0) {

            ctx.strokeStyle =
                COLORS.purple;

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.arc(
                fx,
                fy,
                30,
                -Math.PI / 2,
                forceAngle,
                forceAngle < -Math.PI / 2
            );

            ctx.stroke();

            ctx.fillStyle =
                COLORS.purple;

            ctx.fillText(
                `θ = ${angle}°`,
                fx + 12,
                fy - 25
            );
        }


        workAnimationTime += 0.025;

        requestAnimationFrame(
            drawWorkExperiment
        );
    };


    /* =====================================================
       WORK CALCULATOR
    ===================================================== */

    const updateWork = () => {

        const force =
            Number($("work-force")?.value || 0);

        const displacement =
            Number($("work-displacement")?.value || 0);

        const angle =
            Number($("work-angle")?.value || 0);


        const radians =
            angle *
            Math.PI /
            180;


        const work =
            force *
            displacement *
            Math.cos(radians);


        setText(
            "work-force-value",
            `${force} N`
        );


        setText(
            "work-displacement-value",
            `${round(displacement)} m`
        );


        setText(
            "work-angle-value",
            `${angle}°`
        );


        setText(
            "work-result",
            `${round(work)} J`
        );


        let observation = "";


        if (Math.abs(work) < 0.01) {

            observation =
                angle === 90
                    ? "Force is perpendicular to displacement, so the work done by this force is zero."
                    : "There is no effective displacement component producing work.";

        } else if (work > 0) {

            observation =
                "The force has a component in the direction of displacement, so the work is positive.";

        } else {

            observation =
                "The force acts opposite to the displacement, so the work is negative.";
        }


        setText(
            "work-observation",
            observation
        );


        setText(
            "work-direction-label",
            angle === 90
                ? "Force ⟂ Motion"
                : angle > 90
                    ? "Force opposes Motion"
                    : "Force helps Motion"
        );
    };


    [
        "work-force",
        "work-displacement",
        "work-angle"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updateWork
        );

    });


    /* =====================================================
       KINETIC ENERGY
    ===================================================== */

    const updateKE = () => {

        const mass =
            Number($("ke-mass")?.value || 0);

        const velocity =
            Number($("ke-velocity")?.value || 0);


        const ke =
            0.5 *
            mass *
            velocity *
            velocity;


        setText(
            "ke-mass-value",
            `${mass} kg`
        );


        setText(
            "ke-velocity-value",
            `${velocity} m/s`
        );


        setText(
            "ke-result",
            `${round(ke)} J`
        );
    };


    [
        "ke-mass",
        "ke-velocity"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updateKE
        );

    });


    /* =====================================================
       KE GRAPH
    ===================================================== */

    const keCanvas =
        $("ke-graph");


    const drawKEGraph = () => {

        if (!keCanvas) return;

        const result =
            setupCanvas(keCanvas);

        if (!result) return;

        const {
            ctx,
            width,
            height
        } = result;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.fillStyle =
            COLORS.dark;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        drawGrid(
            ctx,
            width,
            height
        );


        const mass =
            Number($("ke-mass")?.value || 5);


        const padding = 45;

        const graphWidth =
            width - padding * 2;

        const graphHeight =
            height - padding * 2;


        /* axes */

        ctx.strokeStyle =
            "rgba(220,236,255,.45)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            width - padding,
            height - padding
        );

        ctx.moveTo(
            padding,
            height - padding
        );

        ctx.lineTo(
            padding,
            padding
        );

        ctx.stroke();


        /* curve */

        ctx.beginPath();

        for (
            let v = 0;
            v <= 50;
            v += 0.5
        ) {

            const ke =
                0.5 *
                mass *
                v *
                v;


            const x =
                padding +
                (v / 50) *
                graphWidth;


            const maxKE =
                0.5 *
                mass *
                50 *
                50;


            const y =
                height -
                padding -
                (ke / maxKE) *
                graphHeight;


            if (v === 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x, y);
            }
        }


        ctx.strokeStyle =
            COLORS.cyan;

        ctx.lineWidth = 4;

        glow(
            ctx,
            COLORS.cyan,
            15
        );

        ctx.stroke();

        clearGlow(ctx);


        /* labels */

        ctx.fillStyle =
            COLORS.muted;

        ctx.font =
            "12px system-ui";


        ctx.fillText(
            "Velocity",
            width - 80,
            height - 12
        );


        ctx.save();

        ctx.translate(
            15,
            height / 2
        );

        ctx.rotate(-Math.PI / 2);

        ctx.fillText(
            "Kinetic Energy",
            0,
            0
        );

        ctx.restore();
    };


    [
        "ke-mass",
        "ke-velocity"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            drawKEGraph
        );

    });


    /* =====================================================
       POTENTIAL ENERGY
    ===================================================== */

    const updatePE = () => {

        const mass =
            Number($("pe-mass")?.value || 0);

        const heightValue =
            Number($("pe-height")?.value || 0);


        const g = 9.8;


        const pe =
            mass *
            g *
            heightValue;


        setText(
            "pe-mass-value",
            `${mass} kg`
        );


        setText(
            "pe-height-value",
            `${heightValue} m`
        );


        setText(
            "pe-result",
            `${round(pe)} J`
        );
    };


    [
        "pe-mass",
        "pe-height"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updatePE
        );

    });


    /* =====================================================
       POTENTIAL ENERGY CANVAS
    ===================================================== */

    const peCanvas =
        $("pe-canvas");


    const drawPE = () => {

        if (!peCanvas) return;

        const result =
            setupCanvas(peCanvas);

        if (!result) return;

        const {
            ctx,
            width,
            height
        } = result;


        const mass =
            Number($("pe-mass")?.value || 5);

        const h =
            Number($("pe-height")?.value || 10);


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.fillStyle =
            COLORS.dark;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        drawGrid(
            ctx,
            width,
            height
        );


        const ground =
            height - 45;


        const maxHeight =
            Math.max(
                1,
                height - 100
            );


        const objectY =
            ground -
            (h / 100) *
            maxHeight;


        /* vertical height line */

        ctx.strokeStyle =
            COLORS.purple;

        ctx.lineWidth = 2;

        ctx.setLineDash([
            6,
            6
        ]);

        ctx.beginPath();

        ctx.moveTo(
            width * .35,
            ground
        );

        ctx.lineTo(
            width * .35,
            objectY + 25
        );

        ctx.stroke();

        ctx.setLineDash([]);


        /* height label */

        ctx.fillStyle =
            COLORS.purple;

        ctx.font =
            "700 14px system-ui";

        ctx.fillText(
            `h = ${round(h)} m`,
            width * .35 + 12,
            (ground + objectY) / 2
        );


        /* ground */

        ctx.strokeStyle =
            "rgba(148,163,184,.45)";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
            25,
            ground
        );

        ctx.lineTo(
            width - 25,
            ground
        );

        ctx.stroke();


        /* object */

        const x =
            width * .35 - 25;


        ctx.save();

        glow(
            ctx,
            COLORS.cyan,
            25
        );


        const gradient =
            ctx.createLinearGradient(
                x,
                objectY,
                x + 50,
                objectY + 50
            );


        gradient.addColorStop(
            0,
            COLORS.cyanBright
        );


        gradient.addColorStop(
            1,
            "#2563eb"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();

        ctx.arc(
            x + 25,
            objectY + 25,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        clearGlow(ctx);

        ctx.restore();


        /* gravity arrow */

        drawArrow(
            ctx,
            x + 25,
            objectY + 55,
            x + 25,
            objectY + 110,
            COLORS.orange,
            3
        );


        ctx.fillStyle =
            COLORS.orange;

        ctx.font =
            "700 13px system-ui";

        ctx.fillText(
            "gravity",
            x + 40,
            objectY + 90
        );


        ctx.fillStyle =
            COLORS.white;

        ctx.font =
            "700 14px system-ui";

        ctx.fillText(
            `m = ${mass} kg`,
            x - 5,
            objectY - 15
        );
    };


    [
        "pe-mass",
        "pe-height"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            drawPE
        );

    });


    /* =====================================================
       WORK ENERGY THEOREM
    ===================================================== */

    const updateTheorem = () => {

        const mass =
            Number($("theorem-mass")?.value || 0);

        const initial =
            Number($("theorem-initial")?.value || 0);

        const final =
            Number($("theorem-final")?.value || 0);


        const initialKE =
            0.5 *
            mass *
            initial *
            initial;


        const finalKE =
            0.5 *
            mass *
            final *
            final;


        const deltaKE =
            finalKE -
            initialKE;


        setText(
            "theorem-mass-value",
            `${mass} kg`
        );


        setText(
            "theorem-initial-value",
            `${initial} m/s`
        );


        setText(
            "theorem-final-value",
            `${final} m/s`
        );


        setText(
            "initial-ke-result",
            `${round(initialKE)} J`
        );


        setText(
            "final-ke-result",
            `${round(finalKE)} J`
        );


        setText(
            "delta-ke-result",
            `${round(deltaKE)} J`
        );


        setText(
            "theorem-work-result",
            `${round(deltaKE)} J`
        );
    };


    [
        "theorem-mass",
        "theorem-initial",
        "theorem-final"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updateTheorem
        );

    });


    /* =====================================================
       CONSERVATION OF ENERGY
    ===================================================== */

    const conservationCanvas =
        $("energy-conservation-canvas");


    let conservationTime = 0;


    const animateConservation = () => {

        if (!conservationCanvas) return;

        const result =
            setupCanvas(
                conservationCanvas
            );

        if (!result) return;

        const {
            ctx,
            width,
            height
        } = result;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.fillStyle =
            COLORS.dark;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        drawGrid(
            ctx,
            width,
            height
        );


        const totalEnergy =
            980;


        const phase =
            (Math.sin(conservationTime) + 1) / 2;


        const pe =
            totalEnergy *
            phase;


        const ke =
            totalEnergy -
            pe;


        const ground =
            height - 45;


        const maxY =
            70;


        const ballY =
            ground -
            phase *
            (ground - maxY);


        /* track */

        ctx.strokeStyle =
            "rgba(103,232,249,.12)";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(
            width * .28,
            maxY
        );

        ctx.lineTo(
            width * .28,
            ground
        );

        ctx.stroke();


        /* ball */

        ctx.save();

        glow(
            ctx,
            COLORS.cyan,
            25
        );


        const gradient =
            ctx.createRadialGradient(
                width * .28 - 7,
                ballY - 8,
                2,
                width * .28,
                ballY,
                25
            );


        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            .25,
            COLORS.cyanBright
        );

        gradient.addColorStop(
            1,
            "#2563eb"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();

        ctx.arc(
            width * .28,
            ballY,
            22,
            0,
            Math.PI * 2
        );

        ctx.fill();

        clearGlow(ctx);

        ctx.restore();


        /* PE bar */

        const barX =
            width * .52;


        const barWidth =
            Math.min(
                width * .35,
                300
            );


        drawEnergyBar(
            ctx,
            barX,
            height * .28,
            barWidth,
            22,
            pe / totalEnergy,
            COLORS.purple,
            "Potential Energy"
        );


        drawEnergyBar(
            ctx,
            barX,
            height * .48,
            barWidth,
            22,
            ke / totalEnergy,
            COLORS.orange,
            "Kinetic Energy"
        );


        drawEnergyBar(
            ctx,
            barX,
            height * .68,
            barWidth,
            22,
            1,
            COLORS.cyan,
            "Total Energy"
        );


        setText(
            "total-energy",
            `${round(totalEnergy)} J`
        );


        conservationTime += 0.025;


        requestAnimationFrame(
            animateConservation
        );
    };


    const drawEnergyBar = (
        ctx,
        x,
        y,
        width,
        height,
        amount,
        color,
        label
    ) => {

        ctx.save();

        ctx.fillStyle =
            "rgba(255,255,255,.07)";

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            width,
            height,
            height / 2
        );

        ctx.fill();


        const fillWidth =
            width *
            clamp(
                amount,
                0,
                1
            );


        ctx.fillStyle =
            color;

        glow(
            ctx,
            color,
            14
        );


        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            fillWidth,
            height,
            height / 2
        );

        ctx.fill();

        clearGlow(ctx);


        ctx.fillStyle =
            COLORS.white;

        ctx.font =
            "600 12px system-ui";

        ctx.fillText(
            label,
            x,
            y - 8
        );


        ctx.restore();
    };


    /* =====================================================
       MECHANICAL ENERGY
    ===================================================== */

    let mechanicalTime = 0;


    const animateMechanicalEnergy = () => {

        const total =
            980;


        const phase =
            (Math.sin(mechanicalTime) + 1) / 2;


        const pe =
            total *
            phase;


        const ke =
            total -
            pe;


        setText(
            "mechanical-pe",
            `${round(pe)} J`
        );


        setText(
            "mechanical-ke",
            `${round(ke)} J`
        );


        setText(
            "mechanical-total",
            `${total} J`
        );


        const peBar =
            $("mechanical-pe-bar");


        const keBar =
            $("mechanical-ke-bar");


        const totalBar =
            $("mechanical-total-bar");


        if (peBar) {

            peBar.style.width =
                `${(pe / total) * 100}%`;
        }


        if (keBar) {

            keBar.style.width =
                `${(ke / total) * 100}%`;
        }


        if (totalBar) {

            totalBar.style.width =
                "100%";
        }


        mechanicalTime += 0.025;


        requestAnimationFrame(
            animateMechanicalEnergy
        );
    };


    /* =====================================================
       POWER
    ===================================================== */

    const updatePower = () => {

        const work =
            Number($("power-work")?.value || 0);

        const time =
            Number($("power-time")?.value || 1);


        const power =
            work / time;


        setText(
            "power-work-value",
            `${work} J`
        );


        setText(
            "power-time-value",
            `${time} s`
        );


        setText(
            "power-result",
            `${round(power)} W`
        );
    };


    [
        "power-work",
        "power-time"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            updatePower
        );

    });


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(() => {

                    drawKEGraph();

                    drawPE();

                }, 150);

        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    const init = () => {

        updateWork();

        updateKE();

        updatePE();

        updateTheorem();

        updatePower();

        drawKEGraph();

        drawPE();

        drawWorkExperiment();

        animateConservation();

        animateMechanicalEnergy();
    };


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();
    }

})();