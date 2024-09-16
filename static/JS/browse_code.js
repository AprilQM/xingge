function submit(){
    const param = {
        'code':$id("CodeInput").value
    }
    ajax('POST', '/check_browse', param, function (response){
        const input = $id("CodeInput")
        const light = $id("CodeLight")
        if (response !== false){
            window.location.href = response;
        }else {
            input.style.borderBottom = '2px solid red';
            light.textContent = '浏览码无效';
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