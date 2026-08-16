const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(express.json());


/* =====================================================
   SERVE FRONTEND
===================================================== */

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);


/* =====================================================
   CONTACT API - BREVO
===================================================== */

app.post(
    "/api/contact",
    async (req, res) => {

        try {

            const {
                name,
                email,
                subject,
                message
            } = req.body;


            /* =================================================
               VALIDATION
            ================================================= */

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "All fields are required."

                    });

            }


            /* =================================================
               EMAIL VALIDATION
            ================================================= */

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailRegex.test(email)) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid email."

                    });

            }


            /* =================================================
               CHECK BREVO CONFIGURATION
            ================================================= */

            if (
                !process.env.BREVO_API_KEY ||
                !process.env.EMAIL_FROM ||
                !process.env.EMAIL_TO
            ) {

                console.error(
                    "Brevo environment variables are missing."
                );

                return res
                    .status(500)
                    .json({

                        success: false,

                        message:
                            "Email service is not configured."

                    });

            }


            /* =================================================
               SEND EMAIL USING BREVO API
            ================================================= */

            const brevoResponse =
                await fetch(
                    "https://api.brevo.com/v3/smtp/email",
                    {

                        method: "POST",

                        headers: {

                            "accept":
                                "application/json",

                            "api-key":
                                process.env.BREVO_API_KEY,

                            "content-type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            sender: {

                                name:
                                    "My Portfolio",

                                email:
                                    process.env.EMAIL_FROM

                            },

                            to: [

                                {

                                    email:
                                        process.env.EMAIL_TO,

                                    name:
                                        "Portfolio Owner"

                                }

                            ],

                            replyTo: {

                                email:
                                    email

                            },

                            subject:
                                `Portfolio Contact: ${subject}`,

                           textContent: `
New Portfolio Message

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:

${message}
`,

htmlContent: `

                                <div
                                    style="
                                        font-family: Arial, sans-serif;
                                        padding: 20px;
                                        line-height: 1.6;
                                    "
                                >

                                    <h2>
                                        New Portfolio Message
                                    </h2>

                                    <p>
                                        <strong>
                                            Name:
                                        </strong>
                                        ${escapeHtml(name)}
                                    </p>

                                    <p>
                                        <strong>
                                            Email:
                                        </strong>
                                        ${escapeHtml(email)}
                                    </p>

                                    <p>
                                        <strong>
                                            Subject:
                                        </strong>
                                        ${escapeHtml(subject)}
                                    </p>

                                    <hr>

                                    <h3>
                                        Message
                                    </h3>

                                    <p>
                                        ${escapeHtml(message)}
                                    </p>

                                </div>

                            `

                        })

                    }
                );


            /* =================================================
               BREVO RESPONSE
            ================================================= */

            const data =
                await brevoResponse.json();


            console.log(
                "Brevo response:",
                data
            );


            /* =================================================
               BREVO ERROR
            ================================================= */

            if (!brevoResponse.ok) {

                console.error(
                    "Brevo email error:",
                    data
                );

                return res
                    .status(500)
                    .json({

                        success: false,

                        message:
                            "Unable to send message."

                    });

            }


            /* =================================================
               SUCCESS
            ================================================= */

            return res.json({

                success: true,

                message:
                    "Message sent successfully!"

            });


        } catch (error) {

            console.error(
                "Contact error:",
                error
            );


            return res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to send message."

                });

        }

    }
);


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHtml(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   FALLBACK
===================================================== */

app.use(
    (req, res, next) => {

        if (
            req.method === "GET" &&
            !req.path.startsWith("/api")
        ) {

            return res.sendFile(
                path.join(
                    __dirname,
                    "../public/index.html"
                )
            );

        }

        next();

    }
);


/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Portfolio running on port ${PORT}`
        );

    }
);