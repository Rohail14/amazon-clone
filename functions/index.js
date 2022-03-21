const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")
const stripe = require("stripe")('sk_test_51JoqLPSIj5qdUsXeK7Jb95j0ODlePkyTiqJifL70wJUYRQYiP9a99502cKYmzMbz5HOMx5vyz9c7PDy0bNCdV23b00t9KrOoMS')


const app = express();

app.use(cors({origin:true}));
app.use(express.json());

app.get('/', (req,res) => res.status(200).send('hello world'))
app.post('/payments/create', async (req, res) => {
    const total = req.query.total;

    console.log('Payment Request Recieved for this amount >>>', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
    });

    res.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})
exports.api = functions.https.onRequest(app);