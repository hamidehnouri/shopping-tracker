import { Router } from "express";
import {
  createReceiptController,
  getReceiptsController,
  getReceiptByIdController,
  deleteReceiptController,
} from "./receipt.controller";
import { scanReceiptController } from "./scan/receipt_scan.controller";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/", createReceiptController);

router.post("/scan", upload.single("receipt"), scanReceiptController);

router.get("/", getReceiptsController);

router.get("/:id", getReceiptByIdController);

router.delete("/:id", deleteReceiptController);

export default router;
