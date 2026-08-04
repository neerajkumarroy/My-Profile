import React from "react";
import "./Experience.css";
import { FaBriefcase, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";

const experienceData = [
  {
    year: "2025",
    role: "MERN Stack Developer Intern",
    company: "Ftechiz Solutions Private Limited",
    description:
      "Completed a 6-month MERN Stack Developer Internship where I worked on real-world web applications. Developed responsive UIs, built reusable React components, integrated REST APIs, and gained practical full-stack experience.",
    skills: [
      "React.js",
      "JavaScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "REST API",
      "Git",
    ],
    icon: <FaBriefcase />,
  },
  {
    year: "2024 - 2025",
    role: "Personal Projects & Development",
    company: "Self Learning & Practice",
    description:
      "Built modern web applications using React.js, Next.js, Node.js, and MongoDB. Focused on responsive UI design, API integration, performance optimization, and full-stack skills.",
    skills: ["React.js", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
    icon: <FaCode />,
  },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariant = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === "left" ? -60 : 60,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function Experience() {
  return (
    <section className="experience" id="experience">
      <motion.div
        className="experience-heading"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="experience-eyebrow">
          <span className="experience-line"></span>
          <h4>Experience</h4>
        </div>

        <h2>Professional Journey</h2>

        <p>
          My professional experience and projects where I applied my development
          skills to build real-world applications.
        </p>
      </motion.div>

      <div className="experience-timeline">
        <div className="timeline-line" />

        {experienceData.map((item, index) => {
          const direction = index % 2 === 0 ? "left" : "right";
          return (
            <motion.div
              className={`experience-card ${direction}`}
              key={index}
              custom={direction}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="experience-icon"
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
              </motion.div>

              <motion.div
                className="experience-content"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <span className="experience-year">{item.year}</span>
                <h3>{item.role}</h3>
                <h4>{item.company}</h4>
                <p>{item.description}</p>

                <div className="experience-tech">
                  {item.skills.map((skill, i) => (
                    <span key={i} className="tech-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default Experience;
