'use server' // Wajib! Ini menandakan kode ini berjalan secara aman di server

import prisma from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"

// Tipe data yang dibutuhkan oleh fungsi ini
type CreateOrderInput = {
    customerName: string
    totalAmount: number
    discount?: number // <--- BOLEH KOSONG (KARENA TAMU TIDAK DAPAT DISKON)
    items: {
        menuId: string
        quantity: number
        price: number
    }[]
}

// Ini adalah Server Actionnya!
export async function createOrder(data: CreateOrderInput) {
    try {
        // cek apakah yang memesan memiliki sesi login yang aktif
        const supabase = await createClient()
        const { data: authData } = await supabase.auth.getUser()

        // Jika login, kita tangkap ID-nya, Jika tidak (tamu), biarkan null
        const loggedInUserId = authData.user ? authData.user.id : null

        // Kehebatan Prisma: "Nested Create".
        // Kita bisa memasukkan data ke tabel Order dan tabel orderItem sekaligsu secara otomatis!
        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                totalAmount: data.totalAmount,
                discount: data.discount || 0, // <--- SIMPAN DISKON KE DATABASE
                userId: loggedInUserId,
                // (status tidak perlu diisi karena otomatis 'PENDING' dari skema database nya)
                items: {
                    create: data.items.map(item => ({
                        menuId: item.menuId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })

        // Jika berhasil, kembalikan sinyal sukses
        return { success: true, order }
    } catch (error) {
        console.error("Gagal membuat pesanan: ", error)
        return { success: false, error: "Waduh, terjadi kesalahan saat memproses pesanan." }
    }
}