import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

    const alice = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            name: 'pedro',
            email: 'pedro@prisma.io',
            phone: '3224087129',
            role: 'USER',
            transactions: {
                create: [
                    {
                        amount: 1000,
                        concept: 'Salario',
                        type: 'INGRESO',
                    },
                    {
                        amount: 200,
                        concept: 'Compra de libros',
                        type: 'EGRESO',
                    },
                ],
            },
        },
    })

    const bob = await prisma.user.upsert({
        where: { email: 'bob@prisma.io' },
        update: {},
        create: {
            name: 'Bob',
            email: 'bob@prisma.io',
            phone: '3224087129',
            role: 'ADMIN',
            transactions: {
                create: [
                    {
                        amount: 5000,
                        concept: 'Venta de software',
                        type: 'INGRESO',
                    },
                    {
                        amount: 300,
                        concept: 'Pago de internet',
                        type: 'EGRESO',
                    },
                ],
            },
        },
    })

    console.log({ alice, bob })
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