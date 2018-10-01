# Pixabay Images
A server-worker NodeJS application using Redis and Socket.io to search/get images from the Pixabay API

# The Server
The server that renders a single page to the user.

The user will connect to a websocket on the server.

The single page will have a form that the user will submit with the following information;

1. A username for the search (once sent, this field becomes readonly and cannot be changed)
2. A search query so that users may search for images (cleared on submit)
3. A message to submit with the search (cleared on submit)
4. When the user submits a message, you will send this information, as well as the username, through a websocket to the server.

The server will publish a message through Redis to tell a worker to "research the image" (see below).

When the worker is done "researching", it will publish a message of results from pixabay, as well as the user who searched for it, and their message.

When the web site receives a new result, it will notify all users about the message, sender, and the results from pixabay.

Using JavaScript, the web page will then append the images found to an area on the page, along with the user and a message they send.

# The Workers
Worker.js performs a single task.

When the worker is informed to research for a message, it will search the pixabay free api (Links to an external site.)Links to an external site. for images matching that search term.

After it downloads these results ("researching"), it will publish a message of results from pixabay, as well as the user who searched for it, and their message.

# How to run
1. npm install
2. npm run build
3. npm start  

Use a browser to go to http://localhost:3000. You can open multiple browser sessions with this URL and search Pixabay via unique usernames.
