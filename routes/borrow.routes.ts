import express from "express";

const router = express.Router();

import { createBorrow, getBorrows } from "../controllers/borrow.controller";

router.post("/", createBorrow);
router.get("/", getBorrows);

export default router;
