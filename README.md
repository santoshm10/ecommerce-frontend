# E-Commerce

This is a full-stack E-commerce application built using the MERN stack (MongoDB, Express.js, React, Node.js).
It provides all essential features for an online store such as product listing, product details, cart, wishlist and order management.

--- 

## Demo Link 
(Live Demo)[https://ecommerce-frontend-rose-ten.vercel.app/] 

--- 

## Quick Start
```
Clone the repository
git clone https://github.com/santoshm10/ecommerce-frontend.git
git clone https://github.com/santoshm10/ecommerce-backend.git

Frontend setup
cd ecommerce-frontend
npm install
npm start

Backend setup
cd ecommerce-backend
npm install
npm run dev   

```
--- 
## Technologies 

- React 
- React Router 
- Bootstrap 
- Node.js 
- Express 
- MongoDB 
 
 --- 
 
 ## Demo video 
 
 Watch a walkthrough (5 minutes) of all major features of this app: (Video Link)[https://drive.google.com/file/d/1YA_IABJxVSTv28Ny9k10xp9XxMMxgL8u/view] 
 
 --- 
 
 ## Features 

 **Navbar**
 - Avtar, Cart, Wishlist icon buttons

 **Home** 
 - Product categories (Men, Women, Kids, etc.) 
 - Redirect to category-based product listing
 
 **Products** 
 - View all products with filters (category, rating, sort by price)
 - Search bar to search by product name
 - Product details page with images, size, description, and reviews

 **Cart** 
 - Add/remove products to cart
 - Increase/decrease quantity per product
 - Dynamic total calculation
 - Add Address button
 - Place order button
 
 **Wishlist** 
 - Add/remove products to wishlist  
 
 **Avtar** 
 - User details
 - Add Address button
 - View order history
 
 
 --- 
 
 ## API Refrence 
 
 ### **GET /api/products**
 
 List all products<br>
 Sample response:
 ```
[
  {
   _id, name, description, price, category, size, rating, createdAt, updatedAt,..
  },
]
```

### **GET /api/products/:id**
Get single product details

### **POST /api/products**
Create new product

### **POST /api/users**
Create user

### **GET /api/cart/:userId**
Get all cart items for a user<br> 
 Sample responce:
```
[
  {
    _id, user, product, quantity
  },
]
```

### **POST /api/cart**
Add product to cart

### **PUT /api/cart/:id**
Update quantity of product in cartt 

### **DELETE /api/cart/:id**
Remove product from cart

### **GET /api/wishlist/:userId**
Get wishlist of a user

### **POST /api/wishlist**
Add product to wishlist

### **DELETE /api/wishlist/:id**
Remove product from wishlist

### **GET /api/orders/:userId**
Get all orders of a user

### **POST /api/orders**
Create a new order

## **POST /api/users/:userId/address**
Create address by user

## **DELETE "/api/users/:userId/address/:index**
Delete address

--- ## Contact For bugs or feature requests, please reach out to sdmande101195@gmail.com