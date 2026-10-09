CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  name          text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  member_no     serial UNIQUE NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS auth_attempts (
  key text NOT NULL,
  at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_attempts_key_at ON auth_attempts (key, at);

CREATE SEQUENCE IF NOT EXISTS order_no_seq START 4472;

CREATE TABLE IF NOT EXISTS orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  no           integer UNIQUE NOT NULL DEFAULT nextval('order_no_seq'),
  token        text NOT NULL,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','cod','paid','failed','cancelled')),
  method       text NOT NULL,
  currency     text NOT NULL DEFAULT 'PKR',
  sub          integer NOT NULL,
  ship         integer NOT NULL,
  fee          integer NOT NULL,
  total        integer NOT NULL,
  contact      jsonb NOT NULL,
  ship_to      jsonb NOT NULL,
  note         text,
  items        jsonb NOT NULL,
  charge_currency text,
  charge_amount integer,
  user_id      uuid REFERENCES users(id) ON DELETE SET NULL,
  provider_ref text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  paid_at      timestamptz
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'customer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS charge_currency text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS charge_amount integer;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id) ON DELETE SET NULL;

UPDATE users
SET role = 'admin'
WHERE lower(email) = lower('ahmed42.dev@gmail.com');