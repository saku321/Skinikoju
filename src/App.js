import axios from 'axios';
import { useState } from 'react';
import './styles/main.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom'
import Home from './Main.js';
import Ukk from './components/ukk.js';
import Contact from './components/contact';
function App() {
    const navigate = useNavigate();
    

    return (
        <div>
        
            <Routes>
                <Route exact path="/" element={<Home />} />
               
                <Route exact path="/home" element={<Home />} />
            
                <Route exact path="/ukk" element={<Ukk />} />

                <Route exact path="/contact" element={<Contact />} />

                <Route path="*" element={<Home />} />
            </Routes>
        </div>
    );
}



export default App;
