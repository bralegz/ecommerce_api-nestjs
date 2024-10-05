

# :shopping_cart: E-commerce API built with [NestJS](https://docs.nestjs.com/) :shopping_cart:

## Installation

```bash
$ npm install
```
## Create environment variables
Create a file called .env.development and add the required environment variables:
```
DB_NAME=<Name of your local database>
DB_HOST=localhost
DB_PORT=<Port of your local database>
DB_USERNAME=<Database username>
DB_PASSWORD=<Database password>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_SECRET=<Cloudinary secret key>
CLOUDINARY_API_KEY=<Cloudinary api key>
JWT_SECRET=<Secret key to sign JWT>
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

