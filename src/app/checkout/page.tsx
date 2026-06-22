'use client'

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { createOrder } from "@/actions/order"

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart()
    const [isSubmitting, SetIsSubmitting] = useState(false)
    const router = useRouter()
    // State untuk menyimpan nama yang diketik pelanggan
    const [customerName, setCustomerName] = useState("")

    // Jika iseng buka /checkout tapi keranjang kosong, paksa kembali
    if (items.length === 0) {
        return (
        <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Keranjang Kosong! 😱</h1>
            <button 
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
                disabled={isSubmitting} // Tambahkan ini agar tombol tidak bisa ditekan lagi
            >
            Kembali ke Menu
            </button>
        </main>
        )
    }

    // Fungsi yang dijalankan saat tombol "Konfirmasi Pesanan" ditekan
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // Mencegah halaman refresh bawaan HTML
        
        // Validasi sederhana
        if (customerName.trim().length < 3) {
        alert("Nama pemesan minimal 3 huruf ya agar mudah dipanggil!")
        return
        }
        
        SetIsSubmitting(true)
        // 1. Susun data sesuai format yang diminta fungsi createoder
        const orderData = {
            customerName,
            totalAmount: subtotal,
            items: items.map(item => ({
                menuId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        }

        // 2. Panggil Server Action! (ajaibnya ini langsung mengeksekusi fungsi backendnya)
        const result = await createOrder(orderData)

        SetIsSubmitting(false)

        // 3. Tangani hasil responsenya
        if (result.success) {
            alert("Yeay! Pesanan berhasil masuk ke dapur! 🍳")
            clearCart()
            router.push('/')
        } else {
            alert(result.error)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8 pb-32">
            <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-100 pb-4">
                    Review Pesanan 📝
                </h1>
                
                {/* Ringkasan Pesanan */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Daftar Menu</h2>
                    <div className="space-y-4">
                        {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                                <p className="text-sm text-gray-500 font-medium">
                                    {item.quantity} porsi &times; Rp {item.price.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="font-extrabold text-gray-700 text-lg">
                                Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                            </div>
                        </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-gray-200">
                        <h3 className="text-xl font-bold text-gray-500">Total Pembayaran</h3>
                        <h3 className="text-3xl font-black text-green-600">Rp {subtotal.toLocaleString('id-ID')}</h3>
                    </div>
                </div>
                {/* Form Data Pelanggan */}
                <form onSubmit={handleSubmit} className="bg-blue-50 p-6 md:p-8 rounded-2xl border border-blue-100">
                    <h2 className="text-xl font-bold mb-4 text-blue-900">Data Pemesan</h2>
                    <div className="mb-2">
                        <label className="block text-sm font-bold text-blue-800 mb-2">
                            Siapa nama Anda?
                        </label>
                        <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Contoh: Budi, Siti..."
                            className="w-full px-5 py-4 rounded-xl border-2 text-gray-600 border-blue-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-lg font-medium"
                            required
                        />
                    </div>
                
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button 
                            type="button"
                            onClick={() => router.push('/')}
                            className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 flex-1 transition-colors"
                        >
                            Tambah Menu Lain
                        </button>
                        <button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-black shadow-lg shadow-green-200 flex-[2] transition-all active:scale-95 text-lg"
                        >
                            Konfirmasi Pesanan
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}