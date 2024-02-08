const { Router } = require('express')
const router = Router();
const { authMiddleware } = require('../middlewares/authMiddleware')
const { Prisma, PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}

router.get('/', (req, res) => {
    res.send("Working....")
})

router.get('/user', authMiddleware, async (req, res) => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                user_id: req.userId
            }
        })
        res.status(200).json({ account : account });
    } catch (error) {
        handleServerError(res, error);
    }
})

router.post('/transfer', authMiddleware, async (req, res) => {
    try {

        const { amount, to } = req.body;

        const fromAccount = await prisma.account.findFirst({
            where: {
                user_id: req.userId
            }
        })

        if (fromAccount.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await prisma.account.findFirst({
            where: {
                user_id: to
            }
        })

        console.log('====================================');
        console.log(fromAccount.id+"to" +toAccount.id + amount );
        console.log('====================================');

        if (!toAccount) {
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await prisma.$transaction([
            prisma.account.update({
                where: {
                    id: fromAccount.id
                },
                data: {
                    balance: {
                        decrement: parseInt(amount)
                    }
                }
            }),
            prisma.account.update({
                where: {
                    id: toAccount.id
                },
                data: {
                    balance: {
                        increment: parseInt(amount)
                    }
                }
            })
        ],
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            })

        res.status(200).json({ message: "Transaction successful" })
    } catch (error) {
        handleServerError(res, error);
    }
})

module.exports = router;