import React, { useEffect, useState } from 'react'
import { useCartDispatch } from '../state/CartContext'

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const dispatch = useCartDispatch()

    useEffect(() => {
        fetch('http://localhost:8080/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => {
                console.error('Failed to load products', err)
                setProducts([])
            })
            .finally(() => setLoading(false))
    }, [])

    function addToCart(product) {
        dispatch({ type: 'ADD', item: { productId: product.id, quantity: 1 } })
    }

    if (loading) return <div>Ładowanie produktów...</div>

    return (
        <div>
            <h2>Produkty</h2>
            <ul>
                {products.map(p => (
                    <li key={p.id} style={{ marginBottom: 10 }}>
                        <strong>{p.name}</strong> — {p.price.toFixed(2)} zł
                        <button onClick={() => addToCart(p)} style={{ marginLeft: 10 }}>Dodaj do koszyka</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
