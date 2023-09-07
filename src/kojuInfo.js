import React from "react";
import weaponImage from './styles/imgs/weaponIcon.png';
import arrowImage from './styles/imgs/arrowIcon.png';
import euroImage from './styles/imgs/euroIcon.png';
import transferImage from './styles/imgs/transferIcon.png';
import twitterIcon from './styles/imgs/twitterIcon.png';
import tiktokIcon from './styles/imgs/tiktokIcon.png';

import './styles/kojuInfo.css';

function KojuInfo() {
    return (
        <div>
        <div id="kojuInfo">
                <h1>N&#x00C4;IN MYYT SKINISI</h1>
            <ul id="infoUl">
                <li>
                    <div className="circle"><img src={weaponImage} alt="helpImage" /></div>
                    <div className="label">VALITSE SKINI</div>
                </li>

                <li>
                    <div className="circle"><img src={arrowImage} alt="helpImage" /></div>
                    <div className="label">ALOITA KAUPPA</div>
                </li>

                <li>
                    <div className="circle"><img src={euroImage} alt="helpImage" /></div>
                        <div className="label">VALITSE MAKSUTAPA / <br></br>T&#x00C4;YT&#x00C4; TIEDOT</div>
                </li>

                <li>
                    <div className="circle"><img src={transferImage} alt="helpImage" /></div>
                        <div className="label">L&#x00C4;HET&#x00C4; VAIHTOTARJOUS</div>
                </li>
            </ul>
        </div>
                
          
        <div id="footer">

            <div id="footerContainer">
                    <p>@2023 SKINIKOJU.FI <br></br>KAIKKI OIKEUDET PIDET&#x00C4;&#x00C4;N <br></br>Not affiliated with Valve Corp.</p>

                <ul>
                    <li><a href="#"><img src={twitterIcon} alt="twitterImg" /></a></li>
                    <li><a href="#"><img src={tiktokIcon} alt="tiktokImg" /></a></li>
                </ul>
            </div>

        </div>
           
        </div>
    )
}
export default KojuInfo;