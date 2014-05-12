/* Tile Object */

function tile(parent, id, x, y, type, title, settings, filters) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.title = title;
    this.size = [x, y];
    this.interactiveObject = false;
    this.source = this.parent.parent.parent.htmlStorage['tile_'+x+'x'+y+'_'+type];
    this.filters = filters;
    this.settings = settings;

    var that = this;

    this.initializeListeners = function() {

        if ($(that.source).filter('script.saving_function').length > 0) { //add custom functions
            that.parent.parent.parent.drawSurface.append($(that.source).filter('script.saving_function')[0]);
            that.privSaving = eval('tile_'+that.size[0]+'x'+that.size[1]+'_'+that.type+'_save');
        }
        if ($(that.source).filter('script.drawing_function').length > 0) {
            that.parent.parent.parent.drawSurface.append($(that.source).filter('script.drawing_function')[0]);
            that.privDraw = eval('tile_'+that.size[0]+'x'+that.size[1]+'_'+that.type+'_draw');
        }

        $('#'+that.parent.id).append("<div id='"+that.id+"' tile-type='"+that.type+"' class='tile tile_"+x+"x"+y+"'>"); //create container and grab html
        if (that.source === undefined) { //if we havn't loaded already, should never be called
            $.get('html/tile_'+x+'x'+y+'_'+type+'.html', function(result) {
                that.source = result;
            });
        }

        $('#'+that.id).append($(that.source).filter('.front, .back'));
        $('#'+that.id+' .contents').attr('id', 'drawable_'+that.id);
        $('#'+that.id+' .tile_title').text(that.title);
        var innerWidth = $('#'+id).find('.title_area').outerWidth();
        var width = $('#'+that.id).find('.setting_span').outerWidth(true) - 6 - (2 * $('#'+that.id).find('button.setting_btn').outerWidth(true));
        if (innerWidth > width) {
            $('#'+that.id).find('.title_area').css('width', width+'px');
            $('#'+that.id).find('.title_area > span').addClass('too_long');
        }
        that.privDraw();

        $('#'+that.id).draggable({
            opacity: 0.35,
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
                        that.privDraw();
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
            that.privSaving();
        });
    };

    this.addFilters = function(filters) {
        this.filters = filters;
    };

    this.addSettings = function(settings) {
        this.settings = settings;
    };

    this.setTitle = function(title) {
        this.title = title;
        toggleMarquee(that.id);
    };

    this.drawTile = function() {
        setTimeout(function() {
            that.initializeListeners();
        }, 500);
    };

    this.privSaving = function() {
        //create default function? shouldn't ever be used tho //Function for each tile is stored in their file
    };

    this.privDraw = function() {
        //create default function? shouldn't ever be used tho
    };

    if(that.parent.parent.parent.activePage == that.parent.parent.id) { //if adding tile to current page
        that.initializeListeners();
    }
}