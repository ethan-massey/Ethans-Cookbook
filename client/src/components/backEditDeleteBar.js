import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AreYouSureDeleteModal from "./areYouSureDeleteModal";
import LoginModal from "./LoginModal";

export default function BackEditDeleteButtons(props) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalNextAction, setLoginModalNextAction] = useState({
    action: "home",
  });

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  async function deleteRecipe(recipeId) {
    const response = await fetch(`http://localhost:5000/api/${recipeId}`, {
      method: "DELETE",
      body: JSON.stringify({
        token: localStorage.getItem("EthansRecipeDatabaseUserJWT"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // const message = `An error occurred: ${response.statusText}`;
      // window.alert(message);
      navigate("/404");
      return;
    }

    navigate("/");
  }

  useEffect(() => {
    // comes from clicking delete in /recipe/:id while not logged in
    // login modal then sends user to /delete/:id with props.showDeleteModal = true
    if (props.showDeleteModal === true) {
      setShowDeleteModal(true);
    }

    return;
  }, [props.showDeleteModal]);

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = () => {
    if (props.userStatus) {
      navigate(`/edit/${props.recipeId}`);
    } else {
      setLoginModalNextAction({ action: "edit", recipeId: props.recipeId });
      setShowLoginModal(true);
    }
  };

  const handleDeleteClick = () => {
    if (props.userStatus) {
      setShowDeleteModal(true);
    } else {
      setLoginModalNextAction({ action: "delete", recipeId: props.recipeId });
      setShowLoginModal(true);
    }
  };

  return (
    <div className="back-edit-delete-container">
      <p className="back-edit-delete-button">
        <a href={props.backPath}>back</a>
      </p>
      <button
        className="delete-edit-fake-button"
        onClick={() => {
          handleEditClick();
        }}
      >
        <u>edit</u>
      </button>
      <button
        className="delete-edit-fake-button"
        onClick={() => {
          handleDeleteClick();
        }}
      >
        <u>delete</u>
      </button>
      <AreYouSureDeleteModal
        show={showDeleteModal}
        recipeId={props.recipeId}
        deleteRecipe={deleteRecipe}
        closeModal={closeDeleteModal}
      />
      <LoginModal
        show={showLoginModal}
        closeModal={closeLoginModal}
        userStatus={props.userStatus}
        setUserStatus={props.setUserStatus}
        nextAction={loginModalNextAction}
      />
    </div>
  );
}
