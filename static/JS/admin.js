function show_flow(){
    hidden_all_box()
    $id("flowBox").style.display = 'block';
}
function show_user(){
    hidden_all_box()
    $id("userBox").style.display = 'block';
}
function show_announcements(){
    hidden_all_box()
    $id("announcementsBox").style.display = 'block';
}
function show_exchange(){
    hidden_all_box()
    $id("exchangeBox").style.display = 'block';
}
function hidden_all_box(){
     $id("flowBox").style.display = 'none';
     $id("userBox").style.display = 'none';
     $id("announcementsBox").style.display = 'none';
     $id("exchangeBox").style.display = 'none';
}




function findUser(event){
    // 检查是否按下的是回车键（key code 13）
    if (event.key === "Enter") {
        event.preventDefault();
        const expression = $id("findUserInput").value;
        const param = {
            'expression':expression
        }
        ajax('POST','/find_user', param, function (response){
            if(response['pass']){
                clearTable($id("user_table"))
                for (let i = 0 ; i < response['values'].length; i++){
                    const newRow = $id("user_table").insertRow(-1);
                    for (let j = 0; j < 11 ; j++){
                        const cell = newRow.insertCell(-1);
                        if (j === 2){
                            const user_id = response['values'][i][0]
                            cell.innerHTML = '<button class="get_password" onclick="get_password(this,'+ user_id +')">******</button>';
                        }else{
                            cell.innerHTML = response['values'][i][j];
                        }
                    }
                }
            }else{
                alert(`语法错误！请检查字符串是否加引号，或者其他问题`)
            }
        },function (){
            alert("查询失败！网络错误！")
        })
    }
}

function get_password(button, id){
    const btn = button;
    ajax('POST','/get_password', {'id':id }, function (response){
        btn.textContent = response;
    },function (){
        alert("获取密码失败！网络错误！");
    })
}
function get_table_value_by_row_column(table ,row,column){
    return table.rows[row].cells[column].textContent;
}
function change_value(row,column){
    const user_id = get_table_value_by_row_column($id("user_table"), row, 0)
    $id("user_table_change_value_light").style.display = 'block';
    $id("Gray").style.display = 'block';
    const column_name = ['Id','用户名', '密码', '邮箱', '注册时间', '账号等级', '时间加速', '邀请人Id', '邀请数', '邀请码', '上次使用邀请码的时间'][column]
    $id("user_change_pos_light").textContent = `请输入你想对第${row}行，“${column_name}”列的数据进行修改后的值`
    const old_value = get_table_value_by_row_column($id("user_table"), row,column)
    $id("user_change_input").value = old_value;
    $id("user_change_input").setAttribute("placeholder", old_value);
    $id("user_change_input").setAttribute("data-id", user_id);
    $id("user_change_input").setAttribute("data-row", row);
    $id("user_change_input").setAttribute("data-column", column);
}
function hidden_user_change_light(){
    $id("user_table_change_value_light").style.display = 'none';
    $id("Gray").style.display = 'none';
}

function submit_new_user_value(){
    const new_value = $id("user_change_input").value;
    const id = $id("user_change_input").getAttribute("data-id");
    const row = $id("user_change_input").getAttribute("data-row");
    const column = $id("user_change_input").getAttribute("data-column");
    const param = {
        'id':id,
        'column':column,
        'new_value':new_value
    }
    ajax('POST' , '/admin_change_user_value', param, function (response){
        if(response === true){
            $id("user_table").rows[row].cells[column].textContent = new_value;
            hidden_user_change_light()
        }else{
            alert("修改失败！权限不足")
            hidden_user_change_light()
        }
    },function (){
        alert("修改失败！网络错误！")
    })
}
function user_change_enter_down(event){
    if (event.key === "Enter") {
         submit_new_user_value()
    }
}

function upload_announcements(){
    const title = $id("announcementsChose").value;
    const value = $id("announcementsShow").value;
    const param = {
        'title':title,
        'value':value
    }
    ajax('POST', '/upload_announcement', param, function (response){
        if(response === true){
            location.reload()
        }else{
            alert("发生错误！"+response)
        }
    },function (){
        alert("上传失败！网络错误！")
    })
}

function create_submit(announcements){
    const input = $id("CreateInput")
    const light = $id("CreateLight")
    const forbiddenChars = /[\\/:*?"<>|]/;
    if (forbiddenChars.test(input.value)){
        light.style.color = "red";
        light.textContent = "公告名不能包含: \\ / : * ? \" < > |";
        input.style.borderBottom = '2px solid red';
    }else if(input.value === ''){
        light.style.color = "red";
        light.textContent = "公告名不能为空";
        input.style.borderBottom = '2px solid red';
    }else if (input.value in announcements){
        light.style.color = "red";
        light.textContent = "公告已存在";
        input.style.borderBottom = '2px solid red';
    }else{
        const title = $id("CreateInput").value
        const param = {
            'title':title
        }
        ajax('POST', "/create_announcement", param, function (response){
            if (response === true){
                location.reload()
            }else{
                alert("上传失败！错误："+response)
            }
        },function (){
            alert("上传失败！网络错误")
        })
    }
}

function delete_announcements(){
    const title = $id("announcementsChose").value;
    const result = confirm(`你确定要删除"${title}"吗？`)
    if (result){
        const param = {
            'title':title
        }
        ajax("POST", '/delete_announcement', param, function (response){
            if (response === true){
                    location.reload()
                }else{
                    alert("删除失败！错误："+response)
                }
            },function (){
                alert("删除失败！网络错误")
        })
    }
}

function hidden_create_announcement_box(){
    $id("CreateBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}
function show_create_announcement_box(){
    $id("CreateBox").style.display = 'block';
    $id("Gray").style.display = 'block';
    const CreateInput = $id("CreateInput");
    const CreateLight = $id("CreateLight");
    CreateInput.value = '';
    CreateInput.style.borderBottom = '2px solid #1e56a0';
    CreateLight.style.color = '#fff';
}
$id("user_table").addEventListener("contextmenu", function(event) {
    event.preventDefault();

    // 获取目标单元格
    const targetCell = event.target.closest("td");
    if (!targetCell) return; // 如果目标单元格不存在，退出函数

    // 获取单元格所在行和列索引
    const row = targetCell.parentNode.rowIndex;
    const column = targetCell.cellIndex;
    change_value(row, column)
});
document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const CreateInput = $id("CreateInput");
    const CreateLight = $id("CreateLight");


    CreateInput.addEventListener("input", function () {
        CreateInput.style.borderBottom = '2px solid #1e56a0';
        CreateLight.style.color = '#fff';
    });
})
function add_chart(canvas, datas, title){
    // 处理数据
    let t_labels = []
    let t_datas = []
    for (let i in datas){
        t_labels.push(i)
        t_datas.push(datas[i])
    }
    if (t_labels.length > 10){
        t_labels = t_labels.slice(0,10)
    }
    if (t_datas.length > 10){
        t_datas = t_datas.slice(0,10)
    }
    // 创建图表
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: t_labels,
            datasets: [{
                label: title,
                data: t_datas,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            layout: {
                padding: {
                    left: 80, // 左边距
                    right: 80, // 右边距
                    top: 80, // 上边距
                    bottom: 80 // 下边距
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0 && title === 'Ip访问次数') {
                    const firstElement = elements[0];
                    const label = chart.data.labels[firstElement.index];
                    const value = chart.data.datasets[firstElement.datasetIndex].data[firstElement.index];
                    copy(label)
                    alert(`已经将“${label}”复制到剪切板`);
                }
            }
        }
    });
}
function ban_ip_in(ban_ips){
    const input = $id("NewBanInput")
    const ip = input.value;
    console.log(ban_ips, ip, !(ban_ips.includes(ip)))
    if(ban_ips.includes(ip)){
        alert("该Ip已被封禁！")
    }else{
        const param = {
            'ip':ip
        }
        ajax('POST', 'ban_ip_in', param, function (response){
            if(response){
                const new_ip_button = document.createElement("button")
                new_ip_button.className = 'HaveBanIp';
                new_ip_button.textContent = ip;
                new_ip_button.onclick = function() { ban_ip_off(this); };
                $id("HaveBanBox").appendChild(new_ip_button)
                $id("NewBanInput").value = '';
            }else{
                alert("封禁失败！")
            }
        }, function (){
            alert("封禁失败！网络错误")
        })
    }
}
function ban_ip_off(button){
    const ip = button.textContent;
    if(confirm(`你确定要解封“${ip}”吗？`)){
        const param = {
            'ip':ip
        }
        ajax('POST', '/ban_ip_off', param, function (response){
            if(response){
                const parent = button.parentNode;
                parent.removeChild(button)
            }else{
                alert("解封失败！")
            }
        },function (){
            alert("解封失败！网络错误")
        })
    }
}
function show_ban_ip_box(){
    const box = $id("BanIpBox");
    const input =  $id("NewBanInput");
    $id("Gray").style.display = 'block';
    input.value = '';
    box.style.display = 'block';
}
function hidden_ban_ip_box(){
    const box = $id("BanIpBox")
    box.style.display = 'none';
    $id("Gray").style.display = 'none';
}
function show_create_exchange_box(){
    const box = $id("CreateExchangeBox");
    const input =  $id("CreateExchangeInput");
    input.value = '';
    box.style.display = 'block';
    $id("Gray").style.display = 'block';
}
function hidden_create_exchange_box(){
    const box = $id("CreateExchangeBox")
    box.style.display = 'none';
    $id("Gray").style.display = 'none';
}
 // 添加新列的函数

function create_exchange(exchange_description, exchanges, exchange_who_have_table){
    // 加载兑换描述表
    clearTable($id("ExchangeDescriptionTable"))
    for (let i = 0 ; i < exchange_description.length; i++){
        const newRow = $id("ExchangeDescriptionTable").insertRow(-1);
        for (let j = 0; j < 5 ; j++){
            const cell = newRow.insertCell(-1);
            const input = document.createElement("input")
            input.className = "ExchangeInput";
            input.value = exchange_description[i][j];
            input.setAttribute("row", i.toString())
            input.setAttribute("column", j.toString())
            input.setAttribute("table", "ExchangeDescriptionTable")
            input.onkeydown = function (){ExchangeInputDown(event, this)}
            cell.appendChild(input)
        }
    }
    let ExchangeWhoHaveTr = $id("ExchangeWhoHaveTr");
    // 删除content中的所有子节点
    while (ExchangeWhoHaveTr.firstChild) {
        ExchangeWhoHaveTr.removeChild(ExchangeWhoHaveTr.firstChild);
    }


    const ExchangeWhoHaveTh_1 = document.createElement("th")
    ExchangeWhoHaveTh_1.textContent = 'Id(id)';
    ExchangeWhoHaveTr.appendChild(ExchangeWhoHaveTh_1)
    const ExchangeWhoHaveTh_2 = document.createElement("th")
    ExchangeWhoHaveTh_2.textContent = '用户Id(user_id)';
    ExchangeWhoHaveTr.appendChild(ExchangeWhoHaveTh_2)
    // 加载兑换拥有表的列标题
    for (let i = 0 ; i < exchanges.length; i++){
        const ExchangeWhoHaveTr = $id("ExchangeWhoHaveTr")
        const ExchangeWhoHaveTh = document.createElement("th")
        ExchangeWhoHaveTh.textContent = exchanges[i];
        ExchangeWhoHaveTr.appendChild(ExchangeWhoHaveTh)
    }
    clearTable($id("ExchangeWhoHaveTable"))
    // 加载兑换拥有表
    for (let i = 0 ; i < exchange_who_have_table.length; i++){
        const newRow = $id("ExchangeWhoHaveTable").insertRow(-1);
        for (let j = 0; j < exchanges.length + 2 ; j++){
            const cell = newRow.insertCell(-1);
            const input = document.createElement("input")
            input.className = "ExchangeInput";
            input.value = exchange_who_have_table[i][j];
            input.setAttribute("row", i.toString())
            input.setAttribute("column", j.toString())
            input.setAttribute("table", "ExchangeWhoHaveTable")
            input.onkeydown = function (){ExchangeInputDown(event, this)}
            cell.appendChild(input)
        }
    }
}

function submit_create_exchange(){
    const param = {
        'code': $id("CreateExchangeInput").value
    }
    ajax('POST', '/create_exchange', param, function (response){
        if (response['pass']){
            create_exchange(response['exchange_description_table'], response['exchanges'], response['exchange_who_have_table'])
            hidden_create_exchange_box()
        }else{
            const CreateExchangeInput = $id("CreateExchangeInput")
            const CreateExchangeLight = $id("CreateExchangeLight")
            CreateExchangeInput.style.borderBottom = '2px solid red';
            CreateExchangeLight.textContent = '兑换码已存在';
            CreateExchangeLight.style.color = 'red';
        }
    }, function (){
        alert("创建失败！网络错误")
    })
}
document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const CreateExchangeInput = $id("CreateExchangeInput");

    // 添加输入事件监听器
    CreateExchangeInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const CreateExchangeLight = $id("CreateExchangeLight");
        CreateExchangeInput.style.borderBottom = '2px solid #1e56a0';
        CreateExchangeLight.style.color = '#f6f6f6';
    });
})


function ExchangeInputDown(event, input){
    if (event.key === "Enter") {
         const table = input.getAttribute('table')
         const row = input.getAttribute('row')
         const column = input.getAttribute('column')
         const value = input.value;
         const  b = update_table(table, row, column, value)
        console.log(b)
         if (b){
             input.blur()
         }
    }
}
function update_table(table, row, column, value) {
    return new Promise((resolve, reject) => {
        const param = {
            'table': table,
            'row': row,
            'column': column,
            'value': value
        };

        ajax('POST', '/update_exchange', param, function (response) {
            if (response[0] === true) {
                create_exchange(response[1][1],response[1][2],response[1][0])
                resolve(true);
            } else {
                alert("修改发生错误！" + response[0]);
                resolve(false);
            }
        }, function () {
            alert("修改失败！网络错误");
            resolve(false);
        });
    });
}