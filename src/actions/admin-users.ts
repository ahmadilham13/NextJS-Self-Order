'use server'

import prisma from "@/lib/prisma"
import { getMyProfile } from "./auth"
import { revalidatePath } from "next/cache"

// Fungsi Helper: Cek apakah pemanggil adalah ADMIN
async function requireAdmin() {
    const profile = await getMyProfile()
    if (!profile || profile.role !== 'ADMIN') {
        throw new Error("Akses Ditolak: Anda bukan Admin!")
    }
    return profile
}

// Fungsi Helper: Catat Log
async function logAudit(adminId: string, action: string, details: string) {
    await prisma.auditLog.create({
        data: {
            userId: adminId,
            action: action,
            details: details
        }
    })
}

// ----------------------------------------------------
// 1. UBAH ROLE (PANGKAT) PENGGUNA
// ----------------------------------------------------
export async function updateUserRole(targetUserId: string, newRole: 'ADMIN' | 'KITCHEN' | 'CUSTOMER') {
    const admin = await requireAdmin()

    // Cari tahu nama target user yang diubah
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (!targetUser) return { success: false, error: "Pengguna tidak ditemukan" }

    // Cegah admin mengubah jabatannya sendiri untuk menghindari hilangnya akses admin secara tidak sengaja
    if (admin.id === targetUserId) {
        return { success: false, error: "Kamu tidak bisa mengubah role-mu sendiri." }
    }

    // Lakukan Update ke Database
    await prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole }
    })

    // Catat ke log
    await logAudit(
        admin.id, 
        "CHANGE_ROLE", 
        `Mengubah jabatan ${targetUser.name || targetUser.email} dari ${targetUser.role} menjadi ${newRole}`
    )

    revalidatePath('/admin/users')
    return { success: true }
}
