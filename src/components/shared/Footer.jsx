import '../../index.css'
import { Link, useNavigate } from 'react-router'

function Footer() {
  const navigate = useNavigate()

  const handleNavClick = (path) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Columna 1: Logo y descripción */}
          <div className="footer-column footer-logo">
            <div className="footer-logo-container">
              <img 
                src="/foto/LogoFinal.png" 
                alt="Sintax Hotel Logo" 
                className="footer-logo-img"
              />
            </div>
            <p className="footer-tagline">
              Su refugio de lujo y confort en el corazón de la ciudad.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="footer-column">
            <h4 className="footer-title">Navegación</h4>
            <nav className="footer-nav">
              <Link to="/" className="footer-link" onClick={() => handleNavClick('/')}>
                Inicio
              </Link>
              <Link to="/nosotros" className="footer-link" onClick={() => handleNavClick('/nosotros')}>
                Quiénes somos
              </Link>
              <Link to="/habitaciones" className="footer-link" onClick={() => handleNavClick('/habitaciones')}>
                Habitaciones
              </Link>
              <Link to="/contacto" className="footer-link" onClick={() => handleNavClick('/contacto')}>
                Contacto
              </Link>
            </nav>
          </div>

          {/* Columna 3: Contacto */}
          <div className="footer-column">
            <h4 className="footer-title">Contacto</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <span className="footer-icon">📍</span>
                <span>Av. Principal 123, Ciudad Capital</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-icon">📞</span>
                <span>+1 (234) 567-890</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-icon">✉️</span>
                <span>reservas@sintaxhotel.com</span>
              </div>
            </div>
          </div>

          {/* Columna 4: Síguenos */}
          <div className="footer-column">
            <h4 className="footer-title">Síguenos</h4>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <span className="footer-social-icon">f</span>
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <span className="footer-social-icon">📷</span>
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <span className="footer-social-icon">🐦</span>
              </a>
            </div>
          </div>
        </div>

        {/* Separador y Copyright */}
        <div className="footer-separator"></div>
        <div className="footer-copyright">
          <p>&copy; 2025 Sintax Hotel. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

