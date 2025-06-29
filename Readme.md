This repo is maintained for the backend of the Xpsenso project

Steps to setup database in local machine:

1. Use node version above 22.13.1

2. Run below command to install dependencies

```sh
npm i
```

3. Create the .env file with the db credentials

```sh
NODE_ENV=development
SCHEMA=xpenso

DEV_DB_HOST=127.0.0.1
DEV_DB_USER=dev_user
DEV_DB_PASSWORD=dev_password
DEV_DB_NAME=dev_db
DEV_DB_PORT=5432

STAGING_DB_HOST=127.0.0.1
STAGING_DB_USER=staging_user
STAGING_DB_PASSWORD=staging_password
STAGING_DB_NAME=staging_db
STAGING_DB_PORT=5432

PROD_DB_HOST=127.0.0.1
PROD_DB_USER=prod_user
PROD_DB_PASSWORD=prod_password
PROD_DB_NAME=prod_db
PROD_DB_PORT=5432
```

4. Now run the below command to setup the database locally

```sh
npm run setup
```

5. To seed the dummy data to the database created, run the below command

```sh
npm run seed
```
