const { Router } = require('express')
const router = Router();
const { User, Account } = require('../config/db')
const { authMiddleware } = require('../middlewares/userMiddleware')
const mongoose = require('mongoose');

function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}

router.get('/', (req, res) => {
    res.send("Working....")
})

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        res.status(200).json({ balance: account.balance });
    } catch (error) {
        handleServerError(res, error);
    }
})

router.post('/transfer', authMiddleware, async (req, res) => {
    try {
        const session = await mongoose.startSession();

        session.startTransaction();
        const { amount , to } = req.body;
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: "Transaction successful" })
    } catch (error) {
        handleServerError(res, error);
    }
})

module.exports = router;