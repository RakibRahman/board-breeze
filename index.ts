import dotenv from 'dotenv';
import express,{ Express,Request,Response } from 'express';
import cors from "cors";
dotenv.config();

const app:Express = express();


const PORT = process.env.PORT;

if(!PORT){
    throw new Error('Missing env variables');
}

app.use(express.json());
app.use(cors({
  credentials: true
}));



app.get('/',(req:Request,res:Response)=>{
    res.send('Server is ready')
})


app.listen(PORT, () => {
    console.log(`listening the app from port:${PORT}`);
  });
  