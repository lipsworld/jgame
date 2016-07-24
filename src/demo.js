var jgame_demo = {
    // the name of the initial scene for the game
    initialScene : "clearing",

    // list of scenes that appear in the game
    scenes : {
        "clearing" : jgame.newScene({
            intro: "Welcome to our new game!<br><br>You are standing in a clearing, and a path leads to the North",
            moves : [
                {display: "Follow the path North"}
            ]
        })
    }
};
