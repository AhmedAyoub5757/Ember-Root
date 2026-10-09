CREATE TABLE IF NOT EXISTS contact_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  topic        text NOT NULL DEFAULT 'General',
  message      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

CREATE TABLE IF NOT EXISTS batch_subscribers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text UNIQUE NOT NULL,
  flavors      jsonb NOT NULL DEFAULT '[]'::jsonb,
  batch_no     integer,
  source       text NOT NULL DEFAULT 'batch_form',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batch_subscribers_email ON batch_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_batch_subscribers_created_at ON batch_subscribers (created_at DESC);
