const { Router } = require('express')
const { User, Account } = require('../config/db')
const router = Router();
const jwt = require('jsonwebtoken');
const zod = require('zod')
const { authMiddleware } = require('../middlewares/userMiddleware')
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        }

        const user = await User.findOne({ username: username });

        if (user) {
            res.status(404).json({ message: "username already exist" });
        }

        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username: username,
            firstName: firstname,
            lastName: lastname,
            password: encryptedPassword
        })

        await newUser.save();

        const userId = newUser._id;

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        const token = jwt.sign({
            userId
        }, process.env.JWT_KEY);

        res.json({
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

    const existingUser = await User.findOne({ username });
    res.json({ available: !existingUser });
});

router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing Credentials" });
        }

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "Username doesn't exist" });
        }

        const isValidated = await bcrypt.compare(password, user.password);

        if (!isValidated) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign({userId : user._id}, process.env.JWT_KEY, { expiresIn: '1h' });
        user.token = token;
        await user.save();

        res.status(200).json({ token: user.token });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.get('/bulk', authMiddleware, async (req, res) => {
    try {
        const data = await User.find({},{password: 0});
        res.status(200).json({ data });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.put('/', authMiddleware, async (req, res) => {
    try{
        
        const { firstname, lastname, password } = req.body;

        if (!firstname || !lastname || !password) {
            return res.status(400).json({ message: "Missing Credentials" });
        }

        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        
        const result = await User.updateOne({ _id: req.userId }, { $set: { firstName : firstname, lastName : lastname, password: encryptedPassword }  })
        
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