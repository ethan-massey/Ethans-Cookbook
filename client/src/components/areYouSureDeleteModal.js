import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AreYouSureDeleteModal(props) {
  const handleClose = () => props.closeModal();

  const handleConfirm = () => {
    props.deleteRecipe(props.recipeId);
  }

  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this recipe?</Modal.Body>
        <Modal.Footer>
          <Button variant="addRecipeInfo" onClick={handleClose}>
            No
          </Button>
          <Button variant="remove" onClick={handleConfirm}>
            Yes, delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
