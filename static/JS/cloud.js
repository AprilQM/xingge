function to_cloud() {
    $id("ToCloudButton").style.backgroundColor = '#f6f6f6';
    $id("ToCloudButton").style.color = '#163172';
    $id("ToCloudButton").style.fontSize = '40px';
    $id("ToTransmissionButton").style.backgroundColor = '#163172';
    $id("ToTransmissionButton").style.color = '#f6f6f6';
    $id("ToTransmissionButton").style.fontSize = '30px';
    $id("TransmissionUI").style.display = 'none';
    $id("CloudUI").style.display = 'block';
}
function to_transmission() {
    $id("ToTransmissionButton").style.backgroundColor = '#f6f6f6';
    $id("ToTransmissionButton").style.color = '#163172';
    $id("ToTransmissionButton").style.fontSize = '40px';
    $id("ToCloudButton").style.backgroundColor = '#163172';
    $id("ToCloudButton").style.color = '#f6f6f6';
    $id("ToCloudButton").style.fontSize = '30px';
    $id("TransmissionUI").style.display = 'block';
    $id("CloudUI").style.display = 'none';
}
function to_weblink(url) {
    window.open(url, '_blank');
}
$id("ToUserInformation").addEventListener("contextmenu", function (event) {
    event.preventDefault();

    alert("彩蛋！这都被你发现了？兑换码：XGXGXGXG666")
});
let path = [];

function make_filename(filename) {
    if (filename.length > 16) {
        filename = filename.slice(0, 6) + "···" + filename.slice(filename.length - 6, filename.length)
    }
    return filename
}
function create_ui() {
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


    for (let j in t_datas["d"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "d")
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-dir-floder";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        FilesButtonBox.onclick = function () { open_dir(j, datas) }
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j in t_datas["w"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j + ".weblink")
        FilesButtonBox.setAttribute("file_type", "w")
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-link";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        FilesButtonBox.onclick = function () {
            window.open(t_datas["w"][j], '_blank');
        }
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["p"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "p")
        FilesButtonBox.onclick = function () {
            window.open(`/download?path=${path.join("/")}&filename=${j}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-PDF";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["m3"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "m3")
        FilesButtonBox.onclick = function () {
            window.open(`/download?path=${path.join("/")}&filename=${j}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-MP";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["m4"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "m4")
        FilesButtonBox.onclick = function () {
            window.open(`/download?path=${path.join("/")}&filename=${j}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-MP1";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["j"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "j")
        FilesButtonBox.onclick = function () {
            window.open(`/preview?path=${path.join("/")}&filename=${j}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-pictureFile-1";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["z"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "z")
        FilesButtonBox.onclick = function () {
            window.open(`/download?path=${path.join("/")}&filename=${j}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-rarzip";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("FilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["f"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButton"
        FilesButtonBox.setAttribute("filename", j)
        FilesButtonBox.setAttribute("file_type", "f")
        FilesButtonBox.onclick = function () {
            window.open(`/download?path=${path.join("/")}&filename=${j}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-file";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("FilesBox").appendChild(FilesButtonBox)
    }

    const UnderLight = document.createElement("h3")
    UnderLight.id = "UnderLight";
    if (isEmpty) {
        UnderLight.textContent = "咦？这里什么都没有哎！";
    } else {
        UnderLight.textContent = "下面的区域以后再来探索吧~";
    }
    $id("FilesBox").appendChild(UnderLight)
}
function open_dir(filename) {
    path.push(filename)
    const fgf = document.createElement("span")
    fgf.textContent = ">";
    $id("PathH3").appendChild(fgf)
    const file_path_button = document.createElement("button")
    file_path_button.className = 'PathButton';
    filename = make_filename(filename)
    file_path_button.textContent = filename;
    const path_len = path.length
    file_path_button.onclick = function () { dir_to(path_len) }
    $id("PathH3").appendChild(file_path_button)
    create_ui()
}
function dir_to(page) {
    path = path.slice(0, page)
    let parentElement = $id("PathH3");

    // 从后往前删
    while (parentElement.lastChild) {
        parentElement.removeChild(parentElement.lastChild)
    }

    for (let i = 0; i < path.length; i++) {
        const fgf = document.createElement("span")
        fgf.textContent = ">";
        $id("PathH3").appendChild(fgf)
        const file_path_button = document.createElement("button")
        file_path_button.className = 'PathButton';
        file_path_button.textContent = path[i];

        file_path_button.onclick = function () { dir_to(i + 1) }

        $id("PathH3").appendChild(file_path_button)
    }

    create_ui()
}
function hidden_create_dir_box() {
    $id("CreateDirBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}
function show_create_dir_box() {
    $id("Gray").style.display = 'block';
    $id("CreateDirBox").style.display = 'block';
    $id("NewDirNameInput").value = '';
    $id("NewDirNameInput").style.borderBottom = '2px solid #1e56a0';
    $id("NewDirNameLight").style.color = '#f6f6f6';
}
function create_dir() {
    const forbiddenChars = /[\\/:*?"<>|]/;

    if ($id("NewDirNameInput").value === '') {
        $id("NewDirNameLight").textContent = "文件夹名不能为空";
        $id("NewDirNameLight").style.color = "red";
        $id("NewDirNameInput").style.borderBottom = '2px solid red';
    } else if (forbiddenChars.test($id("NewDirNameInput").value)) {
        $id("NewDirNameLight").textContent = "用户名不能包含: \\ / : * ? \" < > |";
        $id("NewDirNameLight").style.color = "red";
        $id("NewDirNameInput").style.borderBottom = '2px solid red';
    } else {
        const param = {
            'path': path,
            'filename': $id("NewDirNameInput").value
        }
        ajax('POST', '/create_dir', param, function (response) {
            if (response[0]) {
                datas = response[1]
                create_ui()
                hidden_create_dir_box()
            } else if (response === false) {
                $id("NewDirNameLight").textContent = "你没有权限创建文件夹";
                $id("NewDirNameLight").style.color = "red";
                $id("NewDirNameInput").style.borderBottom = '2px solid red';
            } else {
                alert("创建失败！")
            }
        }, function () {
            alert("创建失败！网络错误")
        })
    }
}
function delete_(filename) {
    if (confirm("你确定要删除这个文件吗？（如果是文件夹将删除文件夹之中的所有内容），这将无法恢复！你将永远失去！")) {
        const param = {
            'path': path,
            'filename': filename
        }
        ajax('POST', '/delete', param, function (response) {
            if (response[0]) {
                datas = response[1]
                create_ui()
                let p = "/" + filename;
                if (p[0] === '/') {
                    p = p.slice(1, p.length)
                }
                // 遍历数组时从后向前遍历，避免索引问题
                for (let i = DownloadList.length - 1; i >= 0; i--) {
                    console.log(p);
                    if (DownloadList[i].includes(p)) {
                        DownloadList.splice(i, 1);
                        create_download_ui();
                    }
                }
            } else {
                alert("删除失败！")
            }
        }, function () {
            alert("删除失败！网络错误")
        })
    }
}
function hidden_create_link_box() {
    $id("CreateLinkBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}
function show_create_link_box() {
    $id("Gray").style.display = 'block';
    $id("CreateLinkBox").style.display = 'block';
    $id("NewLinkNameInput").value = '';
    $id("NewLinkNameInput").style.borderBottom = '2px solid #1e56a0';
    $id("NewLinkNameLight").style.color = '#f6f6f6';
    $id("NewLinkWebInput").value = '';
    $id("NewLinkWebInput").style.borderBottom = '2px solid #1e56a0';
}
document.addEventListener('DOMContentLoaded', function () {
    // 获取UsernameEdit输入框元素
    const NewDirNameInput = $id("NewDirNameInput");

    // 添加输入事件监听器
    NewDirNameInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const NewDirNameLight = $id("NewDirNameLight");
        NewDirNameInput.style.borderBottom = '2px solid #1e56a0';
        NewDirNameLight.style.color = '#f6f6f6';
    });

    const NewLinkNameInput = $id("NewLinkNameInput");

    // 添加输入事件监听器
    NewLinkNameInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const NewLinkNameLight = $id("NewLinkNameLight");
        NewLinkNameInput.style.borderBottom = '2px solid #1e56a0';
        NewLinkNameLight.style.color = '#f6f6f6';
    });

    const RenameInput = $id("RenameInput");

    // 添加输入事件监听器
    RenameInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const RenameLight = $id("RenameLight");
        RenameInput.style.borderBottom = '2px solid #1e56a0';
        RenameLight.style.color = '#f6f6f6';
    });
})
function submit_link() {
    const NewLinkNameInput = $id("NewLinkNameInput");
    const NewLinkNameLight = $id("NewLinkNameLight");
    const NewLinkWebInput = $id("NewLinkWebInput");
    if (NewLinkNameInput.value === '') {
        NewLinkNameLight.textContent = "描述不能为空";
        NewLinkNameLight.style.color = "red";
        NewLinkNameInput.style.borderBottom = '2px solid red';
    } else {
        const param = {
            'path': path,
            'filename': NewLinkNameInput.value,
            'nr': NewLinkWebInput.value
        }
        ajax('POST', '/weblink', param, function (response) {
            if (response[0]) {
                datas = response[1]
                create_ui()
                hidden_create_link_box()
            } else {
                alert("创建失败")
            }
        }, function () {
            alert("创建失败！网络错误")
        })
    }
}
function hidden_rename_box() {
    $id("RenameBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}

function show_rename_box(old_value) {
    $id("Gray").style.display = 'block';
    $id("RenameBox").style.display = 'block';
    $id("RenameInput").setAttribute("old_value", old_value);
    $id("RenameInput").value = old_value;
    $id("RenameInput").style.borderBottom = '2px solid #1e56a0';
    $id("RenameLight").style.color = '#f6f6f6';
}

function submit_rename() {
    const RenameInput = $id("RenameInput");
    const RenameLight = $id("RenameLight");
    const forbiddenChars = /[\\/:*?"<>|]/;
    if (RenameInput.value === '') {
        RenameLight.textContent = "文件名不能为空";
        RenameLight.style.color = "red";
        RenameInput.style.borderBottom = '2px solid red';
    } else if (forbiddenChars.test(RenameInput.value)) {
        RenameLight.textContent = "用户名不能包含: \\ / : * ? \" < > |";
        RenameLight.style.color = "red";
        RenameInput.style.borderBottom = '2px solid red';
    } else {
        const param = {
            'path': path,
            'old_name': $id("RenameInput").getAttribute("old_value"),
            'new_name': RenameInput.value
        }
        ajax('POST', '/rename', param, function (response) {
            if (response[0]) {
                datas = response[1]
                create_ui()
                hidden_rename_box()
                let old_value = document.getElementById("RenameInput").getAttribute("old_value");
                let p = "/" + old_value;
                if (p[0] === '/') {
                    p = p.slice(1, p.length)
                }
                // 遍历数组时从后向前遍历，避免索引问题
                for (let i = DownloadList.length - 1; i >= 0; i--) {
                    console.log(p);
                    if (DownloadList[i].includes(p)) {
                        DownloadList.splice(i, 1);
                        create_download_ui();
                    }
                }
            } else {
                alert("重命名失败")
            }
        }, function () {
            alert("重命名失败失败！网络错误")
        })
    }
}

const FilesBox = $id("FilesBox");
const UploadLightBox = $id("UploadLightBox");

FilesBox.addEventListener('dragenter', (event) => {
    event.preventDefault();
    UploadLightBox.style.display = "flex";
});

FilesBox.addEventListener('dragover', (event) => {
    event.preventDefault();
});

FilesBox.addEventListener('dragleave', (event) => {
    const rect = FilesBox.getBoundingClientRect();
    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    ) {
        UploadLightBox.style.display = "none";
    }
});

FilesBox.addEventListener('drop', (event) => {
    event.preventDefault();
    UploadLightBox.style.display = "none";

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files); // 调用文件上传处理函数
    } else {
        console.log('No files dropped.');
    }
});

function handleFileUpload(files) {
    const formData = new FormData();
    formData.append("path", path.join("/"));

    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            $id('progressBar').style.width = percentComplete + '%';
        }
    });

    xhr.onload = function () {
        if (xhr.status === 200) {
            datas = JSON.parse(xhr.responseText);
            create_ui();

            let i = 0;
            const interval = setInterval(() => {
                $id('progressBar').style.width = (100 - i).toString() + "%";
                i++;
                if (i > 100) {
                    clearInterval(interval);
                }
            }, 5);
        }
    };

    xhr.send(formData);
}

// 点击上传按钮触发文件选择
$id('UploadButton').addEventListener('click', function (event) {
    event.preventDefault();
    $id('fileInput').click();
});

// 选择文件后自动上传
$id('fileInput').addEventListener('change', function () {
    const fileInput = $id('fileInput');
    const files = fileInput.files;
    if (files.length > 0) {
        handleFileUpload(files);
    }
});

function add_to_download_list(filename) {
    let p = path.join("/") + "/" + filename
    if (p.slice(0, 1) === '/') {
        p = p.slice(1, p.length)
    }
    if (DownloadList.indexOf(p) !== -1) {
        alert(`文件“${p}”已经在下载列表中了`)
    } else {
        DownloadList.push(p)
    }
    create_download_ui()
}

function create_download_ui() {
    $id("StartDownloadButton").href = "/download_more?paths=" + DownloadList.join("@");
    $id("DownloadNum").textContent = ` 下载(${DownloadList.length})`
    let DownloadListBox = $id("DownloadListBox");
    // 删除content中的所有子节点
    while (DownloadListBox.firstChild) {
        DownloadListBox.removeChild(DownloadListBox.firstChild);
    }

    if (DownloadList.length !== 0) {
        for (let i of DownloadList) {
            const div = document.createElement("div")
            div.className = 'OneDownloadBox';
            const span = document.createElement("span")
            span.className = 'OneDownloadTitle';
            span.textContent = i;
            div.appendChild(span)
            const button = document.createElement("button")
            button.className = 'OneDownloadDelete';
            button.textContent = '删除';
            button.onclick = function () { delete_download(i) }
            div.appendChild(button)
            DownloadListBox.appendChild(div)
        }
    } else {
        const h3 = document.createElement("h3")
        h3.id = 'DownloadUnderLight';
        h3.textContent = '暂无下载任务';
        DownloadListBox.appendChild(h3)
    }
}
function delete_download(index) {
    DownloadList.splice(index, 1)
    create_download_ui()
}

function create_browse_code(filename) {
    path.push(filename)
    const param = {
        'path': path
    }
    ajax('POST', '/create_browse_code', param, function (response) {
        if (response === false) {
            alert("你没有分享文件的权限")
        } else {
            copy(response)
            alert(`成功将浏览码：${response} 复制到剪切板！`)
            path.pop()
        }
    }, function () {
        alert("创建浏览码失败！网络错误")
    })
}
// 生成树 由gpt提供
function createTreeElement(directory, path = '', indent = '') {
    let htmlContent = '';
    if (directory.d) {
        const entries = Object.entries(directory.d);
        entries.forEach(([key, value], index) => {
            const isLastItem = index === entries.length - 1;
            const fullPath = path ? `${path}/${key}` : key;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" onclick="get_move_path('${fullPath}')">${key}</span>\n`;
            htmlContent += createTreeElement(value, fullPath, `${indent}${isLastItem ? '    ' : '│   '}`);
        });
    }
    return htmlContent;
}

function hidden_move_box() {
    $id("MoveBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}

function show_move_box(file) {
    $id("Gray").style.display = 'block';
    $id("MoveBox").style.display = 'block';
    $id("FilesTree").innerHTML = username + "<br>" + createTreeElement(datas)
    $id("MoveBox").setAttribute("filename", file)
}
function get_move_path(p) {
    const param = {
        'old_path': path.join("\\") + "\\" + $id("MoveBox").getAttribute("filename"),
        'new_path': p
    }
    ajax('POST', '/move_file', param, function (response) {
        if (response[0]) {
            hidden_move_box()
            datas = response[1]
            create_ui()
        } else {
            alert("移动失败！权限不足")
            hidden_move_box()
        }
    }, function () {
        alert("移动失败！网络错误")
    })
}
document.addEventListener('contextmenu', function (event) {
    // 获取鼠标右键点击的目标元素
    let flag = false;
    const targetElement = event.target;
    let filename;
    let file_type;

    if (targetElement.className === "FilesButton") {
        flag = true;
        filename = targetElement.getAttribute("filename");
        file_type = targetElement.getAttribute("file_type");
    } else if (targetElement.parentElement.className === "FilesButton") {
        flag = true;
        filename = targetElement.parentElement.getAttribute("filename");
        file_type = targetElement.parentElement.getAttribute("file_type");
    }
    if (["d", "w", "f", "z"].indexOf(file_type) !== -1) {
        $id("ShowRenameButton").style.display = "block";
        $id("ShowMoveButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        $id("PreviewButton").style.display = "none";
        $id("DownloadButton").style.display = "none";
    } else if (["p", "m3", "m4"].indexOf(file_type) !== -1) {
        $id("ShowRenameButton").style.display = "block";
        $id("ShowMoveButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        $id("PreviewButton").style.display = "block";
        $id("DownloadButton").style.display = "none";
    } else {
        $id("ShowRenameButton").style.display = "block";
        $id("ShowMoveButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        $id("PreviewButton").style.display = "none";
        if (lv > 2) {
            $id("DownloadButton").style.display = "block";
        } else {
            $id("DownloadButton").style.display = "none";
        }
    }

    if (file_type === "d") {
        if (lv > 3) {
            $id("ShowShareButton").style.display = "block";
        } else {
            $id("ShowShareButton").style.display = "none";
        }

        $id("ShowRenameButton").style.display = "block";
        $id("DeleteButton").style.display = "block";

        $id("ShowMoveButton").style.display = "none";
        $id("PreviewButton").style.display = "none";
        $id("DownloadButton").style.display = "none";
        $id("JoinDownloadListButton").style.display = "none";
    } else if (file_type === "w") {
        $id("ShowShareButton").style.display = "none";
        $id("ShowRenameButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        if (lv > 3) {
            $id("ShowMoveButton").style.display = "block";
        } else {
            $id("ShowMoveButton").style.display = "none";
        }
        $id("PreviewButton").style.display = "none";
        $id("DownloadButton").style.display = "none";
        $id("JoinDownloadListButton").style.display = "none";
    } else if (["p", "m3", "m4"].indexOf(file_type) !== -1) {
        $id("ShowShareButton").style.display = "none";
        $id("ShowRenameButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        if (lv > 3) {
            $id("ShowMoveButton").style.display = "block";
        } else {
            $id("ShowMoveButton").style.display = "none";
        }
        if (lv > 4) {
            $id("PreviewButton").style.display = "block";
        } else {
            $id("PreviewButton").style.display = "none";
        }
        $id("DownloadButton").style.display = "none";
        if (lv > 2) {
            $id("JoinDownloadListButton").style.display = "block";
        } else {
            $id("JoinDownloadListButton").style.display = "none";
        }
    } else if (file_type === "j") {
        $id("ShowShareButton").style.display = "none";
        $id("ShowRenameButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        if (lv > 3) {
            $id("ShowMoveButton").style.display = "block";
        } else {
            $id("ShowMoveButton").style.display = "none";
        }
        $id("PreviewButton").style.display = "none";
        if (lv > 4) {
            $id("DownloadButton").style.display = "block";
        } else {
            $id("DownloadButton").style.display = "none";
        }
        if (lv > 2) {
            $id("JoinDownloadListButton").style.display = "block";
        } else {
            $id("JoinDownloadListButton").style.display = "none";
        }
    } else {
        $id("ShowShareButton").style.display = "none";
        $id("ShowRenameButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        if (lv > 3) {
            $id("ShowMoveButton").style.display = "block";
        } else {
            $id("ShowMoveButton").style.display = "none";
        }
        $id("PreviewButton").style.display = "none";
        $id("DownloadButton").style.display = "none";
        if (lv > 2) {
            $id("JoinDownloadListButton").style.display = "block";
        } else {
            $id("JoinDownloadListButton").style.display = "none";
        }
    }
    if (flag) {
        event.preventDefault();

        const menu = $id("FilesRightMenu");
        menu.style.width = "150px";

        // 获取窗口尺寸
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 获取菜单尺寸
        const menuWidth = 150;
        const menuHeight = menu.offsetHeight;

        // 计算菜单位置
        let menuX = event.clientX;
        let menuY = event.clientY;

        // 检查是否超过窗口边界
        if (menuX + menuWidth > windowWidth) {
            menuX = windowWidth - menuWidth;
        }
        if (menuY + menuHeight > windowHeight) {
            menuY = windowHeight - menuHeight;
        }

        // 设置菜单位置
        menu.style.top = menuY + "px";
        menu.style.left = menuX + "px";

        // 设置项目文件名属性
        menu.setAttribute("filename", filename);
    }
});
document.addEventListener('click', function (event) {
    // 获取鼠标右键点击的目标元素
    const targetElement = event.target;
    // 检查点击是否在菜单内或菜单元素本身
    if (!$id("FilesRightMenu").contains(targetElement)) {
        $id("FilesRightMenu").style.width = "0";
    }
});


function RightMenuShare() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    create_browse_code(filename);
    $id("FilesRightMenu").style.width = "0";
}
function RightMenuRename() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    show_rename_box(filename);
    $id("FilesRightMenu").style.width = "0";
}
function RightMenuMove() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    show_move_box(filename);
    $id("FilesRightMenu").style.width = "0";
}
function RightMenuDelete() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    delete_(filename);
    $id("FilesRightMenu").style.width = "0";
}
function RightMenuPreview() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    window.open("/preview?path=" + path.join("/") + "&filename=" + filename, "_blank");
    $id("FilesRightMenu").style.width = "0";
}
function RightMenuDownload() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    window.open("/download?path=" + path.join("/") + "&filename=" + filename, "_blank");
    $id("FilesRightMenu").style.width = "0";
}
function RightMenuJoinDownloadList() {
    const filename = $id("FilesRightMenu").getAttribute("filename");
    add_to_download_list(filename);
    $id("FilesRightMenu").style.width = "0";
}
