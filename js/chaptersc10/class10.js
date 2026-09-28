/* =========================================
   CLASS 10 PHYSICS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const chapterCards = document.querySelectorAll(".chapter-card");


    chapterCards.forEach((card) => {

        card.addEventListener("click", (event) => {

            const chapter = card.dataset.chapter;

            /*
             * Chapter pages will be connected here
             * as they are created.
             */

            if (chapter === "work-energy") {

                event.preventDefault();

                window.location.href =
                    "class10/work-energy.html";

            }

        });

    });

});
