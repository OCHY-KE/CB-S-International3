create table donations (
  id bigint generated always as identity primary key,
  phone text not null,
  amount numeric not null,
  status text default 'pending',
  checkout_request_id text,
  result_desc text,
  created_at timestamp default now()
);
