const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()
const rootRouter = require("./routes/root");
require('dotenv').config()

app.use(cors())
const PORT = process.env.PORT || 8080;

app.all('*', function (req, res) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
});

app.use(bodyParser.json());
app.use(express.json());



app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
   console.log("Listening on port", PORT);
})
