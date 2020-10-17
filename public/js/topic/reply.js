function getReply() {
    var topicId = $("#topicId").html().replace(/(\")/g, "")
    localStorage.setItem("topicId", topicId)
    localStorage.setItem("replyList", $("#replyList").html())
    if (localStorage.getItem("replyList") == 0) {
        $(".reply").html("<br><p>&nbsp;&nbsp;还没有回复呢</p><br>")
    }
    if (localStorage.getItem("userTel")){
        $("#replyContent").css("display", "block");
    }
    $("#reply").click(function () {
        if (!localStorage.getItem("userTel")) {
            $("#reply").attr("href", "javascript:void(0)");
            
        }
    })

     // 点击提交时数据上传
     $("#replySubmit").click(function () {
        var time = new Date();
        var y = time.getFullYear();
        var m = time.getMonth();
        var d = time.getDate();
        var h = time.getHours();
        var n = time.getMinutes();
        var replyTime = y + "-" + (m + 1) + "-" + d + " " + h + ":" + n;
        var replyContent = $("#note-codable").val();
        var replyName = localStorage.getItem("userName");
        var replyImg = localStorage.getItem("userImg");
        var replyId = localStorage.getItem("topicId");
       if(replyContent != " "){
        $.ajax({
            url: "/details/addReply",
            method: "post",
            data: {
                replyTime: replyTime,
                replyContent:replyContent,
                replyName: replyName,
                replyImg: replyImg,
                replyId:replyId
            },
            success: function (data) {
                layer.msg("回复成功")
                setTimeout('window.location.href = "#"', 1000);                
            }
        })
       }else{
        layer.msg("请填写回复")
       }
    })
}
