import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import { AddCartType } from './types/AddCartType'



type CartState = {
isOpen: boolean,
cart: AddCartType[],
toggleCart: () => void
addProduct: (item: AddCartType) => void
removeProduct: (item: AddCartType) => void

}

// create<CartState>() initializes a Zustand store with the initial state defined by CartState
export const useCartStore = create<CartState>()(
	// persist is used to persist the state of the store across page reloads or browser sessions. It takes a configuration object as the second argument. In this case, { name: "cart-store" } specifies the name of the store for persistence.
	persist(
		//Set function is used to update the state of the store.
		(set) => ({
			cart: [],
			isOpen: false,
			toggleCart: () => set((state) => ({isOpen: !state.isOpen})),

			//addProduct is a function that adds a product to the cart. If the product already exists in the cart, its quantity is incremented. Otherwise, a new item is added to the cart with a quantity of 1.
			addProduct: (item) => set((state) => {
				const exisitingItem = state.cart.find(
					(data) => data.id === item.id
				)
				if(exisitingItem){
					const updatedCart = state.cart.map((data) => {
						if (data.id === item.id){
							return { ...data, quantity: data.quantity! + 1 }
						}
						return data
					})
					return { cart: updatedCart}
				} else {
					return {cart: [...state.cart,  {...item, quantity:1}]}
				}
			}),
			removeProduct: (item) =>
			set((state) => {
			  //Check if the item exists and remove quantity - 1
				const existingItem = state.cart.find(
					(cartItem) => cartItem.id === item.id
				)
				if (existingItem && existingItem.quantity! > 1) {
					const updatedCart = state.cart.map((cartItem) => {
						if (cartItem.id === item.id) {
							return { ...cartItem, quantity: cartItem.quantity! - 1 }
						}
						return cartItem
					})
					return { cart: updatedCart }
				} else {
					//Remove item from cart
					const filteredCart = state.cart.filter(
						(cartItem) => cartItem.id !== item.id
					)
					return { cart: filteredCart }
			  	}
			}),
		}),
		{ name: "cart-store" }
	)
)