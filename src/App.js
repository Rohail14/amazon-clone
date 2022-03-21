import React, { useEffect } from 'react';
import './App.css';
import Header from "./Header.js"
import Home from "./Home.js"
import Checkout from './Checkout';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Login from './Login';
import {auth} from "./firebase";
import {onAuthStateChanged} from "firebase/auth"
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js"
import Orders from './Orders';

const promise = loadStripe("pk_test_51JoqLPSIj5qdUsXeunt9DvcIEuq8hzGCS3ZG3uW4gzpkNgLooSADfAnK08WnfF3UdgPePuOpCxDmfAjE3rfNwFcN00Rl0T1zdl")

function App() {
    
    const [,dispatch] = useStateValue();
    
    useEffect(() => {
        onAuthStateChanged(auth, (authUser) =>{
            console.log("THE USER IS >>>", authUser);

            if(authUser){
                dispatch({
                    type:"SET_USER",
                    user: authUser,
                })

            } else {
                dispatch({
                    type:"SET_USER",
                    user: null,
                })
            }
        })
    },[])
 return(
 <Router>
    <div className="App">
        <Switch>
            <Route path="/orders"> 
                <Header />
                <Orders/>
            </Route>
            <Route path="/login">
                <Login/>
            </Route>
            <Route path="/checkout">
                <Header />
                <Checkout/>
            </Route>
            <Route path="/payment">
                <Header />
                <Elements stripe={promise}>
                    <Payment/>
                </Elements>
            </Route>
            <Route path="/">
                <Header />
                <Home />
                </Route>
            
        </Switch>
    </div> 
 </Router>)
}

export default App;
