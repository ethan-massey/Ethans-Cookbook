import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackEditDeleteButtons from "./backEditDeleteBar";
 
export default function Recipe(props) {
 const [recipeData, setRecipeData] = useState({});

 let params = useParams();
 const navigate = useNavigate();
 
 // This method fetches the records from the database.
useEffect(() => {
async function getRecipeData() {
    const response = await fetch(`https://ethans-cookbook.herokuapp.com/api/${process.env.REACT_APP_API_KEY}/recipe/${params.id.toString()}`);

    if (!response.ok) {
        // const message = `An error occurred: ${response.statusText}`;
        // window.alert(message);
        navigate("/404");
        return;
    }

    const recipe = await response.json();
    setRecipeData(recipe);
}

getRecipeData();

return;
}, [recipeData, params, navigate]);

 function formatIngredients() {
    if (recipeData.ingredients){
        return recipeData.ingredients.map((i) => {
            return (
                <li key={i.name.toString()}>
                    <p>{i.name} - {i.quantity}</p>
                </li>
            )
        });
    }
 }

 function formatSteps() {
    if (recipeData.steps){
        return recipeData.steps.map((step) => {
            return (
                <li key={step.toString()}>
                    <p>{step}</p>
                </li>
            )
        });
    }
 }
 
 // This following section will display the table with the records of individuals.
 return (
<div>
    <div className="center-text">
        <h3 className="recipe-title">{recipeData.name}</h3>
        <h4>Ingredients</h4>
        <ul>
            {formatIngredients()}
        </ul>
        <h4>Steps</h4>
        <ol>
            {formatSteps()}
        </ol>
        <BackEditDeleteButtons backPath="/" recipeId={params.id.toString()} userStatus={props.userStatus} setUserStatus={props.setUserStatus} showDeleteModal={props.showDeleteModal}/>
    </div>
</div>
 );
}