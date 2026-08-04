import "./Hero.css";
import { FaGithub, FaLinkedin, FaReact, FaNodeJs, FaEnvelope } from "react-icons/fa";
import { SiMongodb, SiJavascript } from "react-icons/si";
import { TypeAnimation } from "react-type-animation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import profile from "../../images/Hero2.png";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import HirePopup from "../HirePopup/HirePopup";

/* =====================================================================
   INTERACTIVE NEURAL NETWORK BACKGROUND
   - Plain canvas + requestAnimationFrame (no Three.js, no extra libs)
   - Glowing nodes, animated connecting lines, mouse attraction + click
     energy pulses. Lives entirely in refs so it never triggers a
     React re-render.
   ===================================================================== */

const NN_COLORS = {
    orange: [255, 123, 0], // #ff7b00
    cyan: [97, 219, 251],
};

const CONNECT_DIST = 130;
const MOUSE_RADIUS = 190; // bigger cursor influence zone = more interactive
const MOUSE_CONNECT_RADIUS = 170;
const PULSE_MAX_RADIUS = 280;
const PULSE_SPEED = 6;
const MAX_DPR = 1.75;
const AMBIENT_PULSE_INTERVAL = 2600; // auto energy wave even with no interaction
const TRAIL_LENGTH = 14; // cursor comet-trail sparks

function getNodeCount(width) {
    if (width < 480) return 90;
    if (width < 768) return 150;
    if (width < 1200) return 230;
    return 320;
}

function NeuralNetworkBackground() {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);
    const spotlightRef = useRef(null);
    const rafRef = useRef(null);
    const resizeTORef = useRef(null);
    const mouseIdleTORef = useRef(null);

    const state = useRef({
        nodes: [],
        pulses: [],
        trail: [], // recent cursor positions -> comet-trail sparks
        width: 0,
        height: 0,
        mouse: { x: -9999, y: -9999, active: false },
    }).current;

    const ambientIntervalRef = useRef(null);

    const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createNodes = useCallback((width, height) => {
        const count = getNodeCount(width);
        const nodes = new Array(count);
        for (let i = 0; i < count; i++) {
            const roll = Math.random();
            const layer = roll < 0.4 ? 0 : roll < 0.75 ? 1 : 2;
            // Each node gets a constant "wander" speed for its layer so it
            // NEVER settles or stops — only its heading direction drifts.
            const baseSpeed = (layer === 0 ? 0.16 : layer === 1 ? 0.28 : 0.42) * (0.7 + Math.random() * 0.7);
            const baseR = layer === 0 ? 0.9 : layer === 1 ? 1.3 : 1.8;

            nodes[i] = {
                x: Math.random() * width,
                y: Math.random() * height,
                angle: Math.random() * Math.PI * 2, // current heading
                turnSpeed: 0.012 + Math.random() * 0.03, // how fast heading drifts
                baseSpeed,
                impulseX: 0, // temporary cursor/pulse push, decays independently
                impulseY: 0,
                r: baseR + Math.random() * 0.6,
                phase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.35 + Math.random() * 0.5,
                isCyan: Math.random() < 0.18,
                glow: 0,
            };
        }
        return nodes;
    }, []);

    const buildGrid = useCallback((nodes, cellSize) => {
        const grid = new Map();
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const cx = Math.floor(n.x / cellSize);
            const cy = Math.floor(n.y / cellSize);
            const key = `${cx},${cy}`;
            let bucket = grid.get(key);
            if (!bucket) {
                bucket = [];
                grid.set(key, bucket);
            }
            bucket.push(i);
        }
        return grid;
    }, []);

    const getNeighborIndices = useCallback((grid, cellSize, x, y) => {
        const cx = Math.floor(x / cellSize);
        const cy = Math.floor(y / cellSize);
        const out = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const bucket = grid.get(`${cx + dx},${cy + dy}`);
                if (bucket) out.push(...bucket);
            }
        }
        return out;
    }, []);

    const setup = useCallback(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const width = wrap.clientWidth;
        const height = wrap.clientHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        state.width = width;
        state.height = height;
        state.nodes = createNodes(width, height);
    }, [createNodes, state]);

    const handlePointerMove = useCallback(
        (clientX, clientY) => {
            const wrap = wrapRef.current;
            if (!wrap) return;
            const rect = wrap.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            state.mouse.x = x;
            state.mouse.y = y;
            state.mouse.active = true;

            if (spotlightRef.current) {
                spotlightRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                spotlightRef.current.style.opacity = "1";
            }

            // Drop a trailing spark for the comet-trail effect
            state.trail.push({ x, y, life: 1 });
            if (state.trail.length > TRAIL_LENGTH) state.trail.shift();

            clearTimeout(mouseIdleTORef.current);
            mouseIdleTORef.current = setTimeout(() => {
                state.mouse.active = false;
                if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
                // Gentle repel impulse once the cursor leaves — nodes keep
                // their own wander motion going underneath this.
                for (const n of state.nodes) {
                    const dx = n.x - state.mouse.x;
                    const dy = n.y - state.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS) {
                        const force = (1 - dist / MOUSE_RADIUS) * 0.8;
                        n.impulseX += (dx / (dist || 1)) * force;
                        n.impulseY += (dy / (dist || 1)) * force;
                    }
                }
            }, 160);
        },
        [state]
    );

    const handleMouseMove = useCallback(
        (e) => handlePointerMove(e.clientX, e.clientY),
        [handlePointerMove]
    );

    const handleTouchMove = useCallback(
        (e) => {
            if (e.touches && e.touches[0]) {
                handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        },
        [handlePointerMove]
    );

    const handleMouseLeave = useCallback(() => {
        state.mouse.active = false;
        if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    }, [state]);

    const spawnPulse = useCallback(
        (clientX, clientY) => {
            const wrap = wrapRef.current;
            if (!wrap) return;
            const rect = wrap.getBoundingClientRect();
            state.pulses.push({
                x: clientX - rect.left,
                y: clientY - rect.top,
                radius: 0,
                life: 1,
            });
        },
        [state]
    );

    const handleClick = useCallback((e) => spawnPulse(e.clientX, e.clientY), [spawnPulse]);
    const handleTouchStart = useCallback(
        (e) => {
            if (e.touches && e.touches[0]) {
                spawnPulse(e.touches[0].clientX, e.touches[0].clientY);
            }
        },
        [spawnPulse]
    );

    useEffect(() => {
        setup();
        const ctx = canvasRef.current.getContext("2d");
        const cellSize = CONNECT_DIST;

        const step = () => {
            const { nodes, pulses, width, height, mouse } = state;
            ctx.clearRect(0, 0, width, height);

            for (const n of nodes) {
                if (!reducedMotion) {
                    // Continuous organic wander — heading drifts randomly but
                    // speed never decays to zero, so nodes are always moving.
                    n.angle += (Math.random() - 0.5) * n.turnSpeed;
                    const wx = Math.cos(n.angle) * n.baseSpeed;
                    const wy = Math.sin(n.angle) * n.baseSpeed;

                    n.x += wx + n.impulseX;
                    n.y += wy + n.impulseY;

                    if (n.x < -20) n.x = width + 20;
                    if (n.x > width + 20) n.x = -20;
                    if (n.y < -20) n.y = height + 20;
                    if (n.y > height + 20) n.y = -20;

                    if (mouse.active) {
                        const dx = mouse.x - n.x;
                        const dy = mouse.y - n.y;
                        const dist2 = dx * dx + dy * dy;
                        if (dist2 < MOUSE_RADIUS * MOUSE_RADIUS) {
                            const dist = Math.sqrt(dist2) || 1;
                            const force = (1 - dist / MOUSE_RADIUS) * 0.08;
                            n.impulseX += (dx / dist) * force;
                            n.impulseY += (dy / dist) * force;
                            n.glow = Math.max(n.glow, (1 - dist / MOUSE_RADIUS) * 0.7);
                        }
                    }

                    // Only the extra cursor/pulse push decays — base wander stays constant
                    n.impulseX *= 0.92;
                    n.impulseY *= 0.92;
                }

                n.phase += 0.02 * n.pulseSpeed;
                n.glow *= 0.93;
            }

            const grid = buildGrid(nodes, cellSize);

            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i];
                const neighbors = getNeighborIndices(grid, cellSize, a.x, a.y);
                for (const j of neighbors) {
                    if (j <= i) continue;
                    const b = nodes[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist >= CONNECT_DIST) continue;

                    let alpha = (1 - dist / CONNECT_DIST) * 0.5;

                    if (mouse.active) {
                        const mdx = (a.x + b.x) / 2 - mouse.x;
                        const mdy = (a.y + b.y) / 2 - mouse.y;
                        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                        if (mdist < MOUSE_CONNECT_RADIUS) {
                            alpha = Math.min(1, alpha + (1 - mdist / MOUSE_CONNECT_RADIUS) * 0.6);
                        }
                    }

                    const useCyan = a.isCyan && b.isCyan;
                    const [r, g, bcol] = useCyan ? NN_COLORS.cyan : NN_COLORS.orange;
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${bcol}, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            if (mouse.active) {
                const near = getNeighborIndices(grid, cellSize, mouse.x, mouse.y);
                for (const idx of near) {
                    const n = nodes[idx];
                    const dx = n.x - mouse.x;
                    const dy = n.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_CONNECT_RADIUS) {
                        const alpha = (1 - dist / MOUSE_CONNECT_RADIUS) * 0.45;
                        ctx.strokeStyle = `rgba(${NN_COLORS.cyan[0]}, ${NN_COLORS.cyan[1]}, ${NN_COLORS.cyan[2]}, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(n.x, n.y);
                        ctx.stroke();
                    }
                }
            }

            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.radius += PULSE_SPEED;
                pulse.life -= 0.018;
                if (pulse.life <= 0 || pulse.radius > PULSE_MAX_RADIUS) {
                    pulses.splice(p, 1);
                    continue;
                }

                ctx.strokeStyle = `rgba(255, 123, 0, ${pulse.life * 0.6})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
                ctx.stroke();

                for (const n of nodes) {
                    const dx = n.x - pulse.x;
                    const dy = n.y - pulse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (Math.abs(dist - pulse.radius) < 18) {
                        n.glow = Math.max(n.glow, 0.9);
                    }
                }
            }

            // --- Cursor comet-trail: fading sparks along the recent path ---
            const trail = state.trail;
            for (let t = trail.length - 1; t >= 0; t--) {
                const sp = trail[t];
                sp.life -= 0.07;
                if (sp.life <= 0) {
                    trail.splice(t, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 180, 90, ${sp.life * 0.5})`;
                ctx.arc(sp.x, sp.y, 2 + sp.life * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            for (const n of nodes) {
                const pulseWave = (Math.sin(n.phase) + 1) / 2;
                const alpha = Math.min(1, 0.35 + pulseWave * 0.4 + n.glow);
                const [r, g, b] = n.isCyan ? NN_COLORS.cyan : NN_COLORS.orange;
                const radius = n.r + n.glow * 1.5;

                ctx.beginPath();
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${Math.min(1, alpha)})`;
                ctx.shadowBlur = 6 + n.glow * 10;
                ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);

        const handleResize = () => {
            clearTimeout(resizeTORef.current);
            resizeTORef.current = setTimeout(setup, 150);
        };
        window.addEventListener("resize", handleResize);

        // Automatic ambient energy pulses — fire on their own on a timer so
        // the network always feels alive, even with zero interaction.
        if (!reducedMotion) {
            ambientIntervalRef.current = setInterval(() => {
                state.pulses.push({
                    x: Math.random() * state.width,
                    y: Math.random() * state.height,
                    radius: 0,
                    life: 0.7, // softer than a click pulse
                });
            }, AMBIENT_PULSE_INTERVAL);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearTimeout(resizeTORef.current);
            clearTimeout(mouseIdleTORef.current);
            clearInterval(ambientIntervalRef.current);
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setup, buildGrid, getNeighborIndices, reducedMotion]);

    return (
        <div
            ref={wrapRef}
            className="neural-bg-wrap"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="neural-bg-canvas" />
            <div ref={spotlightRef} className="neural-bg-spotlight" />
        </div>
    );
}

/* =====================================================================
   HERO CONTENT (same image, buttons, socials, popup as before)
   ===================================================================== */

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

function Hero() {
    const [openPopup, setOpenPopup] = useState(false);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 12 });
    const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 12 });

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
        <section className="hero" id="home">
            {/* Interactive neural network background fills the whole section */}
            <NeuralNetworkBackground />

            <div className="hero-content-wrap">
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
                        {/* Same profile image as before */}
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