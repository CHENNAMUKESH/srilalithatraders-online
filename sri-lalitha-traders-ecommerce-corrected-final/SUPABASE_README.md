# Connect this website to Supabase

## 1. Create a Supabase project
Create a free project at Supabase.

## 2. Create the database tables
Open **SQL Editor** in Supabase and run the complete file:
`SUPABASE_SETUP.sql`

## 3. Add your project details
Open:
`supabase-config.js`

Paste:
- Project URL
- anon/public key

Do NOT paste the `service_role` key into the website.

## 4. Publish the website
You can publish the files on GitHub Pages.

## What becomes shared online?
After configuration:
- Products
- Delivery locations
- Orders

The same Supabase database can be used by customers and the owner dashboard.

## Security note
This package is a connection-ready upgrade. For a real production shop, the next step should be replacing the current local owner login with Supabase Authentication and protected database policies.
