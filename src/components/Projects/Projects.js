import "./Projects.css";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Project1 from "../../images/yogawellness.png";
import project2 from "../../images/Global-Dental.png";
import Project3 from "../../images/Data-string.png";

const projectData = [
    {
        id: 1,
        image: Project1,
        title: "Yoga Wellness Website",
        description:
            "Modern responsive yoga website built using React.js with beautiful UI and smooth user experience.",
        tech: ["Next.js", " Tailwind css", "Node.js"],
        github: "https://github.com/neerajkumarroy/yoga-wellness",
        live: "https://yoga-wellness.onrender.com/",
    },
    {
        id: 2,
        image: project2,
        title: "Global Dental",
        description:
            "Responsive Global Dental Clinic website with a modern and attractive design, showcasing dental services, expert doctors, patient testimonials, online appointment booking, and a seamless user experience across all devices.",
        tech: ["HTML5", "CSS3", "javaScript (ES6+)"],
        github: "https://github.com/neerajkumarroy/global-dental",
        live: "https://global-dental.vercel.app/",
    },
    {
        id: 3,
        image: Project3,
        title: "Datastring Consulting",
        description:
            "Developed a responsive corporate business website for DataString Consulting with a modern UI, service pages, industry-focused solutions, contact forms, SEO-friendly structure, and optimized performance for a seamless user experience.",
        tech: ["Next.js", "CSS3", "MongoDB"],
        github: "https://github.com/neerajkumarroy",
        live: "https://datastringconsulting.com/",
    },

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
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Projects() {
    return (
        <section className="projects" id="projects">
            <div className="section-title">
                <motion.span
                    custom={0}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Portfolio
                </motion.span>
                <motion.h2
                    custom={1}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Featured Projects
                </motion.h2>
                <motion.p
                    custom={2}
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    Here are some of my recent projects built using modern web
                    technologies.
                </motion.p>
            </div>

            <motion.div
                className="project-container"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {projectData.map((project, index) => (
                    <motion.div
                        className="project-card"
                        key={project.id}
                        variants={cardVariants}
                        whileHover={{ y: -14 }}
                    >
                        <span className="project-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="project-image">
                            <img src={project.image} alt={project.title} />

                            <div className="image-overlay">
                                <motion.a
                                    href={project.live}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="overlay-btn"
                                    whileHover={{ scale: 1.12, y: -3 }}
                                    whileTap={{ scale: 0.92 }}
                                    aria-label="Live demo"
                                >
                                    <FaExternalLinkAlt />
                                </motion.a>
                                <motion.a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="overlay-btn"
                                    whileHover={{ scale: 1.12, y: -3 }}
                                    whileTap={{ scale: 0.92 }}
                                    aria-label="GitHub repository"
                                >
                                    <FaGithub />
                                </motion.a>
                            </div>
                        </div>

                        <div className="project-content">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>

                            <div className="tech-stack">
                                {project.tech.map((item, i) => (
                                    <span key={i}>{item}</span>
                                ))}
                            </div>

                            <div className="project-buttons">
                                <a href={project.live} target="_blank" rel="noreferrer">
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
            </motion.div>
        </section>
    );
}

export default Projects;