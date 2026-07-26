import React, { useEffect } from "react";
import "./HirePopup.css";

import { motion, AnimatePresence } from "framer-motion";
import Profile from "../../images/Hero2.png"

import {
    FaTimes,
    FaEnvelope,
    FaWhatsapp,
    FaGithub,
    FaLinkedin,
    FaReact,
    FaNodeJs,
    FaCheckCircle,
} from "react-icons/fa";

import {
    SiMongodb,
    SiExpress,
    SiNextdotjs,
} from "react-icons/si";

const FEATURES = [
    "Clean & Scalable Code",
    "Pixel-Perfect Responsive UI",
    "REST API Development",
    "Fast Performance",
    "Modern MERN Stack",
    "Long-Term Support",
];

const HirePopup = ({ isOpen, onClose }) => {
    const phoneNumber = "8445150766"; // Replace with your WhatsApp number

    const message = encodeURIComponent(`Hi Neeraj 👋

I came across your portfolio website and I'm impressed with your work.

I have a project requirement and would like to discuss it with you.

Please let me know when you're available.

Looking forward to working with you.

Thanks! 🚀`);


    // Lock background scroll + close on Escape while the popup is open.
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (

        <AnimatePresence>

            <motion.div
                className="popupOverlay"
                role="dialog"
                aria-modal="true"
                aria-label="Hire Neeraj Kumar"
                onMouseDown={handleOverlayClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >

                <motion.div
                    className="popupCard"
                    initial={{
                        scale: .92,
                        opacity: 0,
                        y: 40
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0
                    }}
                    exit={{
                        scale: .95,
                        opacity: 0
                    }}
                    transition={{
                        duration: .45,
                        ease: "easeOut"
                    }}
                >

                    {/* Close */}

                    <button
                        className="closeBtn"
                        onClick={onClose}
                        aria-label="Close popup"
                    >
                        <FaTimes />
                    </button>

                    {/* LEFT */}

                    <div className="popupLeft">

                        <div className="profileWrapper">

                            <div className="profileGlow"></div>

                            <img
                                src={Profile}
                                alt="Neeraj Kumar"
                            />

                        </div>

                        <span className="availableBadge mobileOnlyBadge">
                            🟢 Available For Work
                        </span>

                        <div className="techIcons">

                            <span title="React">
                                <FaReact />
                            </span>

                            <span title="Node.js">
                                <FaNodeJs />
                            </span>

                            <span title="Express">
                                <SiExpress />
                            </span>

                            <span title="MongoDB">
                                <SiMongodb />
                            </span>

                            <span title="Next.js">
                                <SiNextdotjs />
                            </span>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="popupRight">

                        <span className="availableBadge desktopOnlyBadge">
                            🟢 Available For Work
                        </span>

                        <h1>
                            Let's Build Something Amazing 🚀
                        </h1>

                        <h3>
                            Hi, I'm Neeraj Kumar
                        </h3>

                        <h2>
                            Full Stack MERN Developer
                        </h2>

                        <p>
                            I build fast, responsive and scalable web apps
                            using the MERN Stack, with clean code and a strong
                            focus on user experience.
                        </p>

                        <div className="statsGrid">

                            <div className="statCard">
                                <h2>20+</h2>
                                <span>Projects Completed</span>
                            </div>

                            <div className="statCard">
                                <h2>100%</h2>
                                <span>Responsive Design</span>
                            </div>

                            <div className="statCard">
                                <h2>24 hrs</h2>
                                <span>Average Response</span>
                            </div>

                            <div className="statCard">
                                <h2>MERN</h2>
                                <span>Tech Stack</span>
                            </div>

                        </div>

                        <h3 className="sectionLabel">Why Hire Me?</h3>

                        <div className="featureGrid">

                            {FEATURES.map((feature) => (
                                <div className="featureItem" key={feature}>
                                    <FaCheckCircle />
                                    <span>{feature}</span>
                                </div>
                            ))}

                        </div>

                        <div className="popupButtons">

                            <motion.a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=neerajkumarroy@gmail.com&su=Hiring%20Inquiry&body=Hello%20Neeraj,%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: .95 }}
                                className="emailBtn"
                            >
                                <FaEnvelope />
                                Email Me
                            </motion.a>

                            <motion.a
                                href={`https://wa.me/${phoneNumber}?text=${message}`}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: .95 }}
                                className="whatsappBtn"
                            >
                                <FaWhatsapp />
                                WhatsApp
                            </motion.a>

                        </div>

                        <div className="socialLinks">

                            <motion.a
                                href="https://github.com/neerajkumarroy"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                whileHover={{ scale: 1.15, rotate: 8 }}
                            >
                                <FaGithub />
                            </motion.a>

                            <motion.a
                                href="https://www.linkedin.com/in/neeraj-kumar-roys/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                whileHover={{ scale: 1.15, rotate: 8 }}
                            >
                                <FaLinkedin />
                            </motion.a>

                        </div>

                    </div>

                </motion.div>

            </motion.div>

        </AnimatePresence>

    );

};

export default HirePopup;