import React from 'react'; // Necesitas importar React
import { Container, Row, Col, Button, Card } from 'react-bootstrap'; // Se agregó 'Card'

function Error404() {
  return (
    <Container className="my-5 py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          {/* Icono Grande o Número 404 */}
          <div className="mb-4">
            <span 
              style={{ 
                fontSize: '6rem', 
                fontWeight: '900', 
                color: '#dc3545' // Color de error/peligro (Danger)
              }}
              className="d-block"
            >
              404
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="fw-bold mb-3" style={{ color: '#152945' }}>
            ¡Vaya! Página no encontrada
          </h1>

          {/* Descripción Amigable */}
          <p className="lead mb-4 text-muted">
            Lamentamos el inconveniente. Parece que la página que estás buscando fue eliminada, cambió de nombre o la dirección no es correcta.
          </p>

          <hr className="my-4" />

          {/* Opciones de Navegación */}
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-5">
            
            {/* Botón Principal para volver al inicio */}
            <Button 
              variant="dark" 
              size="lg" 
              href="/" 
              className="fw-semibold"
            >
              Volver al Inicio
            </Button>
            
            {/* Botón Secundario para Contacto/Soporte */}
            <Button 
              variant="outline-secondary" 
              size="lg" 
              href="/contacto"
              className="fw-semibold"
            >
              Contactar a Soporte
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Error404;