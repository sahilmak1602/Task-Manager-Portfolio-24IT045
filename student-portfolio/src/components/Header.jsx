function Header({ name, themeColor }) {
return (
<header className="header" style={{ backgroundColor: themeColor }}>
<div className="header-content">
<h2>{name}</h2>

    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</header>

);
}

export default Header;
