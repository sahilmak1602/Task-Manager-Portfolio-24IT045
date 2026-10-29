import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const TaskManager = lazy(() => import("./pages/TaskManager"));
const Login = lazy(() => import("./pages/Login"));
import "./App.css";

function Home() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
  ];

  return (
    <>
      <section id="home" className="hero">
        <p className="section-label">WELCOME TO MY PORTFOLIO</p>

        <h1>
          Hi, I'm <span>Sahil Makwana</span>
        </h1>

        <h2>IT Student & Web Development Enthusiast</h2>

        <p>
          I enjoy learning new technologies and building useful web applications.
        </p>

        <Link to="/projects" className="primary-button">
          Explore My Projects
        </Link>
      </section>

      <About
        name="Sahil Makwana"
        course="B.Tech in Information Technology"
      />

      <Skills skillList={skills} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header name="Sahil Makwana" themeColor="#111827" />

     <nav className="page-navigation">
      <button
  type="button"
  onClick={() => {
    sessionStorage.removeItem("token");
    window.location.assign("/login");
  }}
>
  Logout
</button>
  <Link to="/">Home</Link>
  <Link to="/projects">Projects</Link>
  <Link to="/tasks">Task Manager</Link>
  <Link to="/login">Login / Register</Link>
  <Link to="/contact">Contact</Link>
</nav>

    <Suspense
  fallback={
    <div className="section skills-section" role="status">
      Loading page...
    </div>
  }
>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/tasks" element={<TaskManager />} />
    <Route path="/login" element={<Login />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</Suspense>

      <Footer name="Sahil Makwana" />
    </BrowserRouter>
  );
}

export default App;