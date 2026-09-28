class Simulation {

    constructor() {

        this.running = false;
        this.startTime = 0;
        this.animationId = null;
    }


    start(callback) {

        this.running = true;

        this.startTime = performance.now();


        const loop = (currentTime) => {

            if (!this.running) {
                return;
            }

            const elapsed =
                (currentTime - this.startTime) / 1000;

            callback(elapsed);

            this.animationId =
                requestAnimationFrame(loop);
        };


        this.animationId =
            requestAnimationFrame(loop);
    }


    stop() {

        this.running = false;

        if (this.animationId) {

            cancelAnimationFrame(
                this.animationId
            );

            this.animationId = null;
        }
    }


    reset() {

        this.stop();
    }
}