'use client' // Wajib ditambahkan agar Next.js tahu ini adalah Client Component yang berjalan di browser
import { createContext, useContext, useState, ReactNode } from "react"


// 1. Mendefinisikan struktur data 1 barang di keranjang
export type CartItem = {
    id: string
    name: string
    price: number
    quantity: number    // Jumlah pesanan (contoh: pesan 2 Nasing Goreng)
}

// 2. Mendefinisikan semua fungsi yang dimiliki keranjang
type CartContextType = {
    items: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'>) => void // Kita modifikasi sedikit agar default quantity = 1
    removeFromCart: (id: string) => void // Fungsi untuk menghapus barang dari keranjang
    subtotal: number // Total harga dari semua barang di keranjang
    clearCart: () => void
}

// 3. Membuat React Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// 4. Membuat Provider (Bungkus utama yang menyimpan data asli)
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Fungsi menambah item
    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems((prevItems) => {
            // Cek apakah item sudah ada di keranjang sebelumnya
            const existingItem = prevItems.find(item => item.id === newItem.id)

            if (existingItem) {
                // Jika sudah ada, cukup tambahkan quantity-nya +1
                return prevItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1  }
                        : item
                )
            }

            // Jika belum ada, masukkan sebagai barang baru dengan quantity 1
            return [...prevItems, { ...newItem, quantity: 1 }]
        })
    }

    // Fungsi menhapus item
    const removeFromCart = (id: string) => {
        setItems((prevItems) => prevItems.filter(item => item.id !== id))
    }

    // Menghitung total harga secara otomatis (harga * jumlah)
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    // Fungsi untuk mengosongkan keranjang
    const clearCart = () => setItems([])

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, subtotal, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

// 5. Membuat Custom Hook agar mudah dipanggil di file lain
export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart harus digunakan di dalam CartProvider')
    }
    return context
}