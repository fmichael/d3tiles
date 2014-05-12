// screen (collection of page)

function screen(surf, baseTiles) {

    this.pageList = {};
    this.availableBaseTiles = baseTiles;
    this.activePage = '';
    this.drawSurface = surf;
    this.mouseX = 0; //current mouse pos.
    this.mouseY = 0;

    this.menuOpen = false; //if any side menu's are open

    this.notiBool = false; //4 menu bools
    this.tileBool = false;
    this.dashBool = false;
    this.settBool = false;

    this.dragging = false; //if we are moving a tile
    this.modalOpen = false;
    this.htmlStorage = {};

    this.addPage = function(id, title) {
        that.pageList[id] = new page(that, id, title);
        $('.dashDock .container').css('width', ($('.container > button').length+1) * $('#addAPage').outerWidth(true));
        $('.dashDock .container').append("<button page-id='"+id+"' class='pageButton' >"+title+"</button>");
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
            //if first page:
            var slideIn = '';
            var slideOut = '';
            if(that.activePage === '') {
                slideIn = 'floatTop';
                that.pageList[id].drawPage(slideIn);
                that.activePage = id;
            }
            else {
                var newPage = $('.pageButton[page-id="'+id+'"').position().left;
                var oldPage = $('.pageButton[page-id="'+that.activePage+'"').position().left;
                if (newPage < oldPage) { //if sliding new from right
                    slideIn = 'floatRightSlide';
                    slideOut = 'floatLeftSlide';
                }
                else { //if sliding new from left
                    slideIn = 'floatLeftSlide';
                    slideOut = 'floatRightSlide';
                }
                that.pageList[id].drawPage(slideIn);
                $('#'+that.activePage).addClass(slideOut);
                setTimeout(function() {
                    that.pageList[that.activePage].stored = $('#'+that.pageList[that.activePage].id).detach();
                    that.activePage = id;
                }, 750);
            }
        }
    };

    this.showNotifBar = function(autoclose) {
        if(!that.menuOpen && $('.notifArea').children().length > 0 && !that.dragging)
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
                top: -65
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
        if(!that.tileBool && !that.modalOpen && !that.dragging && that.activePage !== '')
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
        if(!that.dashBool && !that.modalOpen && !that.dragging)
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
        if(!that.settBool && !that.modalOpen && !that.dragging)
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

    this.addModal = function(file, extra) {
        that.modalOpen = true;
        extra = (extra === undefined) ? '' : '_'+extra;
        that.hideDashDock();
        that.hideTileDock();
        that.drawSurface.append('<div class="modalBack opacityFade"></div>');
        if(that.htmlStorage[file+extra] === undefined) {
            try {
                $.get('html/'+file+extra+'.html', function(result) { //may be a tile or modal, etc
                    that.htmlStorage[file+extra] = result;
                    that.privOpenModal($(result).filter('.modal')); //store obj so we don't fetch again
                });
            }
            catch(err) {
                console.error("Failed to Load Page: "+err.message);
            }
        }
        else {
            that.privOpenModal($(that.htmlStorage[file+extra]).filter('.modal'));
        }
    };

    this.privOpenModal = function(obj) {
        that.drawSurface.append(obj);
        var direction = new RegExp("float.*Slide").exec($('.modal').attr('class'))[0];
        setTimeout(function() {
            $('.modalBack').css('opacity', 1);
            $('.modal.'+direction).removeClass(direction);
        }, 250);
        $('.closeModalButton, .cancelButton, .modalBack').on('click', function() {
            that.closeModal(direction);
        });
    };

    this.closeModal = function(direction) {
        $('.modal').addClass(direction);
        $('.modalBack').removeClass('opacityFade');
        $('.modalBack').animate({
            opacity: 0
        }, 500, function(){
            $('.modalBack').remove();
            $('.modal').remove();
            that.modalOpen = false;
        });
    };

    this.createTileList = function(list) {
        var html = '';
        for(var iter in list) {
            html += '<div class="miniTile background_'+list[iter].type+'" tile-url="'+list[iter].size+'_'+list[iter].type+'">'+
                '<span class="miniTileSize">'+list[iter].size+'</span>'+
            '</div>';
        }
        return html;
    };

    this.drawSurface.on("mouseleave", 'div.notifBar', function() {
        setTimeout(function(){
            if(!that.notiBool && !$('div.notifBar').is(":hover"))
                    that.hideNotifBar();
        }, 1000);
    });
    this.drawSurface.on("mouseleave", 'div.tileDock', function() {
        setTimeout(function(){
            if (!$('div.tileDock').is(":hover"))
            that.hideTileDock();
        }, 1000);
    });
    this.drawSurface.on("mouseleave", 'div.dashDock', function() {
        setTimeout(function(){
            if (!$('div.dashDock').is(":hover"))
                that.hideDashDock();
        }, 1000);
    });

    this.drawSurface.on("mouseleave", 'div.topButtons', function() {
        setTimeout(function(){
            if (!$('div.topButtons').is(":hover"))
                that.hideSettingDock();
        }, 1000);
    });

    this.drawSurface.on('click', '#notifToggle', function(){
        if (!that.notiBool)
            that.expandNotifBar();
        else
            that.collapseNotifBar();
    });

    this.drawSurface.on('click', '#addAPage', function(){
        var id = 'page_'+(++that.counter);
        that.addModal('pageForm');
    });

    this.drawSurface.on('click', '.miniTile', function() {
        that.addModal('tile', $(this).attr('tile-url'));
    });

    this.drawSurface.on('click', '.pageButton', function(){
        that.changeToPage($(this).attr('page-id'));
    });

    this.drawSurface.on('click', '.close_anon', function() {
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
    this.drawSurface.append('<div class="tileDock">'+this.createTileList(this.availableBaseTiles)+'</div>');
    this.drawSurface.append('<div class="dashDock"><div class="container"><button id="addAPage">+</button></div></div>');
    this.drawSurface.append('<div class="garbage">TRASH</div>');
    this.drawSurface.css('height', ($(document).height())+'px');
}