// PAGES

function page(surf) {

    this.groupsList = {};
    this.surface = surf;
    this.mouseX; //current mouse pos.
    this.mouseY;

    this.menuOpen = false; //if any side menu's are open

    this.notiBool = false; //3 menu bools
    this.tileBool  = false;
    this.dashBool  = false;

    this.width = $(window).width();
    this.height = $(window).height();
    this.midWidth = (this.width/2) - 200;
    this.midHeight = (this.height/2) - 200;
    var that = this;

    this.surface.append('<div class="topButtons"></div>'); //top logout/settings button
    this.surface.append('<div class="notifBar">'+
                            '<div class="notifArea"></div>'+
                            '<input id="notifToggle" type="button" value="Expand" />'+
                        '</div>');
    this.surface.append('<div class="tileDock"></div>');
    this.surface.append('<div class="dashDock"></div>');

    this.addGroup = function(id) {
        that.groupsList[id] = {};
        var html = "<div id='"+id+"' class='groups'></div>";
        that.surface.append(html);
    };

    this.removeGroup = function(id) {
        that.groupsList[id].removeAllTiles();
        delete that.groupsList[id];
    };

    this.showNotifBar = function(autoclose) {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            $('.notifBar').animate({
                top: 0
            }, 200, function(){
                that.menuOpen = false;
            });
        }
        if(autoclose !== undefined && autoclose && !that.notiBool) {
            setTimeout(function(){
                that.hideNotifBar();
            }, 5000); //5 seconds, then close notif
        }
    };
    this.hideNotifBar = function() {
        if(!that.menuOpen)
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
                height: 500
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };
    this.collapseNotifBar = function() {
        if(!that.menuOpen)
        {
            that.menuOpen = true;
            that.notiBool = false;
            $('#notifToggle').val('Expand');
            $('.notifBar').animate({
                height: 50
            }, 200, function(){
                that.menuOpen = false;
            });
        }
    };

    this.addAnnon = function(sev, str) {
        var announce = '<div class="anon announc_'+getSev(sev)+'">'+str+'<i class="close_anon"></i></div>';
        $('.notifArea').prepend(announce);
        that.showNotifBar(true);
    };

    this.removeAnnon = function(annon) {
        annon.remove();
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

    $('div.notifBar').on("mouseleave", function() {
        setTimeout(function(){
            if(!that.notiBool)
                that.hideNotifBar();
        }, 1000);
    });
    $('div.tileDock').on("mouseleave", function() {
        setTimeout(function(){
            that.hideTileDock();
        }, 1000);
    });
    $('div.dashDock').on("mouseleave", function() {
        setTimeout(function(){
            that.hideDashDock();
        }, 1000);
    });

    $('#notifToggle').click(function(){
        if (!that.notiBool)
            that.expandNotifBar();
        else
            that.collapseNotifBar();
    });

    $(this.surface).on('click', '.close_anon', function() {
        that.removeAnnon($(this).parent());
    });

    this.surface.on('mousemove', function(e) {
        that.mouseX = e.clientX;
        that.mouseY = e.clientY;

        if(that.mouseX > that.midWidth && that.mouseX < that.midWidth + 400)
        {
            if(that.mouseY > that.height - 75)
                that.showDashDock();

            else if(that.mouseY <= 50)
                that.showNotifBar();
        }

        if(that.mouseY > that.midHeight && that.mouseY < that.midHeight + 400)
        {
            if(that.mouseX <= 75)
                that.showTileDock();
        }
    });
}

//groups

function groups() {
    this.dragging = false;

    this.addData = function(id, data) {
        groups.groupList[id].data = data;
    };

    this.addFilters = function(id, filters) {
        groups.groupList[id].filters = filters;
    };
    this.addSettings = function(id, settings) {
        groups.groupList[id].settings = settings;
    };
    this.addTiles = function(id, tiles) {
        for(var iter in tiles)
            groups.groupList[id].tiles[iter] = new tile(id, iter, tiles[iter].x, tiles[iter].y);
    };
    this.removeAllTiles = function() {
        console.log("Remove all tiles here");
    };
    this.removeTile = function(id, tile) {
        $('#'+groups.groupList[id].tiles[tile].id).remove();
        delete groups.groupList[id].tiles[tile];
    };
}

/* Tile Object */

function tile(parent, id, x, y) {
    this.id = id;
    this.parent = parent;
    this.size = [x, y];
    this.chart = null;
    this.filters = {};
    this.settings = {};

    var that = this;
    var html = "<div id='"+this.id+"' class='tile tile_"+x+"x"+y+"'>";
    $('#'+this.parent).append(html);

    $.get('tiles/tile_'+x+'x'+y+'.html', function(result) {
        $('#'+id).append(result);
        that.drawChart();
    });

    $('#'+this.id).draggable({
        opacity: 0.35,
        snap: ".tile",
        snapMode: 'outer',
        containment: "#tileable",
        handle: '.setting_span',
    });

    $('#'+this.id).on('dragstart', function(e, ui) { //moving tile around
        $('.garbage').addClass('visible');
        groups.dragging = true;
    });

    $('#'+this.id).on('dragstop', function(e, ui) { //moving tile around
        //check if over trash can
        var trash = $('.garbage');
        if (mouseX >= trash.offset().left && mouseX <= trash.offset().left + trash.outerWidth() &&
            mouseY >= trash.offset().top && mouseY <= trash.offset().top + trash.outerHeight()) {
            groups.removeTile(that.parent, that.id);
        }

        $('.garbage').removeClass('visible');
        groups.dragging = false;
    });

    $('#'+this.id).on('click', '.save_btn', function() {
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
                            if($(this).val() != '')
                                value = $(this).val();
                        break;
                    }
                    found = true;
                }
                else if ($(this).context.localName == 'textarea') {
                    if($(this).val() != '') {
                        value = $(this).val();
                        found = true;
                    }
                }
                else if ($(this).context.localName == 'select') {
                    if($(this).val() != '') {
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

    this.addFilters = function(filters) {
        this.filters = filters;
    };

    this.addSettings = function(settings) {
        this.settings = settings;
    };

    this.addTitle = function(title) {
        this.title = title;
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
                    max: parseInt(filters.max),
                    min: parseInt(filters.min),
                }
            };
        }
        stuff.data.groups = [['data1', 'data2']];
        chart = c3.generate(stuff);
    };

    this.drawChart = function() {
        var settings = groups.groupList[parent].settings;
        var filters = groups.groupList[parent].filters;
        var chart1 = {};
        chart1.bindto = '#'+id+' > .front > .contents';
        chart1.type = 'area';
        chart1.size = [150 * this.size[0], 150 * this.size[1]];
        chart1.data = groups.groupList[parent].data;
        this.generate(chart1, mergeObjects(this.settings, settings), mergeObjects(this.filters, filters));
    };
}

//merge Objects, tile > group precendance
function mergeObjects(tileObj, groupObj) {
    if (groupObj == undefined)
        groupObj = {};
    for(var iter in tileObj)
        groupObj[iter] = tileObj[iter];
    return groupObj;
}

function addTrash(surface) {
    var trash = '<div class="garbage">TRASH</div>';
    surface.append(trash);
}

function makeSize(surface) {
    var w = '100%';
    var h = $(document).height();
    surface.css('height', (h-16)+'px');
}

function getSev(num) {
    switch(num) {
        case 1:
            return 'severe';
        break;
        case 2:
            return 'warning';
        break;
        case 3:
            return 'info';
        break;
        case 4:
            return 'success';
        break;
        case 5:
        default:
            return 'default';
    }
}

var data = [
    ['data1', 20, 200, 150, 200, 120, 240, 40, 25, 105, 410, 100, 90],
    ['data2', 150, 59, 50, 260, 700, 10, 70, 60, 10, 70, 0, 200]
];

var page;

$( document ).ready(function() {
/*
    addTrash(surface);*/
    makeSize($('#tileable'));
/*
    groups = new groups();*/
    page = new page($('#tileable'));


    /*groups.add('first');
    groups.addData('first', data);
    groups.addTiles('first', {'chart': {x:3, y:2}});

    groups.add('second');
    groups.addData('second', data);
    groups.addTiles('first', {'tile2': {x:2, y:2}});*/


});

$(window).resize(function(){
    page.width = $(window).width();
    page.height = $(window).height();
    page.midWidth = (page.width/2) - 200;
    page.midHeight = (page.height/2) - 200;
});

/*var system = require('system');

// Web Address (URL) of the page to capture
var url  = system.args[1];

// File name of the captured image
var file = system.args[2]  + ".png";

var page = require('webpage').create();

// Browser size - height and width in pixels
// Change the viewport to 480x320 to emulate the iPhone
page.viewportSize = { width: 1200, height : 800 };

// Set the User Agent String
// You can change it to iPad or Android for mobile screenshots
page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.56 Safari/536.5";

// Render the screenshot image
page.open ( url, function ( status ) {
  if ( status !== "success") {
       console.log("Could not open web page : " + url);
       phantom.exit();
   } else {
       window.setTimeout ( function() {
          page.render(file);
          console.log("Download the screenshot : " + file);
          phantom.exit();
       }, 1000);
   }
});*/

/*var chart = null;
$( document ).ready(function() {

    var chart1 = {};
    chart1.bindto = '#tile1 > .front > .contents';
    chart1.type = 'area';
    chart1.size = [300, 300];
    chart1.data = [
                ['data1', 20, 200, 150, 200, 120, 240, 40, 25, 105, 410, 100, 90],
                ['data2', 150, 59, 50, 260, 700, 10, 70, 60, 10, 70, 0, 200]
            ];
    generate(chart1);


    var chart2 = {};
    chart2.bindto = '#tile2 > .front > .contents';
    chart2.type = 'area';
    chart2.size = [600, 450];
    chart2.data = [
                ['data1', 40, 100, 200, 40, 80, 60, 90, 10, 40, 09, 70, 50],
                ['data2', 60, 40, 0, 60, 70, 110, 200, 400, 90, 70, 60, 250]
            ];
    generate(chart2);

    $(document).on('click', '.save_btn', function() {
        chart1.type = $(this).parent().siblings('.contents').children('select.type').val();

        chart1.subchart = $(this).parent().siblings('.contents').children('input.range').is(":checked") ? true : false;

        chart1.legend = $(this).parent().siblings('.contents').children('input.legend').is(":checked") ? true : false;

        chart1.zoom = $(this).parent().siblings('.contents').children('input.zoom').is(":checked") ? true : false

        chart1.min = $(this).parent().siblings('.contents').children('input.min').val();
        chart1.max = $(this).parent().siblings('.contents').children('input.max').val();

        generate(chart1);
    });
    function generate(options) {
        var stuff = {};

        if("data" in options) {
            stuff.data = {columns: options.data};
        }
        if("legend" in options) {
            stuff.legend = {show: options.legend};
        }
        if("size" in options) {
            stuff.size = {width: options.size[0], height: options.size[1]};
        }
        if("bindto" in options) {
            stuff.bindto = options.bindto;
        }
        if("type" in options) {
            stuff.data.type = options.type;
        }
        if("subchart" in options) {
            stuff.subchart = {show: options.subchart};
        }
        if("zoom" in options) {
            stuff.zoom = {enabled: options.zoom};
        }
        if("min" in options && "max" in options) {
            stuff.axis = {
                y: {
                    max: parseInt(options.max),
                    min: parseInt(options.min),
                }
            };
        }
        stuff.data.groups = [['data1', 'data2']];

        chart = c3.generate(stuff);

        //example data retrieval function for filtering.
        for(target in chart.data.targets)
        {
            console.log(chart.data.targets[target].id+": "+chart.data.get(chart.data.targets[target].id));
        }
    }

    function newData(data) {
        if (data.type == 'column')
            chart.load({
                columns: data.data,
                unload: data.unload,
            });
        else
            chart.load({
                rows: data.data,
                unload: data.unload,
            });
    }

    //example new data example
    setTimeout(function() {
        var objs = {
            data:[
                ['data1', 20, 200, 150, 200, 120, 240, 40, 25, 105, 410, 100, 90],
                ['data2', 150, 59, 50, 260, 700, 10, 70, 60, 10, 70, 0, 200]
            ],
            type: 'column',
            unload: [],
        };
        newData(objs);
    }, 2000);

    setTimeout(function() {
        var objs = {
            data:[
                ['data1', 40, 100, 200, 40, 80, 60, 90, 10, 40, 09, 70, 50],
                ['data2', 60, 40, 0, 60, 70, 110, 200, 400, 90, 70, 60, 250]
            ],
            type: 'column',
            unload: [],
        };
        newData(objs);
    }, 4000);
});*/

