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
    this.modalOpen = false;

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
    this.drawSurface.css('height', ($(document).height())+'px');

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
        if(!that.tileBool && !that.modalOpen)
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
        if(!that.dashBool && !that.modalOpen)
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
        if(!that.settBool && !that.modalOpen)
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

    this.addModal = function(type) {
        that.modalOpen = true;
        that.hideDashDock();
        that.drawSurface.append('<div class="modalBack opacityFade"></div>');
        var form = '';
        var direction = 'floatLeftSlide';
        var title = 'Default Title';
        if (type == 'page') {//need modal for new page settings
            direction = 'floatBottomSlide';
            title = 'Create new Page';
            form = '';
        }
        form += '<span class="closeModalButton">x</span>';
        that.drawSurface.append('<div class="'+direction+' modal"><span class="title">'+title+'</span>'+form+'</div>');
        setTimeout(function() {
            $('.modalBack').css('opacity', 1);
            $('.modal.'+direction).removeClass(direction);
        }, 1);

        $(this.drawSurface).on('click', '.closeModalButton', function() {
            $('.modal').addClass(direction);
            $('.modalBack').removeClass('opacityFade');
            $('.modalBack').animate({
                opacity: 0
            }, 500, function(){
                $('.modalBack').remove();
                $('.modal').remove();
                that.modalOpen = false;
            });
        });
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
        that.addModal('page');
        /*that.addPage(id);
        $('.dashDock .container').css('width', (that.counter+1) * $('#addAPage').outerWidth(true));
        $('.dashDock .container').append("<button page-id='"+id+"' class='pageButton' >"+that.counter+"</button>");
        that.pageList['page_'+that.counter].addGroup('group_'+that.counter);
        that.pageList['page_'+that.counter].groupList['group_'+that.counter].addData(makeData());
        that.pageList['page_'+that.counter].groupList['group_'+that.counter].addTile('tile_'+that.counter, 3, 2, 'chart');*/
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

function page(par, id, title) {
    this.id = id;
    this.parent = par;
    this.title = title;
    this.stored = false;
    this.groupList = {};
    var that = this;

    this.changeTitle = function(title) {
        that.title = title;
    };

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
        }, 250);
    };
}