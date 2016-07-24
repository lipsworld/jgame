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
        // initial scene from your game to load
        var initialScene = params.initialScene;

        // render the template
        $("#jgame").html(jgame.TEMPLATE);

        // draw the initial scene
        initialScene.draw();
    },

    // create a newScene for every different scene in your game
    newScene : function(params) {
        if (!params) { params = {} }
        return new jgame.Scene(params);
    },
    Scene : function(params) {

        // intro text which is printed first when you enter the scene
        this.intro = params.intro;

        // draw the scene into #jgame_scene
        this.draw = function() {
            $("#jgame_scene").html(this.intro);
        }
    }
};
