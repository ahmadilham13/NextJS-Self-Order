'use server' // Wajib! Ini menandakan kode ini berjalan secara aman di server

import prisma from "@/lib/prisma"

// Tipe data yang dibutuhkan oleh fungsi ini
type CreateOrderInput = {
    customerName: string
    totalAmount: number
    items: {
        menuId: string
        quantity: number
        price: number
    }[]
}

// Ini adalah Server Actionnya!
export async function createOrder(data: CreateOrderInput) {
    try {
        // Kehebatan Prisma: "Nested Create".
        // Kita bisa memasukkan data ke tabel Order dan tabel orderItem sekaligsu secara otomatis!
        const order = await prisma.order.create({
            data: {
                customerName: data.customerName,
                totalAmount: data.totalAmount,
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