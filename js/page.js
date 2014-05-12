//page (indivial page)
function page(par, id, title) {
    this.id = id;
    this.parent = par;
    this.title = title;
    this.stored = false;
    this.groupList = {};
    this.numGroups = 0;
    var that = this;

    this.changeTitle = function (title) {
        that.title = title;
    };

    this.addGroup = function (id) {
        that.groupList[id + '_' + (that.numGroups)] = new group(that, id + '_' + (that.numGroups));
        return id + '_' + (that.numGroups++);
    };
    this.removeGroup = function (id) {
        try {
            if (Object.size(that.groupList[id].tileList) !== 0) {
                that.groupList[id].removeAllTiles();
            }
            $('#' + that.groupList[id].id).remove();
            delete that.groupList[id];
        }
        catch (err) {
            that.addAnnon(1, "Error Deleting Group: "+err.message);
        }
    };
    this.removeAllGroups = function () {
        try {
            for (var iter in that.groupList) {
                if (Object.size(that.groupList[iter].tileList) !== 0) {
                    that.groupList[iter].removeAllTiles();
                }
                $('#' + that.groupList[iter].id).remove();
                delete that.groupList[iter];
            }
        }
        catch (err) {
            that.addAnnon(1, "Error Deleting Groups: "+err.message);
        }
    };
    this.drawPage = function (location) {
        if (!that.stored) {
            that.parent.drawSurface.append('<div id="' + that.id + '" class="page ' + ((location === undefined) ? '' : location) + '"><div class="con_page"></div></div>');
            for (var iter in that.groupList) {
                that.groupList[iter].drawGroup();
            }
        }
        else {
            that.parent.drawSurface.append(that.stored);
        }

        $('#' + that.id).addClass(location + 'Slide');
        setTimeout(function () {
            $('#' + that.id).removeClass(location);
            $('#' + that.id).removeClass(location + 'Slide');
        }, 300);
    };
}