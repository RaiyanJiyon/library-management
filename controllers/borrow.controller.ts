import Borrow from "../models/Borrow";
import { Request, Response } from "express";


export const createBorrow = async (req: Request, res: Response) => {
  try {
    const newBorrow = await Borrow.create(req.body);
    res.status(201).json(newBorrow);
  } catch (error) {
    res.status(400).json({ message: "Error creating borrow record", error });
  }
}

export const getBorrows = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find();
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrow records", error });
  }
};
