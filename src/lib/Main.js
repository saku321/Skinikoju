import axios from 'axios';
import { useState } from 'react';
import './styles/main.css';
import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom'


function Home() {
    const navigate = useNavigate();
    const [InvItems, setInvItems] = useState([]);
    const getInv = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/GetInv');
            setInvItems([...InvItems, ...response.data]);
            console.log(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    const getInvs = () => {
        console.log(InvItems);
    }

    const items = InvItems.map((item, index) => {
        return <div key={index}>{item.name}</div>;
    });

    const steamLogin = () => {
        navigate.push('http://localhost:3001/api/auth/steam');
    }

    const testi = async () => {
        const resp = await axios.get("http://localhost:3001/api/getSteamId");
        const id = resp.data;
        console.log(id);
    }


    return (
        <div className="Home">
           
            

            <button onClick={getInv}>buttoniInv</button>

            <button onClick={testi}>Getsteamid</button>
            <div id="invList">
                <ul id="invUl">
                    {InvItems.map((item, index) => (
                        <li key={index}>
                            <div className="card2">
                                <h1>{item.name}</h1>
                                <p>{item.marketName}</p>
                                <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.iconUrl}/330x192`} alt="itemIcon" />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}




export default Home;
