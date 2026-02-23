import pool from "./db.js";
import { createReceiptsTable } from "../modules/receipts/receipt.repository.js";
import { createReceiptItemsTable } from "../modules/receipt_items/receipt_item.repository.js";

const initDatabase = async () => {
  try {
    console.log("Initializing database...");
    await pool.query("BEGIN");

    await pool.query(createReceiptsTable);
    console.log("✅ Receipts table created or already exists");

    await pool.query(createReceiptItemsTable);
    console.log("✅ Receipt items table created or already exists");

    await pool.query("COMMIT");
    console.log("Database initialization completed successfully 🚀");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Error initializing database:", error);
  }
};

export default initDatabase;
