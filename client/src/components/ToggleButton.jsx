import React, {useState} from 'react'
import "./ToggleButton.css"

function ToggleButton({name, isActive, onClick, color}) {


    

    return (
        <>
        <div className = {`toggler ${isActive ? "toggled" : ""}`}
            onClick = {onClick}
            style = {{"--mainColor": color}}>
        </div>
        <span 
            className = "toggle-description"
            style = {{"--mainDescriptionColor": color}}> {name} </span>
        </>
    );
};

export default ToggleButton;