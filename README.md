<div align="center">

# 🛍️ LokaMart

**A modern online marketplace for buyers and independent sellers.**

Built with Next.js and Firebase as the final project of the Frontend Engineer Bootcamp.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%2B_Firestore-FFCA28?logo=firebase&logoColor=black)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

</div>

---

## ✨ About

LokaMart is a shopping platform with two kinds of accounts:

- **Customers** browse products, add them to a cart, purchase, and review their order history.
- **Sellers** manage their own catalogue: add products, search and filter them, and remove the ones they no longer sell.

Each role has its own dashboard, and every page is protected so users only see what belongs to their role.

## 🚀 Features

| Area                   | What it does                                                                                | Status         |
| ---------------------- | ------------------------------------------------------------------------------------------- | -------------- |
| **Register**           | Sign up as a customer or seller, with form validation and automatic login                   | ✅ Done        |
| **Login**              | Email and password login, redirect by role, "Keep me signed in"                             | ✅ Done        |
| **Forgot password**    | Password reset by email                                                                     | ✅ Done        |
| **Route protection**   | Customer-only and seller-only pages                                                         | ✅ Done        |
| **Seller dashboard**   | Add products, filter by category, search by name, pagination, bulk delete with confirmation | 🚧 In progress |
| **Customer dashboard** | 10 recommended products and the full product list                                           | 🚧 In progress |
| **Product detail**     | Image, price, stock, description, and add to cart with stock check                          | 🚧 In progress |
| **Cart**               | Update quantities, remove items, highlight items with insufficient stock, purchase          | 🚧 In progress |
| **Order history**      | Past orders grouped by order ID with line totals and order totals                           | 🚧 In progress |

## 🧰 Tech Stack

| Layer          | Technology                                                                         |
| -------------- | ---------------------------------------------------------------------------------- |
| Framework      | [Next.js](https://nextjs.org/) (App Router)                                        |
| UI             | [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)             |
| Authentication | [Firebase Authentication](https://firebase.google.com/docs/auth)                   |
| Database       | [Cloud Firestore](https://firebase.google.com/docs/firestore)                      |
| Testing        | [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) |
| Deployment     | [Vercel](https://vercel.com/)                                                      |

## 🏁 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Alifarya31/lokamart.git
cd lokamart
npm install
```

### 2. Add environment variables

Create a file named `.env.local` in the project root and fill in the values from your Firebase project (Project settings → Your apps):

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

In the Firebase console, enable **Email/Password** sign-in and create a **Firestore** database.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm run start` | Run the production build     |
| `npm test`      | Run the Jest unit tests      |
| `npm run lint`  | Check the code with ESLint   |

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (auth)/        # /login, /register, /forgot-password
│   ├── (customer)/    # customer-only pages
│   └── (seller)/      # seller-only pages
├── components/        # shared UI: Button, Input, Modal, ProductCard, Header, Logo, Icon
├── contexts/          # AuthContext (current user and role)
├── constants/         # product categories, default images
└── lib/               # Firebase setup, validation, formatRupiah, routes
```

## 🗃️ Data Model

| Collection                      | Purpose                                                             |
| ------------------------------- | ------------------------------------------------------------------- |
| `users/{uid}`                   | Email and role (`customer` or `seller`)                             |
| `products/{productId}`          | Seller's products: name, price, stock, category, description, image |
| `carts/{uid}/items/{productId}` | Items in a customer's cart                                          |
| `orders/{orderId}`              | Completed purchases with a copy of each purchased item              |

Prices are stored as plain numbers and displayed in Indonesian Rupiah.

## 🧪 Testing

Every acceptance criterion is covered by a Jest unit test.

```bash
npm test
```

## 👥 Team

| Name                          | GitHub                                       |
| ----------------------------- | -------------------------------------------- |
| **Alif Arya Ramadhan**        | [@Alifarya31](https://github.com/Alifarya31) |
| **Muhammad Evran Khadafi**    |                                              |
| **Nisa' Ulya Afinatus Salam** |                                              |

---

<div align="center">

Made with 💚 for the Frontend Engineer Bootcamp

</div>
