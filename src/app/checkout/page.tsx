'use client'

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"
import { createOrder } from "@/actions/order"
import { useEffect } from "react"
import { getMyProfile } from "@/actions/auth"

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart()
    const [isSubmitting, SetIsSubmitting] = useState(false)
    const router = useRouter()
    const [customerName, setCustomerName] = useState("")
    const [isMember, setIsMember] = useState(false) // <--- STATE BARU UNTUK DISKON

    // Rumus Matematika Diskon (10% untuk Member)
    const discount = isMember ? Math.floor(subtotal * 0.1) : 0
    const finalTotal = subtotal - discount

    useEffect(() => {
        async function fetchProfile() {
            const profile = await getMyProfile()
            if (profile && profile.name) {
                setCustomerName(profile.name) // Isi otomatis! 
                setIsMember(true) // <--- TANDAI SEBAGAI MEMBER
            }
        }
        fetchProfile()

        // 🚨 SUNTIKAN SCRIPT MIDTRANS
        const snapScript = process.env.NEXT_PUBLIC_SNAP_URL as string
        const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY || ""

        const script = document.createElement("script")
        script.src = snapScript
        script.setAttribute("data-client-key", clientKey)
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)   // Bersihkan script saat pindah halaman
        }
    }, [])

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
        // 2. Kirim data ke Backend Server Action
        const result = await createOrder({
            customerName: customerName,
            totalAmount: finalTotal, // <--- GUNAKAN HARGA SETELAH DISKON
            discount: discount, // <--- INI DIA! MENGIRIM NOMINAL DISKON KE DATABASE
            items: items.map(item => ({
                menuId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        })

        SetIsSubmitting(false)

        // 3. Tangani hasil responsenya dan tampilkan Pop-up kasir midtrans jika berhasil
        if (result.success && result.token) {
            // @ts-expect-error (abaikan error TS karena 'snap' disuntik dari luar)
            window.snap.pay(result.token, {
                onSuccess: function() {
                    alert("Pembayaran Berhasil! Makananmu segera dimasak.")

                    clearCart()
                    router.push('/')
                },
                onPending: function() {
                    alert("Menunggu pembayaran... Silakan selesaikan di ATM/Aplikasi.")
                },
                onError: function() {
                    alert("Pembayaran gagal, Silakan coba lagi.")
                },
                onClose: function() {
                    alert("Kamu menutup layar kasir sebelum menyelesaikan pembayaran")
                }
            })
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
                    
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-gray-500">Subtotal</h3>
                            <h3 className="text-lg font-bold text-gray-500">Rp {subtotal.toLocaleString('id-ID')}</h3>
                        </div>
                        
                        {isMember && (
                            <div className="flex justify-between items-center mb-4 text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span>🌟</span> Diskon Member (10%)
                                </h3>
                                <h3 className="font-black">- Rp {discount.toLocaleString('id-ID')}</h3>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">Total Pembayaran</h3>
                            <h3 className="text-3xl font-black text-blue-600">Rp {finalTotal.toLocaleString('id-ID')}</h3>
                        </div>
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