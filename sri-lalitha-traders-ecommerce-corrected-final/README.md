# SRI LALITHA TRADERS – E-Commerce Website

A bilingual (English + Telugu) Amazon-style starter website for:
- Pumps & Motors
- PVC
- HDPE
- CPVC
- SWR
- Wires

## Features
- Product catalogue and categories
- Search and category filters
- Cart
- UPI / COD checkout flow
- Delivery or store pickup
- Location availability and editable delivery charges
- English / Telugu UI switch
- Owner login and admin dashboard
- Owner can change username and password from Dashboard → Settings
- Add/Edit/Delete products
- Manage supported locations and delivery charges
- Orders stored locally for demonstration
- Editable owner WhatsApp notification number
- New order notification prepared for the owner
- Customer WhatsApp notification when an order is Confirmed or Picked Up
- Customer current GPS location sharing for delivery orders

## Run
1. Extract the ZIP.
2. Open `index.html` in a browser.

## Owner demo login
Username: `owner`
Password: `lalitha123`

## Owner credentials
The initial demo login is `owner` / `lalitha123`.
After login, go to **Owner Dashboard → Settings** to change the username and password.

**Important:** This is a browser/localStorage demo. For real public deployment, replace demo login and localStorage with a secure backend/database and real payment gateway.


## WhatsApp Notifications
1. Login as the owner.
2. Open **Settings**.
3. Enter the owner's WhatsApp number with country code (example: `919876543210`).
4. When a customer places an order, WhatsApp opens with the complete order message for the owner.
5. When the owner changes an order status to **Confirmed** or **Picked Up**, WhatsApp opens with a customer notification message.

Note: This browser version opens WhatsApp with the prepared message. Fully automatic background WhatsApp sending requires a WhatsApp Business/API integration and a backend server.


## Customer Current Location
For home delivery, the customer can tap **Get My Current Location** during checkout and allow browser location permission. The website stores the latitude/longitude as a Google Maps link and includes that link in the owner's WhatsApp order message. The owner can also open the customer's shared location from the Orders dashboard.

The customer must explicitly allow location access; the website cannot access location without permission.
