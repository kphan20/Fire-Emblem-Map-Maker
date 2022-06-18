# Fire-Emblem-Map-Maker

This is a browser-based map editor that allows you to create GBA-era Fire Emblem maps. It was written in React-Redux with a Node.js/MongoDB backend, and it supports my other Fire Emblem project.

I developed this with the following purposes in mind:

- Deepen my React.js skills and gain exposure to Redux
- Learn some Node.js
- Learn how MongoDB interfaces with Node.js
- Develop a system to store maps in a database

As of now, the following features are available:

- Creating map of specified dimensions
- Filling in the tiles with tiles from a tileset
- Drag-filling on the map canvas
- Keeping a hotbar to easily select tiles
- Submitting a completed map for storage in a MongoDB database

Moving forward, I would like to work on the following features:

- A hub for viewing other created maps
- Storing maps in progress
- Optimizing performance through React docs recommendations (ie using useMemo to mitigate expensive rerenders)
- Look to reorganize the code into more manageable chunks
- Finding a way to host the project (preferably github pages)
- Experimenting with the theme of the website

I am hosting the page on Github [here](https://kphan20.github.io/Fire-Emblem-Map-Maker/), thanks
to the help of [these instructions.](https://github.com/gitname/react-gh-pages)
As of right now, the submit functionality may be lacking because I do not have the node server setup yet (am considering Heroku).
