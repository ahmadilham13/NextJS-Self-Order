import { getMyProfile } from "@/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

// Setiap halaman di dalam folder /admin akan secara otomatis dibungkus oleh Layout ini
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. Tembok Keamanan Pertama: Cek siapa yang datang
    const profile = await getMyProfile()

    // 2. Tembok Keamanan Kedua: Usir jika bukan ADMIN
    if (!profile || profile.role !== 'ADMIN') {
        redirect('/') // Usir kembali ke beranda
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-black">
            {/* Sidebar Admin (Kiri) */}
            <aside className="w-full md:w-64 bg-gray-900 text-white shadow-2xl flex flex-col">
                {/* Logo / Judul */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-black text-yellow-400">BACKOFFICE</h1>
                    <p className="text-gray-400 text-sm mt-1">Sistem Pengendali Utama</p>
                </div>

                {/* Navigasi Sidebar */}
                <nav className="p-4 flex-1 space-y-2">
                    <Link href="/admin" className="block px-4 py-3 rounded-xl hover:bg-gray-800 font-bold transition-colors">
                        📊 Dashboard
                    </Link>
                    <Link href="/admin/menu" className="block px-4 py-3 rounded-xl hover:bg-gray-800 font-bold transition-colors">
                        🍔 Manajemen Menu
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-3 rounded-xl hover:bg-gray-800 font-bold transition-colors">
                        👥 Manajemen Staf
                    </Link>
                    <Link href="/admin/audit" className="block px-4 py-3 rounded-xl hover:bg-gray-800 font-bold transition-colors">
                        🕵️ Audit Log
                    </Link>
                    <Link href="/admin/recon" className="block px-4 py-3 rounded-xl hover:bg-gray-800 font-bold transition-colors">
                        💰 Rekonsiliasi
                    </Link>
                </nav>

                {/* Profil Admin di Bawah Sidebar */}
                <div className="p-4 border-t border-gray-800">
                    <div className="bg-gray-800 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Login sebagai:</p>
                        <p className="font-bold text-yellow-400 truncate">{profile.name || profile.email}</p>
                        <Link href="/" className="mt-4 block text-center text-sm font-bold bg-gray-700 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors">
                            ← Kembali ke Toko
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Area Utama (Kanan) */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Ini adalah tempat di mana halaman-halaman admin akan ditampilkan */}
                {children}
            </main>
        </div>
    )
}
