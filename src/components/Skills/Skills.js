import { useEffect, useState } from "react";
import "./Skills.css";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import {
    FaHtml5,
    FaCss3Alt,
    FaReact,
    FaNodeJs,
    FaGitAlt,
} from "react-icons/fa";

import {
    SiJavascript,
    SiExpress,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiTailwindcss,
    SiBootstrap
} from "react-icons/si";

const skills = [
    { icon: <FaHtml5 />, name: "HTML5", level: 95 },
    { icon: <FaCss3Alt />, name: "CSS3", level: 90 },
    { icon: <SiJavascript />, name: "JavaScript", level: 90 },
    { icon: <FaReact />, name: "React.js", level: 90 },
    { icon: <SiNextdotjs />, name: "Next.js", level: 60 },
    { icon: <FaNodeJs />, name: "Node.js", level: 85 },
    { icon: <SiExpress />, name: "Express.js", level: 85 },
    { icon: <SiMongodb />, name: "MongoDB", level: 85 },
    { icon: <SiMysql />, name: "MySQL", level: 50 },
    { icon: <FaGitAlt />, name: "Git", level: 80 },
    { icon: <SiTailwindcss />, name: "Tailwind CSS", level: 85 },
    { icon: <SiBootstrap />, name: "Bootstrap", level: 90 },
];

const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
    }),
};

const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

/* Animated count-up number, starts only once the card is in view */
function Counter({ target, inView }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start = 0; //add let key word
        const duration = 1200;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            setValue(Math.round(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }, [inView, target]);

    return <>{value}%</>;
}

function SkillCard({ skill, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });

    return (
        <motion.div
            className="skill-card"
            variants={cardVariants}
            whileHover={{ y: -12, scale: 1.03 }}
            ref={ref}
        >
            <motion.div
                className="skill-icon"
                whileHover={{ rotate: 12, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
                {skill.icon}
            </motion.div>

            <h3>{skill.name}</h3>

            <div className="progress-bar">
                <motion.div
                    className="progress"
                    initial={{ width: 0 }}
                    animate={{ width: inView ? `${skill.level}%` : 0 }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: index * 0.05 }}
                />
            </div>

            <span>
                <Counter target={skill.level} inView={inView} />
            </span>
        </motion.div>
    );
}

function Skills() {
    return (
        <section className="skills" id="skills">
            <div className="section-title">
                <motion.span
                    custom={0}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    My Skills
                </motion.span>
                <motion.h2
                    custom={1}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Technical Skills
                </motion.h2>
                <motion.p
                    custom={2}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Technologies and tools I use to build modern web applications.
                </motion.p>
            </div>

            <motion.div
                className="skills-grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {skills.map((skill, index) => (
                    <SkillCard skill={skill} index={index} key={skill.name} />
                ))}
            </motion.div>
        </section>
    );
}

export default Skills;