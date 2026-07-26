import "./Hero.css";
import { FaGithub, FaLinkedin, FaReact, FaNodeJs, FaEnvelope } from "react-icons/fa";
import { SiMongodb, SiJavascript } from "react-icons/si";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import profile from "../../images/Hero2.png";
import { useState } from "react";
import HirePopup from "../HirePopup/HirePopup";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: 0.6 + i * 0.15, duration: 0.5, ease: "backOut" },
    }),
};

function Hero() {
    const [openPopup, setOpenPopup] = useState(false);
    return (
        <section className="hero" id="home">
            <motion.div
                className="hero-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.p variants={fadeUp}>👋 Hello, I'm</motion.p>

                <motion.h1 variants={fadeUp}>Neeraj Kumar</motion.h1>

                <motion.div variants={fadeUp}>
                    <TypeAnimation
                        sequence={[
                            "MERN Stack Developer",
                            2000,
                            "React Developer",
                            2000,
                            "Frontend Developer",
                            2000,
                            "Backend Developer",
                            2000,
                        ]}
                        wrapper="h2"
                        repeat={Infinity}
                        className="typing"
                    />
                </motion.div>

                <motion.p className="hero-text" variants={fadeUp}>
                    I build premium web applications with React, Node.js,
                    Express and MongoDB.
                </motion.p>

                <motion.div className="hero-buttons" variants={fadeUp}>
                    <button onClick={() => setOpenPopup(true)}>
                        Hire Me
                    </button>
                    <a href="/NeerajResume.pdf" download>
                        <motion.button
                            className="outline"
                            whileHover={{ scale: 1.06, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Download Resume
                        </motion.button>
                    </a>
                </motion.div>

                <motion.div className="socials" variants={fadeUp}>

                    <motion.a
                        href="https://github.com/neerajkumarroy"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.2, rotate: 8, color: "#ff7b00" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub />
                    </motion.a>

                    <motion.a
                        href="https://www.linkedin.com/in/neeraj-kumar-roys/"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.2, rotate: -8, color: "#ff7b00" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaLinkedin />
                    </motion.a>

                    <motion.a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=neerajkumarroy@gmail.com&su=Hiring%20Inquiry&body=Hello%20Neeraj,%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{
                            scale: 1.2,
                            rotate: 8,
                            color: "#EA4335",
                            textShadow: "0 0 15px #EA4335"
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <FaEnvelope />
                    </motion.a>
                </motion.div>
            </motion.div>

            <div className="hero-right">
                <motion.div
                    className="glow"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>

                <motion.img
                    src={profile}
                    alt="Neeraj"
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    whileHover={{ scale: 1.04 }}
                />

                <motion.div
                    custom={0}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap react"
                    whileHover={{ scale: 1.25 }}
                >
                    <FaReact className="icon" />
                </motion.div>

                <motion.div
                    custom={1}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap node"
                    whileHover={{ scale: 1.25 }}
                >
                    <FaNodeJs className="icon" />
                </motion.div>

                <motion.div
                    custom={2}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap js"
                    whileHover={{ scale: 1.25 }}
                >
                    <SiJavascript className="icon" />
                </motion.div>

                <motion.div
                    custom={3}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap mongo"
                    whileHover={{ scale: 1.25 }}
                >
                    <SiMongodb className="icon" />
                </motion.div>
                <HirePopup
                    isOpen={openPopup}
                    onClose={() => setOpenPopup(false)}
                />
            </div>
        </section>
    );
}

export default Hero;