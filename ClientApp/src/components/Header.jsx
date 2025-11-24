import './Header.css'

function Header({ personalData }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">ÞH</div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button className="download-cv">Download CV</button>
          <button className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
