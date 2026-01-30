import { Col, Container, Row } from "react-bootstrap";
import { CardsNosotros } from "./CardsNosotros";
import Maxi from "../../assets/compressed-Maxi.jpeg";
import Mariano from "../../assets/compressed-Mariano.jpeg";
import Santiago from "../../assets/compressed-Santiago.jpeg";
import Naim from "../../assets/compresse-naim.jpeg";

export const ContainerCard = () => {
    const nosotros = [
  {
    id: 1,
    nombre: "Maximiliano Ordoñez",
    imagen: Maxi,
    github: "https://github.com/Maxii34",
  },
  {
    id: 2,
    nombre: "Mariano Juarez",
    imagen: Mariano,
    github: "https://github.com/cmjuarez95",
  },
  {
    id: 3,
    nombre: "Santiago Robledo",
    imagen: Santiago,
    github: "https://github.com/santyago13",
  },
  {
    id: 4,
    nombre: "Naim Paz",
    imagen: Naim,
    github: "https://github.com/naimp074",
  },

];

  return (
    <>
      <Container className="mt-5 g-2 p-0 d-flex justify-content-center">
        <Row className="d-flex justify-content- justify-content-md-center align-content-center w-100">
            {nosotros.map((nts, index) =>
          <Col xs={12} sm={12} md={4} lg={3} key={index} className="p-0 m-0 d-flex justify-content-center mb-3">
            <CardsNosotros nts={nts}  />
          </Col>
            )}
        </Row>
      </Container>
    </>
  );
};
