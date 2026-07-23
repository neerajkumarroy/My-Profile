import "./Footer.css";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaArrowUp, FaHeart } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const quickLinks = ["home", "about", "skills", "projects", "contact"];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
    }),
};

function Footer() {
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 500);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <footer className="footer">
            <motion.div
                className="footer-glow"
                animate={{ opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="footer-top">
                <motion.div
                    className="footer-brand"
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <h3 className="footer-logo">
                        Neeraj<span>.</span>
                        <p className="eng">Software Developer</p>
                    </h3>
                    <p>
                        MERN stack developer building clean, fast and
                        user-friendly web applications.
                    </p>
                    <div className="footer-socials">
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
                            href="#"
                            whileHover={{ scale: 1.2, rotate: 8, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </motion.a>
                    </div>
                </motion.div>

                <motion.div
                    className="footer-links"
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <h4>Quick Links</h4>
                    <ul>
                        {quickLinks.map((item) => (
                            <li key={item}>
                                <Link
                                    to={item}
                                    smooth={true}
                                    duration={500}
                                    offset={-80}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    className="footer-contact"
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                >
                    <h4>Get In Touch</h4>
                    <a href="mailto:you@example.com" className="footer-email">
                        <HiOutlineMail />neerajkumarroyss@gmail.com
                    </a>
                    <p className="footer-location">Based in India, working worldwide</p>
                </motion.div>
            </div>

            <motion.div
                className="footer-bottom"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <p>
                    © {new Date().getFullYear()} Neeraj Kumar. Made with{" "}
                    <FaHeart className="heart" /> using React.
                </p>
            </motion.div>

            <AnimatePresence>
                {showTop && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link to="home" smooth={true} duration={600}>
                            <motion.div
                                className="to-top"
                                whileHover={{ scale: 1.1, y: -4 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Back to top"
                            >
                                <FaArrowUp />
                            </motion.div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
}

export default Footer;