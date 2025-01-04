import { https, firestore } from "firebase-functions";
import { initializeApp } from "firebase-admin";
import { createTransport } from "nodemailer";

// Initialize Firebase Admin SDK to interact with Firestore
initializeApp();

// Nodemailer email transporter configuration
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Your Gmail account
    pass: "your-email-password",   // Your Gmail password (consider using environment variables for security)
  },
});

// Function to send a generic email
export const sendEmail = https.onRequest((req, res) => {
  const { email, subject, message } = req.body; // Get data from the request body

  const mailOptions = {
    from: "your-email@gmail.com", // Sender's email
    to: email,                    // Receiver's email
    subject: subject,             // Email subject
    text: message,                // Email content
  };

  // Send email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString()); // Send error if email fails
    }
    return res.status(200).send("Email sent: " + info.response); // Success response
  });
});

// Function to send booking confirmation email
export const sendBookingConfirmationEmail = firestore
  .document("bookings/{bookingId}")
  .onCreate((snap) => {
    const bookingData = snap.data();

    const mailOptions = {
      from: "your-email@gmail.com", // Sender's email
      to: bookingData.email,         // Customer's email
      subject: "Booking Confirmation",
      html: `<h1>Booking Confirmed!</h1>
             <p>Dear ${bookingData.name},</p>
             <p>Your booking for ${bookingData.room} has been confirmed.</p>
             <p>Booking details:</p>
             <ul>
               <li><strong>Check-in:</strong> ${bookingData.checkIn}</li>
               <li><strong>Check-out:</strong> ${bookingData.checkOut}</li>
               <li><strong>Guests:</strong> ${bookingData.guests}</li>
               <li><strong>Price:</strong> ${bookingData.price}</li>
             </ul>
             <p>Thank you for choosing us!</p>`,
    };

    // Send email
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
