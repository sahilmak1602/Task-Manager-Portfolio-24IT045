
function Footer({ name }) {
  return (
    <footer id="contact" className="footer">
      <h3>Let's Connect</h3>

      <p>Interested in my work? Feel free to connect with me.</p>

      <p>
        &copy; {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
