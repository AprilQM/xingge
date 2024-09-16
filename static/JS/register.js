document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const username_input = $id("username_input");
    const username_light = $id("username_light");
    const code_input = $id("code_input")
    const code_light = $id("code_light")
    const password_input = $id("password_input")
    const password_light = $id("password_light")
    const confirm_password_input = $id("confirm_password_input")
    const confirm_password_light = $id("confirm_password_light")


    username_input.addEventListener("input", function () {
        username_input.style.borderBottom = '2px solid #1e56a0';
        username_light.style.color = '#f6f6f6';
    });

    code_input.addEventListener("input", function () {
        code_input.style.borderBottom = '2px solid #1e56a0';
        code_light.style.color = '#f6f6f6';
    });

    password_input.addEventListener("input", function () {
        password_input.style.borderBottom = '2px solid #1e56a0';
        password_light.style.color = '#f6f6f6';
    });

    confirm_password_input.addEventListener("input", function () {
        confirm_password_input.style.borderBottom = '2px solid #1e56a0';
        confirm_password_light.style.color = '#f6f6f6';
    });
});

function register(){

    const username_input = $id("username_input");
    const username_light = $id("username_light");
    const code_input = $id("code_input")
    const code_light = $id("code_light")
    const password_input = $id("password_input")
    const password_light = $id("password_light")
    const confirm_password_input = $id("confirm_password_input")
    const confirm_password_light = $id("confirm_password_light")

    if (username_input.value === ''){
        username_light.style.color = "red";
        username_light.textContent = "用户名不能为空";
        username_input.style.borderBottom = '2px solid red';
    }else if(!(username_input.value.length <= 8 && username_input.value.length >= 2)){
        username_light.style.color = "red";
        username_light.textContent = "用户名必须长度为2~8之间";
        username_input.style.borderBottom = '2px solid red';
    } else if(code_input.value === ''){
        code_light.style.color = "red";
        code_light.textContent = "邀请码不能为空";
        code_input.style.borderBottom = '2px solid red';
    }else if(code_input.value.length !== 16){
        code_light.style.color = "red";
        code_light.textContent = "无效的邀请码";
        code_input.style.borderBottom = '2px solid red';
    } else if(password_input.value.length >=13 || password_input.value.length <=5){
        password_light.style.color = "red";
        password_light.textContent = "密码应为6~12位";
        password_input.style.borderBottom = '2px solid red';
    }else if(confirm_password_input.value !== password_input.value){
        confirm_password_light.style.color = "red";
        confirm_password_light.textContent = "两次输入密码不相同";
        confirm_password_input.style.borderBottom = '2px solid red';
    }else{
        const param = {
            'username':username_input.value,
            'password':password_input.value,
            'code':code_input.value
        }
        ajax('POST', '/register', param, function (response){
            if (response['username']){
                username_light.style.color = "red";
                username_light.textContent = "用户名被占用";
                username_input.style.borderBottom = '2px solid red';
            }else if(response['code']){
                code_light.style.color = "red";
                code_light.textContent = "无效的邀请码";
                code_input.style.borderBottom = '2px solid red';
            }else if(response['password']){
                password_light.style.color = "red";
                password_light.textContent = "非法的密码";
                password_input.style.borderBottom = '2px solid red';
            }else{
                window.location.href = '/user_information';
            }
        }, function (){
            alert("注册失败！网络错误！")
        })
    }
}