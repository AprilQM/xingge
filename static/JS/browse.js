function create_ui(){
    let t_datas = datas;
    for (let i = 0; i < path.length; i++) {
        t_datas = t_datas["d"][path[i]]
    }
    let FilesBox = $id("FilesBox");
    // 删除content中的所有子节点
    while (FilesBox.firstChild) {
        FilesBox.removeChild(FilesBox.firstChild);
    }
    let isEmpty = Object.keys(t_datas["d"]).length + t_datas["f"].length + Object.keys(t_datas["w"]).length + t_datas["p"].length + t_datas["m3"].length + t_datas["m4"].length + t_datas["j"].length === 0;

    for (let i in t_datas){
        if (i === 'd'){
            for (let j in t_datas[i]){
                const FilesButton = document.createElement("button")
                FilesButton.className = 'FilesButton';
                FilesButton.onclick = function () {open_dir(j, datas)}
                    const span = document.createElement("span")
                    span.className = 'iconfont icon-dir-floder';
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }else if (i === 'w'){
            for (let j in t_datas[i]){
                const FilesButton = document.createElement("button")
                FilesButton.className = 'FilesButton';
                FilesButton.onclick = function () {to_weblink(t_datas[i][j])}
                    const span = document.createElement("span")
                    span.className = 'iconfont icon-link';
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }else if (i === 'p'){
            for (let j of t_datas[i]){
                const FilesButton = document.createElement("a")
                FilesButton.className = 'FilesButton';
                FilesButton.href = "/browse_download?path=" + path.join("/") + "&filename=" + j + "&code=" + code
                    const span = document.createElement("span")
                    span.className = 'iconfont icon-PDF';
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }else if (i === 'm3'){
            for (let j of t_datas[i]){
                const FilesButton = document.createElement("a")
                FilesButton.className = 'FilesButton';
                FilesButton.href = "/browse_download?path=" + path.join("/") + "&filename=" + j + "&code=" + code
                    const span = document.createElement("span")
                    span.className = 'iconfont icon-MP';
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }else if (i === 'm4'){
            for (let j of t_datas[i]){
                const FilesButton = document.createElement("a")
                FilesButton.className = 'FilesButton';
                FilesButton.href = "/browse_download?path=" + path.join("/") + "&filename=" + j + "&code=" + code
                    const span = document.createElement("span")
                    span.className = 'iconfont icon-MP1';
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }else if (i === 'j'){
            for (let j of t_datas[i]){
                const FilesButton = document.createElement("a")
                FilesButton.className = 'FilesButton';
                FilesButton.href = "/browse_download?path=" + path.join("/") + "&filename=" + j + "&code=" + code
                    const span = document.createElement("span")
                    span.className = 'iconfont icon-pictureFile-1';
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }else{
            for (let j of t_datas[i]){
                const FilesButton = document.createElement("a")
                FilesButton.className = 'FilesButton';
                FilesButton.href = "/browse_download?path=" + path.join("/") + "&filename=" + j + "&code=" + code
                    const span = document.createElement("span")
                    if (i === 'z'){
                       span.className = 'iconfont icon-rarzip';
                    }else{
                        span.className = 'iconfont icon-file';
                    }
                    FilesButton.appendChild(span)
                    const t = document.createElement("t")
                    t.textContent = make_filename(j)
                    FilesButton.appendChild(t)
                $id("FilesBox").appendChild(FilesButton)
            }
        }
    }

    if (isEmpty){
        const UnderLight = document.createElement("h3")
        UnderLight.id = "UnderLight";
        UnderLight.textContent = "咦？这里什么都没有哎！";
        $id("FilesBox").appendChild(UnderLight)
    }else{
        const UnderLight = document.createElement("h3")
        UnderLight.id = "UnderLight";
        UnderLight.textContent = "下面的区域以后再来探索吧~";
        $id("FilesBox").appendChild(UnderLight)
    }
}
function open_dir(filename){
    path.push(filename)
    $id("backButton").style.transform = 'scale(1)'
    create_ui()
}
function Back(){
    path.pop()
    console.log(path)
    if (path.length === 0){
        $id("backButton").style.transform = 'scale(0)'
    }
    create_ui()
}
function make_filename(filename){
    if (filename.length > 24){
        filename = filename.slice(0, 11) + "···" + filename.slice(filename.length - 11, filename.length)
    }
    return filename
}
function to_weblink(url){
    window.location.href = url;
}