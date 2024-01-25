const { Router } = require('express')
const router = Router();
const userRouter = require("../routes/user");
const accountRouter = require("../routes/account");

function handleServerError(res, error) {
    console.error(error);
}

router.get('/', (req, res) => {
    res.send("Working....")
})

router.use('/user',userRouter);
router.use('/account',accountRouter);

module.exports = router ;