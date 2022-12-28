/**
 * page untuk handle Midtrans response/Redirection
 */

import React, { useState, useEffect } from "react";
import LoadingOverlay from "react-loading-overlay";
import Navbar from "../components/Navbar";

const MidtransFinishRedirect = () =>{
    const [isLoading, setIsLoading] = useState(true);

    console.log('test')
    return(
        <LoadingOverlay
            active={isLoading}
            spinner
            text='processing...'
        >
            
            <Navbar />
                
            
        </LoadingOverlay>
    )
}


export { MidtransFinishRedirect }