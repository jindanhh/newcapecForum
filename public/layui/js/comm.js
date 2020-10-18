//用户是否登录
    var login = window.localStorage.getItem("login");
    var phone = window.localStorage.getItem("phone");

    if (login == 1) {
        $("#welcome").html("欢迎" + phone);
        $("#login").css("display", "none");
        $("#reg").css("display", "none");
        $("#exit").html("退出")
    } else {
        $("#welcome").html("");
        $("#login").css("display", "block");
        $("#reg").css("display", "block");
        $("#exit").html("")
    }

