import React from 'react';

const CustomText = (props) => {
    return <p {...props}>{props.children}</p>;
};

export default CustomText;
