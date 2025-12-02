# 🛍️ M-Commerce Microservices Platform

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-orange?style=for-the-badge)

> A scalable, distributed e-commerce platform built using a Microservices architecture. It features a decoupled React frontend styled with Tailwind CSS and independent backend services for Products, Orders, and Payments.

---

## 📑 Table of Contents
* [Architecture Overview](#-architecture-overview)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Screenshots](#-screenshots)
* [Contact](#-contact)

---

## 🏗️ Architecture Overview

This project moves away from the traditional monolithic approach. It implements a **Microservices Architecture** where business domains are separated into distinct, independently deployable services.

The system consists of:
1.  **Client UI:** A responsive Single Page Application (SPA) built with React.
2.  **Product Service:** Manages inventory and product details.
3.  **Order Service:** Handles cart management and order processing.
4.  **Payment Service:** Simulates transaction processing.

---

## ✨ Key Features

* **🎨 Modern UI/UX:** Built with **React 18** and styled rapidly with **Tailwind CSS**.
* **🔗 API Integration:** The frontend communicates with backend microservices via RESTful APIs (located in the `services/` directory).
* **📦 Modular Backend:** Independent services for `Produits` (Products), `Commandes` (Orders), and `Paiement` (Payments).
* **📱 Fully Responsive:** Optimized for mobile and desktop using Tailwind's utility classes.
* **⚡ Performance:** Optimized build size and component rendering.

---

## 🛠 Technology Stack

### Frontend (`client-ui-react`)
* **Framework:** React.js
* **Styling:** Tailwind CSS & PostCSS
* **HTTP Client:** Axios / Fetch API
* **Testing:** React Testing Library

### Backend (Microservices)
* **Framework:** Spring Boot (Java)
* **Build Tool:** Maven/Gradle
* **Database:** H2 / MySQL / PostgreSQL (Configurable per service)

---

## 📂 Project Structure

The repository is organized into a frontend client and distinct backend microservices:

```text
MCOMMERCE/
├── client-ui-react/           # Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI (Navbar, Cards)
│   │   ├── services/          # API Service calls to Microservices
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js     # Tailwind CSS Configuration
│   └── package.json
│
├── microservice-commandes/    # Backend: Orders Management
├── microservice-paiement/     # Backend: Payment Processing
└── microservice-produits/     # Backend: Product Catalog
🚀 Getting Started
To run the full stack locally, you need to start the backend services first, then the frontend.

1. Start the Microservices
Navigate to each microservice folder and run the application (assuming Spring Boot):

Bash

# Terminal 1 - Products
cd microservice-produits
./mvnw spring-boot:run

# Terminal 2 - Orders
cd microservice-commandes
./mvnw spring-boot:run

# Terminal 3 - Payments
cd microservice-paiement
./mvnw spring-boot:run
2. Start the Frontend
Bash

# Terminal 4 - React Client
cd client-ui-react

# Install dependencies (first time only)
npm install

# Run the UI
npm start
The application will launch at http://localhost:3000.



Create your Feature Branch (git checkout -b feature/NewFeature).

Commit your changes (git commit -m 'Add NewFeature').

Push to the branch (git push origin feature/NewFeature).

Open a Pull Request.

📧 Contact
[ADAM]

GitHub: github.com/adamboudali1

LinkedIn: linkedin.com/in/adam boudali

Email: adamboudali1@gmail.com
<p align="center">Made with ❤️ using React</p>
