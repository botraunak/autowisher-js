window.fbAsyncInit = function() {
    FB.init({
        appId: '414427155363670',
        cookie: true,
        xfbml: true,
        version: 'v2.2'
    });
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

var tmzcrr = null;
var birthday = null;
var count = 0;

function display_form() {
    $("#login").hide();
    $("#form").show();
    $("#logout").hide();
}

function display_logout() {
    $("#login").hide();
    $("#form").hide();
    $("#logout").show();
}

function display_login() {
    $("#logout").hide();
    $("#form").hide();
    $("#login").show();
}

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        FB.api("/me?fields=birthday", function(res) {
            birthday = res.birthday.split("/");
            birthday[2] = new Date().getFullYear();
            birthday = birthday.join("/");
            display_form();
        });
    } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'Please log into this app.';
        display_login();
    } else {
        document.getElementById('status').innerHTML = 'Please log into Facebook.';
        display_login();
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

$(document).ready(function() {
    $("#login").show();
    $("#form").hide();
    $("#logout").hide();

    $("#fb_login").click(function() {
        FB.login(function(response) {
            checkLoginState();
        }, {
            scope: 'read_stream,email,publish_actions,user_birthday'
        });
    });
    // Function to handle birthday posts
    $("#bday_submit").submit(function() {
        $("#bday_submit").html("<img src='loading.gif' height='80' width='80' />");
        commentOnPosts('/me/feed?since=' + birthday + "&until=" + encodeURIComponent(birthday + " + 1 day"), commentOnPosts);
        return false;
    });
});

function commentOnPosts(link, callback) {
    FB.api(link, function(response) {
        res = response.data;
        if(res.length == 0)
            return doneCommenting();
        for(item of res) {
            var post_id = item.id;
            var post_name = item.from.name.split(" ");
            var post_name = post_name[0];
            FB.api(
                "/" + post_id + "/comments",
                "POST", {
                    "message": "Thanks " + post_name + "!",
                },
                function(e) {
                    console.log(e);
                }
            );
            count++;
        }
        if(response.paging.next)
            callback.call(null, response.paging.next, callback);
    });
}
function doneCommenting() {
    $("#logout > h3.light").html("Thanks for using AutoWisher. We commented on " + count + " posts, saving you at least " + (count * 6).toString() + " seconds! Happy Birthday, btw!");
    display_logout();
    return false;
}
// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));