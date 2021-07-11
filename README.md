### Simple App

#### Installation
    npm install

#### Config your .env
There is a sample at sample.env
And create the database if it doesn't exist

#### Deploy on localhost:3000
    npm run dev

#### Database
##### Products
##### Users
##### Messages
##### Rooms

##### Login
    http://locahost:3000/auth/login


#### RestAPI
##### Public Routes
* GET => /products             *=> Get all the products*

* GET => /products/:id         *=> Get product by id*

* GET => /categories/:category *=> Get all the products of a category*

##### Protected Routes
* POST => /products            *=> Add a new product*

* PUT => /products/id          *=> Update a product*

* DELETE => /products          *=> Delete a product*

