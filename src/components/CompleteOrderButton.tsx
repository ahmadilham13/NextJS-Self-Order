'use client'

import { useState } from "react"
import { markOrderAsCompleted } from "@/actions/kitchen"
import { OrderStatus } from "@prisma/client"

export default function CompleteOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
    const [isLoading, setIsLoading] = useState(false)

    // Logika Pintar: Tentukan Tujuan Status & Warna berdasarkan status saat ini
    let buttonText = ""
    let nextStatus: OrderStatus | null = null
    let colorClass = ""

    if (currentStatus === 'PENDING') {
        buttonText = "Mulai Masak"
        nextStatus = 'COOKING'
        colorClass = 'bg-yellow-600 hover:bg-yellow-500'
    } else if (currentStatus === 'COOKING') {
        buttonText = "Pesanan Selesai"
        nextStatus = 'READY'
        colorClass = 'bg-yellow-600 hover:bg-yellow-500'
    } else if (currentStatus === 'READY') {
        buttonText = "Pesanan Diambil"
        nextStatus = 'COMPLETED'
        colorClass = 'bg-green-600 hover:bg-green-500'
    } else {
        return null // Jika COMPLETED, tombol disembunyikan
    }

    const handleClick = async () => {
        if (!nextStatus) return
        setIsLoading(true)
        await markOrderAsCompleted(orderId, nextStatus)
        setIsLoading(false)     // Kembalikan ke false karena sekarang kita main filter
    }
    return (
        <button 
            onClick={handleClick}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl font-black transition-all shadow-md active:scale-95 text-white ${
                isLoading 
                ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                : colorClass
            }`}
        >
            {isLoading ? 'Memproses...' : buttonText}
        </button>
    )
}