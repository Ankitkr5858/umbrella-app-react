import React from "react";
import CloseIcon from '../assets/close.png';

const TimesIcon = props => {
  return (
    <img onClick={props.removeCurrentFile} className={`remove-icon ${props.class}`} src={CloseIcon} alt="Close" />
  );
};

export default TimesIcon;
