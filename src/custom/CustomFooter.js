import React from 'react';

const CustomFooter = (props) => {
    return <footer {...props}>{props.children}</footer>;
};

export default CustomFooter;
