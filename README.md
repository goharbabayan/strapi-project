## Tech Stack

This project combines a number of third party open-source tools:

- [Strapi](https://docs.strapi.io/dev-docs/deployment) builds the backend.
- [Next](https://nextjs.org/docs/app/api-reference/next-config-js) & [React](https://reactjs.org/) frontend.
- [Apollo Query](https://www.apollographql.com/docs/react/data/queries) queries from the Strapi Admin.

## Getting started

### Requirements
1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
2. You must [download and install Xampp](https://www.apachefriends.org/ru/index.html) if you don't already have it. Xampp is for running the MySQL server.

## Local Development

### Run the Backend
1. Open the Xampp and start the MySQL server.
2. Open the terminal in the cd [root]/backend directory
3. Run Using npm:

```shell
npm run dev
```
This will run the backend as a dev. Open the localhost url generated in the terminal, the backend will run on the **1337** port

### Run the Frontend
1. Open the terminal in the cd [root]/frontend directory
2. Run Using npm:

```shell
npm run dev
```
This will run the frotntend as a dev. Open the localhost url generated in the terminal, the frontend will run on the **3000** port


## Deployment

The project is deployed on the [Digital Ocean Droplet](https://www.digitalocean.com/). The Backend and Frontend are located on he diferent subdomains [Cloudflare](https://www.cloudflare.com/en-ca/) but refering to the same droplet.

### Application Storage
The Storage is also located at the Digital Ocean platform as a database. The database we are using MySQL. The Database config file is located at the root/backend/config `database.js` file.

### Build
The backend and Frontedn needs to build separatly before deploying to the server.

### Backend Build
1. Configure .env file. the example you can see .env.example file

```
HOST=0.0.0.0
PORT=1337
...
```

2. Launch the server

``` 
NODE_ENV=production npm run build
```

### Deploy Backend
1. Internal database is MySQL hosted on DigitalOcean and working on the project with MySQL2.
2. The server is droplet hosted on DigitalOcean.
3. The backend project is deployed with pm2.

4. Delete old process and logs:

``` 
pm2 flush strapi-app
pm2 delete strapi-app
```

5. Run application:
``` 
cd ~
pm2 start ecosystem.config.js
```

6. Restart to add timestamp in logs:
``` 
pm2 restart strapi-app --time 
``` 
If you have updated .env file use ```--update-env``` flag at the end

7. View logs:
``` 
pm2 logs strapi-app --lines 1000
``` 

### Fronend Build

1. Configure .env file. the example you can see .env.example file
2. Launch the server
```
npm run build
```

### Deploy Frontend

1. Delete old process and logs:

```
pm2 flush sneaky-frontend
pm2 delete sneaky-frontend
```

2. Run application:
```
cd frontend
pm2 start npm --name "sneaky-frontend" -- start
```

3. Restart to add timestamp in logs:

```
pm2 restart sneaky-frontend --time
```

4. View logs:
```
pm2 logs sneaky-frontend --lines 1000
```
