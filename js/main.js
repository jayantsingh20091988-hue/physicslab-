const canvasElement =
    document.getElementById("physicsCanvas");


const physicsCanvas =
    new PhysicsCanvas(canvasElement);


const simulation =
    new Simulation();


const projectile =
    new ProjectileMotion(
        physicsCanvas,
        physicsCanvas
    );


/*
 * Controls
 */

const velocitySlider =
    document.getElementById("velocity");

const angleSlider =
    document.getElementById("angle");

const gravitySlider =
    document.getElementById("gravity");


const velocityValue =
    document.getElementById("velocityValue");

const angleValue =
    document.getElementById("angleValue");

const gravityValue =
    document.getElementById("gravityValue");


const runButton =
    document.getElementById("runButton");

const resetButton =
    document.getElementById("resetButton");


const distanceResult =
    document.getElementById("distanceResult");

const heightResult =
    document.getElementById("heightResult");

const timeResult =
    document.getElementById("timeResult");


const status =
    document.getElementById("simulationStatus");


/*
 * Update simulation parameters
 */

function updateParameters() {

    const velocity =
        Number(velocitySlider.value);

    const angle =
        Number(angleSlider.value);

    const gravity =
        Number(gravitySlider.value);


    velocityValue.textContent =
        velocity;

    angleValue.textContent =
        angle;

    gravityValue.textContent =
        gravity;


    projectile.setParameters(
        velocity,
        angle,
        gravity
    );


    distanceResult.textContent =
        projectile.distance.toFixed(2) + " m";


    heightResult.textContent =
        projectile.maxHeight.toFixed(2) + " m";


    timeResult.textContent =
        projectile.flightTime.toFixed(2) + " s";


    projectile.createTrajectory();

    projectile.reset();
}


/*
 * Slider events
 */

velocitySlider.addEventListener(
    "input",
    updateParameters
);

angleSlider.addEventListener(
    "input",
    updateParameters
);

gravitySlider.addEventListener(
    "input",
    updateParameters
);


/*
 * Run
 */

runButton.addEventListener(
    "click",
    () => {

        simulation.stop();

        status.textContent =
            "Running";

        simulation.start(
            (time) => {

                projectile.update(time);

                if (
                    time >=
                    projectile.flightTime
                ) {

                    simulation.stop();

                    status.textContent =
                        "Complete";
                }

            }
        );
    }
);


/*
 * Reset
 */

resetButton.addEventListener(
    "click",
    () => {

        simulation.stop();

        projectile.reset();

        status.textContent =
            "Ready";
    }
);


/*
 * Initial setup
 */

updateParameters();