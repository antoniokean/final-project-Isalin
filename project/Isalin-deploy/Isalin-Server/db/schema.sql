CREATE TABLE IF NOT EXISTS conversions (
  id SERIAL PRIMARY KEY,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  direction VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);