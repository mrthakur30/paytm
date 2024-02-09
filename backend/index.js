const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()
const rootRouter = require("./routes/root");
require('dotenv').config()

app.use(cors({origin : 'https://main--frolicking-dolphin-f0f06c.netlify.app'}))
const PORT = process.env.PORT || 8080 ;

app.use(bodyParser.json());
app.use(express.json());

app.use("/api/v1",rootRouter);

app.listen(PORT,()=>{
   console.log("Listening on port",PORT);
})
