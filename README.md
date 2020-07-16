# Photo-gallery-back
Back-end project that provides all the endpoints ready to be consumed by the front-end project.

## Description
Node project which has the following features:
1. Search: Endpoint to get a list of pictures if there are exist in the DB.
2. Filter: Endpoint to filter pictures by album. 
3. CRUD: Endpoints to create, read, update or delete pictures, as well as create, read, update or delete albums. 


## Libraries/Components used
* express: To create all the routes thats going to be consumed by the front-end project.
* nodemon: To watch in real time the changes added in the project.
* mongoose: To work with MongoDB.
* dotenv: To use the .env file.
* body-parser: To handle the HTTP POST requests.
* morgan: To automated recording of requests and responses.
* formidable: To parsing form data, especially file uploads.
* lodash: To manipulate objects.
* cors: To share resources from the back-end.


## Getting Started and Installing
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

* First Git clone the repo into your computer
```
git clone https://github.com/jaimeduque17/photo-gallery-back.git
```
* Open your terminal
```
$ cd photo-gallery-back
$ npm install
```
* This should install all the dependencies. Once done
* Run 
``` 
$ yarn start
or
$ npm start
```
* to start the server.
* This should run on (http://localhost:8000).

## Possible Improvements
* Unit Tests - JEST.


## Authors
* **Jaime Duque** - (https://github.com/jaimeduque17)
