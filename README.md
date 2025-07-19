# 🛒 E-Commerce Platform

A full-fledged E-commerce application built with **Next.js**, **TypeScript**, **Express.js**, and **Node.js**, offering a seamless shopping experience and secure payment integration via **Stripe**. Designed with a **microservices architecture** for scalability and maintainability.

---

## 🚀 Features

- 🌐 **Frontend**: Built using **Next.js** with **TypeScript** for robust, fast, and SEO-friendly UI.
- 🔧 **Backend**: RESTful API powered by **Express.js** and **Node.js**.
- 💳 **Stripe Integration**: Secure and reliable credit/debit card payment system.
- 📦 **Product Catalog**: Browse products by categories, view product details.
- 🛒 **Cart System**: Add, update, and remove items from the cart.
- 📬 **Order Tracking**: View order history and track payment status.
- 🧱 **Microservices Architecture**: Decoupled services for better scalability and deployment.

---

## 🛠️ Tech Stack

| Frontend     | Backend         | Payment | Architecture |
|--------------|-----------------|---------|--------------|
| Next.js      | Node.js         | Stripe  | Microservices |
| TypeScript   | Express.js      |         | REST APIs    |
| Tailwind CSS | MongoDB / MySQL |         | Docker-ready |

---

## 📦 Installation

### Prerequisites
- Node.js >= 16.x
- MongoDB or MySQL
- Stripe Account (for API keys)

### Clone the repository
```bash
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app


Project Structure

miteshpr97-e-com_microservices/
├── docker-compose.yml               # Main Docker orchestration file
├── README.md                        # Project overview

├── auth-service/                    # 🧑‍💻 Auth microservice (port: 5000)
│   ├── Dockerfile
│   ├── index.ts                     # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── config/
│   │   └── db.ts                    # DB connection for auth
│   ├── controllers/
│   │   └── authController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts        # JWT / access validation
│   ├── models/
│   │   └── User.ts
│   └── routes/
│       └── authRoutes.ts

├── product-service/                # 📦 Product microservice (port: 5001)
│   ├── Dockerfile
│   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   └── productController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── models/
│   │   └── Product.ts
│   ├── routes/
│   │   └── productRoutes.ts
│   └── utils/
│       ├── cloudinaryConfig.ts
│       └── multerConfiguration.ts

├── order-service/                  # 📦 Order microservice (port: 5002)
│   ├── Dockerfile
│   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   └── orderController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── models/
│   │   └── Order.ts
│   └── routes/
│       └── orderRoutes.ts

├── ecommerce/                      # 🖥️ Frontend (Next.js app on port: 3000)
│   ├── Dockerfile
│   ├── README.md
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── tailwind.config.ts
│   ├── next-env.d.ts
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── provider.tsx
│   │   │   ├── auth/login/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── productDetails/[id]/page.tsx
│   │   │   ├── ProductList/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── profile/[id]/page.tsx
│   │   │   └── viewcart/page.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── context/
│   │   │   └── UserContext.tsx
│   │   ├── dbConfig/
│   │   │   └── dbConfig.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   └── Order.ts
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── cartSlice.ts
│   │   │       └── productSlice.ts
│   │   └── utills/
│   │       ├── get-stripejs.ts
│   │       └── stripe-helpers.ts
│   └── middleware.ts


