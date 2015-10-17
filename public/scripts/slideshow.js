console.log("slideshow.js");

$.ajax({
    type: "GET",
    url: '/photograph_data',
    success: function (data) {
        console.log("success!", data);
    },
    error: function (err) {
        console.log("hideous error", err);
    }
});