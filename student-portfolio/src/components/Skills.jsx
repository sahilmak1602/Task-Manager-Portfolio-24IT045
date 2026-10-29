function Skills({ skillList }) {
  return (
    <section id="skills" className="section skills-section">
      <p className="section-label">WHAT I AM LEARNING</p>

      <h2>My Skills</h2>

      <div className="skills-container">
        {skillList.map((skill) => (
          <div className="skill-card" key={skill}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;