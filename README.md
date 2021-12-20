### WorkShop
Fullstack application web that allows users to manage their products and to communicate with their clients.

#### Installation

    npm install

#### Config your .env

You can follow the sample at sample.env and then create the database if it doesn't exist (empty one will be fine).

#### Deploy on localhost

    npm start

or with Docker. 
    
    npm run build
    docker build -t work-shop .
    docker run -dp 3000:3000 work-shop

By default, there aren't any admin users. Sign up a new normal user, and then update their role by interacting directly with your database.

#### Deploy in dev mode

    npm run dev

or with Docker (in my case: in node:12-alpine and on port 3000)

    docker run -dp 3000:3000 -w /app -v "$(pwd):/app" node:12-alpine sh -c "npm install && npm run dev"

In case you might need, inside a docker, you can use "host.docker.internal" to refer to your host machine's localhost.
