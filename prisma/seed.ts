import prisma from "../src/lib/prisma";

async function main() {
    console.log('Mulai melakukan seeding data...');

    await prisma.menu.deleteMany();

    // Memasukkan 3 menu sekaligus
    await prisma.menu.createMany({
        data: [
            {
                name: 'Nasi Goreng Spesial',
                description: 'Nasi goreng dengan telur, ayam suwir, dan kerupuk',
                price: 25000,
                imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80',
            },
            {
                name: 'Mie Goreng Seafood',
                description: 'Mie goreng dengan udang dan cumi segar',
                price: 30000,
                imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80',
            },
            {
                name: 'Es Teh Manis',
                description: 'Teh melati seduh segar dengan es batu',
                price: 5000,
                imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80',
            }
        ]
    });

    console.log('Seeding berhasil! 🍔');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})