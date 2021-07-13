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

-   GET => /products _=> Get all the products_

-   GET => /products/:id _=> Get product by id_

-   GET => /categories/:category _=> Get all the products of a category_

##### Protected Routes

-   POST => /products _=> Add a new product_

-   PUT => /products/id _=> Update a product_

-   DELETE => /products _=> Delete a product_
