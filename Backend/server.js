const express = require("express");

const nodemailer = require("nodemailer");

const path = require("path");

const dotenv = require("dotenv");


dotenv.config();


const app = express();


const PORT =
    process.env.PORT || 5000;


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
    express.json()
);


/* =====================================================
   SERVE FRONTEND
===================================================== */

app.use(
    express.static(
        path.join(
            __dirname,
            "../public"
        )
    )
);


/* =====================================================
   EMAIL TRANSPORTER
===================================================== */

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


/* =====================================================
   TEST EMAIL CONNECTION
===================================================== */

transporter.verify(
    error => {

        if (error) {

            console.log(
                "Email configuration error:",
                error.message
            );

        } else {

            console.log(
                "Email service is ready."
            );

        }

    }
);


/* =====================================================
   CONTACT API
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


            /* Validation */

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


            /* Basic email validation */

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(email)
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid email."

                    });

            }


            /* Email */

            const mailOptions = {

                from:
                    process.env.EMAIL_USER,

                to:
                    process.env.EMAIL_TO,

                replyTo:
                    email,

                subject:
                    `Portfolio Contact: ${subject}`,

                text: `
New Portfolio Message

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:

${message}
                `,

                html: `
                    <div
                        style="
                            font-family: Arial;
                            padding: 20px;
                            line-height: 1.6;
                        "
                    >

                        <h2>
                            New Portfolio Message
                        </h2>

                        <p>
                            <strong>Name:</strong>
                            ${escapeHtml(name)}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${escapeHtml(email)}
                        </p>

                        <p>
                            <strong>Subject:</strong>
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

            };


            await transporter.sendMail(
                mailOptions
            );


            res.json({

                success: true,

                message:
                    "Message sent successfully!"

            });


        } catch (error) {

            console.error(
                "Contact error:",
                error
            );


            res
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

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   FALLBACK
===================================================== */

app.use((req, res, next) => {

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

});

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