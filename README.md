### Simple App

#### Installation
    npm install

#### Deploy on localhost:3000
    npm run dev

#### Database
##### Product 
- id
- name
- price
- category 
##### User
- id
- username
- password

#### RestAPI
##### Public Routes
* GET => /products             *=> Get all the products*

* GET => /products/:id         *=> Get product by id*

* GET => /categories/:category *=> Get all the products of a category*

##### Protected Routes
* POST => /products            *=> Add a new product*

* PUT => /products/id          *=> Update a product*

* DELETE => /products          *=> Delete a product*

