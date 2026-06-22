import Image from "next/image";
import prisma from "@/lib/prisma"
import AddToCartButton from "@/components/AddToCartButton"

export default async function Home() {

  const menus = await prisma.menu.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  return (
    <main className="min-h-screen bg=slate-50 pb-32">
      {/* Hero Section / Spanduk Atas */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16 px-8 rounded-b-[3rem] shadow-lg mb-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            Pesan Menu Favoritmu! 🍔
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Pilih hidangan lezat kami, tambahkan ke keranjang dan pesananmu akan langsung disiapkan di dapur tanpa perlu antre.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Judul Bagian */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-300">Daftar Menu Spesial</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            {menus.length} Menu Tersedia
          </span>
        </div>

        {/* Grid Kartu Makanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {menus.map((menu) => (
            <div key={menu.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
              {/* Gambar Menu (Dengan efek zoom) */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                {menu.imageUrl ? (
                  <img 
                    src={menu.imageUrl}
                    alt={menu.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No Image
                  </div>
                )}
                {/* Lencana Harga Melayang */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-extrabold px-3 py-1 rounded-full shadow-sm text-sm">
                  Rp {menu.price.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Detail Menu */}
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {menu.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-3 grow">
                  {menu.description}
                </p>

                {/* Tombol Tambah di bagian paling bawah kartu */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <AddToCartButton
                    menuId={menu.id}
                    name={menu.name}
                    price={menu.price}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
