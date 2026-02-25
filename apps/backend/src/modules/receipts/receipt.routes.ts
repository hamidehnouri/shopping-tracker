import { Router } from "express";
import { createReceiptController } from "./receipt.controller";
import { extractReceiptController } from "./receipt_extract.controller";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/", createReceiptController);

router.post("/extract", upload.single("receipt"), extractReceiptController);

export default router;
