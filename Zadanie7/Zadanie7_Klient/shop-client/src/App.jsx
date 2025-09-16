import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Products from './components/Products'
import Cart from './components/Cart'
import Payments from './components/Payments'
import { CartProvider } from './state/CartContext'

export default function App() {
    return (
        <CartProvider>
            <div style={{ padding: 20 }}>
                <header style={{ marginBottom: 20 }}>
                    <Link to="/" style={{ marginRight: 10 }}>Produkty</Link>
                    <Link to="/cart" style={{ marginRight: 10 }}>Koszyk</Link>
                    <Link to="/payments">Płatności</Link>
                </header>

                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payments" element={<Payments />} />
                </Routes>
            </div>
        </CartProvider>
    )
}
