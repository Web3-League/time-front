import React from 'react';

const CustomButton = (props) => {
    return <button {...props}>{props.children}</button>;
};

export default CustomButton;
