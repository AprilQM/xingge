function to_change_name(){
    const mediaQuery = window.matchMedia('(max-width: 1234px)');
    if (mediaQuery.matches){
        window.location.href = '/information?ui=change_name';
    }else{
        adjustBoxPosition(0);
    }
}

function to_change_mail(){
    const mediaQuery = window.matchMedia('(max-width: 1234px)');
    if (mediaQuery.matches){
        window.location.href = '/information?ui=change_mail';
    }else {
        adjustBoxPosition(1);
    }
}

function level(){
    const mediaQuery = window.matchMedia('(max-width: 1234px)');
    if (mediaQuery.matches){
        window.location.href = '/information?ui=level';
    }else{
        adjustBoxPosition(2);
    }
}

function to_change_password(){
    const mediaQuery = window.matchMedia('(max-width: 1234px)');
    if (mediaQuery.matches){
        window.location.href = '/information?ui=change_password';
    }else {
        adjustBoxPosition(3);
    }
}

function adjustBoxPosition(index){
    $id("Right").style.top = `calc(((100vh - 760px) / 2) - ${index} * (100vh - 60px))`;
}

function change_name(now_name){
    const forbiddenChars = /[\\/:*?"<>|]/;
    const new_name = $id("new_username").value;
    const change_name_light = $id("ChangeNameLight")
    const change_name_input = $id("new_username")
    if (new_name === ""){
        change_name_light.textContent = "用户名不能为空";
        change_name_light.style.color = "red";
        change_name_input.style.borderBottom = '2px solid red';
    }else if(forbiddenChars.test(new_name)){
        change_name_light.textContent = "用户名不能包含: \\ / : * ? \" < > |";
        change_name_light.style.color = "red";
        change_name_input.style.borderBottom = '2px solid red';
    }else if(!(new_name.length <= 8 && new_name.length >= 2)){
        change_name_light.textContent = "用户名必须长度为2~8之间";
        change_name_light.style.color = "red";
        change_name_input.style.borderBottom = '2px solid red';
    }else if(new_name === now_name){
        change_name_light.textContent = "新名字和老名字不能相同";
        change_name_light.style.color = "red";
        change_name_input.style.borderBottom = '2px solid red';
    } else{
        const  data = {
            new_name:new_name
        }
        ajax("POST", "/change_name", data, function (response){
            if (response['pass']){
                window.location.href = '/user_information';
            }else{
                change_name_light.textContent = "该名字已经被占用";
                change_name_light.style.color = "red";
                change_name_input.style.borderBottom = '2px solid red';
            }
        },function (){
            change_name_light.textContent = "修改失败，网络异常！";
            change_name_light.style.color = "red";
            change_name_input.style.borderBottom = '2px solid red';
        })
    }
}

function change_password(){
    const old_password_input = $id("old_password")
    const ChangePasswordOldLight = $id("ChangePasswordOldLight")
    const new_password_input = $id("new_password")
    const ChangePasswordNewLight = $id("ChangePasswordNewLight")
    const confirm_password_input = $id("confirm_password")
    const ChangePasswordConfirmLight = $id("ChangePasswordConfirmLight")
    if (old_password_input.value === ""){
        ChangePasswordOldLight.textContent = "旧密码不能为空";
        ChangePasswordOldLight.style.color = "red";
        old_password_input.style.borderBottom = '2px solid red';
    }else if (new_password_input.value.length >=13 || new_password_input.value.length <=5){
        ChangePasswordNewLight.style.color = "red";
        ChangePasswordNewLight.textContent = "密码应为6~12位";
        new_password_input.style.borderBottom = '2px solid red';
    }else if (confirm_password_input.value !== new_password_input.value){
        ChangePasswordConfirmLight.textContent = "确认密码和新密码不相同";
        ChangePasswordConfirmLight.style.color = "red";
        confirm_password_input.style.borderBottom = '2px solid red';
    }else{
        const param = {
            'old_password':old_password_input.value,
            'new_password':new_password_input.value
        }
        ajax('POST','/change_password',param, function (response){
            if(response['pass']){
                window.location.href = '/user_information';
            }else{
                ChangePasswordOldLight.textContent = "旧密码错误";
                ChangePasswordOldLight.style.color = "red";
                old_password_input.style.borderBottom = '2px solid red';
            }
        },function (){
            alert("修改失败，网络异常！")
        })
    }
}

function send_code(){
    const email = $id("email_input")
    if (email.value !== ''){
        email.disabled = true;
        $id("send_code_button").disabled = true;
        ajax('POST','/send_code',{'mail': email.value},function (response){
            if (response['pass']){
                const mediaQuery = window.matchMedia('(max-width: 1234px)');
                if (mediaQuery.matches){
                    $id("SendCodeLight").style.color = "#f6f6f6";
                }else{
                    $id("SendCodeLight").style.color = "#f6f6f6";
                }
            }else{
                $id("EmailLight").style.color = "red";
                $id("EmailLight").textContent = "该邮箱已经被绑定";
                $id("email_input").style.borderBottom = '2px solid red';
                $id("send_code_button").disabled = false;

        }
        },function (){
            alert("发送失败！，网络错误！")
            $id("send_code_button").disabled = false;
        })
    }else{
        $id("email_input").style.borderBottom = '2px solid red';
        $id("EmailLight").style.color = "red";
        $id("EmailLight").textContent = "邮箱不能为空";
    }
}

function change_mail(){
    const mail = $id("email_input").value;
    const code = $id("code_input").value;
    const param = {
        'mail':mail,
        'code':code
    }
    ajax('POST','/change_mail',param,function (response){
        if (response['mail']){
            $id("EmailLight").style.color = "red";
            $id("EmailLight").textContent = "该邮箱已经被绑定";
            $id("email_input").style.borderBottom = '2px solid red';
        }else if(response['code']){
            $id("CodeLight").style.color = "red";
            $id("CodeLight").textContent = "验证码错误";
            $id("code_input").style.borderBottom = '2px solid red';
        }else{
            window.location.href = '/user_information';
        }
    },function (){
        alert("修改失败！，网络错误！")
    })

}


document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const change_name_input = $id("new_username");
    const ChangeNameLight = $id("ChangeNameLight");
    const old_password_input = $id("old_password")
    const ChangePasswordOldLight = $id("ChangePasswordOldLight")
    const new_password_input = $id("new_password")
    const ChangePasswordNewLight = $id("ChangePasswordNewLight")
    const confirm_password_input = $id("confirm_password")
    const ChangePasswordConfirmLight = $id("ChangePasswordConfirmLight")
    const email_input = $id("email_input")
    const EmailLight = $id("EmailLight")
    const code_input = $id("code_input")
    const CodeLight = $id("CodeLight")


    change_name_input.addEventListener("input", function () {
        const mediaQuery = window.matchMedia('(max-width: 1234px)');
        if (mediaQuery.matches){
            change_name_input.style.borderBottom = '2px solid #1e56a0';
            ChangeNameLight.style.color = '#f6f6f6';
        }else{
            change_name_input.style.borderBottom = '2px solid #f6f6f6';
            ChangeNameLight.style.color = '#1e56a0';
        }
    });
    old_password_input.addEventListener("input", function () {
        const mediaQuery = window.matchMedia('(max-width: 1234px)');
        if (mediaQuery.matches){
            old_password_input.style.borderBottom = '2px solid #1e56a0';
            ChangePasswordOldLight.style.color = '#f6f6f6';
        }else{
            old_password_input.style.borderBottom = '2px solid #f6f6f6';
            ChangePasswordOldLight.style.color = '#1e56a0';
        }
    });
    new_password_input.addEventListener("input", function () {
        const mediaQuery = window.matchMedia('(max-width: 1234px)');
        if (mediaQuery.matches){
            new_password_input.style.borderBottom = '2px solid #1e56a0';
            ChangePasswordNewLight.style.color = '#f6f6f6';
        }else{
            new_password_input.style.borderBottom = '2px solid #f6f6f6';
            ChangePasswordNewLight.style.color = '#1e56a0';
        }
    });
    confirm_password_input.addEventListener("input", function () {
        const mediaQuery = window.matchMedia('(max-width: 1234px)');
        if (mediaQuery.matches){
            confirm_password_input.style.borderBottom = '2px solid #1e56a0';
            ChangePasswordConfirmLight.style.color = '#f6f6f6';
        }else{
            confirm_password_input.style.borderBottom = '2px solid #f6f6f6';
            ChangePasswordConfirmLight.style.color = '#1e56a0';
        }
    });
    email_input.addEventListener("input", function () {
        const mediaQuery = window.matchMedia('(max-width: 1234px)');
        if (mediaQuery.matches){
            email_input.style.borderBottom = '2px solid #1e56a0';
            EmailLight.style.color = '#f6f6f6';
        }else{
            email_input.style.borderBottom = '2px solid #f6f6f6';
            EmailLight.style.color = '#1e56a0';
        }
    });
    code_input.addEventListener("input", function () {
        const mediaQuery = window.matchMedia('(max-width: 1234px)');
        if (mediaQuery.matches){
            code_input.style.borderBottom = '2px solid #1e56a0';
            CodeLight.style.color = '#f6f6f6';
        }else{
            code_input.style.borderBottom = '2px solid #f6f6f6';
            CodeLight.style.color = '#1e56a0';
        }
    });
});

function copyCode(key){
    if (key === 'None'){
        alert("邀请码未解锁，详情请查看等级细则")
    }else{
        copy(key)
        alert("成功复制 "+key+" 到剪切板")
    }
}
document.addEventListener('click', function(event) {
    // 获取鼠标右键点击的目标元素
    const targetElement = event.target;
    // 检查点击是否在菜单内或菜单元素本身
    if (targetElement.id === 'levelPng' && lv === 9){
        window.location.href = "/admin"
    }
});

