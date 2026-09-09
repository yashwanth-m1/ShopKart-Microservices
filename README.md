# 🛒 ShopKart – E-Commerce Microservices Application

ShopKart is a full-stack e-commerce application built using **React, Node.js, Express.js, MongoDB, Redis, and AWS**.

The project follows a **microservices architecture**, where different business functionalities such as authentication, products, cart, and orders are separated into independent services.

The application is deployed on AWS and is accessible through CloudFront.

---

## 🌐 Live Demo

**Live Application:**
https://d1hx5n7bh53loe.cloudfront.net

**API Endpoint:**
https://d2o8lzgxvs6ck1.cloudfront.net

**Health Check:**
https://d2o8lzgxvs6ck1.cloudfront.net/health

---

## 📂 Source Code

**GitHub Repository:**
https://github.com/yashwanth-m1/ShopKart-Microservices.git

---

# 📌 Project Overview

ShopKart is designed to simulate a real-world e-commerce platform.

Users can:

* Register and log in
* Browse available products
* View product details
* Add products to the shopping cart
* Update product quantities
* Remove products from the cart
* Clear the cart
* Proceed to checkout
* Place orders
* View order information

Administrators can:

* Add products
* Update products
* Delete products
* View orders
* Manage order-related information

The backend is divided into multiple microservices to make the application modular, maintainable, and scalable.

---

# 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      USER        │
                         └────────┬─────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ React + Vite        │
                       │ Frontend            │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Amazon CloudFront   │
                       │ Frontend CDN        │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Amazon S3           │
                       │ Frontend Hosting    │
                       └─────────────────────┘


                       API REQUESTS
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Amazon CloudFront   │
                  │ API Distribution    │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Application Load    │
                  │ Balancer (ALB)      │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ AWS EC2             │
                  │ Ubuntu Server       │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ API Gateway         │
                  │ Node.js / Express   │
                  └──────────┬──────────┘
                             │
            ┌────────────────┼─────────────────┐
            │                │                 │
            ▼                ▼                 ▼
     ┌────────────┐   ┌────────────┐   ┌────────────┐
     │ User       │   │ Product    │   │ Cart       │
     │ Service    │   │ Service    │   │ Service    │
     └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
           │                │                 │
           ▼                ▼                 ▼
       MongoDB          MongoDB             Redis


                         ┌────────────┐
                         │ Order      │
                         │ Service    │
                         └─────┬──────┘
                               │
                         ┌─────▼──────┐
                         │ MongoDB    │
                         └────────────┘
                               │
                               ▼
                         ┌────────────┐
                         │ AWS SQS    │
                         └─────┬──────┘
                               │
                               ▼
                         ┌────────────┐
                         │ SQS Worker │
                         └────────────┘
```

---

# ☁️ AWS Deployment Architecture

The application is deployed using multiple AWS services.

### Frontend

```text
React Application
       │
       ▼
npm run build
       │
       ▼
dist/
       │
       ▼
Amazon S3
       │
       ▼
CloudFront
       │
       ▼
Live Website
```

### Backend

```text
Frontend
   │
   ▼
CloudFront
   │
   ▼
Application Load Balancer
   │
   ▼
EC2
   │
   ▼
API Gateway
   │
   ├── User Service
   ├── Product Service
   ├── Cart Service
   └── Order Service
```

---

# 🧩 Microservices

## 1. User Service

The User Service is responsible for authentication and user management.

### Responsibilities

* User registration
* User login
* Password validation
* JWT generation
* User profile
* Authentication middleware

### Main Technology

* Node.js
* Express.js
* MongoDB
* JSON Web Token (JWT)

---

## 2. Product Service

The Product Service manages product-related functionality.

### Responsibilities

* Get all products
* Get product details
* Add products
* Update products
* Delete products
* Admin product management

### Main Technology

* Node.js
* Express.js
* MongoDB

---

## 3. Cart Service

The Cart Service manages shopping cart operations.

### Responsibilities

* Add product to cart
* Get cart
* Update product quantity
* Remove product
* Clear cart
* Calculate cart totals

### Main Technology

* Node.js
* Express.js
* Redis
* JWT

Redis is used because shopping cart operations require fast reads and updates.

---

## 4. Order Service

The Order Service handles order-related operations.

### Responsibilities

* Create orders
* Store order information
* Retrieve orders
* Manage order status
* Trigger asynchronous processing

### Main Technology

* Node.js
* Express.js
* MongoDB
* Amazon SQS

---

# 🔐 Authentication

ShopKart uses **JWT-based authentication**.

The login flow is:

```text
User
  │
  ▼
Login Page
  │
  ▼
API Gateway
  │
  ▼
User Service
  │
  ▼
MongoDB
  │
  ▼
Credentials Verified
  │
  ▼
JWT Generated
  │
  ▼
Frontend
  │
  ▼
localStorage
```

For protected requests, the frontend sends:

```http
Authorization: Bearer <JWT>
```

The backend validates the token using the authentication middleware.

---

# 🛍️ Product Flow

When a user opens the products page:

```text
React Frontend
      │
      ▼
CloudFront
      │
      ▼
API CloudFront
      │
      ▼
ALB
      │
      ▼
EC2
      │
      ▼
API Gateway
      │
      ▼
Product Service
      │
      ▼
MongoDB
      │
      ▼
Product Response
      │
      ▼
React UI
```

---

# 🛒 Cart Flow

When a logged-in user adds a product to the cart:

```text
React
  │
  ▼
API Gateway
  │
  ▼
Cart Service
  │
  ▼
JWT Authentication
  │
  ▼
Redis
  │
  ▼
Cart Response
```

Redis provides fast access to frequently changing cart data.

---

# 📦 Order Flow

When a user places an order:

```text
User
  │
  ▼
Checkout
  │
  ▼
Order Service
  │
  ▼
MongoDB
  │
  ▼
ORDER_CREATED Event
  │
  ▼
Amazon SQS
  │
  ▼
SQS Worker
  │
  ▼
Background Processing
```

Amazon SQS provides asynchronous communication between the order service and background worker.

---

# 🔄 API Gateway

The API Gateway provides a single entry point for backend APIs.

| Endpoint          | Service         |
| ----------------- | --------------- |
| `/api/users/*`    | User Service    |
| `/api/products/*` | Product Service |
| `/api/cart/*`     | Cart Service    |
| `/api/orders/*`   | Order Service   |

This prevents the frontend from directly communicating with every microservice.

---

# 🗄️ Database Architecture

## MongoDB

MongoDB is used for persistent application data.

```text
User Service
     │
     ▼
  MongoDB
     │
   Users


Product Service
     │
     ▼
  MongoDB
     │
   Products


Order Service
     │
     ▼
  MongoDB
     │
   Orders
```

## Redis

Redis is primarily used by the Cart Service.

```text
Cart Service
     │
     ▼
   Redis
     │
     ▼
Cart Data
```

---

# 📬 Amazon SQS

Amazon Simple Queue Service (SQS) is used for asynchronous processing.

Instead of making the main API request wait for background processing, the Order Service publishes an event to the queue.

```text
Order Service
      │
      ▼
    SQS Queue
      │
      ▼
  SQS Worker
      │
      ▼
Background Task
```

### Benefits

* Decouples services
* Improves reliability
* Supports asynchronous processing
* Helps handle temporary service failures
* Makes the architecture more scalable

---

# ⚙️ PM2

PM2 is used to manage Node.js processes on the EC2 server.

Currently the following processes are managed using PM2:

```text
api-gateway
user-service
product-service
cart-service
order-service
sqs-worker
```

PM2 provides:

* Process management
* Automatic restart
* Application logs
* Background execution
* Startup persistence

Example:

```bash
pm2 status
```

```bash
pm2 logs
```

```bash
pm2 restart api-gateway
```

```bash
pm2 save
```

---

# 🖥️ EC2 Backend

The backend microservices are deployed on an Ubuntu EC2 instance.

The EC2 server runs:

```text
API Gateway       → Port 3000
Cart Service      → Port 3001
Product Service   → Port 3002
User Service      → Port 3003
Order Service     → Port 3004
SQS Worker
```

PM2 manages all these Node.js processes.

---

# ⚖️ Application Load Balancer

The Application Load Balancer provides the entry point to the backend EC2 infrastructure.

```text
CloudFront
     │
     ▼
    ALB
     │
     ▼
    EC2
     │
     ▼
API Gateway
```

The ALB also performs health checks to verify that the backend is available.

---

# 🚀 Deployment Process

## Frontend Deployment

From the frontend directory:

```bash
npm install
```

Build the application:

```bash
npm run build
```

Upload the build to S3:

```bash
aws s3 sync dist s3://shopkart-frontend-yashwanth --delete
```

Create a CloudFront invalidation:

```bash
aws cloudfront create-invalidation \
  --distribution-id E23574NQCDASVG \
  --paths "/*"
```

---

## Backend Deployment

The backend is hosted on EC2.

After pulling the latest source code:

```bash
git pull
```

Install dependencies:

```bash
npm install
```

Restart services using PM2:

```bash
pm2 restart all
```

Save the process list:

```bash
pm2 save
```

Check service status:

```bash
pm2 status
```

---

# 🔒 Security

The project uses several security mechanisms:

* JWT authentication
* Protected API routes
* CORS configuration
* AWS Security Groups
* Private S3 bucket
* CloudFront distribution
* Environment variables for sensitive configuration
* MongoDB authentication
* Redis authentication

Sensitive credentials such as:

```text
JWT_SECRET
MONGODB_URI
REDIS_URL
AWS credentials
```

are stored in environment variables and are **not committed to GitHub**.

---

# 🌍 Production URLs

### Frontend

https://d1hx5n7bh53loe.cloudfront.net

### API

https://d2o8lzgxvs6ck1.cloudfront.net

### API Health Check

https://d2o8lzgxvs6ck1.cloudfront.net/health

---

# 🧪 Testing

The application can be tested through the live frontend.

### User Flow

1. Register a new account
2. Login
3. Browse products
4. Add products to cart
5. Update quantity
6. Remove products
7. Proceed to checkout
8. Create an order
9. View orders

### Admin Flow

1. Login as admin
2. Open admin dashboard
3. Add product
4. Update product
5. Delete product
6. View orders

---

# 🛠️ Technologies Used

## Frontend

* React
* Vite
* JavaScript
* Axios
* React Router

## Backend

* Node.js
* Express.js
* HTTP Proxy Middleware
* JWT

## Databases

* MongoDB
* Redis

## AWS

* Amazon EC2
* Amazon S3
* Amazon CloudFront
* Application Load Balancer
* Amazon SQS
* AWS IAM

## DevOps / Tools

* Git
* GitHub
* npm
* PM2
* AWS CLI
* Ubuntu/Linux

---

# 📁 Project Structure

```text
ShopKart-Microservices/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── services/
│   │
│   ├── api-gateway/
│   │   └── src/
│   │
│   ├── user-service/
│   │   └── src/
│   │
│   ├── product-service/
│   │   └── src/
│   │
│   ├── cart-service/
│   │   └── src/
│   │
│   └── order-service/
│       └── src/
│
├── workers/
│   └── sqs-worker/
│
├── package.json
├── .gitignore
└── README.md
```

---

# 📈 Scalability

The current application runs multiple microservices on an EC2 instance.

For future scaling, the services can be containerized using Docker and deployed independently using:

* Amazon ECS
* Amazon EKS
* Kubernetes
* Auto Scaling Groups

The ALB can distribute traffic across multiple EC2 instances or containers.

---

# 🎯 Key Features

* Microservices architecture
* REST APIs
* JWT authentication
* Product management
* Shopping cart
* Order management
* Redis caching/data storage
* MongoDB persistence
* Asynchronous processing with SQS
* Background worker
* AWS deployment
* CloudFront CDN
* S3 hosting
* Application Load Balancer
* PM2 process management
* CORS configuration
* Admin functionality

---

# 💡 Key Learning Outcomes

Through this project, I gained practical experience in:

* Designing microservices
* Building REST APIs
* Implementing JWT authentication
* Working with MongoDB and Redis
* Implementing asynchronous communication using SQS
* Managing Node.js processes using PM2
* Deploying applications on AWS
* Configuring EC2 and ALB
* Hosting React applications using S3 and CloudFront
* Debugging production deployment issues
* Configuring CORS and HTTPS
* Working with Git and GitHub

---

# 🚧 Future Improvements

Possible future enhancements include:

* Dockerizing each microservice
* Deploying services using ECS/EKS
* Implementing CI/CD using GitHub Actions
* Adding automated testing
* Adding payment gateway integration
* Adding product search and filtering
* Adding monitoring using Amazon CloudWatch
* Implementing centralized logging
* Adding Auto Scaling
* Adding HTTPS with a custom domain
* Implementing advanced caching strategies

---

# 👨‍💻 Author

**Yashwanth M.**

GitHub:
https://github.com/yashwanth-m1

---

## ⭐ Project Summary

ShopKart demonstrates how a modern e-commerce application can be designed using **microservices, cloud infrastructure, databases, caching, authentication, asynchronous messaging, and AWS deployment services**.

The project is currently deployed and accessible through AWS CloudFront.
