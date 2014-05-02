/* Groups Storage Object */

function page() {

    this.groups;
    this.surface;
    this.mouseX;
    this.mouseY;
    this.notifBool = false;
    this.notifExpanded = false;
    this.tileBool  = false;
    this.dashBool  = false;
    this.width = $(window).width();
    this.height = $(window).height();
    this.midWidth = (this.width/2) - 200;
    this.midHeight = (this.height/2) - 200;
    var that = this;

    this.showNotifBar = function() {
        if(!that.notifBool)
        {
            that.notifBool = true;
            $('.notifBar').animate({
                top: 0
            }, 200, function(){
                that.notifBool = false;
            });
        }
    };
    this.hideNotifBar = function() {
        if(!that.notifBool)
        {
            that.notifBool = true;
            $('.notifBar').animate({
                top: -60
            }, 200, function(){
                that.notifBool = false;
            });
        }
    };
    this.expandNotifBar = function() {
        if(!that.notifBool)
        {
            that.notifBool = true;
            that.notifExpanded = true;
            $("#notifExpand").css('display', 'none');
            $("#notifCollapse").css('display', 'block');
            $('.notifBar').animate({
                height: 500
            }, 200, function(){
                that.notifBool = false;
            });
        }
    };
    this.collapseNotifBar = function() {
        if(!that.notifBool)
        {
            that.notifBool = true;
            that.notifExpanded = false;
            $("#notifCollapse").css('display', 'none');
            $("#notifExpand").css('display', 'block');
            $('.notifBar').animate({
                height: 50
            }, 200, function(){
                that.notifBool = false;
            });
        }
    };

    this.showTileDock = function() {
        if(!that.tileBool)
        {
            that.tileBool = true
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
            if(!that.notifExpanded)
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

    $('#notifExpand').click(function(){
        that.expandNotifBar();
    });
    $('#notifCollapse').click(function(){
        that.collapseNotifBar();
    });

}



var page;

function groups() {
    this.groupList = {};
    this.dragging = false;

    this.add = function(id) {
        groups.groupList[id] = {tiles: {}};
        var html = "<div id='"+id+"' class='groups'></div>";
        surface.append(html);
    };

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
    this.removeTile = function(id, tile) {

        console.log(groups.groupList[id].tiles[tile]);
        $('#'+groups.groupList[id].tiles[tile].id).remove();
        delete groups.groupList[id].tiles[tile];
    };
    this.printGroups = function() {
        for(var iter in groups.groupList)
            console.log(iter, groups.groupList[iter]);
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
            console.log(that.parent, that.id);
            groups.removeTile(that.parent, that.id);
        }

        $('.garbage').removeClass('visible');
        groups.dragging = false;
    });

    this.addFilters = function(filters) {
        this.filters = filters;
    };

    this.settings = function(settings) {
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

        console.log(stuff);
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
        this.generate(chart1, settings, filters);
    };
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

$(document).on('mousemove', function(e) {
    page.mouseX = e.clientX;
    page.mouseY = e.clientY;

    if(page.mouseX > page.midWidth && page.mouseX < page.midWidth + 400)
    {
        if(page.mouseY > page.height - 75)
            page.showDashDock();

        if(page.mouseY <= 50)
            page.showNotifBar();
    }
    
    if(page.mouseY > page.midHeight && page.mouseY < page.midHeight + 400)
    {
        if(page.mouseX <= 75)
            page.showTileDock();
    }
});


var data = [
    ['data1', 20, 200, 150, 200, 120, 240, 40, 25, 105, 410, 100, 90],
    ['data2', 150, 59, 50, 260, 700, 10, 70, 60, 10, 70, 0, 200]
];

$( document ).ready(function() {
    surface = $('#tileable');
    addTrash(surface);
    makeSize(surface);
    groups = new groups();
    page = new page();
    

    groups.add('first');
    groups.addData('first', data);
    groups.addTiles('first', {'chart': {x:3, y:2}});

    groups.add('second');
    groups.addData('second', data);
    groups.addTiles('first', {'tile2': {x:2, y:2}});

    
});

$(window).resize(function(){
    page.width = $(window).width();
    page.height = $(window).height();
    page.midWidth = (page.width/2) - 200;
    page.midHeight = (page.height/2) - 200; 
});

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

