//用户是否登录
var login = window.localStorage.getItem("login");
var phone = window.localStorage.getItem("phone");
if (login == 1) {
    $("#uphoto").css("display", "block");
    $("#welcome").html("欢迎 " + phone);
    $("#user").css("display", "block");
    $("#login").css("display", "none");
    $("#reg").css("display", "none");
    $("#exit").html("退出")
} else {
    $("#welcome").html("");
    $("#uphoto").css("display", "none");
    $("#user").css("display", "none");
    $("#login").css("display", "block");
    $("#reg").css("display", "block");
    $("#exit").html("")
}

$("#exit").click(function () {
    window.localStorage.clear();
    location.reload();
})

