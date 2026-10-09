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
  provider_ref text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  paid_at      timestamptz
);