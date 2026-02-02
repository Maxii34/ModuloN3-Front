import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const ModalHabitacionerForm = ({ show, onHide }) => {
    return (
        <>
        <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={onHide}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    );
};