import { Router } from "express";
import {
  createReceiptController,
  getReceiptsController,
  getReceiptByIdController,
} from "./receipt.controller";
import { extractReceiptController } from "./receipt_extract.controller";
import { upload } from "../../middleware/upload";

const router = Router();

router.post("/", createReceiptController);

router.post("/extract", upload.single("receipt"), extractReceiptController);

router.get("/", getReceiptsController);

router.get("/:id", getReceiptByIdController);

export default router;
