import React from "react";
import "./Education.css";
import { motion } from "framer-motion";
import { FaGraduationCap, FaSchool } from "react-icons/fa";
import { MdCastForEducation } from "react-icons/md";

const educationData = [
    {
        year: "2023 - 2025",
        degree: "Master of Computer Applications (MCA)",
        institute: "Uttaranchal Institute of Technology (UIT), Dehradun",
        score: "CGPA: 8.7/10",
        icon: <MdCastForEducation />,
        color: "#ff7b00",
    },
    {
        year: "2020 - 2023",
        degree: "Bachelor of Computer Applications (BCA)",
        institute: "Himalayan Institute of Technology (HIT), Dehradun",
        score: "CGPA: 8.5/10",
        icon: <FaGraduationCap />,
        color: "#0ea5e9",
    },
    {
        year: "2020",
        degree: "Higher Secondary (12th)",
        institute: "Uttar Pradesh Board",
        score: "Passed",
        icon: <FaSchool />,
        color: "#10b981",
    },
    {
        year: "2018",
        degree: "Secondary (10th)",
        institute: "Uttar Pradesh Board",
        score: "Passed",
        icon: <FaSchool />,
        color: "#8b5cf6",
    },
];

const titleVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" },
    }),
};

const gridVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: "easeOut" },
    },
};

function Education() {
    return (
        <section className="education" id="education">
            <div className="education-heading">
                <motion.div
                    className="education-eyebrow"
                    custom={0}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <span className="education-line"></span>
                    <h4>My Education</h4>
                </motion.div>

                <motion.h2
                    custom={1}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Academic Journey
                </motion.h2>

                <motion.p
                    custom={2}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    My educational background has provided me with strong technical
                    knowledge and problem-solving skills, helping me build a solid
                    foundation in software development.
                </motion.p>
            </div>

            <motion.div
                className="education-grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {educationData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="education-card"
                        variants={cardVariants}
                        style={{ "--accent": item.color }}
                        whileHover={{ y: -8, transition: { duration: 0.25 } }}
                    >
                        <div className="education-top">
                            <motion.div
                                className="education-icon"
                                style={{ background: item.color }}
                                whileHover={{ rotate: 12, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {item.icon}
                            </motion.div>

                            <span className="education-index">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <span className="education-year">{item.year}</span>
                        <h3>{item.degree}</h3>
                        <h4>{item.institute}</h4>
                        <p className="education-score">{item.score}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}

export default Education;