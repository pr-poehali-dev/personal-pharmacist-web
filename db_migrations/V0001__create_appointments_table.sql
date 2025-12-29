CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    appointment_date VARCHAR(100) NOT NULL,
    question TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);