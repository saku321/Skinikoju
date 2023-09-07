
import React, { useEffect, useCallback, useState } from "react";
import Menu from "./menu";
import '../styles/mobileMenu.css';
import logoutIcon from '../styles/imgs/logout.png';
import settingsIcon from '../styles/imgs/settings.png';
const MobileMenu = ({profilePic,settingsToggle,logOutToggle}) => {
  // Your mobile menu content and logic here
  const [mobileMenuDisplay, setMobileMenuDisplay] = useState(false);
  const mobileMenuToggle = () => {
    setMobileMenuDisplay(!mobileMenuDisplay);
    }
    const closeMobileMenu=()=>{
        setMobileMenuDisplay(false);
    }

    /*    
    settings box
    {isLogged && (
                            <div id="settingsBox">
                                <h1>Asetukset</h1>
                                <label>Trade url</label>
                                <br></br>
                                <br></br>
                                <input onPaste={changeTradeUrl} onChange={changeTradeUrl} placeholder={tradeUrl} onClick={getTradeUrl} />
                                <br></br>
                                <br></br>

                                <button onClick={saveTradeUrl}>Tallenna</button>

                            </div>
                        )}*/
                        
  return (
    <div id="mobileHeader">
        
    <div className="card" >
      {profilePic&&(
        <img src={profilePic} alt="steamPic" />

      )}
        <i className="mobileMenuBtn" onClick={mobileMenuToggle}></i>
    </div>
        <div id="mobileMenuLinks" className={mobileMenuDisplay ? "mobileShow" : "mobileHide"}>
           <Menu closeMenu={closeMobileMenu}/>
           {profilePic&&(
           <ul id="mobileSteamMenu">
           <li>
              <img src={settingsIcon} alt="settingsIcon" />
                <span onClick={settingsToggle}>ASETUKSET</span>
            </li>
            <li>
              <img src={logoutIcon} alt="logoutIcon" />
                <span onClick={logOutToggle}>KIRJAUDU ULOS</span>
            </li>
           </ul>
           )}
        </div>
    </div>
  );
};

export default MobileMenu;