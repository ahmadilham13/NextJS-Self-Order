'use server'

import prisma from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function markOrderAsCompleted(orderId: string, newStatus: OrderStatus) {
    try {
        // Mengubah status pesanan di database menjadi COMPLETED
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        })
        // Menyuruh Next.js untuk memperbarui layar dapur
        revalidatePath('/kitchen')
        
        return { success: true }
    } catch (error) {
        console.error("Gagal update status:", error)
        return { success: false }
    }
}