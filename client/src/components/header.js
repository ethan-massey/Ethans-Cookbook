import React from "react"
import { Link } from "react-router-dom";

export default function Header() {
 
 return (
   <div className="header-container">
    <Link to={'/'}>
      <h1>Ethan's Recipe Database</h1>
    </Link>
   </div>
 );
}
