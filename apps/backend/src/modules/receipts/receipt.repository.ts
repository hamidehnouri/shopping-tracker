export const createReceiptsTable = `
  CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    store_name TEXT,
    purchased_at TIMESTAMP,
    total_amount NUMERIC(12, 2),
    currency CHAR(3) DEFAULT 'EUR',
    raw_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  )
`;
