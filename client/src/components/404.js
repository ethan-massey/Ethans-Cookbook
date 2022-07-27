import React from "react"
import BackButton from "./backButton";

export default function PageNotFound() {
 
 return (
   <div>
    <div className="text404">
      <h1>Error 404</h1>
      <h3>Uh Oh. We couldn't find what you were looking for...</h3>
    </div>
    <img alt="Dog-in-scientist-outfit" className="dog-image" src={"/404.jpg"} />
    <BackButton path="/"/>
   </div>
 );
}
