# Server Application

This is the server application, developed in Node.

It consists of a little service returning a set of dummy data to the client apps.

# The data

The data returned by the server is a list of music albums.

Each album will have: a title, an artist, a year and a fake id.

# To run it

Open a terminal, browse the root folder of the application (server) and install the dependencies

```
$ cd <server>
$ npm install
```

Then, run the command to start it

```
$ npm start
```

# To test it

In order to test it, open an API client - e.g. Postman - and do a GET request to `http://localhost:4800/` in order to see the results.
