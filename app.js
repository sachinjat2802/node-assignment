import express from 'express';
const app = express();
import cors from "cors";
import {connected} from './sql/connection.js';
import{ router} from './auth/router.js';

// set up port
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use("/",router);


// const router = require('./routes/router.js');
app.get('/ping', (req,res)=>{
    res.send({
        "msg":"working"
    })
});
// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));