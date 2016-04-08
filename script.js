function loadPage() {
    var urlString = "https://en.wikipedia.org/wiki/Duck";
    $.ajax({
        url: urlString,
        success: function(data) {
            console.log("success");
        }
    });
    console.log("this happened, I guess");   
}