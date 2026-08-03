import "./Hero.css";
import { FaGithub, FaLinkedin, FaReact, FaNodeJs, FaEnvelope } from "react-icons/fa";
import { SiMongodb, SiJavascript } from "react-icons/si";
import { TypeAnimation } from "react-type-animation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import profile from "../../images/Hero2.png";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
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

const letterVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -90 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { delay: 0.15 + i * 0.045, duration: 0.6, ease: "backOut" },
    }),
};

/* ---------- Animated letters ---------- */
function AnimatedName({ text }) {
    return (
        <h1 className="gradient-name" style={{ perspective: 600 }}>
            {text.split("").map((ch, i) => (
                <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "inline-block", transformOrigin: "bottom" }}
                >
                    {ch === " " ? "\u00A0" : ch}
                </motion.span>
            ))}
        </h1>
    );
}

/* ---------- Magnetic wrapper with ripple ---------- */
function Magnetic({ children, strength = 25, className = "", onClick, rippleOnClick = false }) {
    const ref = useRef(null);
    const [ripples, setRipples] = useState([]);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        x.set((relX / rect.width) * strength);
        y.set((relY / rect.height) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleClick = (e) => {
        if (rippleOnClick) {
            const rect = ref.current.getBoundingClientRect();
            const id = Date.now();
            const rx = e.clientX - rect.left;
            const ry = e.clientY - rect.top;
            setRipples((r) => [...r, { id, rx, ry }]);
            setTimeout(() => {
                setRipples((r) => r.filter((rp) => rp.id !== id));
            }, 650);
        }
        onClick && onClick(e);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ x: springX, y: springY, display: "inline-block", position: "relative" }}
            className={className}
        >
            {children}
            {ripples.map((r) => (
                <span key={r.id} className="ripple" style={{ left: r.rx, top: r.ry }} />
            ))}
        </motion.div>
    );
}

/* ---------- Canvas: particles + cursor trail ---------- */
function ParticleBackground() {
    const canvasRef = useRef(null);
    const sparksRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationId;
        let particles = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 16000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.6 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.5 + 0.2,
        }));

        const handleMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            for (let i = 0; i < 2; i++) {
                sparksRef.current.push({
                    x: mx + (Math.random() - 0.5) * 6,
                    y: my + (Math.random() - 0.5) * 6,
                    r: Math.random() * 2 + 1,
                    life: 1,
                });
            }
            if (sparksRef.current.length > 120) {
                sparksRef.current.splice(0, sparksRef.current.length - 120);
            }
        };
        window.addEventListener("mousemove", handleMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 123, 0, ${p.alpha})`;
                ctx.fill();
            });

            sparksRef.current.forEach((s) => {
                s.life -= 0.03;
                s.r *= 0.96;
                if (s.life > 0) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 180, 80, ${s.life * 0.7})`;
                    ctx.fill();
                }
            });
            sparksRef.current = sparksRef.current.filter((s) => s.life > 0);

            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ---------- Meteors ---------- */
function Meteors({ count = 6 }) {
    const meteors = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                top: Math.random() * 60,
                left: Math.random() * 100,
                delay: Math.random() * 8,
                duration: 2 + Math.random() * 2,
            })),
        [count]
    );

    return (
        <div className="meteors">
            {meteors.map((m) => (
                <span
                    key={m.id}
                    className="meteor"
                    style={{
                        top: `${m.top}%`,
                        left: `${m.left}%`,
                        animationDelay: `${m.delay}s`,
                        animationDuration: `${m.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

function Hero() {
    const [openPopup, setOpenPopup] = useState(false);
    const heroRef = useRef(null);

    const spotlightX = useMotionValue(0);
    const spotlightY = useMotionValue(0);
    const springSpotlightX = useSpring(spotlightX, { stiffness: 100, damping: 20 });
    const springSpotlightY = useSpring(spotlightY, { stiffness: 100, damping: 20 });

    const orb1X = useTransform(springSpotlightX, (v) => (v - 200) * 0.02);
    const orb1Y = useTransform(springSpotlightY, (v) => (v - 200) * 0.02);
    const orb2X = useTransform(springSpotlightX, (v) => (v - 200) * -0.035);
    const orb2Y = useTransform(springSpotlightY, (v) => (v - 200) * -0.035);
    const orb3X = useTransform(springSpotlightX, (v) => (v - 200) * 0.05);
    const orb3Y = useTransform(springSpotlightY, (v) => (v - 200) * -0.05);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 12 });
    const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 12 });

    const handleHeroMouseMove = useCallback(
        (e) => {
            const rect = heroRef.current.getBoundingClientRect();
            spotlightX.set(e.clientX - rect.left);
            spotlightY.set(e.clientY - rect.top);
        },
        [spotlightX, spotlightY]
    );

    const handleImageMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotateY.set(px * 25);
        rotateX.set(-py * 25);
    };

    const handleImageMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <section className="hero" id="home" ref={heroRef} onMouseMove={handleHeroMouseMove}>
            <div className="grid-overlay" />
            <Meteors count={6} />
            <ParticleBackground />

            <motion.div className="orb orb-1" style={{ x: orb1X, y: orb1Y }} />
            <motion.div className="orb orb-2" style={{ x: orb2X, y: orb2Y }} />
            <motion.div className="orb orb-3" style={{ x: orb3X, y: orb3Y }} />

            <motion.div
                className="cursor-spotlight"
                style={{ left: springSpotlightX, top: springSpotlightY }}
            />

            <motion.div
                className="hero-left"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.p variants={fadeUp}>👋 Hello, I'm</motion.p>

                <AnimatedName text="Neeraj Kumar" />

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
                    <Magnetic strength={20} rippleOnClick onClick={() => setOpenPopup(true)}>
                        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                            Hire Me
                        </motion.button>
                    </Magnetic>

                    <Magnetic strength={20}>
                        <a href="/NeerajResume.pdf" download>
                            <motion.button
                                className="outline"
                                whileHover={{ scale: 1.06, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Download Resume
                            </motion.button>
                        </a>
                    </Magnetic>
                </motion.div>

                <motion.div className="socials" variants={fadeUp}>
                    <motion.a
                        href="https://github.com/neerajkumarroy"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.3, rotate: 10, color: "#ff7b00" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub />
                    </motion.a>

                    <motion.a
                        href="https://www.linkedin.com/in/neeraj-kumar-roys/"
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{ scale: 1.3, rotate: -10, color: "#ff7b00" }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaLinkedin />
                    </motion.a>

                    <motion.a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=neerajkumarroy@gmail.com&su=Hiring%20Inquiry&body=Hello%20Neeraj,%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                        target="_blank"
                        rel="noreferrer"
                        whileHover={{
                            scale: 1.3,
                            rotate: 10,
                            color: "#EA4335",
                            textShadow: "0 0 15px #EA4335",
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
                />

                <motion.div
                    className="orbit-ring ring-1"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="orbit-ring ring-2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <div className="conic-ring-wrap">
                    <motion.div
                        className="conic-ring"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <motion.div
                    className="tilt-wrapper"
                    style={{
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                        transformPerspective: 800,
                    }}
                    onMouseMove={handleImageMouseMove}
                    onMouseLeave={handleImageMouseLeave}
                    initial={{ opacity: 0, scale: 0.7, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                >
                    <img src={profile} alt="Neeraj" />
                </motion.div>

                <motion.div
                    custom={0}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap react"
                    whileHover={{ scale: 1.3 }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    >
                        <FaReact className="icon" />
                    </motion.div>
                </motion.div>

                <motion.div
                    custom={1}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap node"
                    whileHover={{ scale: 1.3 }}
                >
                    <motion.div
                        animate={{ rotate: [-15, 15, -15] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <FaNodeJs className="icon" />
                    </motion.div>
                </motion.div>

                <motion.div
                    custom={2}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap js"
                    whileHover={{ scale: 1.3 }}
                >
                    <motion.div
                        animate={{ rotate: [0, 15, 0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <SiJavascript className="icon" />
                    </motion.div>
                </motion.div>

                <motion.div
                    custom={3}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="icon-wrap mongo"
                    whileHover={{ scale: 1.3 }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    >
                        <SiMongodb className="icon" />
                    </motion.div>
                </motion.div>
            </div>

            {openPopup &&
                createPortal(
                    <HirePopup isOpen={openPopup} onClose={() => setOpenPopup(false)} />,
                    document.body
                )}
        </section>
    );
}

export default Hero;