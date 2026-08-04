import "./About.css";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Profile from "../../images/Hero2.png";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
    }),
};

const techStack = ["React.js", "Node.js", "MongoDB", "JavaScript"];

const stats = [
    { value: "10+", label: "Projects" },
    { value: "1+", label: "Years Learning" },
    { value: "15+", label: "Technologies" },
];

// Tunable particle-network settings, kept outside the component so they
// don't get recreated on every render.
const PARTICLE_SETTINGS = {
    desktopCount: 28,
    mobileCount: 14,
    mobileBreakpoint: 768,
    linkDistance: 130,
    mouseRadius: 160,
    baseSpeed: 0.18,
    dotColor: "0, 229, 255",
    lineColor: "0, 229, 255",
};

function About() {
    const shouldReduceMotion = useReducedMotion();
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const glowRef = useRef(null);

    // ---------------- particle network (canvas, no extra dependency) ----------------
    useEffect(() => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;
        if (!section || !canvas) return undefined;

        const ctx = canvas.getContext("2d");
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let particles = [];
        let animationFrameId = null;
        let resizeTimeout = null;

        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

        const mouse = { x: -9999, y: -9999, active: false };

        const getParticleCount = () =>
            window.innerWidth < PARTICLE_SETTINGS.mobileBreakpoint
                ? PARTICLE_SETTINGS.mobileCount
                : PARTICLE_SETTINGS.desktopCount;

        const createParticles = () => {
            const count = getParticleCount();
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * PARTICLE_SETTINGS.baseSpeed,
                vy: (Math.random() - 0.5) * PARTICLE_SETTINGS.baseSpeed,
                r: Math.random() * 1.4 + 0.8,
            }));
        };

        const resize = () => {
            const rect = section.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            createParticles();
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!shouldReduceMotion) {
                    // gentle repulsion from the mouse
                    if (mouse.active) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < PARTICLE_SETTINGS.mouseRadius && dist > 0.01) {
                            const force = (1 - dist / PARTICLE_SETTINGS.mouseRadius) * 0.02;
                            p.vx += (dx / dist) * force;
                            p.vy += (dy / dist) * force;
                        }
                    }

                    // gentle speed cap so particles never dart around
                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    const maxSpeed = PARTICLE_SETTINGS.baseSpeed * 2.2;
                    if (speed > maxSpeed) {
                        p.vx = (p.vx / speed) * maxSpeed;
                        p.vy = (p.vy / speed) * maxSpeed;
                    }

                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;
                    p.x = Math.max(0, Math.min(width, p.x));
                    p.y = Math.max(0, Math.min(height, p.y));
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${PARTICLE_SETTINGS.dotColor}, 0.55)`;
                ctx.fill();
            }

            // connect nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < PARTICLE_SETTINGS.linkDistance) {
                        const opacity = (1 - dist / PARTICLE_SETTINGS.linkDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${PARTICLE_SETTINGS.lineColor}, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // faint connection from nearby particles to the mouse
            if (mouse.active && !shouldReduceMotion) {
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < PARTICLE_SETTINGS.mouseRadius) {
                        const opacity = (1 - dist / PARTICLE_SETTINGS.mouseRadius) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(${PARTICLE_SETTINGS.lineColor}, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
        };

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 150);
        };

        resize();
        draw();

        window.addEventListener("resize", handleResize);
        if (!isCoarsePointer) {
            section.addEventListener("mousemove", handleMouseMove);
            section.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(resizeTimeout);
            window.removeEventListener("resize", handleResize);
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [shouldReduceMotion]);

    // ---------------- mouse-following glow (DOM writes only, no React state) ----------------
    useEffect(() => {
        const section = sectionRef.current;
        const glow = glowRef.current;
        if (!section || !glow) return undefined;

        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        if (isCoarsePointer || shouldReduceMotion) return undefined;

        let latestX = 0;
        let latestY = 0;
        let ticking = false;

        const applyPosition = () => {
            glow.style.transform = `translate3d(${latestX}px, ${latestY}px, 0) translate(-50%, -50%)`;
            ticking = false;
        };

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            latestX = e.clientX - rect.left;
            latestY = e.clientY - rect.top;
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(applyPosition);
            }
        };

        const handleMouseEnter = () => {
            glow.style.opacity = "1";
        };

        const handleMouseLeave = () => {
            glow.style.opacity = "0";
        };

        section.addEventListener("mousemove", handleMouseMove);
        section.addEventListener("mouseenter", handleMouseEnter);
        section.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseenter", handleMouseEnter);
            section.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [shouldReduceMotion]);

    return (
        <section className="about" id="about" ref={sectionRef}>
            {/* ---------------- ambient background layer ---------------- */}
            <div className="about-bg" aria-hidden="true">
                <div className="about-grid" />
                <div className="about-gradient-layer" />
            </div>

            <canvas className="about-canvas" ref={canvasRef} aria-hidden="true" />

            <div className="mouse-glow" ref={glowRef} aria-hidden="true" />

            {/* ---------------- image side ---------------- */}
            <motion.div
                className="about-left"
                initial={{ opacity: 0, x: -60, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="image-frame">
                    <span className="image-radial-glow" aria-hidden="true" />
                    <motion.span
                        className="ring"
                        animate={shouldReduceMotion ? {} : { rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="glow-blob"
                        animate={
                            shouldReduceMotion
                                ? { opacity: 0.35 }
                                : { scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }
                        }
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.img
                        src={Profile}
                        alt="profile"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.4 }}
                    />

                    <motion.span
                        className="status-badge"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <span className="status-dot" />
                        Open to Opportunities
                    </motion.span>
                </div>
            </motion.div>

            {/* ---------------- text side ---------------- */}
            <div className="about-right">
                <motion.div
                    className="eyebrow-row"
                    custom={0}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <span className="eyebrow-line" />
                    <h4>About Me</h4>
                </motion.div>

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
                    className="tech-badges"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.6 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
                    }}
                >
                    {techStack.map((tech) => (
                        <motion.span
                            className="tech-pill"
                            key={tech}
                            variants={fadeUp}
                            whileHover={{ y: -3 }}
                        >
                            {tech}
                        </motion.span>
                    ))}
                </motion.div>

                <motion.div
                    className="about-info"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
                    }}
                >
                    {stats.map((stat) => (
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