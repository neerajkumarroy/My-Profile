import "./Projects.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaArrowDown } from "react-icons/fa";

import projectData from "./projectData";

const PROJECTS_PER_LOAD = 3;

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

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 40,
    },

    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: "easeOut",
        },
    },
};

function Projects() {
    const [visibleProjects, setVisibleProjects] = useState(3);

    const handleLoadMore = () => {
        setVisibleProjects((prev) => {
            const nextCount = prev + PROJECTS_PER_LOAD;

            return Math.min(nextCount, projectData.length);
        });
    };

    const displayedProjects = projectData.slice(
        0,
        visibleProjects
    );

    const hasMoreProjects =
        visibleProjects < projectData.length;

    return (
        <section className="projects" id="projects">

            {/* ================= TITLE ================= */}

            <div className="section-title">

                <motion.div
                    className="projects-eyebrow"
                    custom={0}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.6,
                    }}
                >
                    <span className="projects-line"></span>

                    <h4>Projects</h4>
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
                    Featured Projects
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
                    Here are some of my recent projects built using
                    modern web technologies.
                </motion.p>

            </div>


            {/* ================= PROJECT GRID ================= */}

            <div className="project-container">

                {displayedProjects.map((project, index) => (

                    <motion.div
                        className="project-card"
                        key={project.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            delay: index * 0.08,
                        }}
                        whileHover={{
                            y: -12,
                        }}
                    >

                        {/* Project Number */}

                        <span className="project-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>


                        {/* ================= IMAGE ================= */}

                        <div className="project-image">

                            <img
                                src={project.image}
                                alt={project.title}
                                loading="lazy"
                            />

                            <div className="image-overlay">

                                <motion.a
                                    href={project.live}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="overlay-btn"
                                    whileHover={{
                                        scale: 1.12,
                                        y: -3,
                                    }}
                                    whileTap={{
                                        scale: 0.92,
                                    }}
                                    aria-label="Live Demo"
                                >
                                    <FaExternalLinkAlt />
                                </motion.a>

                                <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="overlay-btn"
                                    whileHover={{
                                        scale: 1.12,
                                        y: -3,
                                    }}
                                    whileTap={{
                                        scale: 0.92,
                                    }}
                                    aria-label="GitHub"
                                >
                                    <FaGithub />
                                </motion.a>

                            </div>

                        </div>


                        {/* ================= CONTENT ================= */}

                        <div className="project-content">

                            <h3>
                                {project.title}
                            </h3>

                            <p>
                                {project.description}
                            </p>


                            {/* Technologies */}

                            <div className="tech-stack">

                                {project.tech.map((item, i) => (
                                    <span
                                        key={`${project.id}-${i}`}
                                    >
                                        {item}
                                    </span>
                                ))}

                            </div>


                            {/* Buttons */}

                            <div className="project-buttons">

                                <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Live Demo
                                </a>

                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="github"
                                >
                                    GitHub
                                </a>

                            </div>

                        </div>

                    </motion.div>

                ))}

            </div>


            {/* ================= LOAD MORE ================= */}

            {hasMoreProjects && (

                <motion.div
                    className="load-more-wrapper"
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                >

                    <motion.button
                        type="button"
                        className="load-more-btn"
                        onClick={handleLoadMore}
                        whileHover={{
                            y: -4,
                            scale: 1.02,
                        }}
                        whileTap={{
                            scale: 0.96,
                        }}
                    >

                        <span>
                            Load More Projects
                        </span>

                        <span className="load-more-icon">
                            <FaArrowDown />
                        </span>

                    </motion.button>


                    <p className="project-count">
                        Showing {visibleProjects} of{" "}
                        {projectData.length} projects
                    </p>

                </motion.div>

            )}


            {/* ================= ALL PROJECTS ================= */}

            {!hasMoreProjects && (
                <div className="project-count final-count">
                    Showing all {projectData.length} projects
                </div>
            )}

        </section>
    );
}

export default Projects;