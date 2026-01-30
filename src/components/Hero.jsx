import { useState } from 'react'
import { useNavigate } from 'react-router'
import './Hero.css'

function Hero() {
  const navigate = useNavigate()
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  // Obtener la fecha de hoy en formato YYYY-MM-DD para el input date
  const today = new Date().toISOString().split('T')[0]

  // Obtener la fecha mínima de salida (día siguiente a la llegada)
  const getMinCheckOutDate = () => {
    if (!checkInDate) return today
    
    const checkIn = new Date(checkInDate)
    checkIn.setDate(checkIn.getDate() + 1)
    return checkIn.toISOString().split('T')[0]
  }

  // Manejar cambio en fecha de llegada
  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value
    setCheckInDate(newCheckIn)
    
    // Si la fecha de salida es anterior o igual a la nueva fecha de llegada, resetearla
    if (checkOutDate && newCheckIn) {
      const checkOut = new Date(checkOutDate)
      const checkIn = new Date(newCheckIn)
      if (checkOut <= checkIn) {
        setCheckOutDate('')
      }
    }
  }

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Tu Oasis de Tranquilidad en el Corazón de la Ciudad</h1>
        <p className="hero-subtitle">
          Descubre una experiencia de lujo y confort diseñada para superar tus expectativas.
        </p>
        
        <div className="booking-form">
          <div className="form-group">
            <label htmlFor="checkin">Llegada</label>
            <div className="input-wrapper">
              <input
                type="date"
                id="checkin"
                value={checkInDate}
                onChange={handleCheckInChange}
                min={today}
                className="form-input date-input"
              />
              <span className="input-icon">📅</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="checkout">Salida</label>
            <div className="input-wrapper">
              <input
                type="date"
                id="checkout"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={getMinCheckOutDate()}
                disabled={!checkInDate}
                className="form-input date-input"
              />
              <span className="input-icon">📅</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="guests">Huéspedes</label>
            <div className="input-wrapper">
              <select id="guests" className="form-input">
                <option value="2">2 Huéspedes</option>
                <option value="1">1 Huésped</option>
                <option value="3">3 Huéspedes</option>
                <option value="4">4 Huéspedes</option>
                <option value="5">5+ Huéspedes</option>
              </select>
              <span className="input-icon">▼</span>
            </div>
          </div>
          
          <button 
            className="booking-button"
            onClick={() => navigate('/habitaciones')}
          >
            Ver Disponibilidad
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero

