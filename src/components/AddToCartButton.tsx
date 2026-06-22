'use client'    // komponen ini harus dirender di browser agar bisa diklik

import { useCart } from "@/context/CartContext"

// Data yang dibutuhkan tomobol ini saat dipanggil
type Props = {
    menuId: string
    name: string
    price: number
}

export default function AddToCartButton({ menuId, name, price }: Props) {
    // Mengambil fungsi addToCart dari mesin keranjang
    const { addToCart } = useCart()

    return (
        <button
            onClick={() => {
                addToCart({ id: menuId, name, price })
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex justify-center items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Tambah ke Pesanan
        </button>
    )
}