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

[View Code](https://github.com/richard-jones/jgame/tree/46573ee5ae66ff5b8199233868fae40294189926)

[View Diff](https://github.com/richard-jones/jgame/commit/46573ee5ae66ff5b8199233868fae40294189926)

We represent each scene in the game with an object which will hold the state for that scene, and will now how to render itself

* src/jgame.js - defines a newScene function with constructs a Scene object which can have properties, like an intro
* src/demo.js - this is where we'll build our actual game data
* jgame.html - load our new demo.js file, and send the initial scene into jgame.startup()


## Step 4: Make some initial (non functional) controls

[View Code](https://github.com/richard-jones/jgame/tree/223fdf03aed5192425ad535a6b3a58b757418ba0)

[View Diff](https://github.com/richard-jones/jgame/commit/223fdf03aed5192425ad535a6b3a58b757418ba0)

Each scene will have controls that are dependent on what is going on in the scene.  We make a new Controls object which
can take the scene's requirements and render them on the page.

* jgame.js - defines a newControls function which constructs a Controls object, which knows about the moves you can make in a Scene.  We also have the Scene give us the correct Controls.
* demo.js - extend our description of the scene a little, and add a single available move

## Step 5: Prepare to support multiple scenes

[View Code](https://github.com/richard-jones/jgame/tree/93df0a88a83cfc88de3679974e816bd5f6ba374a)

[View Diff](https://github.com/richard-jones/jgame/commit/93df0a88a83cfc88de3679974e816bd5f6ba374a)

Up until now, we've focused on rendering a single scene and its controls.  Our code isn't well suited to supporting multiple scenes, so we need to change some things

* demo.js - change the structure of the demo game, to allow multiple scenes by name
* jgame.html - instead of sending the initialScene to the game, send the entire game data module
* jgame.js - Change the way we startup to use the game data module


## Step 6: Bind our first event handler to move between scenes

[View Code](https://github.com/richard-jones/jgame/tree/2e1ebfbb17d86aa96edbf1ce4086316c347c63ac)

[View Diff](https://github.com/richard-jones/jgame/commit/2e1ebfbb17d86aa96edbf1ce4086316c347c63ac)

We create second scene in the demo game, and add a link in the controls that allows us to change the scene by clicking the move instruction

* demo.js - add a new scene ("cliff") and a "move_to" field in the "move" objects
* jgame.js - create a move link, and bind a jquery event handler which calls the new jgame.move function, which moves the view to a new scene


## Step 7: Our first minor refactor

[View Code](https://github.com/richard-jones/jgame/tree/0e4025c74116f834ef14a67329dc7f9a3c577d86)

[View Diff](https://github.com/richard-jones/jgame/commit/0e4025c74116f834ef14a67329dc7f9a3c577d86)

We had 2 functions (jgame.startup and jgame.move) that were of a similar structure.  We now want to DRY (Don't Repeat Yourself) that code

* jgame.js - merge shared functionality from jgame.startup and jgame.move into jgame.enterScene, and have the old functions use that new one


## Step 8: Support the existence of items in scenes

We add the ability for a scene to contain items, and for those items to be passed on to the controls, so that in the next step we can interact with them

* demo.js - add a list of a single item with a name and sceneDescription to the first scene
* jgame.js - support the adding of items to a scene, render the scene description for the item at draw, and pass it on to the controls.  The controls now render select boxes for interacting with scene items.


