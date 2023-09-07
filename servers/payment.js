'use strict'
const axios = require("axios");
const express = require('express');
const session = require('express-session');
const config = require('./config')

const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: "GET,POST",
    credentials: true,
  })
);

app.post("/payment/Identity", function (req, res) {
    // Extract data from the request body
    const requestData = {
        country_code: "SE",
        site_display_name: "localhost",
        ref: "merchant-transaction-ref",
        amount: "100.00",
        currency: "SEK",
        site: "localhost",
        success_url: "https://example.com/return_path/transaction_identifier",
        failure_url: "https://example.com/return_path/transaction_identifier",
        close_url: "https://example.com/return_path/transaction_identifier",
        user_ip: "123.456.78.90",

        bank_account: {
            type: "iban",
            account_number: "SE0000000000000000000000",
          },
           user_id: "f65191e4-3064-cc45-df68-8130e4a11197",

      };
      
  
    axios
      .post("https://api-sandbox.zimpler.net/v4/withdrawals", requestData)
      .then((response) => {
        // Handle the response from the API
        res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        // Handle any errors that occurred during the request
        res.status(500).send(error);
      });
  });
  
  app.listen(3005, () => {
    console.log('Server is running on port 3005');
  });