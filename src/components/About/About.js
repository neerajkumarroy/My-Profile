import "./About.css";
import { motion } from "framer-motion";
import Profile from "../../images/Hero2.png"

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
    }),
};

function About() {
    return (
        <section className="about" id="about">
            <motion.div
                className="about-left"
                initial={{ opacity: 0, x: -60, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="image-frame">
                    <motion.span
                        className="ring"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="glow-blob"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.img
                        src={Profile}
                        alt="profile"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </motion.div>

            <div className="about-right">
                <motion.h4
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    About Me
                </motion.h4>

                <motion.h2
                    custom={1}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Passionate Software Developer
                </motion.h2>

                <motion.p
                    custom={2}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    I am a Software Developer specializing in React.js,
                    JavaScript, Node.js, Express.js, and MongoDB. I enjoy
                    building responsive, modern, and user-friendly web
                    applications with clean and maintainable code.
                </motion.p>

                <motion.div
                    className="about-info"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
                    }}
                >
                    {[
                        { value: "20+", label: "Projects" },
                        { value: "1+", label: "Years Learning" },
                        { value: "15+", label: "Technologies" },
                    ].map((stat) => (
                        <motion.div
                            className="box"
                            key={stat.label}
                            variants={fadeUp}
                            whileHover={{ y: -8, scale: 1.05 }}
                        >
                            <h3>{stat.value}</h3>
                            <span>{stat.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default About;