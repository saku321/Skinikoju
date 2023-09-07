
import React, { useEffect, useCallback, useState } from "react";

import '../styles/steamMenu.css';
import logoutIcon from '../styles/imgs/logout.png';
import settingsIcon from '../styles/imgs/settings.png';
const SteamMenu = ({userData,settingsToggle,logOutToggle}) => {


    const [dropStatus, setDropStatus] = useState(false);


    const dropToggle = () => {
        setDropStatus(!dropStatus);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (!event.target.closest(".card")) {
            if(setDropStatus){
                setDropStatus(false);
            }
          }
        };
    
        document.addEventListener("click", handleClickOutside);
    
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [dropStatus]);
    return (
    
    
                    <div id="steamMenu">
                       {userData &&(

                            <div id="steamMenuContainer">
                            <div className="card" onClick={dropToggle}>
                                
                                <div className="textBox">
                                    <div className="textContent">
                                        <p>{userData.displayName}</p>
                                    </div>
                                   
                                    </div>
                                    <img src={userData.profilePic} alt="steamPic" />

                            </div>
                            {(dropStatus)&&(

                          
                            <div id="steamDropDown">
                                <ul>
                                    <li>
                                        <img src={settingsIcon} alt="settingsIcon" />
                                        <span onClick={settingsToggle}>Asetukset</span>
                                    </li>
                                    <li>
                                        <img src={logoutIcon} alt="logoutIcon" />
                                        <span onClick={logOutToggle}>Kirjaudu ulos</span>
                                    </li>
                                </ul>
                            </div>  
                            )}
                           </div>
       )}

                    </div>
    
  );
};

export default SteamMenu;