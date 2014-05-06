$(document).on('click', '.swap_btn, .fill_btn', function() {
    if (!$(this).closest('.tile').hasClass('flipping')) {
        $(this).closest('.tile').addClass('flipping');
        $(this).closest('.tile').toggleClass('flipped');
        var that = this;
        setTimeout(function() {
            if ($(that).parent().parent().hasClass('front')) {
                $(that).parent().parent('.front').addClass('flipped');
                $(that).parent().parent().siblings('.back').addClass('flipped');
                if ($(that).hasClass('fill_btn'))
                    $(that).parent().parent().siblings('.back').addClass('filters');
                else
                    $(that).parent().parent().siblings('.back').removeClass('filters');
            }
            else {
                $(that).parent().parent('.back').removeClass('flipped');
                $(that).parent().parent().siblings('.front').removeClass('flipped');
            }
        }, 300);
        setTimeout(function() {
            $(that).closest('.tile').removeClass('flipping');
        }, 400);
    }
});

$(document).on('mouseenter', '.setting_span', function() {
    $(this).find('.setting_btn').addClass('visible');
})
.on('mouseleave', '.setting_span', function() {
    $(this).find('.setting_btn').removeClass('visible');
});