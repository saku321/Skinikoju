import React, { useEffect, useState } from 'react';
import Menu from './menu';
import MobileMenu from './mobileMenu';

function ChoseMenu(){
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
        // Check if the device is mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(isMobile);
    }, []);
    return(
        <div>
        {isMobile ? (

            
                <MobileMenu/>
          
            ):(
            <div>
                <Menu/>
            </div>
        )};
            
        </div>

    );
}
export default ChoseMenu;