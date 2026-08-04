import { useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaPaperPlane,
} from "react-icons/fa";

// =======================================================
// EMAILJS CREDENTIALS - PASTE YOUR VALUES HERE
// =======================================================
const EMAILJS_PUBLIC_KEY = "aJ5Pr0GP0Eag13EVp";
const EMAILJS_SERVICE_ID = "service_fg3uwpa";
const EMAILJS_TEMPLATE_ID = "data@123";
// =======================================================

function Contact() {
    // Controlled form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // Track sending state to disable button / change text
    const [isSending, setIsSending] = useState(false);

    // Handle input changes for all fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Simple email format validator
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Reset form fields after successful send
    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions while already sending
        if (isSending) return;

        const { name, email, subject, message } = formData;

        // 1 & 2. Validate all fields / prevent empty submissions
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            toast.warn("⚠️ Please fill in all required fields.");
            return;
        }

        // 3. Validate email format
        if (!isValidEmail(email)) {
            toast.warn("⚠️ Please enter a valid email address.");
            return;
        }

        // 4 & 5. Disable button + change text while sending
        setIsSending(true);

        try {
            // 6. Send the email using EmailJS
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message,
                    to_email: "neerajkumarroyss@gmail.com",
                },
                EMAILJS_PUBLIC_KEY
            );

            // 7. Success: clear fields, re-enable button, show toast
            resetForm();
            toast.success(
                "✅ Message sent successfully!"
            );
        } catch (error) {
            // 8. Failure: re-enable button, keep values, show error toast
            console.error("EmailJS Error:", error);
            toast.error("❌ Failed to send message. Please try again later.");
        } finally {
            // Always re-enable the button when done
            setIsSending(false);
        }
    };

    return (
        <section className="contact" id="contact">
            <div className="contact-heading">
                <div className="contact-eyebrow">
                    <span className="contact-line"></span>
                    <h4 className="exitcolor">GET IN TOUCH</h4>
                </div>

                <h2>Let's Work Together</h2>

                <p>
                    Have a project in mind or want to discuss an opportunity?
                    Feel free to contact me.
                </p>
            </div>

            <div className="contact-container">

                {/* Left Side */}

                <div className="contact-info">

                    <div className="info-card">
                        <FaMapMarkerAlt />
                        <div>
                            <h3>Location</h3>
                            <p>Dehradun, Uttarakhand, India</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <FaPhoneAlt />
                        <div>
                            <h3>Phone</h3>
                            <p>+918445150766</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <FaEnvelope />
                        <div>
                            <h3>Email</h3>
                            <p>neerajkumarroyss@gmail.com</p>
                        </div>
                    </div>

                </div>

                {/* Right Side */}

                <div className="contact-form">

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            rows="7"
                            name="message"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <button type="submit" disabled={isSending}>
                            <FaPaperPlane />
                            {isSending ? "Sending..." : "Send Message"}
                        </button>

                    </form>

                </div>

            </div>

            {/* Toast notification container - renders all toasts */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="dark"
            />
        </section>
    );
}

export default Contact;