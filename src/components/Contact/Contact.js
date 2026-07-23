import "./Contact.css";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaPaperPlane,
} from "react-icons/fa";

function Contact() {
    return (
        <section className="contact" id="contact">
            <div className="contact-heading">
                <span>Get In Touch</span>
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

                    <form>

                        <div className="input-group">

                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Your Email"
                                required
                            />

                        </div>

                        <input
                            type="text"
                            placeholder="Subject"
                            required
                        />

                        <textarea
                            rows="7"
                            placeholder="Write your message..."
                            required
                        ></textarea>

                        <button type="submit">
                            <FaPaperPlane />
                            Send Message
                        </button>

                    </form>

                </div>

            </div>
        </section>
    );
}

export default Contact;