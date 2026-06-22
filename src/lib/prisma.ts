import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";


// 1. Mengambil koneksi pooler dari .env
const connectionString = process.env.DATABASE_URL;

// 2. Menginisialisasi koneksi pool dan adapter PostgreSQL
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Fungsi utama untuk membuat jembatan (Prisma CLient)
const prismaCLientSingleton = () => {
    return new PrismaClient({ adapter });
};

// 4. Meniympan koneksi ke memori global untuk mencegak koneksi berlipat ganda
declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaCLientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaCLientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;