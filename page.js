// screen (collection of page)

function screen(surf) {

    this.pageList = {};
    this.activePage = '';
    this.drawSurface = surf;
    this.mouseX = 0; //current mouse pos.
    this.mouseY = 0;
    this.counter = 0;

    this.menuOpen = false; //if any side menu's are open

    this.notiBool = false; //4 menu bools
    this.tileBool = false;
    this.dashBool = false;
    this.settBool = false;

    this.dragging = false; //if we are moving a tile

    this.width = $(document).width();
    this.height = $(document).height();
    this.midWidth = (this.width/2) - 200;
    this.midHeight = (this.height/2) - 200;
    var that = this;

    this.drawSurface.append('<div class="topButtons"><i class="icon_logout"></i><i class="icon_setting"></i></div>'); //top logout/settings button
    this.drawSurface.append('<div class="notifBar">'+
                                '<div class="notifArea"></div>'+
                                '<input id="notifToggle" type="button" value="Expand" />'+
                            '</div>');
    this.drawSurface.append('<div class="tileDock"></div>');
    this.drawSurface.append('<div class="dashDock"><div class="container"><button id="addAPage">+</button></div></div>');
    this.drawSurface.append('<div class="garbage">TRASH</div>');
    this.drawSurface.css('height', ($(document).height()-16)+'px');

    this.addPage = function(id) {
        that.pageList[id] = new page(that, id);
    };

    this.removePage = function(id) {
        try {
            if (Object.size(that.pageList[id].groupList) !== 0)
                that.pageList[id].removeAllGroups();
            $('#'+that.pageList[id].id).remove();
            $('.pageButton[page-id="'+that.pageList[id].id+'"]').remove();
            if (that.activePage == that.pageList[id].id)
                that.activePage = '';
            delete that.pageList[id];
        }
        catch(err) {
            console.error("Error Deleting Page: "+err.message);
        }
    };

    this.removeAllPages = function() {
        try {
            for(var iter in that.pageList) {
                if (Object.size(that.pageList[iter].groupList) !== 0)
                    that.pageList[iter].removeAllGroups();
                $('#'+that.pageList[iter].id).remove();
                $('.pageButton[page-id="'+that.pageList[iter].id+'"]').remove();
                if (that.activePage == that.pageList[iter].id)
                    that.activePage = '';
                delete that.pageList[iter];
            }
        }
        catch(err) {
            console.error("Error Deleting Pages: "+err.message);
        }
    };

    this.changeToPage = function(id) {
        if (typeof that.pageList[id] != "undefined" && that.activePage != id) {
            if(that.activePage !== '') {
                //$('#'+that.pageList[that.activePage].id).addClass('slideLeft');
                //setTimeout(function() {
                    that.pageList[that.activePage].stored = $('#'+that.pageList[that.activePage].id).detach();
                //}, 400);
            }
            that.activePage = id;
            if(that.pageList[id].stored === false) {
                that.pageList[id].drawPage('floatTop');
            }
            else
                that.drawSurface.append(that.pageList[id].stored);
        }
    };

    this.showNotifBar = function(autoclose) {
        if(!that.menuOpen && $('.notifArea').children().length > 0)
        {
            that.menuOpen = true;
            $('.notifBar').animate({
                top: 0
            }, 200, function(){
                that.menuOpen = false;
            });
        }
        if(typeof autoclose != "undefined" && autoclose && !that.notiBool) {
            setTimeout(function(){
                that.hideNotifBar();
            }, 5000); //5 seconds, then close notif
        }
    };
    this.hideNotifBar = function() {
        if(!that.menuOpen && !that.notiBool)
        {
            that.menuOpen = true;
            $('.notifBar').animate({
                top: -60
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };
    this.expandNotifBar = function() {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            that.notiBool = true;
            $('#notifToggle').val('Collapse');
            $('.notifBar').animate({
                height: that.height*0.75
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };
    this.collapseNotifBar = function(closeAfter) {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            that.notiBool = false;
            $('#notifToggle').val('Expand');
            $('.notifBar').animate({
                height: 50
            }, 200, function(){
                that.menuOpen = false;
                if(closeAfter)
                    that.hideNotifBar();
            });
        }
    };

    this.addAnnon = function(sev, str) {
        var announce = '<div class="anon announc_'+getSev(sev)+'">'+str+'<i class="close_anon"></i></div>';
        $('.notifArea').prepend(announce);
        that.showNotifBar(true);
    };

    this.removeAnnon = function(annon) {
        try {
            annon.remove();
            if($('.notifArea').children().length === 0)
                that.collapseNotifBar(true);
        }
        catch (err) {
            console.error("Error Deleting Notification: "+err.message);
        }
    };

    this.showTileDock = function() {
        if(!that.tileBool)
        {
            that.tileBool = true;
            $('.tileDock').animate({
                left: 0
            }, 250, function(){
                that.tileBool = false;
            });
        }
    };
    this.hideTileDock = function() {
        if(!that.tileBool)
        {
            that.tileBool = true;
            $('.tileDock').animate({
                left: -310
            }, function(){
                that.tileBool = false;
            });
        }
    };

    this.showDashDock = function() {
        if(!that.dashBool)
        {
            that.dashBool = true;
            $('.dashDock').animate({
                bottom: 0
            }, 200, function(){
                that.dashBool = false;
            });
        }
    };
    this.hideDashDock = function() {
        if(!that.dashBool)
        {
            that.dashBool = true;
            $('.dashDock').animate({
                bottom: -85
            }, function(){
                that.dashBool = false;
            });
        }
    };

    this.showSettingDock = function() {
        if(!that.settBool)
        {
            that.settBool = true;
            $('.topButtons').addClass('in');
            $('.topButtons').animate({
                right: -100,
                top: -100
            }, function(){
                that.settBool = false;
            });
        }
    };

    this.hideSettingDock = function() {
        if(!that.settBool)
        {
            that.settBool = true;
            $('.topButtons').removeClass('in');
            $('.topButtons').animate({
                right: -250,
                top: -250
            }, function(){
                that.settBool = false;
            });
        }
    };

    $('div.notifBar').on("mouseleave", function() {
        setTimeout(function(){
            if(!that.notiBool && !$('div.notifBar').is(":hover"))
                    that.hideNotifBar();
        }, 1000);
    });
    $('div.tileDock').on("mouseleave", function() {
        setTimeout(function(){
            if (!$('div.tileDock').is(":hover"))
            that.hideTileDock();
        }, 1000);
    });
    $('div.dashDock').on("mouseleave", function() {
        setTimeout(function(){
            if (!$('div.dashDock').is(":hover"))
                that.hideDashDock();
        }, 1000);
    });

    $('div.topButtons').on("mouseleave", function() {
        setTimeout(function(){
            if (!$('div.topButtons').is(":hover"))
                that.hideSettingDock();
        }, 1000);
    });

    $('#notifToggle').click(function(){
        if (!that.notiBool)
            that.expandNotifBar();
        else
            that.collapseNotifBar();
    });

    $('#addAPage').click(function(){
        var id = 'page_'+(++that.counter);

        viewable.addPage(id);
        $('.dashDock .container').css('width', (that.counter+1) * $('#addAPage').outerWidth(true));
        $('.dashDock .container').append("<button page-id='"+id+"' class='pageButton' >"+id+"</button>");
        viewable.pageList['page_'+that.counter].addGroup('group_'+that.counter);
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter].addData(makeData());
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter].addTile('tile_'+that.counter, 3, 2, 'chart');

        /*viewable.pageList['page_'+that.counter].addGroup('group_'+that.counter+1);
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+1].addData(makeData());
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+1].addTile('tile_'+that.counter+1, 3, 2, 'chart');

        viewable.pageList['page_'+that.counter].addGroup('group_'+that.counter+2);
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+2].addData(makeData());
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+2].addTile('tile_'+that.counter+2, 3, 2, 'chart');

        viewable.pageList['page_'+that.counter].addGroup('group_'+that.counter+3);
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+3].addData(makeData());
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+3].addTile('tile_'+that.counter+3, 3, 2, 'chart');

        viewable.pageList['page_'+that.counter].addGroup('group_'+that.counter+4);
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+4].addData(makeData());
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+4].addTile('tile_'+that.counter+4, 3, 2, 'chart');

        viewable.pageList['page_'+that.counter].addGroup('group_'+that.counter+5);
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+5].addData(makeData());
        viewable.pageList['page_'+that.counter].groupList['group_'+that.counter+5].addTile('tile_'+that.counter+5, 3, 2, 'chart');*/
    });

    $(this.drawSurface).on('click', '.pageButton', function(){
        that.changeToPage($(this).attr('page-id'));
    });

    $(this.drawSurface).on('click', '.close_anon', function() {
        that.removeAnnon($(this).parent());
    });

    this.drawSurface.on('mousemove', function(e) {
        that.mouseX = e.clientX;
        that.mouseY = e.clientY;

        if (that.mouseX >= that.width - 25 && that.mouseY <= 25) {
            that.showSettingDock();
        }

        if(that.mouseX > that.midWidth && that.mouseX < that.midWidth + 400)
        {
            if(that.mouseY > that.height - 15)
                that.showDashDock();

            else if(that.mouseY <= 15)
                that.showNotifBar();
        }

        if(that.mouseY > that.midHeight && that.mouseY < that.midHeight + 400)
        {
            if(that.mouseX <= 15)
                that.showTileDock();
        }
    });
}

//page (indivial page)

function page(par, id) {
    this.id = id;
    this.parent = par;
    this.stored = false;
    this.groupList = {};
    var that = this;

    this.addGroup = function(id) {
        that.groupList[id] = new group(that, id);
        if(that.parent.activePage == that.id)
            $('#'+that.id).append('<div id="'+id+'"></div>');
    };
    this.removeGroup = function(id) {
        try {
            if (Object.size(that.groupList[id].tileList) !== 0)
                that.groupList[id].removeAllTiles();
            $('#'+that.groupList[id].id).remove();
            delete that.groupList[id];
        }
        catch (err) {
            console.error("Error Deleting Group: "+err.message);
        }
    };
    this.removeAllGroups = function() {
        try {
            for(var iter in that.groupList) {
                if (Object.size(that.groupList[iter].tileList) !== 0)
                    that.groupList[iter].removeAllTiles();
                $('#'+that.groupList[iter].id).remove();
                delete that.groupList[iter];
            }
        }
        catch (err) {
            console.error("Error Deleting Groups: "+err.message);
        }
    };
    this.drawPage = function(location) {
        that.parent.drawSurface.append('<div id="'+that.id+'" class="page '+((location === undefined) ? '' : location)+'"><div class="con_page"></div></div>');
        for(var iter in that.groupList)
            that.groupList[iter].drawGroup();
        $('#'+that.id).addClass(location+'Slide');
        setTimeout(function() {
            $('#'+that.id).removeClass(location);
            $('#'+that.id).removeClass(location+'Slide');
        }, 5000);
    };
}

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

/* Tile Object */

function tile(parent, id, x, y, type) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.title = '';
    this.size = [x, y];
    this.chart = null;
    this.filters = {};
    this.settings = {};

    var that = this;
    if(that.parent.parent.parent.activePage == that.parent.parent.id) {
        that.initializeListeners();
    }

    this.initializeListeners = function() {
        $('#'+this.parent.id).append("<div id='"+this.id+"' class='tile tile_"+x+"x"+y+"'>");

        $.get('tiles/tile_'+x+'x'+y+'.html', function(result) {
            $('#'+id).append(result);
            var innerWidth = $('#'+id).find('.title_area').outerWidth();
            var width = $('#'+id).find('.setting_span').outerWidth(true) - 6 - (2 * $('#'+id).find('button.setting_btn').outerWidth(true));
            if (innerWidth > width) {
                $('#'+id).find('.title_area').css('width', width+'px');
                $('#'+id).find('.title_area > span').addClass('too_long');
            }

            that.drawChart();
        });

        $('#'+that.id).draggable({
            opacity: 0.35,
            snap: ".tile",
            snapMode: 'outer',
            containment: "#tileable",
            handle: '.setting_span',
        });

        $('#'+that.id).on('dragstart', function(e, ui) { //moving tile around
            $('.garbage').addClass('visible');
            that.parent.parent.parent.dragging = true;
        });

        $('#'+that.id).on('dragstop', function(e, ui) { //moving tile around
            //check if over trash can
            var trash = $('.garbage');
            if (that.parent.parent.parent.mouseX >= trash.offset().left && that.parent.parent.parent.mouseX <= trash.offset().left + trash.outerWidth() &&
                that.parent.parent.parent.mouseY >= trash.offset().top && that.parent.parent.parent.mouseY <= trash.offset().top + trash.outerHeight()) {
                that.parent.removeTile(that.id);
            }

            $('.garbage').removeClass('visible');
            that.parent.parent.parent.dragging = false;
        });

        $('#'+that.id).on('click', '.save_btn', function() {
            $(this).closest('.back').find('.contents').children().each(function() {
                var which = 'settings';
                if ($(this).hasClass('settings'))
                    which = 'settings';
                else if ($(this).hasClass('filter'))
                    which = 'filters';
                $(this).children().each(function() {
                    var value = false;
                    var found = false;
                    //grab each setting
                    if ($(this).context.localName == 'input') {
                        switch($(this).attr('type')) {
                            case 'checkbox':
                                if($(this).is(":checked"))
                                    value = true;
                                else
                                    value = false;
                            break;
                            case 'radio':
                                if($(this).is(":checked"))
                                    value = true;
                                else
                                    value = false;
                            break;
                            case 'text':
                            case 'number':
                            case 'range':
                            case 'input':
                                if($(this).val() !== '')
                                    value = $(this).val();
                            break;
                        }
                        found = true;
                    }
                    else if ($(this).context.localName == 'textarea') {
                        if($(this).val() !== '') {
                            value = $(this).val();
                            found = true;
                        }
                    }
                    else if ($(this).context.localName == 'select') {
                        if($(this).val() !== '') {
                            value = $(this).val();
                            found = true;
                        }
                    }
                    if (found) {
                        if (which == 'settings')
                            that.settings[$(this).attr('setFilt')] = value;
                        else
                            that.filters[$(this).attr('setFilt')] = value;
                    }
                });
            });
            that.drawChart();
        });
    };

    this.addFilters = function(filters) {
        this.filters = filters;
    };

    this.addSettings = function(settings) {
        this.settings = settings;
    };

    this.addTitle = function(title) {
        this.title = title;
        toggleMarquee(that.id);
    };

    this.drawTile = function() {
        that.initializeListeners();
    };

    this.generate = function(options, settings, filters) {
        var stuff = {};
        if("data" in options) {
            stuff.data = {columns: options.data};
        }
        if("legend" in settings) {
            stuff.legend = {show: settings.legend};
        }
        if("size" in options) {
            stuff.size = {width: options.size[0], height: options.size[1]};
        }
        if("bindto" in options) {
            stuff.bindto = options.bindto;
        }
        if("type" in settings) {
            stuff.data.type = settings.type;
        }
        if("subchart" in settings) {
            stuff.subchart = {show: settings.subchart};
        }
        if("zoom" in settings) {
            stuff.zoom = {enabled: settings.zoom};
        }
        if("min" in filters && "max" in filters) {
            stuff.axis = {
                y: {
                    max: parseInt(filters.max, 10),
                    min: parseInt(filters.min, 10),
                }
            };
        }
        stuff.data.groups = [['data1', 'blablablabla', 'data3']];
        chart = c3.generate(stuff);
    };

    this.drawChart = function() {
        var settings = that.parent.settings;
        var filters = that.parent.filters;
        var chart = {};
        chart.bindto = '#'+id+' > .front > .contents';
        chart.type = 'area';
        chart.size = [150 * that.size[0], 150 * that.size[1]];
        chart.data = that.parent.data;
        that.generate(chart, mergeObjects(that.settings, settings), mergeObjects(that.filters, filters));
    };
}

//merge Objects, tile > group precendance
function mergeObjects(tileObj, groupObj) {
    if (groupObj === undefined)
        groupObj = {};
    for(var iter in tileObj)
        groupObj[iter] = tileObj[iter];
    return groupObj;
}

function getSev(num) {
    switch(parseInt(num, 10)) {
    case 1:
        return 'severe';
    case 2:
        return 'warning';
    case 3:
        return 'info';
    case 4:
        return 'success';
    default:
        return 'default';
    }
}

function toggleMarquee(obj) {
    var innerWidth = $('#'+obj).find('.title_area').outerWidth();
    var width = $('#'+obj).find('.setting_span').outerWidth(true) - 6 - (2 * $('#'+obj).find('button.setting_btn').outerWidth(true));
    if (innerWidth > width) {
        $('#'+obj).find('.title_area').css('width', width+'px');
        $('#'+obj).find('.title_area > span').addClass('too_long');
    }
    else {
        $('#'+obj).find('.title_area > span').removeClass('too_long');
    }
}

function makeData() {
    var data = [];
    for(var x = 0; x < (Math.floor(Math.random() * 1) + 1); x++) {
        data[x] = [];
        for(var y = 0; y < (Math.floor(Math.random() * 30) + 1); y++)
            data[x][y] = Math.floor(Math.random() * 100) + 1;
    }
    return data;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var viewable;

$(document).ready(function() {
    viewable = new screen($('#tileable'));
});

$(window).resize(function(){
    viewable.width = $(window).width();
    viewable.height = $(window).height();
    viewable.midWidth = (viewable.width/2) - 200;
    viewable.midHeight = (viewable.height/2) - 200;
});