import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackEditDeleteButtons from "./backEditDeleteBar";
import { RECIPE_DATABASE_TITLE } from "../constants";

export default function Recipe(props) {
  const [recipeData, setRecipeData] = useState({});

  let params = useParams();
  const navigate = useNavigate();

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecipeData() {
      await fetch(
        `https://ethans-cookbook.herokuapp.com/api/recipe/${params.id.toString()}`
      )
        .then((response) => {
          if (!response.ok) {
            // const message = `An error occurred: ${response.statusText}`;
            // window.alert(message);
            navigate("/404");
            return;
          } else {
            return response.json();
          }
        })
        .then((responseJson) => {
          setRecipeData(responseJson);
          // Set web title
          document.title = RECIPE_DATABASE_TITLE + ' - ' + responseJson.name;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getRecipeData();

    return;
  }, [params, navigate]);

  function formatIngredients() {
    if (recipeData.ingredients) {
      return recipeData.ingredients.map((i, index) => {
        return (
          <li key={i.name.toString() + index.toString()}>
            <p>
              {i.name} - {i.quantity}
            </p>
          </li>
        );
      });
    }
  }

  function formatSteps() {
    if (recipeData.steps) {
      return recipeData.steps.map((step, index) => {
        return (
          <li key={step.toString() + index.toString()}>
            <p>{step}</p>
          </li>
        );
      });
    }
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <div className="center-text">
        <h3 className="recipe-title">{recipeData.name}</h3>
        <h4>Ingredients</h4>
        <ul>{formatIngredients()}</ul>
        <h4>Steps</h4>
        <ol>{formatSteps()}</ol>
        <BackEditDeleteButtons
          backPath="/"
          recipeId={params.id.toString()}
          userStatus={props.userStatus}
          setUserStatus={props.setUserStatus}
          showDeleteModal={props.showDeleteModal}
        />
      </div>
    </div>
  );
}
