import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Background from "./components/Background/Background";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import WhatsApp from "./components/WhatsApp/WhatsApp";
function App() {

  return (

    <div className="App">

      <Background />

      <Navbar />

      <Hero />

      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
      <WhatsApp />

    </div>

  );

}

export default App;