export const createReceiptItemsTable = `
  CREATE TABLE IF NOT EXISTS receipt_items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES receipts(id) ON DELETE CASCADE,
    item_index INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 3) DEFAULT 1,
    unit_price NUMERIC(10, 2),
    total_price NUMERIC(10, 2) NOT NULL,
    vat_class TEXT,
    raw_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  )
`;
