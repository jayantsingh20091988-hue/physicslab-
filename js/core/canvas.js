class PhysicsCanvas {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.resize();

        window.addEventListener("resize", () => {
            this.resize();
        });
    }


    resize() {

        const rect = this.canvas.getBoundingClientRect();

        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        this.width = rect.width;
        this.height = rect.height;
    }


    clear() {

        this.ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );
    }


    drawGrid() {

        const ctx = this.ctx;

        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;

        const spacing = 40;

        for (
            let x = 0;
            x <= this.width;
            x += spacing
        ) {

            ctx.beginPath();

            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);

            ctx.stroke();
        }


        for (
            let y = 0;
            y <= this.height;
            y += spacing
        ) {

            ctx.beginPath();

            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);

            ctx.stroke();
        }
    }
}