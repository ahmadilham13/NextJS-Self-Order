import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function UserHeader() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

    // Jika belum login, tampilkan tombol login
    if (!data.user) {
        return (
        <div className="flex justify-end p-6 border-b border-gray-800">
            <Link href="/auth" className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-full font-black shadow-lg transition-transform active:scale-95">
            Masuk / Daftar
            </Link>
        </div>
        )
    }

    // Jika sudah login, cari namanya dari database Prisma kita
    const user = await prisma.user.findUnique({
        where: { id: data.user.id }
    })

    // Server Action untuk Logout
    const handleLogout = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/')
    }

    return (
        <div className="flex justify-end items-center p-6 border-b border-gray-800 gap-6">
            <div className="text-right">
                <p className="text-gray-400 text-sm">Selamat datang kembali,</p>
                <p className="text-white font-black text-xl">{user?.name || data.user.email} 👋</p>
            </div>
            
            <form action={handleLogout}>
                <button className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2 rounded-full font-bold border border-red-500 transition-colors shadow-md active:scale-95">
                Keluar
                </button>
            </form>
        </div>
    )

}