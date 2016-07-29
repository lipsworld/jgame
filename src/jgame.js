var jgame = {
    TEMPLATE : '<div class="row">\
        <div class="col-md-12">\
            <div id="jgame_scene">Scene appears here</div>\
        </div>\
    </div>\
    <div class="row">\
        <div class="col-md-12">\
            <div id="jgame_controls">Controls appear here</div>\
        </div>\
    </div>',

    // this is where we'll store a copy of the game data
    gameData : false,

    // this is where we'll store a copy of the current scene
    currentScene : false,

    // object for storing the state of the player in the game
    player : false,

    // call this function to start up the game
    startup : function(params) {
        // get the game data (all the scenes and stuff)
        var gameData = params.gameData;
        jgame.gameData = gameData;

        // create a new player object
        jgame.player = jgame.newPlayer();

        // render the template
        $("#jgame").html(jgame.TEMPLATE);

        // kick off the game with the initial scene
        jgame.enterScene({sceneId : gameData.initialScene});
    },

    // move the view to a new scene
    move : function(params) {
        var moveTo = params.moveTo;
        jgame.enterScene({sceneId: moveTo});
    },

    action : function(params) {
        var source = params.source;
        if (source === "scene") {
            jgame.currentScene.action(params);
        } else if (source === "inventory") {
            var item = jgame.player.getInventoryItem({name: params.on});
            if (params.action === "look_at") {
                var text = "<br><br>Look at " + item.name;
                if (item.lookAt) {
                    text = "<br><br>" + item.lookAt;
                }
                jgame.currentScene.say({text: text});
            } else if (params.action === "pick_up") {
                var text = "<br><br>You already picked that up";
                jgame.currentScene.say({text: text});
            }
        }

        var controls = jgame.currentScene.getControls();
        controls.draw();
    },

    enterScene : function(params) {
        var sceneId = params.sceneId;

        var newScene = jgame.gameData.scenes[sceneId];
        jgame.currentScene = newScene;

        newScene.draw();

        // get the controls for the scene and draw them
        var controls = newScene.getControls();
        controls.draw();
    },

    // create a newScene for every different scene in your game
    newPlayer : function(params) {
        if (!params) { params = {} }
        return new jgame.Player(params);
    },
    Player : function(params) {
        this.inventory = [];

        this.getInventoryItem = function(params) {
            for (var i = 0; i < this.inventory.length; i++) {
                var item = this.inventory[i];
                if (item.name === params.name) {
                    return item;
                }
            }
            return false;
        };

        this.addToInventory = function(params) {
            var inventoryItem = jgame.gameData.inventory[params.item];
            this.inventory.push(inventoryItem);
        };

        this.listInventory = function() {
            var items = [];
            for (var i = 0; i < this.inventory.length; i++) {
                items.push(this.inventory[i].name);
            }
            return items;
        }
    },

    // create a newScene for every different scene in your game
    newScene : function(params) {
        if (!params) { params = {} }
        return new jgame.Scene(params);
    },
    Scene : function(params) {

        // intro text which is printed first when you enter the scene
        this.intro = params.intro;

        // the list of moves available from this scene
        this.moves = params.moves || [];

        // list of items that appear in the scene
        this.items = params.items || [];

        // draw the scene into #jgame_scene
        this.draw = function() {
            var text = this.intro;

            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (!item.removed && item.sceneDescription) {
                    text += " " + item.sceneDescription;
                }
            }

            $("#jgame_scene").html(text);
        };

        this.say = function(params) {
            $("#jgame_scene").append(params.text);
        };

        this.getControls = function() {
            var sceneItems = [];
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (!item.removed) {
                    sceneItems.push(item.name);
                }
            }

            return jgame.newControls({
                moves: this.moves,
                sceneItems: sceneItems
            });
        };

        this.action = function(params) {
            var act = params.action;
            var on = params.on;

            if (act === "look_at") {
                var item = this._getItem(on);
                var text = "<br><br>Look at " + on;
                if (item.lookAt) {
                    text = "<br><br>" + item.lookAt;
                }
                $("#jgame_scene").append(text);
            } else if (act === "pick_up") {
                // add the item to the player's inventory
                jgame.player.addToInventory({item: on});

                // mark the item as removed from the scene
                var item = this._getItem(on);
                item["removed"] = true;

                // output something to the display
                var text = "<br><br> Pick up " + on;
                if (item.pickUp) {
                    text = "<br><br>" + item.pickUp;
                }
                $("#jgame_scene").append(text);
            }
        };
        
        this._getItem = function(name) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].name === name) {
                    return this.items[i];
                }
            }
            return false;
        }
    },

    // each scene will need to return a set of controls for us to use
    newControls : function(params) {
        if (!params) { params = {} }
        return new jgame.Controls(params);
    },
    Controls : function(params) {
        // list of moves to offer the user
        // each entry in the list should be of the form
        // {display: "<value to display to user>", move_to: "<scene name the move takes you to>"}
        this.moves = params.moves || [];

        // the list of items that appear on the scene
        this.sceneItems = params.sceneItems || [];

        this.draw = function() {
            // construct the HTML fragment for the list of available moves
            var moveFrag = "<ul>";
            for (var i = 0; i < this.moves.length; i++) {
                var move = this.moves[i];
                moveFrag += '<li><a href="#" class="jgame_move-link" data-move-to="' + move.move_to + '">' + move.display + '</a></li>';
            }
            moveFrag += "</ul>";

            // construct the HTML select boxes which can be used to interact with the scene itself
            var itemOptionsFrag = "";
            // first do the scene items
            if (this.sceneItems.length > 0) {
                itemOptionsFrag += '<optgroup label="Scene">';
                for (var i = 0; i < this.sceneItems.length; i++) {
                    var item = this.sceneItems[i];
                    itemOptionsFrag += '<option value="scene ' + item + '">' + item + '</option>';
                }
                itemOptionsFrag += "</optgroup>";
            }
            // then do the player's inventory
            var inventory = jgame.player.listInventory();
            if (inventory.length > 0) {
                itemOptionsFrag += '<optgroup label="Inventory">';
                for (var i = 0; i < inventory.length; i++) {
                    var item = inventory[i];
                    itemOptionsFrag += '<option value="inventory ' + item + '">' + item + '</option>';
                }
                itemOptionsFrag += "</optgroup>";
            }

            var actionFrag = '<select name="jgame_action">\
                <option value="look_at">Look At</option>\
                <option value="pick_up">Pick Up</option>\
            </select>\
            <select name="jgame_item">' + itemOptionsFrag + '</select>\
            <button id="jgame_act">Do it!</button>';

            // build the full set of controls and render into the page
            var html = '<div class="row"><div class="col-md-6"><strong>Where to?</strong><br>' + moveFrag + '</div>\
                <div class="col-md-6"><strong>Choose an action</strong><br>' + actionFrag + '</div></div>';

            $("#jgame_controls").html(html);

            // bind the click event to the move links
            $(".jgame_move-link").on("click", function(event) {
                event.preventDefault();
                var moveTo = $(this).attr("data-move-to");
                jgame.move({moveTo : moveTo});
            });

            // bind the click event to the action button
            $("#jgame_act").on("click", function(event) {
                event.preventDefault();
                var action = $("select[name=jgame_action]").val();
                var item = $("select[name=jgame_item]").val();
                var bits = item.split(" ");
                jgame.action({source: bits[0], action: action, on: bits[1]});
            })
        }
    }
};
