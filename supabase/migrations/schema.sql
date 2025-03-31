-- Create tables with RLS (Row Level Security) enabled

-- Categories table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products table
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price decimal(10,2) not null,
  compare_at_price decimal(10,2),
  category_id uuid references categories(id),
  stock_quantity integer not null default 0,
  images text[] not null default array[]::text[],
  sizes text[] not null default array[]::text[],
  colors text[] not null default array[]::text[],
  is_featured boolean default false,
  is_published boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wishlists table
create table wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  status text not null default 'pending',
  total_amount decimal(10,2) not null,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  payment_status text not null default 'pending',
  payment_method text,
  shipping_method text,
  tracking_number text,
  notes text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order Items table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer not null,
  price decimal(10,2) not null,
  selected_size text,
  selected_color text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Staff table (for admin dashboard)
create table staff (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'staff',
  permissions text[] not null default array[]::text[],
  last_active timestamp with time zone,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity Logs table (for admin dashboard)
create table activity_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table wishlists enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table staff enable row level security;
alter table activity_logs enable row level security;

-- Create policies
-- Categories policies
create policy "Categories are viewable by everyone" on categories
  for select using (true);

create policy "Categories are editable by admin" on categories
  for all using (
    exists (
      select 1 from staff 
      where user_id = auth.uid() 
      and (role = 'admin' or 'manage_categories' = any(permissions))
    )
  );

-- Products policies
create policy "Products are viewable by everyone" on products
  for select using (is_published = true);

create policy "Products are editable by admin" on products
  for all using (
    exists (
      select 1 from staff 
      where user_id = auth.uid() 
      and (role = 'admin' or 'manage_products' = any(permissions))
    )
  );

-- Wishlists policies
create policy "Users can view their own wishlists" on wishlists
  for select using (auth.uid() = user_id);

create policy "Users can manage their own wishlists" on wishlists
  for all using (auth.uid() = user_id);

-- Orders policies
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Staff can view all orders" on orders
  for select using (
    exists (
      select 1 from staff 
      where user_id = auth.uid()
    )
  );

create policy "Staff can update orders" on orders
  for update using (
    exists (
      select 1 from staff 
      where user_id = auth.uid() 
      and (role = 'admin' or 'manage_orders' = any(permissions))
    )
  );

-- Order Items policies
create policy "Users can view their own order items" on order_items
  for select using (
    exists (
      select 1 from orders 
      where orders.id = order_items.order_id 
      and orders.user_id = auth.uid()
    )
  );

-- Staff policies
create policy "Only admins can manage staff" on staff
  for all using (
    exists (
      select 1 from staff 
      where user_id = auth.uid() 
      and role = 'admin'
    )
  );

-- Activity Logs policies
create policy "Staff can view activity logs" on activity_logs
  for select using (
    exists (
      select 1 from staff 
      where user_id = auth.uid()
    )
  );

-- Create functions and triggers
-- Update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_categories_updated_at
  before update on categories
  for each row
  execute function update_updated_at_column();

create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();

create trigger update_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

create trigger update_staff_updated_at
  before update on staff
  for each row
  execute function update_updated_at_column();

-- Create function to log activities
create or replace function log_activity()
returns trigger as $$
begin
  insert into activity_logs (user_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    case
      when tg_op = 'DELETE' then old.id
      else new.id
    end,
    case
      when tg_op = 'DELETE' then row_to_json(old)::jsonb
      else row_to_json(new)::jsonb
    end
  );
  return null;
end;
$$ language plpgsql;

-- Create activity log triggers
create trigger log_products_activity
  after insert or update or delete on products
  for each row
  execute function log_activity();

create trigger log_orders_activity
  after insert or update or delete on orders
  for each row
  execute function log_activity(); 