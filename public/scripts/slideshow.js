console.log("slideshow.js");

var photographs = [];
var current_image_index = 0;
var img_transition_time = 1100;
var img_display_time = 5000;

var load_image = function (callback) {
    var origin_path = "/images/photographs/"
    var imgpath = origin_path + escape(photographs[current_image_index]);
    console.log(current_image_index, imgpath);

    $('.surface.main').removeClass('transitions showing');

    setTimeout(function () {
        $('<img/>').attr('src', imgpath).load(function() {
            var timg = $(this);

            $('.surface').addClass('transitions');
            $('.surface.main').css('background-image', 'url('+imgpath+')').attr('photonumber', current_image_index.toString()).addClass('transitions').addClass('showing');
            
            setTimeout(function () {
                $('.surface.buffer').css('background-image', 'url('+imgpath+')').attr('photonumber', current_image_index.toString()).addClass('showing');
                timg.remove();
                callback();
            }, img_transition_time);
        });
    }, 11);
}

var load_next_image = function () {
    load_image(function () {
        setTimeout(function () {
            //call self
            current_image_index++;
            if (current_image_index >= photographs.length) {
                current_image_index = 0;
            }
            load_next_image();
        }, img_display_time);
    });
}

var get_photograph_list = function () {
    $.ajax({
        type: "GET",
        url: '/photograph_data',
        success: function (data) {
            console.log("success!");
            photographs = data.photographs;
            console.log(photographs);
            load_next_image();
        },
        error: function (err) {
            console.log("hideous error", err);
        }
    });
}

setTimeout(function () {
    console.log("GO!");
    get_photograph_list()
}, 666);
