/* =========================================================
   PHYSICS LAB — CONTENT / KINEMATICS
========================================================= */


/* =========================================================
   CLASS 9 DROPDOWN
========================================================= */

const classHeader =
    document.querySelector(".class-header");

const classContent =
    document.querySelector(".class-content");

const classExpandButton =
    document.querySelector(".expand-button");


if (
    classHeader &&
    classContent &&
    classExpandButton
) {

    classExpandButton.addEventListener(
        "click",
        () => {

            const isOpen =
                classExpandButton
                    .getAttribute("aria-expanded")
                    === "true";


            classExpandButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );


            classContent.classList.toggle(
                "closed",
                isOpen
            );


            classHeader.classList.toggle(
                "collapsed",
                isOpen
            );

        }
    );

}



/* =========================================================
   CHAPTER DROPDOWN
========================================================= */

const chapterButton =
    document.querySelector(".chapter-button");

const groupList =
    document.querySelector(".group-list");


if (
    chapterButton &&
    groupList
) {

    chapterButton.addEventListener(
        "click",
        () => {

            const isOpen =
                chapterButton.classList
                    .contains("active");


            chapterButton.classList.toggle(
                "active",
                !isOpen
            );


            chapterButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );


            groupList.classList.toggle(
                "open",
                !isOpen
            );

        }
    );

}



/* =========================================================
   FEEDBACK
========================================================= */

/*
   Put your Web3Forms Access Key here.

   Example:

   const WEB3FORMS_ACCESS_KEY =
       "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

*/

const WEB3FORMS_ACCESS_KEY =
    "YOUR_WEB3FORMS_ACCESS_KEY";


const feedbackForm =
    document.getElementById("feedbackForm");

const feedbackStatus =
    document.getElementById("feedbackStatus");


if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (
                WEB3FORMS_ACCESS_KEY ===
                "YOUR_WEB3FORMS_ACCESS_KEY"
            ) {

                feedbackStatus.textContent =
                    "Feedback service is not connected yet.";

                feedbackStatus.style.color =
                    "#fbbf24";

                return;

            }


            const button =
                feedbackForm.querySelector(
                    ".send-feedback"
                );


            button.disabled = true;


            const formData =
                new FormData(feedbackForm);


            formData.append(
                "access_key",
                WEB3FORMS_ACCESS_KEY
            );


            formData.append(
                "subject",
                "Physics Lab — Class 9 Kinematics Feedback"
            );


            formData.append(
                "from_name",
                "Physics Lab"
            );


            feedbackStatus.textContent =
                "Sending...";


            try {

                const response =
                    await fetch(
                        "https://api.web3forms.com/submit",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    feedbackStatus.textContent =
                        "✓ Feedback sent successfully.";

                    feedbackStatus.style.color =
                        "#22d3ee";


                    feedbackForm.reset();

                } else {

                    throw new Error(
                        "Submission failed"
                    );

                }

            } catch (error) {

                console.error(error);

                feedbackStatus.textContent =
                    "Something went wrong. Please try again.";

                feedbackStatus.style.color =
                    "#fb7185";

            }


            button.disabled = false;

        }
    );

}