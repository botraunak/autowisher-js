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
        display_form();
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
            scope: 'user_posts,read_stream,email,publish_actions'
        });
    });

    $("#fb_logout").click(function() {
        FB.logout(function(response) {
            checkLoginState();
        });
    });

    // Function to handle birthday posts
    $("#bday_submit").submit(function() {
        var tmzcrr = this.tmzcrr.value * 3600;
        var since_time = this.bdaystrt.value;
        myDate = since_time.split("-").reverse();
        var newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
        var since_time = new Date(newDate).getTime() + tmzcrr;
        var count = 0;
        var end = false;
        var until = since_time + 86400;


       FB.api('/me/feed?until='+until, function(response) {
             res = response.data;
            while (!end) {
                for (item of res) {
                    var unix_time = Date.parse(item.created_time);
                    console.log(unix_time);
                    if (unix_time >= since_time) {
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
                    } else {
                        end = true;
                        break;
                    }
                }
                if (!end) {
                    $link = response.paging.next;
                    $.getJSON("link", function(result) {
                        res = result.data;
                    });
                }
            }
        });
        display_logout();
        return false;
    });
});

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));