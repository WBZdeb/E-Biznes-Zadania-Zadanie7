import React, { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const CartStateContext = createContext()
const CartDispatchContext = createContext()

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            // jeśli produkt już w koszyku, zwiększ ilość
            const exists = state.find(i => i.productId === action.item.productId)
            if (exists) {
                return state.map(i =>
                    i.productId === action.item.productId ? {...i, quantity: i.quantity + action.item.quantity} : i
                )
            }
            return [...state, action.item]
        }
        case 'REMOVE':
            return state.filter(i => i.productId !== action.productId)
        case 'UPDATE':
            return state.map(i => i.productId === action.item.productId ? { ...i, quantity: action.item.quantity } : i)
        case 'CLEAR':
            return []
        default:
            throw new Error('Unknown action: ' + action.type)
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, [])
    return (
        <CartStateContext.Provider value={state}>
            <CartDispatchContext.Provider value={dispatch}>
                {children}
            </CartDispatchContext.Provider>
        </CartStateContext.Provider>
    )
}

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export function useCart() {
    return useContext(CartStateContext)
}

export function useCartDispatch() {
    return useContext(CartDispatchContext)
}
