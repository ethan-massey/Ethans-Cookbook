import React, {useState, useEffect} from "react";
 
import { Route, Routes } from "react-router-dom";

import RecipeIndex from "./components/recipeIndex";
import Recipe from "./components/recipe";
import Header from "./components/header";
import PageNotFound from "./components/404";
import AddRecipe from "./components/addRecipe";
import EditRecipe from "./components/editRecipe";
import {handleUserAuth} from "./components/userTokenFunctions";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Globals.css';
// fonts
import './fonts/pt-serif-caption-v17-latin-regular.eot';
import './fonts/pt-serif-caption-v17-latin-regular.svg';
import './fonts/pt-serif-caption-v17-latin-regular.ttf';
import './fonts/pt-serif-caption-v17-latin-regular.woff';
import './fonts/pt-serif-caption-v17-latin-regular.woff2';

const App = () => {
  const [user, setUser] = useState(false);

  const setUserStatus = (userStatus) => {
    setUser(userStatus);
  }

  useEffect(() => {
    // check if user is logged in
    var userToken = JSON.parse(localStorage.getItem("EthansRecipeDatabaseUser"));
    handleUserAuth(userToken, setUserStatus);
  
    return;
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route exact path="/" element={<RecipeIndex userStatus={user} setUserStatus={setUserStatus} />} />
        <Route path="/recipe/:id" element={<Recipe userStatus={user} setUserStatus={setUserStatus} showDeleteModal={false}/>} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
        {/* Routes that require log in  */}
        {user ? 
          <>
            <Route path="/add" element={<AddRecipe userStatus={user} setUserStatus={setUserStatus} />} />
            <Route path="/edit/:id" element={<EditRecipe userStatus={user} setUserStatus={setUserStatus} />} />
            <Route path="/delete/:id" element={<Recipe userStatus={user} setUserStatus={setUserStatus} showDeleteModal={true}/>} />
          </>
          :
          null
        }
      </Routes>
      <p className="copyright">© Ethan Massey 2022</p>
    </div>
  );
};

export default App;