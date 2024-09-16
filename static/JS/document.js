
// 编写快捷空格
const spaces = document.getElementsByClassName("space")

for (let i in spaces){
    let num = spaces[i].innerHTML;
    if (num){
        num = parseInt(num)
    }else{
        num = 1
    }
    let t_s = ""
    for (let j = 0; j < num; j++){
        t_s += "&nbsp"
    }
    spaces[i].innerHTML = t_s
}