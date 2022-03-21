import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import "./Login.css"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { auth } from './firebase.js'

function Login() {

    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signIn = e => {
        e.preventDefault()

        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            history.push('/')
        })
        .catch(error => alert(error.message))
    }
    const register = e => {
        e.preventDefault()

        createUserWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            history.push('/')
        })
        .catch(error => alert(error.message))
    }

    return (
        <div className="login">
            <Link to="/">
                <img className="login__logo"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" alt="Amazon Logo"/>
             </Link>
            <div className="login__container">
                <h1>Sign-in</h1>

                <form>
                    <h5>E-mail</h5>  
                    <input type="email" value={email} onChange={e => (setEmail(e.target.value))}/>
                    
                    <h5>Password</h5>  
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>

                    <button className="login__signInButton" type="submit" onClick={signIn}>Sign-In</button>
                </form>

                <p> By signing-in you agree to Amazon Clone's Conditions 
                of Use & Sale. Please see our Privacy Notice, 
                our cookies Notice and our Interest-Based Ads</p>

                <button className="login__registerButton" onClick={register}>Create Your Amazon Account</button>
            </div>
        </div>
    )
}

export default Login
