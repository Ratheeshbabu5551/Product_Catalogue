# Installations

> Make sure you have nodejs and npm installed on your machine.

1. Clone the repo to your local machine.
2. Run `npm install` to install all the dependencies.
3. Run `npm run scripts` to create the tables in json format and to create and insert the data in the database collections.
4. Run `npm start` to start the server.

# Sample Environment File

Create .env file in the root directory and add the following code with your credentials.

> Signup at https://cloud.mongodb.com/ to get your DB_USER and DB_PASS.

```
DB_USER=<your-username>
DB_PASS=<your-pass>
DB_NAME=store
PORT=8000
```