import Image from "next/image";
import prisma from "@/lib/prisma"

export default async function Home() {

  const menus = await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          Self-Order Menu 🍔
        </h1>

        {/* Grid untuk menampilkan kartu-kartu makanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Gambar menu */}
              {menu.imageUrl && (
                <img 
                  src={menu.imageUrl}
                  alt={menu.name}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Detail Menu */}
              <div className="p-05">
                <h2 className="text-xl font-bold text-gray-800">{menu.name}</h2>
                <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-2">
                  {menu.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-extrabold text-green-600">
                    Rp {menu.price.toLocaleString('id-ID')}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
