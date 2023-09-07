import React, { useEffect, useState } from 'react';
import "../styles/ukkStyle.css";

import '../styles/menuStyle.css';
import ChoseMenu from './choseMenu';

function Ukk(){
    
   
    return(
        <div>
            <div id="menuLinks">
                <ChoseMenu />
            </div>
            
            <div className="faq-container">
                <div className='question'>
                    <h1 id="faqTitle">UKK</h1>
                </div>
                <div className="question">
                    <h1>Mikä on Skinikoju?</h1>
                    <p>Skinikoju on suomalainen automatisoitu CSGO skinien myyntipalvelu. Voit siis myydä meille skinisi nopeasti ilman ihmiskontaktia ja saat rahasi haluamallasi maksutavalla suoraan tilillesi ilman odottelua.</p>
                </div>
                <div className="question">
                    <h1>Miksi myisin skinini teille?</h1>
                    <p>Se on helpoin ja nopein tapa myydä skinit ja maksamme verot Suomeen joten tuet sillä myös Suomen valtiota. Maksamme myös kilpailukykyisen hinnan.</p>
                </div>
                <div className="question">
                    <h1>Mistä hintanne muodostuvat?</h1>
                    <p>Hintamme muodostuvat lukuisista eri muuttujista. Mutta kuitenkin Buff163 markkinapaikan 30 päivän keskihinnasta 85-75% on aikalailla suuntaa antava arvio, joka on muita vastaavia sivuja huomattavasti parempi.</p>
                </div>
                <div className="question">
                    <h1>Mitä maksutapoja teillä on käytössä?</h1>
                    <p>Käytämme maksujen lähettämisessä Trustlyä jolla on käytössä esim. Paypal, kaikki suomen pankit ja Visa.</p>
                </div>
           
            </div>
        </div>
    );
}
export default Ukk;