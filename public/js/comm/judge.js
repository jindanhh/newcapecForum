 window.onload = function () {
            if (localStorage.getItem("userTel")) {
                var userTel = document.getElementById("login");
                userTel.innerHTML = "欢迎&nbsp;" + localStorage.getItem("userName");
                $("#uphoto").css("display", "block");
                $("#user").css("display", "block");
                $("#reg").css("display", "none");
                $("#exit").html("退出")
                if (localStorage.getItem("userImg")) {
                    // var imgBox = document.getElementById("img-box");
                    var uphoto = document.getElementById("uphoto");
                    // imgBox.innerHTML = "<img src=" + localStorage.getItem("userImg") + ">";
                    uphoto.innerHTML = "<img src=" + localStorage.getItem("userImg") + ">";
                }
            }          
            // 发帖按钮检测是否登录 
            $("#posted").click(function () {
                if (!localStorage.getItem("userTel")) {
                    $("#posted").attr("href", "javascript:void(0)");
                }
            })
            $("#exit").click(function () {
                window.localStorage.clear();
                location.reload();
            })
        }