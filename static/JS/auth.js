function Login(){
    const username = $id('UserNameInput').value;
    const pwd = $id('PasswordInput').value;
    if (username === ''){
        const  usernameInput = $id("UserNameInput");
        const  usernameLight = $id("AuthUsernameLight");
        usernameInput.style.borderBottom = '2px solid red';
        usernameLight.textContent = '用户名不能为空';
        usernameLight.style.color = 'red';
    }
    else if(pwd === ''){
        const  passwordInput = $id("PasswordInput");
        const  passwordLight = $id("AuthPasswordLight");
        passwordInput.style.borderBottom = '2px solid red';
        passwordLight.textContent = '密码不能为空';
        passwordLight.style.color = 'red';
    }else{
        const param = {
            username:username,
            password:pwd
        }
        ajax('POST', 'login', param, function (response, status){
            console.log(response)
            if (response['pass']){
                window.location.href = '/home'
            }else if (response['password']){
                const  passwordInput = $id("PasswordInput");
                const  passwordLight = $id("AuthPasswordLight");
                passwordInput.style.borderBottom = '2px solid red';
                passwordLight.textContent = '密码错误';
                passwordLight.style.color = 'red';
            }else if (response['username']){
                const  usernameInput = $id("UserNameInput");
                const  usernameLight = $id("AuthUsernameLight");
                usernameInput.style.borderBottom = '2px solid red';
                usernameLight.textContent = '未知用户';
                usernameLight.style.color = 'red';
            }
        },function (response,status){
            console.log("返回值："+response,'情况'+status)
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const UserNameInput = $id("UserNameInput");

    // 添加输入事件监听器
    UserNameInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const usernameInput = $id("UserNameInput");
        const usernameLight = $id("AuthUsernameLight");
        usernameInput.style.borderBottom = '2px solid #1e56a0';
        usernameLight.style.color = '#f6f6f6';
    });
    // 获取UsernameEdit输入框元素
    const PasswordInput = $id("PasswordInput");

    // 添加输入事件监听器
    PasswordInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const passwordInput = $id("PasswordInput");
        const passwordLight = $id("AuthPasswordLight");
        passwordInput.style.borderBottom = '2px solid #1e56a0';
        passwordLight.style.color = '#f6f6f6';
    });
});



// 快捷寻找id
function $id(key){
    return document.getElementById(key)
}