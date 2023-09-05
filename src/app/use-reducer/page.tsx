"use client";
import React, { useReducer, useState } from 'react'

type TAction =
  { type: "ADD_ITEM", payload: TItem } |
  { type: "REMOVE_ITEM", payload: TItem } |
  { type: "CREATE_ITEM", payload: TItem }

type TItem = {
  id: number,
  name: string,
  quantity: number,
  price: number
}

type TCart = {
  items: TItem[],
  total: number
}

const reducerFn = (state: TCart, action: TAction): TCart => {

  const existingItem = state.items.find((item) => action.payload.id === item.id);
  switch (action.type) {
    case "ADD_ITEM":

      if (existingItem) {
        return {
          items: state.items.map((item) => {
            return action.payload.id === item.id ? { ...item, quantity: Number(item.quantity) + 1 } : item
          }),
          total: state.total + action.payload.price
        }
      } else {
        return {
          items: [...state.items, { ...action.payload }],
          total: state.total + action.payload.price
        }
      }

    case 'REMOVE_ITEM':
      if (existingItem) {
        if (existingItem.quantity > 1) {
          return {
            items: state.items.map((item) => {
              return item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
            }),
            total: state.total - action.payload.price
          }
        } else {
          return {
            items: state.items.filter((item) => {
              return item.id !== action.payload.id
            }),
            total: state.total - action.payload.price
          }
        }
      } else {
        throw new Error("Something went wrong, Item does not exist")
      }

    case 'CREATE_ITEM':
      if (existingItem) {
        throw new Error("Item already exist increase or Decrease the quantity")
      } else {
        return {
          items: [...state.items, {...action.payload}],
          total: state.total + Number(action.payload.price)
        }
      }

    default:
      return {
        ...state
      }
  }
}

const initialState: TCart = {
  items: [{ id: 128736, name: "Clinic Plus", price: 80, quantity: 1 }],
  total: 80
}

function UseReducer() {
  const [item, setItem] = useState({
    id: Number(Date.now()),
    name: "",
    quantity: 0,
    price: 0
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setItem((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_ITEM', payload: item })

  }

  const [cart, dispatch] = useReducer(reducerFn, initialState);

  const addItemToCart = (item: TItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItemFromCart = (item: TItem) => {
    dispatch({ type: "REMOVE_ITEM", payload: item })
  }

  return (
    <React.Fragment>
      <h1>Shopping Cart</h1>
      <ul className=''>
        {cart.items.map((item) => (
          <li key={item.id} className='flex gap-3'>
            {item.name} - Quantity: {item.quantity} - ${item.price} each
            <button onClick={() => addItemToCart(item)} className='bg-red-400 px-3 py-1 rounded-md'>Add</button>
            <button onClick={() => removeItemFromCart(item)} className='bg-red-400 px-3 py-1 rounded-md'>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${cart.total}</p>

      <form action="" className='flex gap-2 mt-3'>

        <input type="text" value={item.name} placeholder='Enter Product Name' name="name" className='px-1 text-gray-800 rounded-sm' id="" onChange={handleChange} />

        <input type="number" value={item.quantity} placeholder='Enter Quantity' name="quantity" id="" className='px-1 rounded-sm text-gray-800' onChange={handleChange} />

        <input type="number" value={item.price} placeholder='Enter Price' name="price" id="" className='px-1 rounded-sm text-gray-800' onChange={handleChange} />

        <button type="submit" className='bg-red-400 px-3 py-1 rounded-md' onClick={onSubmit}>Submit</button>
      </form>
    </React.Fragment>
  )
}


export default UseReducer;