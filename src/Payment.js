import { CardElement,PaymentElement,useElements, useStripe } from '@stripe/react-stripe-js';
import axios from './axios';
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format';
import { Link,useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import "./Payment.css"
import { getCartTotal } from './reducer';
import { useStateValue } from './StateProvider'
import { db } from './firebase';



function Payment() {

    const [{cart,user}, dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements = useElements();

    const[error, setError] = useState(null);
    const[disabled, setDisabled] = useState(true);

    const[processing,setProcessing] = useState("");
    const[succeeded, setSucceeded] = useState(false);
    const[clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        
        const getClientSecret = async () => {
            const response = await axios({
                method:'post',
                url: `/payments/create?total=${getCartTotal(cart)*100}`
            });
            setClientSecret(response.data.clientSecret);
        }
        getClientSecret();
    
    },[cart])

    console.log("The Secret is >>>", clientSecret)

    const handleSubmit= async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then((result) => {
            
            console.log(result)
            const paymentinfo = result.error.payment_intent
            const rawAmount = paymentinfo.amount/100;

            db.collection("users").doc(user?.email).collection("orders").doc(paymentinfo.id).set({
                cart:cart,
                amount:rawAmount,
                created:paymentinfo.created
            });
    
         
            
            setSucceeded(true);
            setError(null);
            setProcessing(false);

            history.replace('/orders')

            dispatch({
                type:"EMPTY_CART"
            })
        })
    }

    const handleChange= event => {

        setDisabled(event.empty);
        setError(event.error ? event.error.message : "")
    }
    
    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (
                        <Link to="/checkout">{cart?.length} {cart.length === 1 ?"Item":"Items"}</Link>
                        )
                </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>React Corner</p>
                        <p>Dev City, Matrix</p>
                    </div>
                </div>
                <div className="payment__section">
                     <div className="payment__title">
                        <h3>Review Items and Delivery</h3>
                    </div>
                    <div className="payment__items">
                        {cart.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (

                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getCartTotal(cart)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing? <p>Processing</p>:"Buy Now"}</span>
                                </button>
                            </div>
                                {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Payment
