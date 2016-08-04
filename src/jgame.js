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
        var item = false;
        if (params.source === "scene") {
            item = jgame.currentScene.getItem({name: params.on});
        } else if (params.source === "inventory") {
            item = jgame.player.getInventoryItem({name: params.on});
        }
        if (item === false) {
            jgame.currentScene.say({text: "<br><br>You didn't specify an item to act on"});
            return;
        }

        if (params.action === "look_at") {
            jgame.lookAt({item: item, context: params.source});
        } else if (params.action === "pick_up") {
            jgame.pickUp({item: item, context: params.source});
        } else if (params.action === "use") {
            var useWithItem = false;
            if (params.useWithSource === "scene") {
                useWithItem = jgame.currentScene.getItem({name: params.useWith});
            } else if (params.useWithSource === "inventory") {
                useWithItem = jgame.player.getInventoryItem({name: params.useWith});
            }
            if (useWithItem === false) {
                jgame.currentScene.say({text: "<br><br>You didn't specify an item to act on"});
                return;
            }
            jgame.use({item: item, useWithItem: useWithItem, context: params.source});
        } else if (params.action === "talk_to") {
            jgame.talkTo({item: item, context: params.source});
        }

        var controls = jgame.currentScene.getControls();
        controls.draw();
    },

    lookAt : function(params) {
        var item = params.item;

        var prefix = "<br><br>Look at " + item.name + ": ";
        var text = "You look at the " + name;
        if (item.lookAt) {
            text = item.lookAt;
        }

        jgame.currentScene.say({text: prefix + text});
    },

    pickUp : function(params) {
        var item = params.item;
        var context = params.context;

        var prefix = "<br><br>Pick up " + item.name + ": ";
        var text = "You can't pick that up!";

        if (context == "scene") {
            if (item.allowPickUp) {
                // add the item to the player's inventory and remove it from the scene
                jgame.player.addToInventory({name: item.name});
                jgame.currentScene.removeItem({name: item.name});
                text = "You pick up the " + name;
            }
            if (item.pickUp) {
                text = item.pickUp;
            }
        } else if (context === "inventory") {
            text = "You already picked that up";
        }

        jgame.currentScene.say({text: prefix + text});
    },

    use : function(params) {
        var item = params.item;
        var useWithItem = params.useWithItem;

        var prefix = "<br><br>Use " + item.name + " with " + useWithItem.name + ": ";

        if (item.use && item.use[useWithItem.name]) {
            var fn = item.use[useWithItem.name];
            jgame.currentScene.say({text: prefix});
            fn();
        } else if (useWithItem.use && useWithItem.use[item.name]) {
            var fn = useWithItem.use[item.name];
            jgame.currentScene.say({text: prefix});
            fn();
        } else {
            jgame.currentScene.say({text: prefix + "That doesn't work!"});
        }
    },

    talkTo : function(params) {
        var item = params.item;

        var prefix = "<br><br>Talk to " + item.name + ": ";
        var text = "That doesn't make any sense";

        if (item.talkTo) {
            jgame.currentScene.setMode({mode: "talk"});
            jgame.currentScene.setTalk({talkOptions : item.talkTo});
            text = "";
        }

        jgame.currentScene.say({text: prefix + text});
    },

    converse : function(params) {
        var end = params.end;
        var question = params.question;

        if (end === true) {
            jgame.currentScene.setMode({mode: "navigate"});
            jgame.currentScene.say({text: "<br><br>" + question});
        } else {
            var answer = jgame.currentScene.getAnswer({question: question});
            if (answer === false) {
                answer = "...";
            }
            jgame.currentScene.say({text : "<br><br>You: " + question + "<br>'" + answer + "'"});
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
            var inventoryItem = jgame.gameData.inventory[params.name];
            this.inventory.push(inventoryItem);
        };

        this.removeFromInventory = function(params) {
            var idx = false;
            for (var i = 0; i < this.inventory.length; i++) {
                if (this.inventory[i].name === params.name) {
                    idx = i;
                    break
                }
            }
            if (idx !== false) {
                this.inventory.splice(idx, 1);
            }
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

        this.mode = "navigate";

        this.talkOptions = false;

        // draw the scene into #jgame_scene
        this.draw = function() {
            var text = this.intro;

            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.sceneDescription) {
                    text += " " + item.sceneDescription;
                }
            }

            $("#jgame_scene").html(text);
        };

        this.say = function(params) {
            var scene = $("#jgame_scene");
            scene.append(params.text);
            var height = scene[0].scrollHeight;
            scene.scrollTop(height);
        };

        this.getControls = function() {
            if (this.mode == "navigate") {
                var sceneItems = [];
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    sceneItems.push(item.name);
                }

                return jgame.newNavigateControls({
                    moves: this.moves,
                    sceneItems: sceneItems
                });
            } else if (this.mode == "talk") {
                var questions = [];
                for (var i = 0; i < this.talkOptions.length; i++) {
                    questions.push(this.talkOptions[i].question);
                }

                return jgame.newTalkControls({
                    questions: questions
                })
            }
        };

        this.addItem = function(params) {
            this.items.push(params.item)
        };
        
        this.removeItem = function(params) {
            var idx = false;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].name === params.name) {
                    idx = i;
                    break
                }
            }
            if (idx !== false) {
                this.items.splice(idx, 1);
            }
        };

        this.addMove = function(params) {
            this.moves.push(params.move)
        };
        
        this.getItem = function(params) {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].name === params.name) {
                    return this.items[i];
                }
            }
            return false;
        };

        this.setMode = function(params) {
            this.mode = params.mode;
        };

        this.setTalk = function(params) {
            this.talkOptions = params.talkOptions;
        };

        this.getAnswer = function(params) {
            var question = params.question;
            for (var i = 0; i < this.talkOptions.length; i++) {
                if (this.talkOptions[i].question === question) {
                    return this.talkOptions[i].answer;
                }
            }
            return false;
        }
    },

    // each scene will need to return a set of controls for us to use
    newNavigateControls : function(params) {
        if (!params) { params = {} }
        return new jgame.NavigateControls(params);
    },
    NavigateControls : function(params) {
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
                <option value="use">Use</option>\
                <option value="talk_to">Talk To</option>\
            </select>\
            <select name="jgame_item">' + itemOptionsFrag + '</select>';

            var withFrag = '<span id="jgame_with-container" style="display:none">&nbsp;With&nbsp;<select name="jgame_with">' + itemOptionsFrag + '</select></span>';

            var buttonFrag = '&nbsp;<button id="jgame_act">Do it!</button>';

            // build the full set of controls and render into the page
            var html = '<div class="row"><div class="col-md-6"><strong>Where to?</strong><br>' + moveFrag + '</div>\
                <div class="col-md-6"><strong>Choose an action</strong><br>' + actionFrag + withFrag + buttonFrag + '</div></div>';

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
                var firstSpace = item.indexOf(" ");
                var source = item.substring(0, firstSpace);
                var on = item.substring(firstSpace + 1);

                var useWith = false;
                var useWithSource = false;
                if (action === "use") {
                    var withItem = $("select[name=jgame_with]").val();
                    var withFirstSpace = withItem.indexOf(" ");
                    useWithSource = withItem.substring(0, withFirstSpace);
                    useWith = withItem.substring(withFirstSpace + 1);
                }

                jgame.action({source: source, action: action, on: on, useWith: useWith, useWithSource: useWithSource});
            });

            // bind the change event to the action pull-down
            $("select[name=jgame_action]").on("change", function(event) {
                event.preventDefault();
                var action = $("select[name=jgame_action]").val();
                if (action === "use") {
                    $("#jgame_with-container").show();
                } else {
                    $("#jgame_with-container").hide();
                }
            });
        }
    },

    newTalkControls : function(params) {
        if (!params) { params = {} }
        return new jgame.TalkControls(params);
    },
    TalkControls : function(params) {
        this.questions = params.questions || [];

        this.draw = function () {
            var talkOptions = "<ul>";
            for (var i = 0; i < this.questions.length; i++) {
                talkOptions += '<li><a href="#" class="jgame_talk" data-tyoe="question">' + this.questions[i] + '</a></li>';
            }
            talkOptions += '<li><a href="#" class="jgame_talk" data-type="exit">Nothing else just now...</a></li>';
            talkOptions += "</ul>";

            // build the full set of controls and render into the page
            var html = '<div class="row"><div class="col-md-12">' + talkOptions + '</div>';
            $("#jgame_controls").html(html);

            $(".jgame_talk").on("click", function(event) {
                event.preventDefault();
                var type = $(this).attr("data-type");
                var question = $(this).html();

                if (type === "exit") {
                    jgame.converse({end: true, question: question});
                } else {

                    jgame.converse({question: question});
                }

            });
        }
    }
};
