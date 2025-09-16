import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCartDispatch } from '../state/CartContext'

export default function Payments() {
    const [name, setName] = useState('')
    const [card, setCard] = useState('')
    const [message, setMessage] = useState(null)
    const location = useLocation()
    const amountFromCart = location.state?.amount ?? 0
    const dispatch = useCartDispatch()

    function pay() {
        const payload = { name, cardNumber: card, amount: amountFromCart }
        fetch('http://localhost:8080/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.succeeded) {
                    setMessage(`Płatność zakończona sukcesem, id: ${data.paymentId}`)
                    // wyczyść koszyk po udanej płatności
                    dispatch({ type: 'CLEAR' })
                } else {
                    setMessage('Płatność nieudana')
                }
            })
            .catch(err => {
                console.error(err)
                setMessage('Błąd serwera przy płatności')
            })
    }

    return (
        <div>
            <h2>Płatności</h2>
            <div>Do zapłaty: {amountFromCart?.toFixed?.(2) ?? amountFromCart} zł</div>
            <div style={{ marginTop: 10 }}>
                <div>
                    <label>Imię i nazwisko: <input value={name} onChange={e => setName(e.target.value)} /></label>
                </div>
                <div style={{ marginTop: 6 }}>
                    <label>Numer karty: <input value={card} onChange={e => setCard(e.target.value)} /></label>
                </div>
                <div style={{ marginTop: 10 }}>
                    <button onClick={pay}>Zapłać</button>
                </div>
            </div>
            {message && <div style={{ marginTop: 10 }}>{message}</div>}
        </div>
    )
}
