import React from 'react';


const CustomHeader = ({userId}) => {
    return <header>
        <h1>POKE-VETO</h1>
        <div> USER PROFILE : {userId} </div>
    </header>;
};

export default CustomHeader;
