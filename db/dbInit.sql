CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
    account_no TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    balance INTEGER NOT NULL,
    last_sync timestamp,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (bank_name, account_no)
);

CREATE INDEX IF NOT EXISTS accounts_idx ON accounts (user_id);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    user_id INTEGER NOT NULL,
    bank_name TEXT NOT NULL,
    account_no TEXT NOT NULL,
    date date NOT NULL DEFAULT CURRENT_DATE,
    category_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    name TEXT NOT NULL,
    comment TEXT,
    debit_to TEXT,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_expenses_account FOREIGN KEY (bank_name, account_no) REFERENCES accounts(bank_name, account_no) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS expenses_idx ON expenses (user_id, date);

CREATE TABLE IF NOT EXISTS credits (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1),
    user_id INTEGER NOT NULL,
    bank_name TEXT NOT NULL,
    account_no TEXT NOT NULL,
    date date NOT NULL DEFAULT CURRENT_DATE,
    amount INTEGER NOT NULL,
    name TEXT NOT NULL,
    credit_from TEXT,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    CONSTRAINT fk_credits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_credits_account FOREIGN KEY (bank_name, account_no) REFERENCES accounts(bank_name, account_no) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS credits_idx ON credits (user_id, date);

CREATE TABLE IF NOT EXISTS alarms (
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    expense_limit INTEGER NOT NULL,
    limit_duration INTEGER NOT NULL,
    description TEXT,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    CONSTRAINT fk_alarms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_alarms_category FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, category_id)
);
