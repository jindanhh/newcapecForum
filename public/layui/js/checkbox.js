
        var j_cbAll = document.getElementById("j_cbAll");
        var allCheckBox = document.querySelectorAll("#j_tb input[type=checkbox]");

        var btn = document.getElementById("btn");

      //全选全不选
        j_cbAll.onclick = function () {
            var j_cbAllVal = this.checked;
            for (var i = 0; i < allCheckBox.length; i++) {
                allCheckBox[i].checked = j_cbAllVal;
            }
        }

        for (var i = 0; i < allCheckBox.length; i++) {
            allCheckBox[i].onclick = function () {
                checkAllCheckBox();
            }
        }


        //都选中的话上边总的也选中
        function  checkAllCheckBox(){
            var isChecked = true; 

            for (var j = 0; j < allCheckBox.length; j++) {
                if (!allCheckBox[j].checked) {
                    isChecked = false;
                    break;
                }
            }

            j_cbAll.checked = isChecked;
        }
