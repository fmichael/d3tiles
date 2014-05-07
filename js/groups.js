//group (indivial group)

function group(par, id) {
    this.id = id;
    this.parent = par;
    this.data = {};
    this.filters = {};
    this.settings = {};
    this.tileList = {};

    var that = this;

    this.addData = function(data) {
        that.data = data;
    };

    this.addFilters = function(filters) {
        that.filters = filters;
    };

    this.addSettings = function(settings) {
        that.settings = settings;
    };

    this.addTile = function(id, x, y) {
        that.tileList[id] = new tile(that, id, x, y);
    };

    this.removeAllTiles = function() {
        try {
            for(var iter in that.tileList) {
                $('#'+that.tileList[iter].id).remove();
                delete that.tileList[iter];
            }
        }
        catch (err) {
            console.error("Error Deleting Tiles: "+err.message);
        }
    };

    this.removeTile = function(id) {
        try {
            $('#'+that.tileList[id].id).remove();
            delete that.tileList[id];
        }
        catch (err) {
            console.error("Error Deleting Tile: "+err.message);
        }
    };
    this.drawGroup = function() {
        $('#'+that.parent.id+" > .con_page").append('<div id="'+that.id+'" class="group"></div>');
        for(var iter in that.tileList)
            that.tileList[iter].drawTile();
    };
}