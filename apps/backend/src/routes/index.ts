import { Router } from "express";
import receiptRoutes from "../modules/receipts/receipt.routes";

const router = Router();

router.use("/receipts", receiptRoutes);

export default router;
