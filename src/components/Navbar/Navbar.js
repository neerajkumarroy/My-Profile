import "./Navbar.css";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-scroll";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (

        <header className="header">

            <div className="logo">
                <h2>
                    Neeraj<span>.</span>
                </h2>

                <p>Software Developer</p>
            </div>

            <nav className={menuOpen ? "nav active" : "nav"}>

                <Link
                    to="home"
                    smooth={true}
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                >
                    Home
                </Link>

                <Link
                    to="about"
                    smooth={true}
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                >
                    About
                </Link>

                <Link
                    to="skills"
                    smooth={true}
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                >
                    Skills
                </Link>

                <Link
                    to="projects"
                    smooth={true}
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                >
                    Projects
                </Link>

                <Link
                    to="contact"
                    smooth={true}
                    duration={500}
                    onClick={() => setMenuOpen(false)}
                >
                    Contact
                </Link>

            </nav>

            <div
                className="menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
            >

                {menuOpen ? <FaTimes /> : <FaBars />}

            </div>

        </header>

    );

}

export default Navbar;