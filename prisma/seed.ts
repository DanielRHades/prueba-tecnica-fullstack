import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    const daniel = await prisma.user.upsert({
        where: { email: 'daniel@gmail.com' },
        update: {},
        create: {
            name: 'Daniel Rodriguez',
            email: 'daniel@gmail.com',
            phone: '3224087129',
            role: 'USER',
            transactions: {
                create: [
                    {
                        amount: 6000,
                        concept: 'Prueba Tecnica',
                        type: 'INCOME',
                    },
                    {
                        amount: 1000,
                        concept: 'Compra de libros',
                        type: 'EXPENSE',
                    },
                ],
            },
        },
    })

    const bob = await prisma.user.upsert({
        where: { email: 'bob@gmail.com' },
        update: {},
        create: {
            name: 'Bob Vance',
            email: 'bob@gmail.com',
            phone: '3224087129',
            role: 'ADMIN',
            transactions: {
                create: [
                    {
                        amount: 5000,
                        concept: 'Venta de software',
                        type: 'INCOME',
                    },
                    {
                        amount: 1000,
                        concept: 'Pago de internet',
                        type: 'EXPENSE',
                    },
                ],
            },
        },
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })