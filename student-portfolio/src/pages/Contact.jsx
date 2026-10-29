import { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "" || message.trim() === "") {
      return;
    }

    setSubmitted(true);
  }

  return (
    <section className="section about-section">
      <h1>Contact Me</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Your Name</label>
          <br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Enter your name"
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="message">Your Message</label>
          <br />
          <textarea
            id="message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Write your message"
            rows="5"
            required
          />
        </div>

        <button type="submit" className="primary-button">
          Send Message
        </button>
      </form>

      {submitted && (
        <p role="status">
          Thank you, {name}! Your message has been submitted successfully.
        </p>
      )}
    </section>
  );
}

export default Contact;