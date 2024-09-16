function submit(){
    $id("SubmitButton").disabled = true;
    const param = {
        'code':$id("CodeInput").value
    }
    ajax('POST', '/check_exchange', param, function (response){
        const input = $id("CodeInput")
        const light = $id("CodeLight")
        if (response['pass']){
            alert(`兑换成功！您获得时间加速+${response['reward']}`)
            window.location.href = '/user_information';
        }else if (response['code']){
            input.style.borderBottom = '2px solid red';
            light.textContent = '兑换码不存在';
            light.style.color = 'red';
        }else if (response['had']){
            input.style.borderBottom = '2px solid red';
            light.textContent = '你已拥有此兑换码';
            light.style.color = 'red';
        }else if (response["time"]){
            input.style.borderBottom = '2px solid red';
            light.textContent = '兑换码时效已过';
            light.style.color = 'red';
        }
    },function (){
        alert("兑换失败！网络错误")
    })
}
document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const CodeInput = $id("CodeInput");

    // 添加输入事件监听器
    CodeInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const CodeLight = $id("CodeLight");
        CodeInput.style.borderBottom = '2px solid #1e56a0';
        CodeLight.style.color = '#f6f6f6';
    });
})