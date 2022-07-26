import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { createNewToken } from './userTokenFunctions';

export default function LoginModal(props) {
  const [userAnswer, setUserAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const WRONG_ANSWER = "Wrong!"
  const CORRECT_ANSWER = process.env.REACT_APP_LOGIN_PASS;

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  }

  const handleClose = () => {
    props.closeModal();
  }

  // actions to happen after successful login
  const handleNextAction = () => {
    if(props.nextAction.action === 'home'){
      navigate('/');
    }else if (props.nextAction.action === 'edit'){
      navigate(`/edit/${props.nextAction.recipeId}`);
    }else if(props.nextAction.action === 'delete'){
      navigate(`/delete/${props.nextAction.recipeId}`);
    }else if(props.nextAction.action === 'add'){
      navigate('/add');
    }
  }

  const handleSubmit = () => {
    // Do user login stuff
    if(userAnswer.trim() === CORRECT_ANSWER){
        // put new user token in local storage
        createNewToken();
        handleClose();
        props.setUserStatus(true);
        handleNextAction();
    }else{
        setErrorMessage(WRONG_ANSWER);
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="password.ControlInput1">
              <Form.Label>What is Ethan's favorite vacation destination?</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your answer here..."
                autoFocus
                onChange={e => {handleAnswerChange(e)}}
              />
            </Form.Group>
            {errorMessage ? <p className='error'>{errorMessage}</p> : null }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='Submit' onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
