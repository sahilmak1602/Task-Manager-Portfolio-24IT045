function About({ name, course }) {
  return (
    <section id="about" className="section about-section">
      <p className="section-label">GET TO KNOW ME</p>

      <h2>About Me</h2>

      <p className="about-text">
        Hello! I am <strong>{name}</strong>, a student pursuing{" "}
        <strong>{course}</strong>. I am interested in web development and
        creating modern, responsive websites.
      </p>

      <p className="about-text">
        My goal is to improve my technical skills by building practical
        projects and learning new technologies.
      </p>
    </section>
  );
}

export default About;