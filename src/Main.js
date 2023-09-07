import './styles/main.css';
import './styles/searchInput.css';
import React, { useEffect, useCallback, useState } from "react";
import { io } from "socket.io-client";
import steamIcon from './styles/imgs/steamicon.png';
import KojuInfo from './kojuInfo';
import logoutIcon from './styles/imgs/logout.png';
import settingsIcon from './styles/imgs/settings.png';
import closeIcon from './styles/imgs/close-button.png';
import Menu from './components/menu.js';
import MobileMenu from './components/mobileMenu.js';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import SteamMenu from './components/steamMenu';
import ChoseMenu from './components/choseMenu';

const socket = io("http://localhost:5000", {withCredentials:true});
function Home() {
    
    const [InvItems, setInvItems] = useState([{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      },{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      },{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      },{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      },{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      },{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      },{
        "tradelock": true,
        "name": "★ Talon Knife",
        "image": "-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJfxPrMfipP7dezhr-KmsjmJrnIqWZQ-sd9j-Db8IjKhF2zowdyNj37cYaQcQ8_NF7Zr1Dqwb270cPv6Z_Izydj7CkjtHrelkThhxwaP_sv26JqHcKn6w",
        "appId": 730,
        "category": "skin",
        "family": "★ Talon Knife",
        "marketHashName": "★ Talon Knife | Doppler (Factory New) - Ruby",
        "price": 310785,
        "p": 310785,
        "cheapest": 310785,
        "liquidity": "0.718725735524185341460000",
        "type": "skin",
        "sparkline": [
          311295,
          319825,
          319303,
          317809,
          316428,
          317809,
          315534,
          315085,
          314806,
          313475,
          314792,
          314123,
          313939,
          315582,
          320720,
          320389,
          318784,
          315534,
          314123,
          320389,
          315612,
          315288,
          314558,
          309045,
          305264,
          305447,
          305454,
          306215,
          306632,
          306424,
          310785
        ],
        "paintSeed": 865,
        "weaponId": 523,
        "float": 0.015595508739352226,
        "assetId": "28845088468",
        "prices": {
          "buff": 310785,
          "buff_buy": 301035
        },
        value:"2003",
        wear:"FN",
        "pattern": null,
        "stickers": []
      }]);
   
    const [filteredInv, setFilteredInv] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [userData, setUserData] = useState([]);
    const [isLogged, setLogged] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const [userOffers, setUserOffers] = useState([]);


    const [alertMsg, setAlertMsg] = useState("");
    const [currTotal, setCurrTotal] = useState(0);
    const [lastBudjet, setLastBudjet] = useState(0);
    const [maxBudjet, setMaxBudjet] = useState(10000);

    const [targetBudjet, setTargetBudjet] = useState(222);
    const [currentBudjet, setCurrentBudjet] = useState(10000);

    const [tradeUrl, setTradeUrl] = useState("");
 
    
    const [loadingToastId, setLoadingToastId] = useState(null);
    const [displayedAlerts, setDisplayedAlerts] = useState([]);

    const [invLoaded, setInvLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [dropStatus, setDropStatus] = useState(false);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [steamStatus, setSteamStatus] = useState("");

    const [searchSkinQuery, setSearchSkinQuery] = useState("");
    const [mobileMenuDisplay, setMobileMenuDisplay] = useState(false);
    //budjet input background value
    const [val, setVal] = useState(0);

    const [sivu, setSivu] = useState(0);

 
  
    const itemsPerPage = 16;
    const [startAnimation, setStartAnimation] = useState(false);
    const [isFunctionCalled, setIsFunctionCalled] = useState(false);
    const testi = () => {
      
      //  socket.emit("sendTradeInf", userData.id,tradeUrl, selectedItems);
        /*const sortedInvItems = InvItems
            .filter(item => !item.tradelock)
            .sort((a, b) => b.assetId - a.assetId);

        const lastSelectedItemIndex = sortedInvItems.findIndex(item => selectedIds.includes(item.assetId));
        const currentPage = Math.ceil((lastSelectedItemIndex + 1) / itemsPerPage);
        const lastItemIndex = currentPage * itemsPerPage;
        const firstItemIndex = lastItemIndex - itemsPerPage;
        const currentItems = sortedInvItems.slice(firstItemIndex, lastItemIndex);
        setFilteredInv(currentItems);
        console.log(selectedItems);*/
       
        
        setLastBudjet(currentBudjet);
        setTargetBudjet(600);
        setStartAnimation(true);
     
    
    }
   



    useEffect(() => {
        setVal(currentBudjet / maxBudjet);
      }, [currentBudjet, maxBudjet]);
    

      useEffect(() => {
        if (startAnimation) {
          const difference = Math.abs(targetBudjet - currentBudjet);
          let step;
          if (difference >= 100) {
            step = 100;
          } else if (difference >= 10) {
            step = 10;
          } else {
            step = 1;
          }
      
          const changeBudjet = () => {
            if (targetBudjet > lastBudjet) {
              setCurrentBudjet((prevBudjet) => {
                if (prevBudjet < targetBudjet) {
                  const newBudjet = prevBudjet + step;
                  setVal(newBudjet / maxBudjet);
                  return newBudjet;
                }
                return targetBudjet;
              });
            } else if (targetBudjet < lastBudjet) {
              setCurrentBudjet((prevBudjet) => {
                if (prevBudjet > targetBudjet) {
                  const newBudjet = prevBudjet - step;
                  setVal(newBudjet / maxBudjet);
                  return newBudjet;
                }
                return targetBudjet;
              });
            }
          };
      
          const interval = setInterval(changeBudjet, 15);
      
          return () => {
            clearInterval(interval);
            
          };
        }
      }, [currentBudjet, lastBudjet, startAnimation, targetBudjet]);
      
      
   
    //get user inventory
    if (InvItems.length === 0) {

        socket.on("user inv", function (data) {
            if (data.error ==="invError") {
                if(!displayedAlerts.includes("invError")){
                    toast.remove();
                    toast.error("Kokeile myöhemmin uudelleen",{duration:60000});

                    displayedAlerts.push("invError");
                }
                
            } else {

                const dataArr = Object.values(data.items);
                setInvItems([]);
                const itemsWithoutError = dataArr.filter(item => !item.error || item.error === undefined);
                const itemsWithError = dataArr.filter(item => item.error);

                itemsWithoutError.sort((a, b) => b.value - a.value);
                itemsWithError.sort((a, b) => b.value - a.value);

                const sortedItems = [...itemsWithoutError, ...itemsWithError];

                setInvItems(prevItems => [...prevItems, ...sortedItems]);
                if (!invLoaded) {
                    setLoadingToastId(null);
                    toast.remove();

                }
                setInvLoaded(true);

            }
        });
    }
    useEffect(() => {
        //socket stuff
        socket.emit("steamStatus");
        socket.on("steamRespStatus",function(data){
            setSteamStatus(data.steamStatus);
          
        });
        socket.on("respInf", function (data) {

            if (data.status === true) {

               // axios.post("/backendTrustly",{})
                
                toast("Lähetä offeri: https://steamcommunity.com/tradeoffer/new/?partner=1514637547&token=ilwJMIMI", { duration: 6000, icon: '✅', });
                //Pitäisi saada trustlyn iframe näkyviin
            }
            if (data.status === 401) {
                

                if(!displayedAlerts.includes("401")){
                    toast.error("Sinulla pitää olla authenticaattori käytössä");
                    displayedAlerts.push("401");
                }
            } else if (data.status === 402) {

                if(!displayedAlerts.includes("402")){
                    setDisplayedAlerts([]);
                    toast.error("Jotain meni pieleen, yritä myöhemmin uudelleen");
                    displayedAlerts.push("402");
                }

            }
            
            else if (data.status === 403) {

                if(!displayedAlerts.includes("403")){
                    setDisplayedAlerts([]);
                    toast.error("Sinulla on jo menossa oleva offeri");

                    displayedAlerts.push("403");
                }

            }
            else if(data.status===404){
                
                if(!displayedAlerts.includes("404")){
                    setDisplayedAlerts([]);
                    toast.error("Joitain skinejä ei löytynyt tavaraluettelostasi -> Päivitä tavaraluettelo");
                    displayedAlerts.push("404");
                }
            }

        });

        socket.on("errorChannel", function (data) {

            if (data.code === 407) {
               

                if(!displayedAlerts.includes("407")){
                    setDisplayedAlerts([]);
                    toast.error("Käyttäjää ei tunnistettu, yritä uudelleen!");
                    displayedAlerts.push("407");
                }
            }
            
            else if (data.code === 408) {

                if (!displayedAlerts.includes("steamError")) {
                    displayedAlerts.push("steamError");
                    setInvItems([]);
                    toast.remove();
                    toast(
                        <div>
                            <p>Steamilla on ongelmia, yritä myöhemmin uudelleen.</p>
                            <p>Voit seurata steamin statusta täältä: <a href="https://steamstat.us" target="_blank">https://steamstat.us</a></p>
                        </div>,
                        {
                            duration: 15000,
                            icon: "❌",
                        }
                    );
                }
            }
            else if (data.code === 200) {
                
                displayedAlerts.filter((alertId) => alertId !== "steamError");
            }


        });
        
            const getUser = () => {
                fetch("/api/auth/user", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (response.status === 200) return response.json();
                        toast.error("Kirjaudu sisään!");
                    })
                    .then((resObject) => {
                        //if user has logged in
                        if (resObject.user) {
                            if (resObject.user.provider === 'steam') {
                                if (resObject.user.profileStatus === 3 && InvItems.length === 0) {
                                    socket.emit("steamStatus");
                                    socket.emit('auth', resObject.user.id);
                                    if (steamStatus!=="Critical") {
                                        socket.emit("get user offers", resObject.user.id);
                                        socket.once("User offers received", (data) => {
                                           
                                            if (data.offers) {
                                                const singleOffer = data.offers;
                                                const parsedOffer = {
                                                    tradeTime: singleOffer.tradeTime,
                                                    items: JSON.parse(singleOffer.items),
                                                    tradePrice: singleOffer.tradePrice,
                                                    tradeStatus: singleOffer.tradeStatus
                                                };
                                                if (parsedOffer.tradeStatus > 0) {
                                                    setUserOffers([parsedOffer]);

                                                } else {
                                                    if(!displayedAlerts.includes("loadingInv")){
                                                        setDisplayedAlerts([]);
                                                        setLoadingToastId(toast.loading('Lataa tavaraluetteloa...'));
                                                      socket.emit("get user inv", resObject.user.id);
                                                        displayedAlerts.push("loadingInv");
                                                    }
                                                }
                                                   
                                                   
                                            }else {
                                                if(!displayedAlerts.includes("loadingInv")){
                                                    setDisplayedAlerts([]);
                                                    setLoadingToastId(toast.loading('Lataa tavaraluetteloa...'));
                                                    socket.emit("get user inv", resObject.user.id);
                                                    displayedAlerts.push("loadingInv");
                                                }
                                               
                                             
                                            }
                                           
                                        });
         
                                    }
                                } if (resObject.user.profileStatus != 3) {
                                  toast.error("Steam profiilisi pitää olla julkinen");
                                }

                                setUserData(resObject.user);
                               
                                setLogged(true);

                            }
                        } else {
                            setLogged(false);

                        }


                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error("Jotain meni pieleen");
                    });
            };
            getUser();


    if (isLogged) {


        socket.on('connect', () => {





        });


    }



    }, []);

    const selectItem = (item) => {


        //voitas hakee infot suoraa invitems taulukosta tolla id:llä
        if (selectedIds.includes(item.assetId)) {




            setSelectedIds(selectedIds.filter(selectedId => selectedId !== item.assetId));
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));

           
            setCurrTotal(parseFloat(currTotal) - parseFloat(item.value));
            

           
        } else {
       
            if (tradeUrl === "") {
                getTradeUrl();
              
            }

            setSelectedIds(selectedIds.concat(item.assetId));

            setSelectedItems(selectedItems.concat(item));
            setCurrTotal(parseFloat(currTotal) + parseFloat(item.value));
        }




    }

    const logUserOut=()=>{
        if (isLogged) {
            fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    window.location.reload(false);

                    console.log(response);
                });
        }
    }

   
    const openSettings=()=>{
        setSettingsOpen(!settingsOpen);
    }
    const sendTradeOff = () => {
        if (selectedItems.length === 0) {
            toast('Valitse skini', {
                icon: '❗️',
            });
        } else {
           
            if (userData.id != null && selectedItems != null ) {
                //lähetä
           
                console.log(tradeUrl);
                if (tradeUrl != "") {
                
                    const urlToken = tradeUrl.split("token=")[1];
                    socket.emit("sendTradeInf", userData.id, urlToken, selectedItems);
                    console.log(selectedItems);

                    axios.post('http://localhost:3005/payment/Identity')
                      .then(function(response) {
                        // Handle the response from the server
                        console.log(response.data);
                      })
                      .catch(function(error) {
                        // Handle any errors that occurred during the request
                        console.error(error);
                      });
                    
                    //päivitetään offers socket kohta eli saadaan uus offeri

                    /*
                        -Tästä lähetetään trustlyn backendiin tieto
                        -


                    */
                  
                } else {
                    toast('Lisää tradelinkki!', {
                        icon: '👆🏼',
                    });
                }
               
               

            } else {
                console.log("value error");
            }

        }
    }
    const reloadInv = () => {
        if (steamStatus!=="critical") {
            console.log("SteamStatus: "+steamStatus);
            axios.get("/api/settings/getInvRefresh", {


            }).then((res) => {

                console.log(res.data);
                if (res.data.body) {

                    const bodyDate = new Date(res.data.body);
                    const currentDate = new Date();
                    const diffInMs = Math.abs(currentDate.getTime() - bodyDate.getTime());
                    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

                    if (diffInMinutes >= 3 && steamStatus!=="critical") {

                        setInvItems([]);
                        setLoadingToastId(toast.loading('Lataa tavaraluetteloa...'));

                        socket.emit("force refresh userInv", userData.id)

                        axios.post("/api/settings/updateInvCall").then((res) => {

                        }).catch((err) => {
                            console.log(err);
                        });

                    } else {
                        toast.error("Voit päivittää tavaraluettelon vain 3minuutin välein");
                    }
                }

            }).catch((err) => {
                toast.error("Tavaraluetteloa ei voitu päivittää");
            })
        } else {
            toast(
                <div>
                    <p>Steamilla on ongelmia, yritä myöhemmin uudelleen.</p>
                    <p>Voit seurata steamin statusta täältä: <a href="https://steamstat.us" target="_blank">https://steamstat.us</a></p>
                </div>,
                {
                    duration: 15000,
                    icon: "❌",
                }
            );
        }
    }


    const changeTradeUrl = (e) => {
        const inputUrl = e.target.value;

        setTradeUrl(inputUrl);

       

    }
    const saveTradeUrl = () => {
        
        const totalUrl = tradeUrl.split("tradeoffer/");

        if (totalUrl[0] != "https://steamcommunity.com/") {
            toast.error("Anna kelvollinen tradelinkki");


        } else {


            axios.post("/api/settings/setTradeUrl", {
                url: totalUrl[1],
            }).then((res) => {
                if (res.data.status) {
                    toast.success("Tradelinkki tallenettu");
                    setTradeUrl(totalUrl[1]);

                } else {
                    toast.error("Tradelinkkiä ei voitu tallentaa");
                }
            }).catch((err) => {

                toast.error("Jotain meni peileen");
            });
        }

        
    }

    const getTradeUrl = () => {
        //saadaan tradeurl ja invlastcall

        axios.get("/api/settings/getTradeUrl").then((res) => {
            setTradeUrl(res.data.body);

        }).catch((err) => {
            toast.error("Trade linkkiä ei löydy");
        });


    }
    const dropDown = () => {
        setDropStatus(!dropStatus);
    
    }
   
  
    useEffect(() => {
        // Check if the device is mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(isMobile);
    }, []);

   
    const changeSivu = () => {
        if (sivu === 0) {
            setSivu(1);
        } else if(sivu===1) {
            setSivu(0);
        }
    }
    
    const getStatusColor = () => {
        switch (steamStatus) {
          case 'Critical':
            return 'red';
          case 'Delayed':
            return 'orange';
          case 'Normal':
          default:
            return 'green';
        }
      };
     

    return (
        <div className="Home" >
            
            <Toaster />
            {filteredInv.length > 0 && (
                <div id="showUserInv">
                    <div>
                        <h1>Lähetä valitut skinit:</h1>
                        
                            <div id="selectedItemsContainer">
                            <button onClick={changeSivu}>Vaihtoehto 1</button>

                                <ul id="skinUl">

                                {selectedItems.map((item, index) => {
                                    return (
                                        <li key={index} style={{width:"100%"} }>
                                            <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}/330x192`} alt="skinIcon" />
                                            <p>{item.marketHashName}</p>
                                            <p>{item.float.toFixed(4)}</p>
                                            <div id="itemStickers">
                                            stickers:
                                            <ul id="stickerUl">
                                            {item.stickers.map((sticker, index) => {
                                                return (
                                                <li key={index}>
                                                    <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${sticker.image}`} alt="stickerImg" />
                                                    <p>{sticker.marketHashName}</p>
                                                    <p>Price: ${sticker.price}</p>
                                                    <p>Slot: {sticker.slot}</p>
                                                    <p>Wear: {sticker.wear}</p>
                                                </li>
                                                );
                                            })}
                                            </ul>
                                        </div>
                                        </li>
                                    );

                                })}

                                    </ul>
                                </div>
                      

                      
                    </div>
                </div>
              )}
            
            {isMobile ? (
               
                    <MobileMenu profilePic={userData.profilePic} settingsToggle={openSettings} logOutToggle={logUserOut}/>
                 
            ) : (

                <div id="menuLinks">
                    <SteamMenu userData={userData} settingsToggle={openSettings} logOutToggle={logUserOut}/>
                    <ChoseMenu />
                  
                    <button onClick={testi}>Test Button</button>

                    
                    {(isLogged && settingsOpen)&&(
                        <div id="settingsBox">
                            <img onClick={openSettings} src={closeIcon} alt="closeIcon"/>
                            <h1>Asetukset</h1>
                            <label>Trade url</label>
                          
                            <input onPaste={changeTradeUrl} onChange={changeTradeUrl} placeholder={tradeUrl} onClick={getTradeUrl} />
                            <br></br>
                            <br></br>

                            <button onClick={saveTradeUrl}>Tallenna</button>

                        </div>
                    )}

                </div>
            )}
        
 
            <div id="mainContent" >
                

                    <img src={require('./styles/imgs/kt.png')} alt="mainImage" id="mainImage" />
                 
                {!isLogged && (
                    <div id="loginFirst">
                         <div id="tausta"/>
                        <div id="loginFirstContainer">
                           
                            <h1>Kirjaudu sisään aloittaaksesi<br></br> kaupankäynnin</h1>
                            <div id="steamLoginBtn">
                                <div className="cssbuttons-io-button">
                                    <a href="http://192.168.0.164:3001/api/auth/steam">
                                        <img src={steamIcon} alt="steamIcon" />
                                        <p>KIRJAUDU SISÄÄN STEAMILLA</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {(isLogged && filteredInv.length === 0 && userOffers.length===0 &&!settingsOpen)&& (

                    <div id="invList">

                        <div id="invHelpButtons">
                            <form className="searchForm">
                                <label>

                                    <input type="text" required="" id="searchSkin" onChange={e => setSearchSkinQuery(e.target.value)} />

                                    <div className="search">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr">
                                            <g>
                                                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                            </g>
                                        </svg>
                                    </div>
                                    <button className="close-btn" type="reset" onClick={e => setSearchSkinQuery("")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </label>
                            </form>
                            <div id="spaceLine"></div>
                            <button onClick={reloadInv} id="reloadInvBtn">

                            </button>
                        </div>

                        <div id="invContent">
                            <ul id="invUl">

                                {InvItems.filter(skin => skin.marketHashName.match(new RegExp(searchSkinQuery, "i")))
                                    .map((item, index) => {
                                        if (item.type === "skin" || item.type === "glove") {
                                            if (item.value===0 && item.error && item.error !== ""&&item.tradelock) {
                                                return (
                                                    <li key={index} className="unacceptableItem" >
                                                        <div className="card2">
                                                            <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}/330x192`} alt="itemIcon" />
                                                            <p>{item.error}</p>
                                                            
                                                        </div>
                                                    </li>
                                                );
                                            } else if (!item.error) {
                                                const hasStattrak = item.marketHashName.includes("StatTrak");
                                                return (
                                                    <li key={index} onClick={() => { selectItem(item) }} className="acceptableItem" style={{
                                                        backgroundColor: `#1D1D20`,
                                                        border: hasStattrak ? "1px solid #CF7F42" : "1px solid rgba(0,0,0,0.0)",
                                                        filter: selectedIds.includes(item.assetId) ? "brightness(0.5)" : "none",
                                                    }}>
                                                        <div className="card2">
                                                            <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}/330x192`} alt="itemIcon" />
                                                            <p style={{ color: "#ACAEB0" }} >{(item.wear)} / {(parseFloat(item.float).toFixed(3))}</p>
                                                            <p style={{ color: "white" }}>€ {(item.value)}</p>
                                                        </div>
                                                    </li>
                                                );
                                            }
                                        } else{
                                            return null; // hide the item
                                        }
                                    })}


                                {InvItems.length === 0 && (
                                    <p style={{ color: "white" }}>{alertMsg}</p>
                                )}
                            </ul>
                            <div id="invButtons">
                                <div id="budjetDiv">

                                    <div id="steamStatus">
                                    <p>
                                        Steam status: 
                                        <span id="statusColor" style={{ backgroundColor: getStatusColor() }}></span>
                                        {steamStatus}
                                    </p>


                                    </div>

                                    <div id="inputWrapper">
                                        <div id="budjetTopTxt">
                                            <p id="budjetTxt">BUDJETTI</p>



                                        </div>
                                        <div id="inputContainer" style={{ position: "relative" }}>
                                        <input
                                            type="range"
                                            value={currentBudjet}
                                            min="0"
                                            max={maxBudjet}
                                            data-prev-value="0"
                                            id="budjetRange"
                                            style={{
                                            backgroundImage: `-webkit-gradient(linear, left top, right top,
                                                color-stop(${val}, #0075FF),
                                                color-stop(${val}, #575757)
                                            )`, 
                                            

                                            }}
                                            readOnly
                                        />
                                    
                                        <label
                                            htmlFor="budjetRange"
                                            id="budjetValue"
                                            style={{
                                                position: "absolute",
                                                top: "calc(100% - 5px)",
                                                left: `calc(${(currentBudjet / maxBudjet) * 100}% - ${
                                                    (currentBudjet / maxBudjet) * 50
                                                  }px)`,
                                                  transform: "translateX(-40%)",
                                                textAlign: "center",
                                                width: "auto",
                                                whiteSpace: "nowrap",
                                              
                                                
                                              }}
                                        >
                                            {currentBudjet}{'\u20AC'}
                                        </label>
                                     
                                        <p id="budjetInfo">?</p>
                                        <div id="budjetInfoContainer">
                                            <p>
                                            Ostamme skinejä viikoittaisella budjetilla, <br></br>joka päivittyy jokaisen ostoksen myötä.
                                            </p>
                                        </div>
                                        </div>


                                </div>
                                </div>
                                <div id="TotalPrice">
                                    <p>SUMMA</p>
                                    <div id="priceBox">
                                        <h1>{currTotal.toFixed(2)}{'\u20AC'}</h1>
                                    </div>
                                </div>


                                <div id="offerButtons">
                                    <button className="invBtn" id="sendTradeBtn" onClick={sendTradeOff}>ALOITA KAUPPA</button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
                {userOffers.length > 0 && (
                    <div id="offersDiv">
                    <p>Skinit:</p>
                      
                   
                        {userOffers.map((offer, index) => (
                           
                            <>
                            <ul>
                                {offer.items.map((item, itemIndex) => (
                                    <li key={`${index}-${itemIndex}`}>
                                        <img
                                            src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.image}/330x192`}
                                            alt="itemIcon"
                                        />
                                        <p>{item.marketHashName}</p>
                                    </li>
                                ))}
                            </ul>
                               
                                {offer.tradeStatus === 1 && (
                                    <div id="sendTradeDiv">
                                        <button className="secondBtn">Lähetä offeri <img style={{ width: "20%",marginLeft:"20px" }} src={steamIcon} alt="steamLogo" /></button>
                                    </div>
                                ) }
                            </>
                        ))}
                   
                    </div>
                )}
                        


                <div style={{ width: '100%' }}>
                    <KojuInfo />
                </div>
           
        </div>
        </div>
    );
}




export default Home;
