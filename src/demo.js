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
                    lookAt: "There is a curled up rope on the ground, with a slipknot tied in it, like something a cowboy might use",
                    pickUp: "You stoop down and collect up the rope",
                    allowPickUp: true
                }
            ]
        }),
        "cliff" : jgame.newScene({
            intro: "You reach a chasm!",
            moves : [
                {display: "Go back South", move_to: "clearing"}
            ],
            items : [
                {
                    name: "Tree",
                    sceneDescription: "On the other side of the chasm a gnarled old tree's branches extend towards you.",
                    lookAt: "A huge, sturdy looking tree, whose branches feel only just out of reach",
                    pickUp: "The tree is way to heavy, and wouldn't fit in your bag",
                    allowPickUp: false,
                    use : {
                        "Lasso" : function() { jgame_demo.functions.useLassoWithTree() }
                    }
                }
            ]
        }),
        "far_edge" : jgame.newScene({
            intro: "You are standing on the edge of a cliff, beneath a huge tree.  A path leads down the mountain, into the trees.",
            moves : [
                {display: "Swing across the chasm!", move_to: "cliff"}
            ],
            items : [
                {
                    name: "Old Woman",
                    sceneDescription: "An old woman blocks your way on the path",
                    lookAt: "An old woman wrapped in ragged clothes.  She looks grumpy.",
                    pickUp: "You don't think even your best moves would work on her",
                    allowPickUp: false
                }
            ]
        })
    },

    // list of items that can appear in the inventory
    inventory : {
        "Lasso" : {
            name: "Lasso",
            lookAt: "It's a lasso, like a cowboy might use.  You found it in a clearing.",
            use : {
                "Tree" : function() { jgame_demo.functions.useLassoWithTree() }
            }
        }
    },

    // list of items that can appear in a scene
    sceneItems : {
        "Tree with Rope" : {
            name: "Tree with Rope",
            lookAt: "There's a rope hanging from the tree branch"
        }
    },

    functions : {
        useLassoWithTree : function() {
            jgame.player.removeFromInventory({name: "Lasso"});
            jgame_demo.scenes["cliff"].removeItem({name: "Tree"});
            jgame_demo.scenes["cliff"].addItem({item: jgame_demo.sceneItems["Tree with Rope"]});
            jgame_demo.scenes["cliff"].addMove({move: {display : "Swing across the chasm!", move_to: "far_edge"}});
            jgame.currentScene.say({text: "<br><br>You toss the loop of the lasso over the nearest branch of the tree and pull it tight, making a serviceable swinging rope!"});
        }
    }
};
