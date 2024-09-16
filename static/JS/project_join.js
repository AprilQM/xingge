function submit(){
    $id("SubmitButton").disabled = true;
    const param = {
        'code':$id("CodeInput").value
    }
    ajax('POST', '/join_project', param, function (response){
        const input = $id("CodeInput")
        const light = $id("CodeLight")
        if (response['code']) {
            input.style.borderBottom = '2px solid red';
            light.textContent = '加入码不存在';
            light.style.color = 'red';
        }else if (response['joined']){
            input.style.borderBottom = '2px solid red';
            light.textContent = '你已经加入该项目';
            light.style.color = 'red';
        }else{
            window.location.href = '/collaboration';
        }
    },function (){
        alert("加入失败！网络错误")
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