import './Services.css'

function Services() {
  const services = [
    {
      icon: '📶',
      title: 'Wi-Fi de Alta Velocidad',
      description: 'Conexión gratuita en todas nuestras habitaciones.'
    },
    {
      icon: '🏊',
      title: 'Piscina Relajante',
      description: 'Sumérgete en nuestra piscina climatizada con vistas panorámicas.'
    },
    {
      icon: '🍽️',
      title: 'Restaurante Gourmet',
      description: 'Saborea la alta cocina con ingredientes locales y frescos.'
    },
    {
      icon: '🌿',
      title: 'Spa y Bienestar',
      description: 'Renueva tu cuerpo y mente con nuestros tratamientos exclusivos.'
    }
  ]

  return (
    <section className="services">
      <div className="services-container">
        <h2 className="services-title">Servicios Exclusivos para una Estancia Inolvidable</h2>
        <p className="services-subtitle">
          Disfrute de nuestras instalaciones de primera clase pensadas para su relajación y conveniencia.
        </p>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

