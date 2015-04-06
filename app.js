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
            scope: 'user_posts,read_stream,email,publish_actions,user_birthday'
        });
    });

    $("#fb_logout").click(function() {
        FB.logout(function(response) {
            checkLoginState();
        });
    });

    // Function to handle birthday posts
    $("#bday_submit").submit(function() {
        var count = 0;
        var end = false;
        commentOnPosts('/me/feed?since=' + birthday + "&until=" + encodeURIComponent(birthday + " + 1 day"), commentOnPosts);
        return false;
    });
    display_logout();
});

function commentOnPosts(link, callback) {
    FB.api(link, function(response) {
        res = response.data;
        if(res == null)
            return;
        while(1) {
            for (item of res) {
                var post_id = item.id;
                var post_name = item.from.name.split(" ");
                var post_name = post_name[0];
                FB.api(
                    "/" + post_id + "/comments",
                    "POST", {
                        "message": "Thanks " + post_name + "!",
                    },
                    function(response) {
                        if (response && !response.error) {
                            count += 1;
                        }
                    }
                );
            }
            callback.call(null, response.paging.next, callback);
        }
    });
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