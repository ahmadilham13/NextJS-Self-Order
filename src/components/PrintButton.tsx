'use client'

export default function PrintButton() {
    return (
        <button 
            onClick={() => window.print()} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-transform active:scale-95 flex items-center gap-2"
        >
            🖨️ Cetak Bon (PDF)
        </button>
    )
}
