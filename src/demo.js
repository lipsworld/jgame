var jgame_demo = {
    // the name of the initial scene for the game
    initialScene : "clearing",

    // list of scenes that appear in the game
    scenes : {
        "clearing" : jgame.newScene({
            intro: "Welcome to our new game!<br><br>You are standing in a clearing, and a path leads to the North.",
            moves : [
                {display: "Follow the path North", move_to: "cliff"}
            ],
            items : [
                {
                    name: "Lasso",
                    sceneDescription: "There is a lasso lying on the ground.",
                    lookAt: "There is a curled up rope on the ground, with a slipknot tied in it, like something a cowboy might use"
                }
            ]
        }),
        "cliff" : jgame.newScene({
            intro: "You reach a cliff edge!  There is no way to go except the way you came.",
            moves : [
                {display: "Go back South", move_to: "clearing"}
            ]
        })
    }
};
