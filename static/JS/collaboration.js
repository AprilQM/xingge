function hidden_create_project() {
    $id("Gray").style.display = "none";
    $id("CreateProjectLightBox").style.display = "none";
}

function show_create_project() {
    $id("Gray").style.display = "block";
    $id("CreateProjectLightBox").style.display = "block";
}

function submit_create_project() {
    const param = {
        "title": $id("ProjectInput").value
    }
    ajax('POST', "/create_project", param, function (response) {
        if (response !== true) {
            alert("创建失败")
        } else {
            location.reload()
        }
    }, function () {
        alert("创建失败！网络错误")
    })
}

function hidden_project_information() {
    $id("ProjectInformationBackground").style.display = "none";
}

function show_project_information(project_index) {
    $id("ProjectInformationBackground").style.display = "block";
    $id("ProjectTitle").textContent = project_list[project_index][0];
    $id("ProjectOwner").textContent = "策划：" + project_list[project_index][1][1]
    $id("GetJoinCode").innerText = "加入码 : ****************"
    let admins = []
    for (let i of project_list[project_index][2]) {
        admins.push(i)
    }
    $id("ProjectAdmins").textContent = "管理员：" + admins.join("，")
    let members = []
    for (let i of project_list[project_index][3]) {
        members.push(i)
    }
    $id("ProjectMembers").textContent = "成员：" + members.join("，")
    $id("ProjectInformationBackground").setAttribute("project_id", project_list[project_index][5])
    $id("ProjectInformationBackground").setAttribute("project_index", project_index)
    if (admins.indexOf(username) !== -1) {
        $id("GoControlProject").style.display = "block";
    } else {
        $id("GoControlProject").style.display = "none";
    }
}

function show_message_board() {
    $id("MessageBoardBox").style.display = "block";
    const project_index = $id("ProjectInformationBackground").getAttribute("project_index")
    $id("MessageBoard").value = project_list[project_index][4];
}

function hidden_message_board() {
    $id("MessageBoardBox").style.display = "none";
}

function submit_message() {
    const param = {
        "message": $id("MessageBoard").value,
        "project_id": $id("ProjectInformationBackground").getAttribute("project_id")
    }
    ajax("POST", "/update_message_board", param, function (response) {
        if (response) {
            const project_index = $id("ProjectInformationBackground").getAttribute("project_index")
            hidden_message_board()
            project_list[project_index][4] = $id("MessageBoard").value;
        } else {
            alert("提交失败！")
        }
    }, function () {
        alert("提交失败！网络错误")
    })
}
function show_admin() {
    $id("AdminBox").style.display = 'block';
    const project_index = parseInt($id("ProjectInformationBackground").getAttribute("project_index"))
    $id("AdminProjectTitle").textContent = project_list[project_index][0]
    const window_height = window.innerHeight;
    $id("AdminProjectTitle").style.fontSize = (window_height - 200) / project_list[project_index][0].length / 2 + "px"
    $id("AdminProjectOwner").textContent = "策划: " + project_list[project_index][1][1]
    const owner = project_list[project_index][1][1]

    let AdminsBox = $id("AdminsBox");
    while (AdminsBox.firstChild) {
        AdminsBox.removeChild(AdminsBox.firstChild);
    }
    let MembersBox = $id("MembersBox");
    while (MembersBox.firstChild) {
        MembersBox.removeChild(MembersBox.firstChild);
    }
    const admin_light = document.createElement("h1")
    admin_light.textContent = "管理员"
    admin_light.id = "admin_light";
    $id("AdminsBox").appendChild(admin_light)
    const member_light = document.createElement("h1")
    member_light.textContent = "成员"
    member_light.id = "member_light";
    $id("MembersBox").appendChild(member_light)
    for (let i of project_list[project_index][3]) {
        if (i !== owner) {
            if (project_list[project_index][2].indexOf(i) !== -1) {
                const admin = document.createElement("button")
                admin.className = "ManageAdminButton"
                admin.textContent = " " + i;
                admin.onclick = function () { admin_to_member(i) }
                $id("AdminsBox").appendChild(admin)
            } else {
                const member = document.createElement("button")
                member.className = "ManageMemberButton"
                member.textContent = " " + i;
                member.onclick = function () { member_to_admin(i) }
                member.addEventListener("contextmenu", function (event) {
                    event.preventDefault()
                    kick_member(i)
                })
                $id("MembersBox").appendChild(member)
            }
        }
    }
}
function hidden_admin() {
    $id("AdminBox").style.display = 'none';
}

function get_code() {
    if ($id("GetJoinCode").innerText === "加入码 : ****************") {
        const param = {
            "project_id": $id("ProjectInformationBackground").getAttribute("project_id")
        }
        ajax('POST', "/get_join_code", param, function (response) {
            JoinCode = response
            $id("GetJoinCode").innerText = "加入码 : " + response;
        }, function () {
            alert("获取失败！网络错误")
        })
    } else {
        copy(JoinCode)
        alert(`成功将“${JoinCode}”复制到剪切板`)
    }
}

function hidden_join() {
    $id("Gray").style.display = "none";
    $id("UserJoinLightBox").style.display = "none";
}

function show_join() {
    $id("Gray").style.display = "block";
    $id("UserJoinLightBox").style.display = "block";
}

function submit_join() {
    const project_index = parseInt($id("ProjectInformationBackground").getAttribute("project_index"))
    const param = {
        "project_id": $id("ProjectInformationBackground").getAttribute("project_id"),
        "username": $id("UserJoinInput").value
    }
    if (project_list[project_index][3].indexOf($id("UserJoinInput").value) === -1) {
        ajax("POST", "/project_join_admin", param, function (response) {
            if (response[0]) {
                project_list = response[1]
                show_project_information($id("ProjectInformationBackground").getAttribute("project_index"))
                hidden_join()
                show_admin()
            } else {
                $id("UserJoinInput").style.borderBottom = "red 2px solid"
                $id("UserJoinLight").style.color = "red"
                $id("UserJoinLight").textContent = "未知用户"
            }
        })
    } else {
        $id("UserJoinInput").style.borderBottom = "red 2px solid"
        $id("UserJoinLight").style.color = "red"
        $id("UserJoinLight").textContent = "该用户已经在项目中"
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // 获取UsernameEdit输入框元素
    const UserJoinInput = $id("UserJoinInput");

    // 添加输入事件监听器
    UserJoinInput.addEventListener("input", function () {
        // 在这里编写输入事件触发时执行的代码
        const usernameLight = $id("AuthUsernameLight");
        UserJoinInput.style.borderBottom = '2px solid #1e56a0';
        $id("UserJoinLight").style.color = '#f6f6f6';
    });
});
document.addEventListener('contextmenu', function (event) {
    // 获取鼠标右键点击的目标元素
    let flag = false
    const targetElement = event.target;
    let project_id
    if (targetElement.className === "ProjectBox") {
        flag = true
        project_id = targetElement.getAttribute("project_id")
    } else if (targetElement.parentElement.className === "ProjectBox") {
        flag = true
        project_id = targetElement.parentElement.getAttribute("project_id")
    }
    if (flag) {
        event.preventDefault();

        const menu = $id("ProjectRightMenu");

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


        $id("ProjectRightMenu").onclick = function () { delete_project(project_id) }
    }
});
document.addEventListener('click', function (event) {
    // 获取鼠标右键点击的目标元素
    const targetElement = event.target;
    // 检查点击是否在菜单内或菜单元素本身
    if (!$id("ProjectRightMenu").contains(targetElement)) {
        $id("ProjectRightMenu").style.width = "0";
    }
});

function delete_project(project_id) {
    if (confirm("你确定要删除该项目吗？")) {
        const param = {
            "project_id": project_id
        }
        ajax('POST', 'delete_project', param, function (response) {
            if (response) {
                location.reload()
            } else {
                alert("删除失败！你没有权限")
            }
        }, function () {
            alert("删除失败！网络错误")
        })
    }
}

function kick_member(member_name) {
    if (confirm("你确定要将该用户从项目中踢出吗？")) {
        const param = {
            "project_id": $id("ProjectInformationBackground").getAttribute("project_id"),
            "member_name": member_name
        }
        ajax('POST', "/kick_member", param, function (response) {
            if (response[0]) {
                alert(`已经将“${member_name}”踢出`)
                project_list = response[1]
                show_project_information($id("ProjectInformationBackground").getAttribute("project_index"))
                show_admin()
            } else {
                alert("踢出失败！该用户是管理员，要踢出请先将其降级为成员")
            }
        }, function () {
            alert("踢出失败！网络错误")
        })
    }
}

function member_to_admin(member_name) {
    const param = {
        "project_id": $id("ProjectInformationBackground").getAttribute("project_id"),
        "member_name": member_name
    }
    ajax('POST', "/member_to_admin", param, function (response) {
        if (response[0]) {
            project_list = response[1]
            show_project_information($id("ProjectInformationBackground").getAttribute("project_index"))
            show_admin()
        } else {
            alert("提升失败！该用户已经是管理员")
        }
    }, function () {
        alert("提升失败！网络错误")
    })
}

function to_join_code() {
    window.location.href = "/join_code"
}

function admin_to_member(admin_id) {
    const param = {
        "project_id": $id("ProjectInformationBackground").getAttribute("project_id"),
        "admin_id": admin_id
    }
    ajax('POST', "/admin_to_member", param, function (response) {
        if (response[0]) {
            project_list = response[1]
            show_project_information($id("ProjectInformationBackground").getAttribute("project_index"))
            show_admin()
        } else {
            alert("降级失败！该用户已经是成员")
        }
    }, function () {
        alert("降级失败！网络错误")
    })

}


function show_project_cloud() {
    const project_index = parseInt($id("ProjectInformationBackground").getAttribute("project_index"))
    $id("project_name").textContent = project_list[project_index][0]
    const param = {
        "project_id": $id("ProjectInformationBackground").getAttribute("project_id")
    }
    ajax('POST', "/get_project_cloud_files", param, function (response) {
        datas = response
        create_cloud_ui()
    }, function () {
        alert("获取项目列表失败！网络错误")
    })
    $id("ProjectCloudBox").style.display = "block";

    ajax('POST', "/get_user_files", null, function (response) {
        user_files = response
    }, function () {
        console.error("获取用户云盘错误！")
    })
}

function create_cloud_ui() {
    let t_datas = datas;
    for (let i = 0; i < path.length; i++) {
        t_datas = t_datas["d"][path[i]]
    }
    let BottomFilesBox = $id("BottomFilesBox");
    // 删除content中的所有子节点
    while (BottomFilesBox.firstChild) {
        BottomFilesBox.removeChild(BottomFilesBox.firstChild);
    }
    let isEmpty = Object.keys(t_datas["d"]).length + t_datas["f"].length + Object.keys(t_datas["w"]).length + t_datas["p"].length + t_datas["m3"].length + t_datas["m4"].length + t_datas["j"].length === 0;


    for (let j in t_datas["d"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "d")
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-dir-floder";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        FilesButtonBox.onclick = function () { open_dir(j, datas) }
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }
    for (let j in t_datas["w"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j + ".weblink")
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
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["p"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "p")
        FilesButtonBox.onclick = function () {
            window.open(`/download_project?path=${path.join("/")}&filename=${j}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-PDF";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["m3"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "m3")
        FilesButtonBox.onclick = function () {
            window.open(`/download_project?path=${path.join("/")}&filename=${j}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-MP";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["m4"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "m4")
        FilesButtonBox.onclick = function () {
            window.open(`/download_project?path=${path.join("/")}&filename=${j}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-MP1";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["j"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "j")
        FilesButtonBox.onclick = function () {
            window.open(`/preview_project?path=${path.join("/")}&filename=${j}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-pictureFile-1";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }
    for (let j of t_datas["z"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "z")
        FilesButtonBox.onclick = function () {
            window.open(`/download_project?path=${path.join("/")}&filename=${j}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-rarzip";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }

    for (let j of t_datas["f"]) {
        const FilesButtonBox = document.createElement("div")
        FilesButtonBox.className = "FilesButtonBox"
        FilesButtonBox.setAttribute("project_file_name", j)
        FilesButtonBox.setAttribute("file_type", "f")
        FilesButtonBox.onclick = function () {
            window.open(`/download_project?path=${path.join("/")}&filename=${j}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
        }
        const FileSpan = document.createElement("span")
        FileSpan.className = "iconfont icon-file";
        FilesButtonBox.appendChild(FileSpan)
        const FileT = document.createElement("t")
        FileT.textContent = make_filename(j)
        FilesButtonBox.appendChild(FileT)
        $id("BottomFilesBox").appendChild(FilesButtonBox)
    }

    const UnderLight = document.createElement("h3")
    UnderLight.id = "UnderLight";
    if (isEmpty) {
        UnderLight.textContent = "咦？这里什么都没有哎！";
    } else {
        UnderLight.textContent = "下面的区域以后再来探索吧~";
    }
    $id("BottomFilesBox").appendChild(UnderLight)
}

function download_j() {
    const filename = $id("ProjectFilesRightMenu").getAttribute("project_file_name")
    window.open(`/download_project?path=${path.join("/")}&filename=${filename}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
    $id("ProjectFilesRightMenu").style.width = "0";
}

function preview_else() {
    const filename = $id("ProjectFilesRightMenu").getAttribute("project_file_name")
    window.open(`/preview_project?path=${path.join("/")}&filename=${filename}&project_id=${$id("ProjectInformationBackground").getAttribute("project_id")}`, "_blank")
    $id("ProjectFilesRightMenu").style.width = "0";
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

    create_cloud_ui()
}
function open_dir(filename) {
    path.push(filename)
    const fgf = document.createElement("span")
    fgf.textContent = ">";
    fgf.style.display = "inline";
    $id("PathH3").appendChild(fgf)
    const file_path_button = document.createElement("button")
    file_path_button.className = 'PathButton';
    filename = make_filename(filename)
    file_path_button.textContent = filename;
    const path_len = path.length
    file_path_button.onclick = function () { dir_to(path_len) }
    $id("PathH3").appendChild(file_path_button)
    create_cloud_ui()
}

const FilesBox = $id("BottomFilesBox");
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
    formData.append('project_id', $id("ProjectInformationBackground").getAttribute("project_id"));

    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload_project', true);

    xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            $id('progressBar').style.width = percentComplete + '%';
        }
    });

    xhr.onload = function () {
        if (xhr.status === 200) {
            datas = JSON.parse(xhr.responseText);
            create_cloud_ui();

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

function make_filename(filename) {
    if (filename.length > 16) {
        filename = filename.slice(0, 6) + "···" + filename.slice(filename.length - 6, filename.length)
    }
    return filename
}


function show_create_dir_box() {
    $id("Gray").style.display = 'block';
    $id("CreateDirBox").style.display = 'block';
    $id("NewDirNameInput").value = '';
    $id("NewDirNameInput").style.borderBottom = '2px solid #1e56a0';
    $id("NewDirNameLight").style.color = '#f6f6f6';
}

function hidden_create_dir_box() {
    $id("Gray").style.display = "none";
    $id("CreateDirBox").style.display = "none";
}

function submit_create_dir() {
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
            'project_id': $id("ProjectInformationBackground").getAttribute("project_id"),
            'path': path,
            'filename': $id("NewDirNameInput").value
        }
        ajax('POST', '/create_project_dir', param, function (response) {
            if (response[0]) {
                datas = response[1]
                create_cloud_ui()
                hidden_create_dir_box()
            } else if (response[0] === false) {
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
            'project_id': $id("ProjectInformationBackground").getAttribute("project_id"),
            'path': path,
            'filename': NewLinkNameInput.value,
            'nr': NewLinkWebInput.value
        }
        ajax('POST', '/weblink_project', param, function (response) {
            if (response[0]) {
                datas = response[1]
                create_cloud_ui()
                hidden_create_link_box()
            } else {
                alert("创建失败")
            }
        }, function () {
            alert("创建失败！网络错误")
        })
    }
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
    //
    // const RenameInput = $id("RenameInput");
    //
    // // 添加输入事件监听器
    // RenameInput.addEventListener("input", function () {
    //     // 在这里编写输入事件触发时执行的代码
    //     const RenameLight = $id("RenameLight");
    //     RenameInput.style.borderBottom = '2px solid #1e56a0';
    //     RenameLight.style.color = '#f6f6f6';
    // });
})

function show_move_in_box() {
    $id("Gray").style.display = "block";
    $id("MoveInBox").style.display = "block";
    $id("FilesPathBox").innerHTML = username + "<br>" + createTreeElement(user_files)
}

function hidden_move_in_box() {
    $id("Gray").style.display = "none";
    $id("MoveInBox").style.display = "none";
}

function createTreeElement(directory, path = '', indent = '') {
    let htmlContent = '';

    // 处理 'd' 键中的内容
    if (directory['d']) {
        const dEntries = Object.entries(directory['d']);
        dEntries.forEach(([key, value], index) => {
            const isLastItem = index === dEntries.length - 1;
            const currentPath = `${path}${key}/`;

            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${currentPath}" onclick="printPath(event)">${key}</span>\n`;
            htmlContent += createTreeElement(value, currentPath, `${indent}${isLastItem ? '    ' : '│   '}`);
        });
    }

    // 处理 'f' 键中的文件列表
    if (directory['f']) {
        directory['f'].forEach((file, fileIndex) => {
            const isLastItem = fileIndex === directory['f'].length - 1;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${path}${file}" onclick="printPath(event)">${file}</span>\n`;
        });
    }

    // 处理 'w' 键中的内容
    if (directory['w']) {
        const wEntries = Object.entries(directory['w']);
        wEntries.forEach(([key, value], index) => {
            const isLastItem = index === wEntries.length - 1;
            const currentPath = `${path}${key}`;

            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${currentPath}.weblink" onclick="printPath(event)">${key}</span>\n`;
            htmlContent += createTreeElement(value, currentPath, `${indent}${isLastItem ? '    ' : '│   '}`);
        });
    }

    // 处理 'p' 键中的文件列表
    if (directory['p']) {
        directory['p'].forEach((file, fileIndex) => {
            const isLastItem = fileIndex === directory['p'].length - 1;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${path}${file}" onclick="printPath(event)">${file}</span>\n`;
        });
    }

    // 处理 'j' 键中的文件列表
    if (directory['j']) {
        directory['j'].forEach((file, fileIndex) => {
            const isLastItem = fileIndex === directory['j'].length - 1;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${path}${file}" onclick="printPath(event)">${file}</span>\n`;
        });
    }

    // 处理 'm3' 键中的文件列表
    if (directory['m3']) {
        directory['m3'].forEach((file, fileIndex) => {
            const isLastItem = fileIndex === directory['m3'].length - 1;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${path}${file}" onclick="printPath(event)">${file}</span>\n`;
        });
    }

    // 处理 'm4' 键中的文件列表
    if (directory['m4']) {
        directory['m4'].forEach((file, fileIndex) => {
            const isLastItem = fileIndex === directory['m4'].length - 1;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" data-path="${path}${file}" onclick="printPath(event)">${file}</span>\n`;
        });
    }

    return htmlContent;
}

// 打印路径的函数
function printPath(event) {
    $id("MoveInCancelButton").style.color = "#777777";
    $id("MoveInCancelButton").disabled = true;
    $id("MoveInCancelButton").textContent = "正在移动";
    $id("MoveInCancelButton").style.cursor = "not-allowed";
    $id("FilesPathBox").style.margin = "4px";
    $id("FilesPathBox").style.border = "none";
    const pa = event.target.getAttribute('data-path');
    const param = {
        'project_id': $id("ProjectInformationBackground").getAttribute("project_id"),
        'target_file': pa,
        'target_path': path
    }
    ajax('POST', '/move_file_from_userCloud_to_projectCloud', param, function (response) {
        if (response[0]) {
            datas = response[1]
            hidden_move_in_box()
            create_cloud_ui()
            $id("MoveInCancelButton").style.color = "#1e56a0";
            $id("MoveInCancelButton").disabled = false;
            $id("MoveInCancelButton").textContent = "取消"
            $id("MoveInCancelButton").style.cursor = "pointer";
            $id("FilesPathBox").style.margin = "0";
            $id("FilesPathBox").style.border = "#f6f6f6 4px solid";
        } else {
            alert("移动失败！")
        }
    }, function () {
        alert("移动失败！网络错误")
    })
}

document.addEventListener('contextmenu', function (event) {
    // 获取鼠标右键点击的目标元素
    let flag = false;
    const targetElement = event.target;
    let project_file_name;
    let project_type;

    if (targetElement.className === "FilesButtonBox") {
        flag = true;
        project_file_name = targetElement.getAttribute("project_file_name");
        project_type = targetElement.getAttribute("file_type");
    } else if (targetElement.parentElement.className === "FilesButtonBox") {
        flag = true;
        project_file_name = targetElement.parentElement.getAttribute("project_file_name");
        project_type = targetElement.parentElement.getAttribute("file_type");
    }
    if (["d", "w", "f", "z"].indexOf(project_type) !== -1) {
        $id("ShowRenameButton").style.display = "block";
        $id("ShowMoveButton").style.display = "block";
        $id("DeleteButton").style.display = "block";
        $id("PreviewButton").style.display = "none";
        $id("DownloadButton").style.display = "none";
    } else if (["p", "m3", "m4"].indexOf(project_type) !== -1) {
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
        $id("DownloadButton").style.display = "block";
    }
    if (flag) {
        event.preventDefault();

        const menu = $id("ProjectFilesRightMenu");
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
        menu.setAttribute("project_file_name", project_file_name);
    }
});
document.addEventListener('click', function (event) {
    // 获取鼠标右键点击的目标元素
    const targetElement = event.target;
    // 检查点击是否在菜单内或菜单元素本身
    if (!$id("ProjectFilesRightMenu").contains(targetElement)) {
        $id("ProjectFilesRightMenu").style.width = "0";
    }
});

function delete_file() {
    if (confirm("你确定要删除这个文件吗？（如果是文件夹将删除文件夹之中的所有内容），这将无法恢复！你将永远失去！")) {
        const param = {
            'project_id': $id("ProjectInformationBackground").getAttribute("project_id"),
            "project_file_name": $id("ProjectFilesRightMenu").getAttribute("project_file_name"),
            "path": path
        }
        ajax('POST', '/delete_project_file', param, function (response) {
            if (response[0]) {
                datas = response[1]
                $id("ProjectFilesRightMenu").style.width = "0";
                create_cloud_ui()
            } else {
                alert("删除失败！")
            }
        }, function () {
            alert("删除失败！网络错误")
        })
    }
}

function show_rename_box() {
    $id("ProjectFilesRightMenu").style.width = "0";
    const old_value = $id("ProjectFilesRightMenu").getAttribute("project_file_name");
    $id("Gray").style.display = 'block';
    $id("RenameBox").style.display = 'block';
    $id("RenameInput").setAttribute("old_value", old_value);
    $id("RenameInput").value = old_value;
    $id("RenameInput").style.borderBottom = '2px solid #1e56a0';
    $id("RenameLight").style.color = '#f6f6f6';
}

function hidden_rename_box() {
    $id("RenameBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}

function submit_rename() {
    const param = {
        'project_id': $id("ProjectInformationBackground").getAttribute("project_id"),
        "old_name": $id("ProjectFilesRightMenu").getAttribute("project_file_name"),
        "new_name": $id("RenameInput").value,
        "path": path
    }
    ajax('POST', "/rename_project", param, function (response) {
        if (response[0]) {
            datas = response[1]
            hidden_rename_box()
            create_cloud_ui()
        } else {
            alert("重命名失败！")
        }
    }, function () {
        alert("重命名失败！网络错误")
    })
}

function hidden_move_box() {
    $id("MoveBox").style.display = 'none';
    $id("Gray").style.display = 'none';
}

function show_move_box() {
    $id("ProjectFilesRightMenu").style.width = "0";
    const file = $id("ProjectFilesRightMenu").getAttribute("project_file_name");
    $id("Gray").style.display = 'block';
    $id("MoveBox").style.display = 'block';
    $id("FilesTree").innerHTML = username + "<br>" + createTreeElement_d(datas)
    $id("MoveBox").setAttribute("filename", file)
}
function get_move_path(p) {
    const param = {
        'project_id': $id("ProjectInformationBackground").getAttribute("project_id"),
        'old_path': path.join("\\") + "\\" + $id("ProjectFilesRightMenu").getAttribute("project_file_name"),
        'new_path': p
    };
    ajax('POST', '/move_file_project', param, function (response) {
        if (response[0]) {
            datas = response[1]
            hidden_move_box()
            create_cloud_ui()
        } else {
            alert("移动失败！权限不足")
            hidden_move_box()
        }
    }, function () {
        alert("移动失败！网络错误")
    })
}
function createTreeElement_d(directory, path = '', indent = '') {
    let htmlContent = '';
    if (directory.d) {
        const entries = Object.entries(directory.d);
        entries.forEach(([key, value], index) => {
            const isLastItem = index === entries.length - 1;
            const fullPath = path ? `${path}/${key}` : key;
            htmlContent += `${indent}${isLastItem ? '└── ' : '├── '}`;
            htmlContent += `<span class="node" onclick="get_move_path('${fullPath}')">${key}</span>\n`;
            htmlContent += createTreeElement_d(value, fullPath, `${indent}${isLastItem ? '    ' : '│   '}`);
        });
    }
    return htmlContent;
}
$id('ToJoinCodeButton').addEventListener('mouseover', function () {
    $id('ToCollaborationButton').style.backgroundColor = '#163172';
    $id('ToCollaborationButton').style.color = '#f6f6f6';
    $id('ToCollaborationButton').style.fontSize = '30px';
});

$id('ToJoinCodeButton').addEventListener('mouseout', function () {
    $id('ToCollaborationButton').style.backgroundColor = '#f6f6f6';
    $id('ToCollaborationButton').style.color = '#163172';
    $id('ToCollaborationButton').style.fontSize = '40px';
});
