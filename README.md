# JGame

## Step 1: Set up the application directory structure

[View Code](https://github.com/richard-jones/jgame/tree/d7d25185a661dc43bed5097a8a607e6a84121799)

We have an HTML file in jgame.html which will be our entry point into the application, and which is set up to import all the CSS and JavaScript, then the following directories

* css - for all jgame CSS files
* src - for all jgame JavaScript files
* vendor - for all libraries and other 3rd party bits we'll use (like bootstrap and jquery)


## Step 2: Set up a view on the program

[View Code](https://github.com/richard-jones/jgame/tree/20264d19e89bd2259f5cdd56ffe4fc3581f00f86)

[View Diff](https://github.com/richard-jones/jgame/commit/20264d19e89bd2259f5cdd56ffe4fc3581f00f86)

In order to see what the program is outputting, we need to set up the interface so that we can start outputting things to it.

We do this by using JavaScript to write some HTML into the page, and using some CSS to style that HTML into a basic interface for our game

* src/jgame.js - defines a TEMPLATE for the layout, and writes it into the HTML DIV with the id "jgame"
* css/jgame.css - defines layout styles for the scene and the controls
* jgame.html - calls the jgame.startup() function to load the game when the browser is ready


## Step 3: Get our first game scene to exist

We represent each scene in the game with an object which will hold the state for that scene, and will now how to render itself

* src/jgame.js - defines a newScene function with constructs a Scene object which can have properties, like an intro
* src/demo.js - this is where we'll build our actual game data
* jgame.html - load our new demo.js file, and send the initial scene into jgame.startup()

