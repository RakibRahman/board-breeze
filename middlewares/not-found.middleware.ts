import { NextFunction,Request,Response } from "express";

export const notFoundHandler = (req:Request,res:Response,next:NextFunction)=>{
    const message = "API endpoint does not exist";
    res.status(404).json({ status: 404, message });
}