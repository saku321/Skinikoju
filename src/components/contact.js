import Menu from "./menu.js";
import React, { useEffect, useState } from 'react';
import ChoseMenu from "./choseMenu.js";
import '../styles/menuStyle.css';
function Contact(){
   
   
    return(
        <div>
             <ChoseMenu/>
          
         
            <ul style={{margin:"auto"}}>
                <li style={{color:"white"}}>Sähköposti: asiakaspalvelu@skinikoju.fi</li>
            </ul>

        </div>

    );
}
export default Contact;