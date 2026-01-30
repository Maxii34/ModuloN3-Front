import './Gallery.css'

function Gallery() {
  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Vestíbulo del hotel'
    },
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Piscina del hotel'
    },
    {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Pasillo del hotel'
    },
    {
      url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Habitación deluxe'
    },
    {
      url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Suite ejecutiva'
    },
    {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Habitación familiar'
    },
    {
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Restaurante gourmet'
    },
    {
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Bar del hotel'
    },
    {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'Spa y bienestar'
    }
  ]

  return (
    <section className="gallery" id="galeria">
      <div className="gallery-container">
        <h2 className="gallery-title">Galería de Momentos</h2>
        <p className="gallery-subtitle">
          Explora los rincones de nuestro hotel y descubre la belleza en cada detalle.
        </p>
        
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image.url} alt={image.alt} className="gallery-image" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery

