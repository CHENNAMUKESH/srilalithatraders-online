-- SRI LALITHA TRADERS - Supabase setup
-- Run this in Supabase Dashboard -> SQL Editor.

create table if not exists products (
  id bigint primary key,
  name text not null,
  category text not null,
  price numeric not null default 0,
  stock integer not null default 0,
  image text
);

create table if not exists delivery_locations (
  name text primary key,
  charge numeric not null default 0
);

create table if not exists orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  address text,
  delivery_location text,
  payment_method text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  delivery_charge numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'Order Placed',
  current_location jsonb,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security.
alter table products enable row level security;
alter table delivery_locations enable row level security;
alter table orders enable row level security;

-- Public customers can read products and delivery locations.
create policy "public read products" on products
for select using (true);

create policy "public read delivery locations" on delivery_locations
for select using (true);

-- Customers can create orders.
create policy "public create orders" on orders
for insert with check (true);

-- IMPORTANT:
-- Do NOT create public update/delete policies for products or orders in production.
-- The next secure step is Supabase Authentication for the owner dashboard.
