$(function () {
    $('.summernote').summernote({
        height: 200,
        tabsize: 2,
        lang: 'zh-CN',
        resize: 'none'
    });
    $(".note-video-url").attr({
        "type": "file",
        name: "singleFile",
        id: "singleFile"
    });

    $(".note-video-btn").click(function () {
        var fileList = $('#singleFile')[0].files;
        console.log(fileList);
        // FormData它是用来异步文件上传的
        var formData = new FormData();
        //此处文件名必须为 singleFile ，因为后台设置仅接口此文件名
        formData.append('singleFile', fileList[0]);

        $.ajax({
            url: '/posted/single',
            type: 'post',
            // 不让jQuery去处理数据,而是让XMLHttpRequest去处理数据
            processData: false,
            contentType: false, //使用multer配合ajax时无需配置multipart/form-data，multer将自动配置，手动配置将报错，boundary not found
            data: formData,
            success: function (data) {
                console.log(data)
                $(".note-video-clip").attr("src", data.path);
            }
        })
    })

    // 点击提交时数据上传
    $("#topicSubmit").click(function () {
        var time = new Date();
        var y = time.getFullYear();
        var m = time.getMonth();
        var d = time.getDate();
        var h = time.getHours();
        var n = time.getMinutes();
        var topicTime = y + "-" + (m + 1) + "-" + d + " " + h + ":" + n;
        var submitHTML = $(".note-editable").html();
        var topicTitle = $("#topicTitle").val();
        var moduleName = $("#moduleName").val();
        var topicDes = $('#topicDes').val();
        var userName = localStorage.getItem("userName")
        if (submitHTML != " " && topicTitle != " " && topicDes != " " && moduleName != "选择模块") {
            $.ajax({
                url: "/topic/addTopic",
                method: "post",
                data: {
                    topicTitle: topicTitle,
                    topicDes: topicDes,
                    topicContent: submitHTML,
                    moduleName: moduleName,
                    poster: userName,
                    topicTime: topicTime,
                    topicStatus: 0,
                    visitedCount: 0,
                },
                success: function (data) {
                    layer.alert("发布成功,点击跳转查看当前模块(2s之后将自动跳转)")
                    setTimeout('window.location.href = "/topic/queryAll/' +
                        moduleName + '?pageNum=1&pageSize=5"', 2000);
                }
            })
        } else if (moduleName = "选择模块") {
            layer.msg("请选择模块")
        } else {
            layer.msg("尚有信息未填写，不能发布")
        }
    })
})