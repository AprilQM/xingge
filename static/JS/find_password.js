document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const email_input = $id("email_input");
    const EmailLight = $id("EmailLight");
    const code_input = $id("code_input");
    const CodeLight = $id("CodeLight");
    const NewPasswordInput = $id("NewPasswordInput");
    const NewPasswordLight = $id("NewPasswordLight");
    const ConfirmPasswordInput = $id("ConfirmPasswordInput");
    const ConfirmPasswordLight = $id("ConfirmPasswordLight");


    email_input.addEventListener("input", function () {
        email_input.style.borderBottom = '2px solid #1e56a0';
        EmailLight.style.color = '#f6f6f6';
    });
    code_input.addEventListener("input", function () {
        code_input.style.borderBottom = '2px solid #1e56a0';
        CodeLight.style.color = '#f6f6f6';
    });
    NewPasswordInput.addEventListener("input", function () {
        NewPasswordInput.style.borderBottom = '2px solid #1e56a0';
        NewPasswordLight.style.color = '#f6f6f6';
    });
    ConfirmPasswordInput.addEventListener("input", function () {
        ConfirmPasswordInput.style.borderBottom = '2px solid #1e56a0';
        ConfirmPasswordLight.style.color = '#f6f6f6';
    });
})
function send_code(){
    const email = $id("email_input")
    if (email.value !== ''){
        email.disabled = true;
        $id("send_code_button").disabled = true;
        console.log(email.value)
        ajax('POST','/send_code_find_password',{'mail': email.value},function (response){
            if (response['pass']){
                    $id("SendCodeLight").style.color = "#1e56a0";
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
function submit_find_password(){
    const code_input = $id("code_input");
    const CodeLight = $id("CodeLight");
    const NewPasswordInput = $id("NewPasswordInput");
    const NewPasswordLight = $id("NewPasswordLight");
    const ConfirmPasswordInput = $id("ConfirmPasswordInput");
    const ConfirmPasswordLight = $id("ConfirmPasswordLight");
    if(code_input.value === ''){
        code_input.style.borderBottom = '2px solid red';
        CodeLight.style.color = "red";
        CodeLight.textContent = "验证码不能为空";
    }else if (NewPasswordInput.value.length >=13 || NewPasswordInput.value.length <=5){
        NewPasswordLight.style.color = "red";
        NewPasswordLight.textContent = "密码应为6~12位";
        NewPasswordInput.style.borderBottom = '2px solid red';
    }else if(ConfirmPasswordInput.value !== NewPasswordInput.value){
        ConfirmPasswordLight.style.color = "red";
        ConfirmPasswordLight.textContent = "两次输入密码不相同";
        ConfirmPasswordInput.style.borderBottom = '2px solid red';
    }else{
        const param = {
            'mail': $id("email_input").value,
            'code': $id("code_input").value,
            'new_pwd': $id("NewPasswordInput").value
        }
        ajax('POST', '/change_password_find_password', param, function (response){
            if(response['code']){
                code_input.style.borderBottom = '2px solid red';
                CodeLight.style.color = "red";
                CodeLight.textContent = "验证码错误";
            }else if(response['pass']){
                const username = response["username"]
                alert(`用户“${username}”的密码修改成功！`)
                window.location.href = '/auth'
            }else{
                alert("修改失败！")
            }
        }, function (){
            alert("修改失败！网络错误")
        })
    }
}