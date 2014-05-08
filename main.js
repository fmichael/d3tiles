//Helper Functions
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
    for(var x = 0; x < (Math.floor(Math.random() * 5) + 1); x++) {
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

$(window).resize(function(){
    viewable.width = $(window).width();
    viewable.height = $(window).height();
    viewable.midWidth = (viewable.width/2) - 200;
    viewable.midHeight = (viewable.height/2) - 200;
});

var viewable;

$(document).ready(function() {
    var tileList = {
        one: {
            type: 'chart',
            size: '1x1',
        },
        onepfive: {
            type: 'number',
            size: '1x1',
        },
        two: {
            type: 'chart',
            size: '2x2',
        },
        twopfive: {
            type: 'map',
            size: '4x4',
        },
        thr: {
            type: 'chart',
            size: '3x2',
        },
        fou: {
            type: 'table',
            size: '3x3',
        }
    };
    viewable = new screen($('#tileable'), tileList);
});