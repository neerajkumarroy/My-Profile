import { useEffect, useState, useRef } from "react";
import "./Skills.css";
import { motion, useInView } from "framer-motion";

import {
    FaHtml5,
    FaCss3Alt,
    FaReact,
    FaNodeJs,
    FaGitAlt,
    FaGithub,
    FaDocker,
    FaAws,
} from "react-icons/fa";

import {
    SiJavascript,
    SiExpress,
    SiMongodb,
    SiMysql,
    SiNextdotjs,
    SiTailwindcss,
    SiBootstrap,
} from "react-icons/si";

/* =========================================================
   CUSTOM SVG ICONS
========================================================= */

/* MUI */

const MuiIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="M2 5.2 12 1l10 4.2v9.2L12 19l-4.6-1.9v-3.3L12 15.7l7-2.9V7.4L12 4.5 5.2 7.3v7.2L2 13.2V5.2Z"
            fill="currentColor"
        />

        <path
            d="M7.2 8.8 12 6.8l4.8 2v3.2l-4.8 2-4.8-2V8.8Z"
            fill="currentColor"
            opacity="0.65"
        />
    </svg>
);

/* Zustand */

const ZustandIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        />

        <path
            d="M8 9.5c1.5-2 4-2.2 5.7-.7 1.3 1.1 1.8 2.8 1.2 4.3-.7 1.8-2.7 2.8-4.6 2.2-1.3-.4-2.2-1.5-2.3-2.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />

        <circle
            cx="9"
            cy="10"
            r="1"
            fill="currentColor"
        />

        <circle
            cx="15"
            cy="14"
            r="1"
            fill="currentColor"
        />
    </svg>
);

/* RESTful API */

const RestApiIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        />

        <path
            d="M7 9h10M7 13h6M7 17h4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />

        <circle
            cx="18"
            cy="13"
            r="1.5"
            fill="currentColor"
        />
    </svg>
);

/* Socket.io */

const SocketIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle
            cx="12"
            cy="12"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        />

        <path
            d="M8 12h8M12 8v8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />

        <circle
            cx="12"
            cy="12"
            r="2"
            fill="currentColor"
        />
    </svg>
);

/* Netlify */

const NetlifyIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="M3 11.5 12 4l9 7.5-9 1.7-9-1.7Z"
            fill="currentColor"
        />

        <path
            d="M5 14.1 12 19l7-4.9-2-.4-5 3.4-5-3.4-2 .4Z"
            fill="currentColor"
        />

        <path
            d="M7.3 7.2 12 3l4.7 4.2-1.8.5L12 5.5 9.1 7.7l-1.8-.5Z"
            fill="currentColor"
        />
    </svg>
);

/* Render */

const RenderIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="M4 4h7.5c4.7 0 8.5 3.3 8.5 7.5S16.2 19 11.5 19H8v-3h3.5c2.8 0 5-1.9 5-4.5s-2.2-4.5-5-4.5H7v13H4V4Z"
            fill="currentColor"
        />
    </svg>
);

/* =========================================================
   SKILLS DATA
========================================================= */

const skills = [
    {
        icon: <FaHtml5 />,
        name: "HTML5",
        className: "html",
    },

    {
        icon: <FaCss3Alt />,
        name: "CSS3",
        className: "css",
    },

    {
        icon: <SiJavascript />,
        name: "JavaScript",
        className: "javascript",
    },

    {
        icon: <FaReact />,
        name: "React.js",
        className: "react",
    },

    {
        icon: <SiNextdotjs />,
        name: "Next.js",
        className: "next",
    },

    {
        icon: <FaNodeJs />,
        name: "Node.js",
        className: "node",
    },

    {
        icon: <SiExpress />,
        name: "Express.js",
        className: "express",
    },

    {
        icon: <SiMongodb />,
        name: "MongoDB",
        className: "mongodb",
    },

    {
        icon: <SiMysql />,
        name: "MySQL",
        className: "mysql",
    },

    {
        icon: <SiTailwindcss />,
        name: "Tailwind CSS",
        className: "tailwind",
    },

    {
        icon: <SiBootstrap />,
        name: "Bootstrap",
        className: "bootstrap",
    },

    {
        icon: <MuiIcon />,
        name: "MUI",
        className: "mui",
    },

    {
        icon: <ZustandIcon />,
        name: "Zustand",
        className: "zustand",
    },

    {
        icon: <RestApiIcon />,
        name: "RESTful API",
        className: "rest-api",
    },

    {
        icon: <SocketIcon />,
        name: "Socket.io",
        className: "socket",
    },

    {
        icon: <FaGitAlt />,
        name: "Git",
        className: "git",
    },

    {
        icon: <FaGithub />,
        name: "GitHub",
        className: "github",
    },

    {
        icon: <FaDocker />,
        name: "Docker",
        className: "docker",
    },

    {
        icon: <FaAws />,
        name: "AWS",
        className: "aws",
    },

    {
        icon: <NetlifyIcon />,
        name: "Netlify",
        className: "netlify",
    },

    {
        icon: <RenderIcon />,
        name: "Render",
        className: "render",
    },
];

/* =========================================================
   TITLE ANIMATION
========================================================= */

const titleVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },

    visible: (i = 0) => ({
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.6,
            delay: i * 0.15,
            ease: "easeOut",
        },
    }),
};

/* =========================================================
   GRID ANIMATION
========================================================= */

const gridVariants = {
    hidden: {},

    visible: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
};

/* =========================================================
   CARD ANIMATION
========================================================= */

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 35,
        scale: 0.96,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

/* =========================================================
   SKILL CARD
========================================================= */

function SkillCard({ skill }) {
    return (
        <motion.div
            className="skill-card"
            variants={cardVariants}
            whileHover={{
                y: -8,
                transition: {
                    duration: 0.25,
                    ease: "easeOut",
                },
            }}
        >
            <motion.div
                className={`skill-icon ${skill.className}`}
                whileHover={{
                    scale: 1.08,
                    rotate: 3,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut",
                }}
            >
                {skill.icon}
            </motion.div>

            <h3>{skill.name}</h3>
        </motion.div>
    );
}

/* =========================================================
   SKILLS COMPONENT
========================================================= */

function Skills() {
    return (
        <section className="skills" id="skills">

            {/* =========================
                SECTION TITLE
            ========================= */}

            <div className="section-title">

                <motion.div
                    className="skills-eyebrow"
                    custom={0}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.6,
                    }}
                >
                    <span className="skills-line"></span>

                    <h4>My Skills</h4>
                </motion.div>

                <motion.h2
                    custom={1}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.6,
                    }}
                >
                    Technical Skills
                </motion.h2>

                <motion.p
                    custom={2}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.6,
                    }}
                >
                    Technologies and tools I use to build modern web applications.
                </motion.p>

            </div>

            {/* =========================
                SKILLS GRID
            ========================= */}

            <motion.div
                className="skills-grid"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                    once: true,
                    amount: 0.12,
                }}
            >
                {skills.map((skill) => (
                    <SkillCard
                        key={skill.name}
                        skill={skill}
                    />
                ))}
            </motion.div>

        </section>
    );
}

export default Skills;