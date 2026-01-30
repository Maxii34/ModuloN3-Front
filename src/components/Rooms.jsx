import './Rooms.css'
import { Link, useNavigate } from 'react-router'

function Rooms() {
  const navigate = useNavigate()
  const rooms = [
    {
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Habitación Deluxe',
      description: 'Perfecta para viajeros de negocios o parejas, con vistas a la ciudad y todas las comodidades modernas.'
    },
    {
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Suite Ejecutiva',
      description: 'Un espacio amplio y sofisticado con sala de estar separada, ideal para una estancia de lujo prolongada.'
    },
    {
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Habitación Familiar',
      description: 'Comodidad para todos con amplios espacios, y servicios pensados para la familia.'
    }
  ]

  return (
    <section className="rooms" id="habitaciones">
      <div className="rooms-container">
        <h2 className="rooms-title">Nuestras Habitaciones</h2>
        <p className="rooms-subtitle">
          Cada espacio está diseñado para ofrecer el máximo confort y una atmósfera de serena elegancia.
        </p>
        
        <div className="rooms-grid">
          {rooms.map((room, index) => (
            <div key={index} className="room-card">
              <div className="room-image-wrapper">
                <img src={room.image} alt={room.title} className="room-image" />
              </div>
              <div className="room-content">
                <h3 className="room-title">{room.title}</h3>
                <p className="room-description">{room.description}</p>
                
              </div>
            </div>
          ))}
        </div>
        
        <div className="rooms-button-wrapper">
          <button 
            className="rooms-button"
            onClick={() => navigate('/habitaciones')}
          >
            Ver Todas las Habitaciones
          </button>
        </div>
      </div>
    </section>
  )
}

export default Rooms

