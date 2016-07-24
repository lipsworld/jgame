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

    startup : function(params) {
        $("#jgame").html(jgame.TEMPLATE);
    }
};
