import { Container, Row, Col, Card } from "react-bootstrap";
import { ContainerCard } from "../ui/ContainerCard";

export const QuienesSomos = () => {
  return (
    <>
      <section className="mt-4 mb-4 css-quienes-somos d-flex justify-content-center">
        <Container>
          <Card>
            <Row className="g-0">
              <Col md={6}>
                <Card.Img
                  variant="top"
                  src="https://images.pexels.com/photos/33389199/pexels-photo-33389199.jpeg"
                  alt="Imagen de la tarjeta"
                  style={{ height: "350px", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <Card.Body className="p-0 px-3 pt-1">
                  <Card.Title>
                    {" "}
                    <strong>Sintax Hotel</strong>{" "}
                  </Card.Title>
                  <Card.Text>
                    Más que una estructura, <strong>Sintax Hotel</strong> es una
                    declaración de diseño y funcionalidad. Nacimos de la visión
                    de crear un oasis urbano donde el ritmo de la ciudad se
                    equilibra con la serenidad impecable. Nuestro propósito es
                    ser el refugio que nuestros huéspedes necesitan: un lugar
                    donde la arquitectura inteligente y los detalles de lujo se
                    combinan para crear una atmósfera de paz y eficiencia.
                    Elegir Sintax es elegir la tranquilidad de saber que cada
                    aspecto de tu estancia ha sido diseñado para tu éxito y tu
                    descanso. Somos el motor de tu siguiente gran día.
                  </Card.Text>
                  <div className="promesa-destacada">
                    <h5 className="mb-1 text-primary">
                      Nuestra Promesa Sintax
                    </h5>
                    <p className="mb-1">
                      "Eficiencia en cada proceso. Confort en cada rincón. El
                      diseño funcional de Sintax garantiza tu tranquilidad."
                    </p>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
          <div className="">
            <div>
            <h4 className=" display-5 text-center my-3">
              Conose nuestro equipo de trabajo
            </h4>
            </div>
            <ContainerCard />
          </div>
        </Container>
      </section>
    </>
  );
};
