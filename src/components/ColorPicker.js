import React from "react";

const ColorPicker = (props) => {
    return (
        <div className="color-picker__wrapper">
            {
                props.colors.map( color => <span key={color} onClick={() => props.setActiveColor(color)} className={`color-picker ${color}-bg`} />)
            }
        </div>
    )
}

export default ColorPicker;