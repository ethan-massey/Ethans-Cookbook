import React from "react";

export default function BackButton(props) {
 
 return (
    <div>
        <p className="back-button">
            <a href={props.path}>back</a>
        </p>
    </div>
 );
}
