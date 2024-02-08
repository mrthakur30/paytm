const { Router } = require('express')
const router = Router();
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middlewares/authMiddleware')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


function handleServerError(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}

router.get('/', (req, res) => {
    res.send("Working....")
})

router.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body;


        if (!firstname || !lastname || !username || !password) {
            res.status(404).json({ message: "Missing Credentails" });
            return;
        }


        // const user = prisma.user.aggregate({
        //     where: {
        //         username: username
        //     }
        // })

        // console.log('====================================');
        // console.log(user);
        // console.log('====================================');

        // if (user) {
        //     res.status(404).json({ message: "username already exist" });
        //     return;
        // }

        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                firstName: firstname,
                lastName: lastname,
                password: encryptedPassword
            },
        })

        const userId = newUser.id;

        await prisma.account.create({
            data: {
                user_id: userId,
                balance: 1 + parseInt(Math.random() * 10000)
            }
        })

        const token = jwt.sign({
            userId
        }, process.env.JWT_KEY);
        
        res.status(200).json({
            message: "User created successfully",
            token: token
        })
    } catch (error) {
        handleServerError(res, error);
    }
})

router.post('/check-username', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            username: username
        }
    });

    res.json({ available: !existingUser });
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing Credentials" });
        }

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({ message: "Username doesn't exist" });
        }

        const isValidated = await bcrypt.compare(password, user.password);

        if (!isValidated) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, { expiresIn: '1h' });

        res.status(200).json({ token: token });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.get('/bulk', authMiddleware, async (req, res) => {
    try {
        const data = await prisma.user.findMany({
            where: {},
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                password: false
            }
        })

        res.status(200).json({ data });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.put('/', authMiddleware, async (req, res) => {
    try {

        const { firstname, lastname, password } = req.body;

        if (!firstname || !lastname || !password) {
            return res.status(400).json({ message: "Missing Credentials" });
        }

        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const result = await prisma.updateOne({
            where: {
                id: req.userId
            },
            data: {
                firstName: firstname,
                lastName: lastname,
                password: encryptedPassword
            }
        })

        console.log(result);

        if (result.modifiedCount === 1) {
            res.json({ message: "User Updated" });
        } else {
            res.json({ message: "User not found" });
        }
    } catch (error) {
        handleServerError(res, error);
    }
});

module.exports = router;