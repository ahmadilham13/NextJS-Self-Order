'use server'

import prisma from "@/lib/prisma"
import { getMyProfile } from "./auth"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// Fungsi Helper Rahasia: Memastikan hanya ADMIN yang bisa menjalankan perintah di bawah ini
async function requireAdmin() {
    const profile = await getMyProfile()
    if (!profile || profile.role !== 'ADMIN') {
        throw new Error("Akses Ditolak: Anda bukan Admin!")
    }
    return profile
}

// Fungsi Helper Rahasia: Mencatat setiap kejadian ke buku catatan (Audit Log)
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
// 1. TAMBAH MENU BARU
// ----------------------------------------------------
export async function addMenu(name: string, description: string | null, price: number, imageUrl: string | null) {
    const admin = await requireAdmin()

    const newMenu = await prisma.menu.create({
        data: { name, description, price, imageUrl, isAvailable: true }
    })

    await logAudit(admin.id, "CREATE_MENU", `Menambahkan menu baru: ${name} (Rp ${price})`)
    
    revalidatePath('/admin/menu')
    revalidatePath('/')
    return { success: true, menu: newMenu }
}

// ----------------------------------------------------
// 2. UBAH STATUS KETERSEDIAAN (Tersedia / Habis)
// ----------------------------------------------------
export async function toggleMenuAvailability(menuId: string, isAvailable: boolean) {
    const admin = await requireAdmin()

    const updatedMenu = await prisma.menu.update({
        where: { id: menuId },
        data: { isAvailable }
    })

    const statusText = isAvailable ? "Tersedia" : "Habis"
    await logAudit(admin.id, "UPDATE_MENU_STOCK", `Mengubah status ${updatedMenu.name} menjadi ${statusText}`)

    revalidatePath('/admin/menu')
    revalidatePath('/')
    return { success: true }
}

// ----------------------------------------------------
// 3. EDIT HARGA & DATA MENU
// ----------------------------------------------------
export async function updateMenu(menuId: string, name: string, description: string | null, price: number, imageUrl: string | null) {
    const admin = await requireAdmin()

    const updatedMenu = await prisma.menu.update({
        where: { id: menuId },
        data: { name, description, price, imageUrl }
    })

    await logAudit(admin.id, "UPDATE_MENU_DATA", `Mengedit menu: ${updatedMenu.name}`)

    revalidatePath('/admin/menu')
    revalidatePath('/')
    return { success: true }
}

// ----------------------------------------------------
// 4. HAPUS MENU
// ----------------------------------------------------
export async function deleteMenu(menuId: string) {
    const admin = await requireAdmin()

    const menu = await prisma.menu.findUnique({ where: { id: menuId } })
    if (!menu) return { success: false, error: "Menu tidak ditemukan" }

    try {
        await prisma.menu.delete({
            where: { id: menuId }
        })

        await logAudit(admin.id, "DELETE_MENU", `Menghapus menu: ${menu.name}`)

        revalidatePath('/admin/menu')
        revalidatePath('/')
        return { success: true }
    } catch (error: any) {
        // P2003 adalah kode error Prisma untuk Foreign Key Constraint Violation
        if (error.code === 'P2003') {
            return { success: false, error: "⛔ GAGAL: Menu ini tidak bisa dihapus karena sudah pernah dipesan oleh pelanggan. Menghapusnya akan merusak riwayat Struk/Bon lama. Solusi: Ubah statusnya menjadi 'Habis'." }
        }
        return { success: false, error: "Terjadi kesalahan saat menghapus menu." }
    }
}

// ----------------------------------------------------
// 5. UPLOAD GAMBAR KE SUPABASE STORAGE
// ----------------------------------------------------
export async function uploadMenuImage(formData: FormData) {
    const admin = await requireAdmin()
    
    const file = formData.get('file') as File
    if (!file) return { success: false, error: "File gambar tidak ditemukan" }

    const supabase = await createClient()
    
    // Bikin nama file unik: timestamp_namafileAsli (tanpa spasi)
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`

    // 1. Upload ke Storage
    const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(uniqueFileName, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) {
        return { success: false, error: `Gagal upload gambar: ${error.message}. (PENTING: Pastikan kamu sudah membuat "Storage Policy" di Supabase yang mengizinkan operasi INSERT/Upload ke bucket ini!)` }
    }

    // 2. Dapatkan link (URL) Publik dari gambar tersebut
    const { data: publicUrlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(uniqueFileName)

    return { success: true, url: publicUrlData.publicUrl }
}
