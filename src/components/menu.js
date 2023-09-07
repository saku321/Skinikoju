
import { Route, Routes,Link } from 'react-router-dom';
import '../styles/menuStyle.css';

import React, { useEffect, useCallback, useState } from "react";

function Menu(){


    return(
        <div>

            <ul id="menuUl">
                <li><Link to="/">ETUSIVU</Link></li>
                <li><Link to="/ukk">UKK</Link></li>
                <li><Link to="/contact">OTA YHTEYTTÄ</Link></li>
            </ul>
  
        </div>
    );
}

export default Menu;