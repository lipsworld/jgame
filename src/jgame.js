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

    // call this function to start up the game
    startup : function(params) {
        // get the game data (all the scenes and stuff)
        var gameData = params.gameData;
        jgame.gameData = gameData;

        // render the template
        $("#jgame").html(jgame.TEMPLATE);

        jgame.enterScene({sceneId : gameData.initialScene});
    },

    // move the view to a new scene
    move : function(params) {
        var moveTo = params.moveTo;
        jgame.enterScene({sceneId: moveTo});
    },

    enterScene : function(params) {
        var sceneId = params.sceneId;

        var newScene = jgame.gameData.scenes[sceneId];

        newScene.draw();

        // get the controls for the scene and draw them
        var controls = newScene.getControls();
        controls.draw();
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
                if (item.sceneDescription) {
                    text += " " + item.sceneDescription;
                }
            }

            $("#jgame_scene").html(text);
        };

        this.getControls = function() {
            var sceneItems = [];
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                sceneItems.push(item.name);
            }

            return jgame.newControls({
                moves: this.moves,
                sceneItems: sceneItems
            });
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
            for (var i = 0; i < this.sceneItems.length; i++) {
                var item = this.sceneItems[i];
                itemOptionsFrag += '<option value="' + item + '">' + item + '</option>';
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
            })
        }
    }
};
