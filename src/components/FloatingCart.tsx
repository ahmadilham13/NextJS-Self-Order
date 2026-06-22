'use client'    // wajib agar UI ini bisa menghitung dan merender secara interaktif

import { useCart } from "@/context/CartContext"

export default function FloatingCart() {
    const { items, removeFromCart, subtotal } = useCart()

    // JIka keranjang kosong, sembunyikan komponen ini (jangan tampilkan apa-apa)
    if (items.length === 0) return null

    // Menghitung total porsi makanan yang dipesan
    const totalItems = items.reduce((total, item) => total + item.quantity, 0)

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-5">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* detail barang di keranjang */}
                <div className="flex-1 w-full overflow-hidden">
                    <div className="text-sm font-semibold text-gray-500 mb-2">
                        Pesanan Anda ({totalItems} porsi)
                    </div>

                    {/* Daftar Makanan */}
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        {items.map(item => (
                            <span key={item.id} className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium text-blue-900 whitespace-nowrap border border-blue-100">
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md font-bold text-xs">
                                    {item.quantity}x
                                </span>
                                {item.name}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-1 text-red-400 hover:text-red-600 font-bold text-lg leading-none transition-colors"
                                    title="Hapus Makanan">
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Total Harga & Tombol Lanjut */}
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                    <div className="text-left sm:text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Tagihan</div>
                        <div className="text-xl sm:text-2xl font-extrabold text-green-600">
                            Rp {subtotal.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all active:scale-95">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    )
}