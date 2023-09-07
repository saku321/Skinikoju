'use strict'
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const config = require('./config')
const bodyParser = require('body-parser');
const { createUser,updateUrl,getTradeUrl,updateInvCall,getInvCall } = require('./servers/dbServer');
// Let's set a port
const  port = 3001;
// Spin up the server
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST",
    credentials: true,
  })
);

//server.listen(5000);




// Required to get data from user for sessions
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// steamit
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3001/api/auth/steam/return',
    realm: 'http://localhost:3001/',
    apiKey: config.steamApiKey,
}, function (identifier, profile, done) {
    process.nextTick(function () {
        profile.identifier = identifier;
        return done(null, profile);


    });
}
));
app.use(session({
    secret: config.sessionSK,
    saveUninitialized: true,
    resave: false,

    cookie: {
        maxAge: 86400000,//1day
        httpOnly: true,
    //secure: true, sitku servu
        sameSite: 'strict',

    }
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(cookieParser());

function isAuthenticated(req, res, next) {
    // check if the request has a valid session cookie and JWT
    if (req.session && req.cookies.jwt) {
        try {
            // verify the JWT
            const dec=jwt.verify(req.cookies.jwt, process.env.JWTS);
            if (req.user.id === dec.id) {
                // continue to the next middleware or route handler
                next();
            }
        } catch (err) {
            // JWT verification failed
            res.status(401).json({ error: "Unauthorized" });
        }
    } else {
        // session or JWT is missing
        res.status(401).json({
            error: "Unauthorized"
        });
    }
}

// Routes
//voi lisätä jwt tokeni homman
app.get("/api/auth/user", (req, res) => {


    
    if (req.user) {
        const userObj = {
            displayName: req.user.displayName,
            profilePic: req.user.photos[1].value,
            id: req.user.id,
            provider: req.user.provider,
            profileStatus: req.user._json.communityvisibilitystate,
        }

     

        res.status(200).json({
            success: true,
            message: "successfull",
            user: userObj,

        });
    } 
   
});

app.get('/api/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
    res.redirect('/')

});
app.get('/api/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
    
    const token = jwt.sign({
        id: req.user.id,
        displayName: req.user.displayName,
        provider: req.user.provider,
    }, process.env.JWTS, { expiresIn: '1d' });

  //secure:true sitku servu
    res.cookie("jwt", token, { httpOnly: true,  sameSite: 'strict', });

    const dbObject = {
        ip: req.socket.remoteAddress,
        id: req.user.id,

    }
    createUser(dbObject);
    res.redirect("http://localhost:3000");

  

});

app.post('/api/auth/logout', function (req, res, next) {
    res.clearCookie('jwt', { path: '/' });
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

app.post("/api/settings/setTradeUrl", isAuthenticated ,function (req, res) {


    const url = req.body.url
    updateUrl(req.user.id, url, (result, error) => {
        if (error) {
            res.status(200).json({ status: false });

        } else {
            res.status(200).json({ status: true});
        }
         
    });
});

app.get("/api/settings/getTradeUrl", isAuthenticated, function (req, res) {

    getTradeUrl(req.user.id, (result, error) => {
        if (error) {
            res.status(500).json({ body: "something went wrong" });
        } else if (result === null) {
            res.status(404).json({ body: "Käyttäjän url ei löydy" });
        } else {

            res.status(200).json({ body:result[0].userTradeUrl });
        }
    });

});

app.post("/api/settings/updateInvCall", isAuthenticated, function (req, res) {

    updateInvCall(req.user.id);


});


app.get("/api/settings/getInvRefresh",isAuthenticated,function (req, res) {

    getInvCall(req.user.id, (result, error) => {
        
        if (error) {
            res.status(500).json({ body: "something went wrong" });
        } else if (result === null) {
            res.status(404).json({ body: "Käyttäjän tietoja ei löydy" });
        } else {
            res.status(200).json({ body: result[0].invLastCall });
        }
    });

   

});




app.listen(port, () => {
    console.log('Listening, port ' + port);

});




