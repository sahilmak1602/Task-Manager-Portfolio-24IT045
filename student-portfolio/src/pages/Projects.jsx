import { useEffect, useState } from "react";

const excludedProjects = ["get-fit", "gym-fitness"];

function Projects() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchRepositories() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://api.github.com/users/sahilmak1602/repos?per_page=100"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();

      // Sirf public repositories aayengi.
      // Get-fit aur GYM-FITNESS ko remove karenge.
      const filteredProjects = data.filter(
        (repo) =>
          repo.private === false &&
          !excludedProjects.includes(repo.name.toLowerCase())
      );

      setRepositories(filteredProjects);
    } catch (err) {
      setError("Projects load nahi hue. Internet check karke retry karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRepositories();
  }, []);

  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section skills-section">
      <p className="section-label">MY GITHUB PROJECTS</p>

      <h1>My Public Projects</h1>

      <p>
        Explore my public GitHub repositories and projects.
      </p>

      <input
        type="text"
        placeholder="Search my projects..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loading && (
        <div>
          <div className="loading-spinner"></div>
          <p>Loading repositories...</p>
        </div>
      )}

      {error && (
        <div>
          <p role="alert">{error}</p>

          <button
            className="primary-button"
            onClick={fetchRepositories}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p>Total public projects: {filteredRepositories.length}</p>

          <div className="skills-container">
            {filteredRepositories.length > 0 ? (
              filteredRepositories.map((repo) => (
                <div className="skill-card" key={repo.id}>
                  <h3>{repo.name}</h3>

                  <p>
                    {repo.description || "No description available."}
                  </p>

                  <p>
                    <strong>Language:</strong>{" "}
                    {repo.language || "Not specified"}
                  </p>

                  <p>
                    <strong>Stars:</strong> {repo.stargazers_count}
                  </p>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project on GitHub →
                  </a>
                </div>
              ))
            ) : (
              <p>No public projects found.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Projects;