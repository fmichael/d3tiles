/* Tile Object */

function tile(parent, id, x, y, type) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.title = '';
    this.size = [x, y];
    this.chart = false;
    this.map = false;
    this.filters = {};
    this.settings = {};

    var that = this;

    this.initializeListeners = function() {
        $('#'+that.parent.id).append("<div id='"+that.id+"' tile-type='"+that.type+"' class='tile tile_"+x+"x"+y+"'>");
        if (that.parent.parent.parent.htmlStorage['tile_'+x+'x'+y+'_'+type] === undefined) {

            $.get('html/tile_'+x+'x'+y+'_'+type+'.html', function(result) {
                that.parent.parent.parent.htmlStorage['tile_'+x+'x'+y+'_'+type] = result;

                $('#'+that.id).append($(result).filter('.front, .back'));
                $('#'+that.id+' .contents').attr('id', 'drawable_'+that.id);

                var innerWidth = $('#'+that.id).find('.title_area').outerWidth();
                var width = $('#'+that.id).find('.setting_span').outerWidth(true) - 6 - (2 * $('#'+that.id).find('button.setting_btn').outerWidth(true));

                if (innerWidth > width) {
                    $('#'+that.id).find('.title_area').css('width', width+'px');
                    $('#'+that.id).find('.title_area > span').addClass('too_long');
                }
                that.startDraw();
            });
        } else {
            $('#'+that.id).append($(that.parent.parent.parent.htmlStorage['tile_'+x+'x'+y+'_'+type]).filter('.front, .back'));
            $('#'+that.id+' .contents').attr('id', 'drawable_'+that.id);
            var innerWidth = $('#'+id).find('.title_area').outerWidth();
            var width = $('#'+that.id).find('.setting_span').outerWidth(true) - 6 - (2 * $('#'+that.id).find('button.setting_btn').outerWidth(true));
            if (innerWidth > width) {
                $('#'+that.id).find('.title_area').css('width', width+'px');
                $('#'+that.id).find('.title_area > span').addClass('too_long');
            }
            that.startDraw();
        }

        $('#'+that.id).draggable({
            opacity: 0.35,
            snap: ".tile",
            snapMode: 'outer',
            containment: "#tileable",
            handle: '.setting_span',
            cursorAt: {left: (that.size[0]*150/2), top: 10},
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

        $('#'+that.id).on('click', '.swap_btn, .fill_btn', function() {
            if (!$(this).closest('.tile').hasClass('flipping')) {
                $(this).closest('.tile').addClass('flipping');
                $(this).closest('.tile').toggleClass('flipped');
                var thee = this;
                setTimeout(function() {
                    if ($(thee).parent().parent().hasClass('front')) {
                        $(thee).parent().parent('.front').addClass('flipped');
                        $(thee).parent().parent().siblings('.back').addClass('flipped');
                        if ($(thee).hasClass('fill_btn'))
                            $(thee).parent().parent().siblings('.back').addClass('filters');
                        else
                            $(thee).parent().parent().siblings('.back').removeClass('filters');
                    }
                    else {
                        $(thee).parent().parent('.back').removeClass('flipped');
                        $(thee).parent().parent().siblings('.front').removeClass('flipped');
                    }
                }, 300);
                setTimeout(function() {
                    $(thee).closest('.tile').removeClass('flipping');
                    if($(thee).hasClass('save_btn'))
                        that.startDraw();
                }, 400);
            }
        });

        $('#'+that.id).on('mouseenter', '.setting_span', function() {
            $(this).find('.setting_btn').addClass('visible');
        })
        .on('mouseleave', '.setting_span', function() {
            $(this).find('.setting_btn').removeClass('visible');
        });

        $('#'+that.id).on('click', '.save_btn', function() {
            if(that.type == 'chart' || that.type == 'table' || that.type == 'number') {
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
                //no need to re-draw since redrawn once flipped back over
            }
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
        setTimeout(function() {
            that.initializeListeners();
        }, 500);
    };

    this.generateChart = function(options, settings, filters) {
        if(that.type == 'chart') {
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
            console.log(stuff);
            stuff.data.groups = [['data1', 'blablablabla', 'data3']];
            //if (that.chart !== false)
            //    that.chart.load(stuff);
            //else
                that.chart = c3.generate(stuff);
        }
    };

    this.startDraw = function() {
        if(that.type == 'chart') {
            var settings = that.parent.settings;
            var filters = that.parent.filters;
            var chart = {};
            chart.bindto = '#drawable_'+that.id;
            chart.type = 'area';
            chart.size = [150 * that.size[0], 150 * that.size[1]];
            chart.data = that.parent.data;
            that.generateChart(chart, mergeObjects(that.settings, settings), mergeObjects(that.filters, filters));
        }
        else if (that.type == 'map') {
            if (that.map !== false)
                that.map.remove(); //remove map to re-draw if needed (options may have changed, etc)
            that.map = L.map('drawable_'+that.id, {
                /*layers: MQ.mapLayer(), *///leaflet + mapquest free map_tiles
                center: [ 40.731701, -73.993411 ],
                zoom: 12
            });
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { //osm tile layer
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            }).addTo(that.map);
        }
        else if (that.type == 'table') {
            $('#drawable_'+that.id).empty();
            var appender = '<div class="table_cont"><table id="table_'+that.id+'" class="table table-bordered"><thead>';
            var objects = [];
            var length = 0;
            for(var iter in that.parent.data) {
                appender += '<th>'+iter+'</th>';
                length = that.parent.data[iter].length;
            }
            appender += '</thead><tbody>';

            for(var x = 0; x < length; x++) {
                objects[x]= {};
            }
            for(var iter in that.parent.data) {
                for(var iteriter in that.parent.data[iter]) {
                    objects[iteriter][iter] = that.parent.data[iter][iteriter];
                }
            }
            appender += '</tbody></table></div>';
            $('#drawable_'+that.id).append(appender);
            $('#table_'+that.id).dynatable({
                features: that.settings,
                dataset: {
                    records: objects
                }
            });
        }
        else if (that.type == 'number') {
            var num = 0;
            var str = (that.settings.label == undefined) ? '' : that.settings.label;
            var type = (that.settings.type == undefined) ? 'count' : that.settings.type;
            if(typeof that.parent.data == 'number') { //a single data value was returned
                num = that.parent.data;
            }
            else {
                switch(type) {
                    case 'count':
                        num = that.parent.data.length;
                        break;
                    case 'sum':
                        for(var x in that.parent.data)
                            num += that.parent.data[x];
                        break;
                    case 'min':
                        num = that.parent.data[0];
                        for(var x in that.parent.data)
                            if(num > that.parent.data[x])
                                num = that.parent.data[x];
                        break;
                    case 'max':
                        num = that.parent.data[0];
                        for(var x in that.parent.data)
                            if(num < that.parent.data[x])
                                num = that.parent.data[x];
                        break;
                    case 'average':
                        var ttl = that.parent.data.length;
                        for(var x in that.parent.data)
                            num += that.parent.data[x];
                        num = parseFloat((num / ttl).toFixed(2));
                }
            }
            //output to boxy box
            $('#drawable_'+that.id).empty();
            $('#drawable_'+that.id).append('<span class="number">'+num+'</span><span class="label">'+str+'</span');
        }
    };

    if(that.parent.parent.parent.activePage == that.parent.parent.id) { //if adding tile to current page
        that.initializeListeners();
    }
}