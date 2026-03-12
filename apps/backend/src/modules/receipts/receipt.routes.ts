import { Router } from "express";
import {
  createReceiptController,
  getReceiptsController,
  getReceiptByIdController,
  deleteReceiptController,
} from "./receipt.controller";
import { extractReceiptController } from "./extract/receipt_extract.controller";
import { categorizeReceiptController } from "./classify/receipt_classify.controller";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/", createReceiptController);

router.post("/extract", upload.single("receipt"), extractReceiptController);

router.post("/:id/categorize", categorizeReceiptController);

router.get("/", getReceiptsController);

router.get("/:id", getReceiptByIdController);

router.delete("/:id", deleteReceiptController);

export default router;
