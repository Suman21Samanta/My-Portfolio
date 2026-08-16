/* =====================================================
   PORTFOLIO JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       TYPING EFFECT
    ===================================================== */

    const typingText =
        document.querySelector(".typing-text");

    const words = [
        "Frontend Developer",
        "Web Developer",
        "UI/UX Designer"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {

        // যদি HTML-এ typing element না থাকে
        if (!typingText) {
            return;
        }

        const currentWord =
            words[wordIndex];

        if (!deleting) {

            typingText.textContent =
                currentWord.substring(
                    0,
                    charIndex + 1
                );

            charIndex++;

            if (
                charIndex ===
                currentWord.length
            ) {

                deleting = true;

                setTimeout(
                    typeEffect,
                    1500
                );

                return;
            }

        } else {

            typingText.textContent =
                currentWord.substring(
                    0,
                    charIndex - 1
                );

            charIndex--;

            if (charIndex === 0) {

                deleting = false;

                wordIndex++;

                if (
                    wordIndex >=
                    words.length
                ) {

                    wordIndex = 0;

                }

            }

        }

        const speed =
            deleting ? 50 : 100;

        setTimeout(
            typeEffect,
            speed
        );

    }

    if (typingText) {
        typeEffect();
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuIcon =
        document.querySelector("#menu-icon");

    const navbar =
        document.querySelector("#navbar");


    if (menuIcon && navbar) {

        menuIcon.addEventListener(
            "click",
            () => {

                navbar.classList.toggle(
                    "active"
                );

                const icon =
                    menuIcon.querySelector("i");

                if (!icon) {
                    return;
                }

                if (
                    navbar.classList.contains(
                        "active"
                    )
                ) {

                    icon.classList.remove(
                        "bx-menu"
                    );

                    icon.classList.add(
                        "bx-x"
                    );

                } else {

                    icon.classList.remove(
                        "bx-x"
                    );

                    icon.classList.add(
                        "bx-menu"
                    );

                }

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU
    ===================================================== */

    document
        .querySelectorAll(".navbar a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (!navbar || !menuIcon) {
                        return;
                    }

                    navbar.classList.remove(
                        "active"
                    );

                    const icon =
                        menuIcon.querySelector("i");

                    if (!icon) {
                        return;
                    }

                    icon.classList.remove(
                        "bx-x"
                    );

                    icon.classList.add(
                        "bx-menu"
                    );

                }
            );

        });


    /* =====================================================
       ACTIVE NAVBAR
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "section"
        );

    const navLinks =
        document.querySelectorAll(
            ".navbar a"
        );


    window.addEventListener(
        "scroll",
        () => {

            let current = "";

            sections.forEach(
                section => {

                    const sectionTop =
                        section.offsetTop - 180;

                    if (
                        window.scrollY >=
                        sectionTop
                    ) {

                        current =
                            section.getAttribute(
                                "id"
                            );

                    }

                }
            );


            navLinks.forEach(
                link => {

                    link.classList.remove(
                        "active"
                    );

                    if (
                        link.getAttribute(
                            "href"
                        ) === "#" + current
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       3D MOUSE EFFECT
    ===================================================== */

    const cube =
        document.querySelector(".cube");


    if (cube) {

        document.addEventListener(
            "mousemove",
            event => {

                const x =
                    (
                        window.innerWidth / 2
                        - event.clientX
                    ) / 25;


                const y =
                    (
                        window.innerHeight / 2
                        - event.clientY
                    ) / 25;


                cube.style.animationPlayState =
                    "paused";


                cube.style.transform =
                    `rotateX(${y}deg)
                     rotateY(${-x}deg)`;

            }
        );

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const form =
        document.querySelector(
            "#contact-form"
        );


    const submitButton =
        document.querySelector(
            "#submit-btn"
        );


    const formMessage =
        document.querySelector(
            "#form-message"
        );


    if (form) {

        form.addEventListener(
            "submit",
            async event => {

                /*
                 * VERY IMPORTANT
                 * Prevent normal HTML form submission.
                 * This stops the page from jumping/reloading.
                 */

                event.preventDefault();

                event.stopPropagation();


                /* -----------------------------------------
                   GET FORM VALUES
                ----------------------------------------- */

                const name =
                    document
                        .querySelector("#name")
                        ?.value
                        .trim();


                const email =
                    document
                        .querySelector("#email")
                        ?.value
                        .trim();


                const subject =
                    document
                        .querySelector("#subject")
                        ?.value
                        .trim();


                const message =
                    document
                        .querySelector("#message")
                        ?.value
                        .trim();


                /* -----------------------------------------
                   CHECK INPUT
                ----------------------------------------- */

                if (
                    !name ||
                    !email ||
                    !subject ||
                    !message
                ) {

                    if (formMessage) {

                        formMessage.textContent =
                            "Please fill in all fields.";

                        formMessage.style.color =
                            "#ff6b6b";

                    }

                    return;

                }


                /* -----------------------------------------
                   EMAIL VALIDATION
                ----------------------------------------- */

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailRegex.test(email)
                ) {

                    if (formMessage) {

                        formMessage.textContent =
                            "Please enter a valid email.";

                        formMessage.style.color =
                            "#ff6b6b";

                    }

                    return;

                }


                /* -----------------------------------------
                   BUTTON LOADING
                ----------------------------------------- */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Sending...";

                }


                if (formMessage) {

                    formMessage.textContent =
                        "Sending message...";

                    formMessage.style.color =
                        "#00eaff";

                }


                /* -----------------------------------------
                   SEND TO NODE.JS BACKEND
                ----------------------------------------- */

                try {

                    const response =
                        await fetch(
                            "/api/contact",
                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        name:
                                            name,

                                        email:
                                            email,

                                        subject:
                                            subject,

                                        message:
                                            message

                                    })

                            }
                        );


                    /* -------------------------------------
                       GET SERVER RESPONSE
                    ------------------------------------- */

                    const data =
                        await response.json();


                    console.log(
                        "Server response:",
                        data
                    );


                    /* -------------------------------------
                       SUCCESS
                    ------------------------------------- */

                    if (
                        response.ok &&
                        data.success
                    ) {

                        if (formMessage) {

                            formMessage.textContent =
                                "✓ Message sent successfully!";

                            formMessage.style.color =
                                "#00eaff";

                        }


                        form.reset();

                    }


                    /* -------------------------------------
                       SERVER ERROR
                    ------------------------------------- */

                    else {

                        if (formMessage) {

                            formMessage.textContent =
                                data.message ||
                                "Unable to send message.";

                            formMessage.style.color =
                                "#ff6b6b";

                        }

                        console.error(
                            "Server error:",
                            data
                        );

                    }

                }


                /* -----------------------------------------
                   CONNECTION ERROR
                ----------------------------------------- */

                catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );


                    if (formMessage) {

                        formMessage.textContent =
                            "Unable to connect to server.";

                        formMessage.style.color =
                            "#ff6b6b";

                    }

                }


                /* -----------------------------------------
                   RESET BUTTON
                ----------------------------------------- */

                finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Send Message";

                    }

                }

            }
        );

    } else {

        console.error(
            "Contact form #contact-form not found."
        );

    }

});