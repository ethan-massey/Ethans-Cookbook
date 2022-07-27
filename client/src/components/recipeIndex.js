import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import LoginModal from "./LoginModal";
 
export default function RecipeList(props) {
 const [recipes, setRecipes] = useState([]);
 const [showLoginModal, setShowLoginModal] = useState(false);
 const navigate = useNavigate();
 
 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecipes() {
     const response = await fetch(`https://ethans-cookbook.herokuapp.com/api/recipe/`);
 
     if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
     }
 
     const recipes = await response.json();
     setRecipes(recipes);
   }
 
   getRecipes();
 
   return;
 }, [recipes.length]);
 
 // sorts by name and returns JSX for each recipe
 function recipeList() {
  let sortedRecipes = [...recipes];
  sortedRecipes.sort(function(a, b) {
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  return sortedRecipes.map((recipe) => {
    return (
      <li key={recipe._id}>
          <p>
              <Link to={`/recipe/${recipe._id}`}>
                  {recipe.name}
              </Link>
          </p>
      </li>
    );
  });
 }

 const closeLoginModal = () => {
  setShowLoginModal(false);
 }
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3 className="contents-title">Contents</h3>
     <ul>
        {recipeList()}
     </ul>
     <Button variant="addrecipe" 
        onClick={() => {
          if(props.userStatus){
            navigate('/add');
          }else{
            setShowLoginModal(true);
          }
        }}
        >Add Recipe
     </Button>
     <LoginModal show={showLoginModal} closeModal={closeLoginModal} userStatus={props.userStatus} setUserStatus={props.setUserStatus} nextAction={{action: 'add'}}/>
   </div>
 );
}