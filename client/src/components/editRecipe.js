import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import BackButton from "./backButton";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

// Grid components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function EditRecipeForm() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([""]);
  const [errorText, setErrorText] = useState("");

  const ERROR_EMPTY_FIELDS = "Please fill in or remove empty fields.";

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getRecipeData() {
      const response = await fetch(
        `http://localhost:5000/api/recipe/${params.id.toString()}`
      );

      if (!response.ok) {
        // const message = `An error occurred: ${response.statusText}`;
        // window.alert(message);
        navigate("/404");
        return;
      }

      const recipe = await response.json();
      setName(recipe.name);
      setIngredients(recipe.ingredients);
      setSteps(recipe.steps);
    }

    getRecipeData();

    return;
    // }, [name, ingredients, steps, id, navigate]);
  }, [params, navigate]);

  // Change labels based on screen size
  const screenWidth = window.innerWidth;
  const removeLabel = screenWidth > 600 ? "Remove" : <FaMinus />;
  const addLabel =
    screenWidth > 600 ? (
      <>
        {"Add Another"} <FaPlus />
      </>
    ) : (
      <FaPlus />
    );

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleIngredientChange = (e, index, field) => {
    let newIngredients = [...ingredients];
    newIngredients[index][field] = e.target.value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (e, index) => {
    let newSteps = [...steps];
    newSteps[index] = e.target.value;
    setSteps(newSteps);
  };

  const addIngredientField = () => {
    let newIngredients = [...ingredients];
    newIngredients.push({ name: "", quantity: "" });
    setIngredients(newIngredients);
  };

  const addStepField = () => {
    setSteps([...steps, ""]);
  };

  // validate input and set appropriate error message
  const validateInput = () => {
    if (!name || name.trim().length === 0) {
      setErrorText(ERROR_EMPTY_FIELDS);
      return false;
    }
    for (let i = 0; i < ingredients.length; i++) {
      if (
        !ingredients[i].name ||
        !ingredients[i].quantity ||
        ingredients[i].name.trim().length === 0 ||
        ingredients[i].quantity.trim().length === 0
      ) {
        setErrorText(ERROR_EMPTY_FIELDS);
        return false;
      }
    }
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i] || steps[i].trim().length === 0) {
        setErrorText(ERROR_EMPTY_FIELDS);
        return false;
      }
    }
    setErrorText("");
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInput()) {
      // trim whitespace and submit to db
      const fullRecipe = {
        name: name.trim(),
        ingredients: ingredients.map((i) => ({
          name: i.name.trim(),
          quantity: i.quantity.trim(),
        })),
        steps: steps.map((step) => step.trim()),
      };
      submit(fullRecipe);
    }
  };

  async function submit(recipe) {
    const response = await fetch(
      `http://localhost:5000/api/update/${params.id.toString()}`,
      {
        method: "POST",
        body: JSON.stringify({
          ...recipe,
          sessionID: sessionStorage.getItem("EthansRecipeDatabaseUserSessionID"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // const message = `An error occurred: ${response.statusText}`;
      // window.alert(message);
      navigate("/404");
      return;
    }

    setName("");
    setIngredients([{ name: "", quantity: "" }]);
    setSteps([""]);
    navigate(`/recipe/${params.id.toString()}`);
  }

  // itemType can be either "ingredient" or "step"
  const handleRemoveItem = (index, itemType) => {
    if (itemType === "step") {
      let newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    } else if (itemType === "ingredient") {
      let newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  return (
    <div className="recipeForm">
      <h3 className="recipe-title">Edit Recipe</h3>
      <Container>
        <Form>
          {/* Title Row */}
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label>Recipe Title</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  placeholder="Enter title"
                  onChange={handleNameChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <hr />
          {/* Ingredients Row */}
          <Row>
            <Col>
              <Form.Label>Ingredients</Form.Label>
            </Col>
            <Col>
              <Form.Label>Quantity</Form.Label>
            </Col>
          </Row>
          {ingredients.map((ingredient, index) => (
            <Row key={ingredient.toString() + index.toString()}>
              <Col xs={6}>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Control
                    name="name"
                    type="text"
                    value={ingredient.name}
                    placeholder="Spices..."
                    onChange={(e) => {
                      handleIngredientChange(e, index, e.target.name);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Control
                    name="quantity"
                    type="text"
                    value={ingredient.quantity}
                    placeholder="1 cup..."
                    onChange={(e) => {
                      handleIngredientChange(e, index, e.target.name);
                    }}
                  />
                </Form.Group>
              </Col>
              {ingredients.length > 1 ? (
                <Col xs={2}>
                  <Button
                    variant="remove"
                    onClick={() => {
                      handleRemoveItem(index, "ingredient");
                    }}
                  >
                    {removeLabel}
                  </Button>
                </Col>
              ) : null}
            </Row>
          ))}
          <Row>
            <Col xs={6}>
              <Button variant="addRecipeInfo" onClick={addIngredientField}>
                {addLabel}
              </Button>
            </Col>
          </Row>
          <hr />
          {/* Steps Row */}
          <Row>
            <Form.Label>Steps</Form.Label>
          </Row>
          {steps.map((step, index) => (
            <Row key={index}>
              <Col xs={10}>
                <Form.Group className="mb-3" controlId="formBasicText">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={step}
                    placeholder="Stir... Melt... Pour..."
                    onChange={(e) => {
                      handleStepChange(e, index);
                    }}
                  />
                </Form.Group>
              </Col>
              {steps.length > 1 ? (
                <Col xs={2}>
                  <Button
                    variant="remove"
                    onClick={() => {
                      handleRemoveItem(index, "step");
                    }}
                  >
                    {removeLabel}
                  </Button>
                </Col>
              ) : null}
            </Row>
          ))}
          <Row>
            <Col xs={6}>
              <Button variant="addRecipeInfo" onClick={addStepField}>
                {addLabel}
              </Button>
            </Col>
          </Row>
          <hr />
          {/* Submit Row */}
          {errorText !== "" ? <p className="error">{errorText}</p> : null}
          <Row>
            <Col>
              <Button
                variant="addRecipeInfo"
                type="submit"
                onClick={(e) => {
                  handleSubmit(e);
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <BackButton path={`/recipe/${params.id.toString()}`} />
    </div>
  );
}
