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

    // call this function to start up the game
    startup : function(params) {
        // get the game data (all the scenes and stuff)
        var gameData = params.gameData;

        // initial scene from your game to load
        var initialScene = gameData.scenes[gameData.initialScene];

        // render the template
        $("#jgame").html(jgame.TEMPLATE);

        // draw the initial scene
        initialScene.draw();

        // get the controls for the scene and draw them
        var controls = initialScene.getControls();
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
        this.moves = params.moves;

        // draw the scene into #jgame_scene
        this.draw = function() {
            $("#jgame_scene").html(this.intro);
        };

        this.getControls = function() {
            return jgame.newControls({
                moves: this.moves
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
        // {display: "<value to display to user>"}
        this.moves = params.moves;

        this.draw = function() {
            var moveFrag = "<ul>";
            for (var i = 0; i < this.moves.length; i++) {
                var move = this.moves[i];
                moveFrag += "<li>" + move.display + "</li>";
            }
            moveFrag += "</ul>";
            var html = '<div class="row"><div class="col-md-12"><strong>Where to?</strong><br>' + moveFrag + '</div></div>';
            $("#jgame_controls").html(html);
        }
    }
};
