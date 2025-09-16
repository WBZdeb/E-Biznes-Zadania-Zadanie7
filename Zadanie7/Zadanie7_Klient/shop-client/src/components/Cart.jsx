import React, { useState } from 'react'
import { useCart, useCartDispatch } from '../state/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
    const items = useCart()
    const dispatch = useCartDispatch()
    const [serverResponse, setServerResponse] = useState(null)
    const navigate = useNavigate()

    function remove(productId) {
        dispatch({ type: 'REMOVE', productId })
    }

    function checkoutCart() {
        fetch('http://localhost:8080/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        })
            .then(res => res.json())
            .then(data => {
                setServerResponse(data)
                // Optional: przejdź do płatności
                navigate('/payments', { state: { amount: data.totalPrice } })
            })
            .catch(err => {
                console.error(err)
                setServerResponse({ message: 'Błąd wysyłki koszyka' })
            })
    }

    return (
        <div>
            <h2>Koszyk</h2>
            {items.length === 0 ? <div>Twój koszyk jest pusty</div> : (
                <div>
                    <ul>
                        {items.map(i => (
                            <li key={i.productId}>
                                Produkt ID {i.productId} — ilość: {i.quantity}
                                <button onClick={() => remove(i.productId)} style={{ marginLeft: 8 }}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={checkoutCart}>Wyślij koszyk na serwer / Przejdź do płatności</button>
                </div>
            )}
            {serverResponse && (
                <div style={{ marginTop: 12 }}>
                    <strong>Serwer:</strong> {serverResponse.message} — przedmiotów: {serverResponse.totalItems}, suma: {serverResponse.totalPrice}
                </div>
            )}
        </div>
    )
}
