"use client";

import React, { useReducer } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

type CartAction =
  { type: 'ADD_ITEM'; payload: CartItem } |
  { type: 'REMOVE_ITEM', payload: CartItem }

type CartState = {
  items: CartItem[],
  total: number
}

// Define the initial state for the shopping cart
const initialState: CartState = {
  items: [
    { id: 123445, name: "Dove Conditioner", price: 34, quantity: 2 }],
  total: 0,
};

// Define the reducer function to handle actions
const cartReducer = (state: CartState, action: CartAction):CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if the item already exists in the cart
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        // If it exists, increase the quantity
        return {
          items: state.items.map(item => 
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
          total: state.total + action.payload.price,
        };
      } else {
        // If it doesn't exist, add it to the cart
        return {
          // ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price,
        };
      }

    case 'REMOVE_ITEM':
      // Find the item to remove
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      if (itemToRemove) {
        // If the item has a quantity greater than 1, decrease the quantity
        if (itemToRemove.quantity > 1) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
            total: state.total - action.payload.price,
          };
        } else {
          // If the item has a quantity of 1, remove it from the cart
          return {
            ...state,
            items: state.items.filter(item => item.id !== action.payload.id),
            total: state.total - action.payload.price,
          };
        }
      }
      return state;

    default:
      return state;
  }
};

function ShoppingCart() {
  // Use useReducer with the cartReducer and initial state
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addItemToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = (item: CartItem) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  return (
    <div className=''>
      <h1>Shopping Cart</h1>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.name} - Quantity: {item.quantity} - ${item.price} each
            <button onClick={() => addItemToCart(item)} className=''>Add</button>
            <button onClick={() => removeItemFromCart(item)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cart.total}</p>
    </div>
  );
}

export default ShoppingCart;
