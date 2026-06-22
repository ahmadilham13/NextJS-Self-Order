'use client'

import { useState } from "react"
import { addMenu, deleteMenu, toggleMenuAvailability, updateMenu, uploadMenuImage } from "@/actions/admin-menu"

// Tipe data untuk properti yang dikirim dari Server Component
type Menu = {
    id: string
    name: string
    description: string | null
    price: number
    imageUrl: string | null
    isAvailable: boolean
}

export default function AdminMenuClient({ initialMenus }: { initialMenus: Menu[] }) {
    // State sederhana untuk memunculkan Form Tambah/Edit Menu
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState("")

    // Menyimpan data ketikan di form
    const [formData, setFormData] = useState({
        name: "", description: "", price: 0, imageUrl: ""
    })

    // Fungsi membuka form untuk Tambah
    const openAddForm = () => {
        setEditingMenu(null)
        setSelectedFile(null)
        setUploadProgress("")
        setFormData({ name: "", description: "", price: 0, imageUrl: "" })
        setIsFormOpen(true)
    }

    // Fungsi membuka form untuk Edit
    const openEditForm = (menu: Menu) => {
        setEditingMenu(menu)
        setSelectedFile(null)
        setUploadProgress("")
        setFormData({
            name: menu.name,
            description: menu.description || "",
            price: menu.price,
            imageUrl: menu.imageUrl || ""
        })
        setIsFormOpen(true)
    }

    // Fungsi eksekusi tombol Simpan
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        let finalImageUrl = formData.imageUrl

        // Jika Admin memilih file gambar dari komputernya, Upload dulu ke Supabase!
        if (selectedFile) {
            setUploadProgress("Mengunggah gambar ke Supabase...")
            const uploadData = new FormData()
            uploadData.append('file', selectedFile)

            const uploadResult = await uploadMenuImage(uploadData)
            if (!uploadResult.success) {
                alert(uploadResult.error)
                setIsLoading(false)
                setUploadProgress("")
                return // Hentikan proses simpan jika upload gagal
            }
            finalImageUrl = uploadResult.url as string // Timpa URL lama dengan URL asli dari Supabase
        }

        setUploadProgress("Menyimpan data ke database...")

        if (editingMenu) {
            // Panggil Server Action: Update
            await updateMenu(editingMenu.id, formData.name, formData.description, Number(formData.price), finalImageUrl)
        } else {
            // Panggil Server Action: Tambah
            await addMenu(formData.name, formData.description, Number(formData.price), finalImageUrl)
        }

        setIsFormOpen(false)
        setIsLoading(false)
        setUploadProgress("")
        setSelectedFile(null)
    }

    // Fungsi eksekusi tombol Hapus
    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Yakin ingin menghapus ${name} permanen?`)) {
            const res = await deleteMenu(id)
            if (!res.success) {
                alert(res.error) // Tampilkan pesan error ramah dari Server
            }
        }
    }

    // Fungsi eksekusi tombol Habis/Tersedia
    const handleToggleStock = async (id: string, currentStatus: boolean) => {
        await toggleMenuAvailability(id, !currentStatus)
    }

    return (
        <div>
            {/* Header & Tombol Tambah */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-gray-800">🍔 Manajemen Menu</h2>
                <button 
                    onClick={openAddForm}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                >
                    + Tambah Menu
                </button>
            </div>

            {/* Modal Form (Hanya Muncul Jika isFormOpen == true) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingMenu ? "Edit Menu" : "Tambah Menu Baru"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Nama Makanan</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-black focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Harga (Rp)</label>
                                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-black focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Pilih Gambar dari Komputer</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} 
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-black focus:border-blue-500 outline-none text-sm bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                                />
                                <div className="text-xs text-gray-400 mt-2 text-center">- ATAU -</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Tempel URL Gambar Eksternal</label>
                                <input type="url" disabled={selectedFile !== null} placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-black focus:border-blue-500 outline-none text-sm disabled:opacity-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-1">Deskripsi (Opsional)</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 text-black focus:border-blue-500 outline-none" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8 items-center">
                            <span className="text-sm font-bold text-blue-600 mr-auto">{uploadProgress}</span>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Batal</button>
                            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg">
                                {isLoading ? "Memproses..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel Daftar Menu */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4 font-bold">Nama Menu</th>
                            <th className="p-4 font-bold">Harga</th>
                            <th className="p-4 font-bold text-center">Status Stok</th>
                            <th className="p-4 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialMenus.map(menu => (
                            <tr key={menu.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-black">
                                <td className="p-4 flex items-center gap-4">
                                    {/* Thumbnail Gambar */}
                                    <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-200">
                                        {menu.imageUrl ? (
                                            <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 font-bold">No Img</div>
                                        )}
                                    </div>
                                    
                                    {/* Teks Nama & Deskripsi */}
                                    <div>
                                        <p className="font-bold text-lg">{menu.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2 max-w-[200px]">{menu.description}</p>
                                    </div>
                                </td>
                                <td className="p-4 font-mono font-bold text-yellow-600">
                                    Rp {menu.price.toLocaleString('id-ID')}
                                </td>
                                <td className="p-4 text-center">
                                    {/* Tombol Saklar Tersedia / Habis */}
                                    <button 
                                        onClick={() => handleToggleStock(menu.id, menu.isAvailable)}
                                        className={`px-4 py-1 rounded-full text-xs font-bold border transition-colors ${menu.isAvailable ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'}`}
                                    >
                                        {menu.isAvailable ? '✅ Tersedia' : '❌ Habis'}
                                    </button>
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button onClick={() => openEditForm(menu)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(menu.id, menu.name)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-bold transition-colors">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {initialMenus.length === 0 && (
                    <div className="p-8 text-center text-gray-500 font-bold">Belum ada menu yang didaftarkan.</div>
                )}
            </div>
        </div>
    )
}
