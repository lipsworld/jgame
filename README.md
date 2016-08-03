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

[View Code](https://github.com/richard-jones/jgame/tree/abe0b0c03b35441376d9954d5e3f120a3e99cfc7)

[View Diff](https://github.com/richard-jones/jgame/commit/abe0b0c03b35441376d9954d5e3f120a3e99cfc7)

We add the ability for a scene to contain items, and for those items to be passed on to the controls, so that in the next step we can interact with them

* demo.js - add a list of a single item with a name and sceneDescription to the first scene
* jgame.js - support the adding of items to a scene, render the scene description for the item at draw, and pass it on to the controls.  The controls now render select boxes for interacting with scene items.


## Step 9: First interaction with an item in a scene

[View Code](https://github.com/richard-jones/jgame/tree/230439346677580bff88746276e259986fec805f)

[View Diff](https://github.com/richard-jones/jgame/commit/230439346677580bff88746276e259986fec805f)

We add the general ability to interact with an item in a scene, and implement the ability to look at items.

* demo.js - add the text that will be displayed when you look at an item
* jgame.js - bind an event handler to the item interaction button, and an action method on the Scene that an react to the interaction, which implements the ability to Look At an item


## Step 10: Add player inventory and pick-up option

[View Code](https://github.com/richard-jones/jgame/tree/4b630cfbdbdd7b9c78b61b6c26e43c380d50e4a9)

[View Diff](https://github.com/richard-jones/jgame/commit/4b630cfbdbdd7b9c78b61b6c26e43c380d50e4a9)

We add the concept of a "player" who has an inventory, and modify the existing code to allow items from a scene to be collected

* demo.js - add an "inventory" version of an item, which is different from the version of the item as it appears in the scene
* jgame.js - implement "pick_up" as an action you can take on an item in the scene, and add an additional action method in the root of jgame which allows the controls to be re-drawn after


## Step 11: Make the inventory interactive

[View Code](https://github.com/richard-jones/jgame/tree/aba45a059841164fefbc1a1bdf20be88bf2e687d)

[View Diff](https://github.com/richard-jones/jgame/commit/aba45a059841164fefbc1a1bdf20be88bf2e687d)

We add the inventory to the list of items you can interact with, and handle the look_at and pick_up behaviours for collected items

* jgame.js - add the inventory items to the controls pull-down and upgrade jgame.action so that it can distinguish between actions on the scene and actions on the inventory, and behave appropriately.


## Step 12: Refactor the Player into a single objects

[View Code](https://github.com/richard-jones/jgame/tree/43fb14e561c3795e6a771ae4282aa7c01caf3b37)

[View Diff](https://github.com/richard-jones/jgame/commit/43fb14e561c3795e6a771ae4282aa7c01caf3b37)

The Player's inventory was getting a bit out of hand, so we're going to pull all the inventory functionality into a single object, and make the Player a fully constructed object, to bring it in line with the rest of the app

* jgame.js - create a new Player object, and give it functions for interacting with the inventory.  Refactor the rest of the code to use this new object


## Step 13: Introduce interactive scene items that can't be collected

[View Code](https://github.com/richard-jones/jgame/tree/885badae1f3caf1dfd569dcca742fea918d32143)

[View Diff](https://github.com/richard-jones/jgame/commit/885badae1f3caf1dfd569dcca742fea918d32143)

Sometimes we'll want to interact with items in a scene that we don't want the player to be able to pick up, so we introduce that kind of item, and refactor the code to handle it

 * demo.js - add an item to the "cliff" scene, and introduce a new allowPickUp attribute to an items' definition
 * jgame.js - refactor jgame.action to respect allowPickUp


## Step 14: Add a "use" control

[View Code](https://github.com/richard-jones/jgame/tree/1e3d45fe9d3f3a2f01966df77268704e748bc902)

[View Diff](https://github.com/richard-jones/jgame/commit/1e3d45fe9d3f3a2f01966df77268704e748bc902)

In order to use items with eachother we'll need to add a "use" control, and we'll need to extend the current controls to allow that

* jgame.js - add a hidden select box which then appears only when "use" is selected from the controls.  Extend the action click handler to extract that information and send it to jgame.action if it is relevant


## Step 15: Implement a "use" function

[View Code](https://github.com/richard-jones/jgame/tree/667b5b525b8dceb4d6e500b5d5418f179199065b)

[View Diff](https://github.com/richard-jones/jgame/commit/667b5b525b8dceb4d6e500b5d5418f179199065b)

This is probably our toughest step so far.  Using one object on another could have a variety of consequences, so it's not so easy to declare it like we did with Look At and Pick Up.

Instead we're going to have to alow the game data to specify the behaviour, by allowing it to run a function of its own when one object is used on another.  So in this step we add such a function, and build all the extra behaviour the game needs to support running it.

* demo.js - define a function to run when one item is used on another, and referene that function from within each of the items concerned, so we know when to run it
* jgame.js - add some utility functions to the player and the scene, and add the capability to act on a "use" action.  When the result of the "use" puts a new item on the scene we also find a bug in our event handler, so we fix that.


## Step 16: add a new scene

To demonstrate how the controls can be changed based on actions in the game, we add a new scene which can only be reached after an item has been used on another.

* demo.js - define the new scene, and update the "use" function to add a move to that scene once the action has completed
* jgame.js - a tiny enhancement, to allow new moves to be added to a scene

