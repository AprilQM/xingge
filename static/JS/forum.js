let stateShowFindForumInput = true
function ToUserInformation(){
    window.location.href = '/user_information'
}
function ToBrowseCode(){
    window.location.href = '/browse_code'
}
function ShowFindForumInput(){
    if  (stateShowFindForumInput){
        $id("FindForumInput").value = '';
        const mediaQuery = window.matchMedia('(max-width: 1145px)');
        $id("FindForumInput").disabled = false
        $id("FindForumInput").style.borderBottom = "#1e56a0 2px solid";
        if (mediaQuery.matches){
            $id("FindForumInput").style.width = '160px';
        }else{
            $id("FindForumInput").style.width = '500px';
        }
    }else{
        $id("FindForumInput").style.borderBottom = "#f6f6f6 2px solid";
        $id("FindForumInput").disabled = true
        $id("FindForumInput").style.width = '0';
    }
    stateShowFindForumInput = !stateShowFindForumInput
}
function ToForum(){
    window.location.href = "/forum"
}
function hidden_create_post(){
    $id("Gray").style.display = 'none';
    $id("CreatePostLightBox").style.display = 'none';
}
function show_create_post(){
    $id("Gray").style.display = 'block';
    $id("CreatePostLightBox").style.display = 'block';
    $id("PostTitleInput").value = '';
    $id("PostContent").value = '';
    $id("PostTitleInput").style.borderBottom = '2px solid #1e56a0';
    $id("PostCreateLight").style.color = '#f6f6f6';
}
function ToPostList(){
    $id("PostContentBackground").style.display = 'none';
}
function ToPostContent(id){
    $id("PostContentBackground").style.display = 'block';
    $id("PostContentBackground").setAttribute("post_id", id)
    let content = {}
    for (let i = 0 ;i < Posts.length;i++){
        if (Posts[i]["id"] === parseInt(id)){
            content = Posts[i]
            break
        }
    }
    $id("PostTitleH1").textContent = content['post']['title']
    $id("PostAuthorImg").src = `/static/levels/lv${content['author']['level']}.png`
    $id("PostAuthorImg").alt = 'Lv' + content['author']['level']
    $id("PostAuthorH2").textContent = " " + content['author']['name']
    $id("PostTimeH3").textContent = "发布日期：" + content['time']
    $id("ToCreateCommentButton").onclick = function (){show_create_comment(id)};
    let ContentBox = $id("ContentBox");
    // 删除content中的所有子节点
    while (ContentBox.firstChild) {
        ContentBox.removeChild(ContentBox.firstChild);
    }
    let PostCommentBox = $id("PostCommentBox");
    // 删除content中的所有子节点
    while (PostCommentBox.firstChild) {
        PostCommentBox.removeChild(PostCommentBox.firstChild);
    }
    for (let i = 0 ; i < content['post']['content'].length ; i += 2){
        const PostContentH4 = document.createElement("h4")
        PostContentH4.className = 'PostContentH4';
        PostContentH4.textContent = content['post']['content'][i]
        const PostLinkA = document.createElement("a")
        PostLinkA.className = 'PostLinkA';
        PostLinkA.target = "_blank";
        PostLinkA.href = '/browse?code=' + content['post']['content'][i + 1]
        PostLinkA.textContent = content['post']['content'][i + 1]
        $id("ContentBox").appendChild(PostContentH4)
        $id("ContentBox").appendChild(PostLinkA)
    }
    for (let i = 0 ; i < content['post']['comments'].length ; i++){
        const CommentBox = document.createElement("div");
        CommentBox.className = "CommentBox";
        CommentBox.setAttribute("comment_id", i.toString())
            const PostLevelImg = document.createElement("img")
            PostLevelImg.className = 'PostLevelImg';
            PostLevelImg.src = `/static/levels/lv${content['post']['comments'][i]['commentator']['level']}.png`
            PostLevelImg.alt = 'Lv' + content['post']['comments'][i]['commentator']['level']
            PostLevelImg.textContent = content['post']['comments'][i]['commentator']['name'];
            const Commentator = document.createElement("h3")
            Commentator.className = 'Commentator';
            Commentator.textContent = " " + content['post']['comments'][i]['commentator']['name'];
            const CommentContent = document.createElement("h3")
            CommentContent.className = 'CommentContent';
            CommentContent.textContent = content['post']['comments'][i]['content'];
            CommentBox.appendChild(PostLevelImg)
            CommentBox.appendChild(Commentator)
            CommentBox.appendChild(CommentContent)
        $id("PostCommentBox").appendChild(CommentBox)

    }
}
function submit_create_post(){
    const param = {
        'title' : $id("PostTitleInput").value,
        'content': $id("PostContent").value,
    }
    if (param['title'] === ''){
        $id("PostTitleInput").style.borderBottom = '2px solid red'
        $id("PostCreateLight").style.color = 'red';
        $id("PostCreateLight").textContent = "帖子标题不能为空"
    }else{
        ajax('POST', '/create_post', param, function (response){
            if(response){
                location.reload()
            }else{
                $id("PostTitleInput").style.borderBottom = '2px solid red'
                $id("PostCreateLight").style.color = 'red';
                $id("PostCreateLight").textContent = "你没有创建帖子的权限"
            }
        })
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // 获取UsernameEdit输入框元素
    const PostTitleInput = $id("PostTitleInput");
    const PostCreateLight = $id("PostCreateLight");


    PostTitleInput.addEventListener("input", function () {
        PostTitleInput.style.borderBottom = '2px solid #1e56a0';
        PostCreateLight.style.color = '#f6f6f6';
    });
})
function hidden_create_comment(){
    $id("Gray").style.display = 'none';
    $id("CreateCommentLightBox").style.display = 'none';
}
function show_create_comment(id){
    $id("Gray").style.display = 'block';
    $id("CreateCommentLightBox").style.display = 'block';
    $id("CreateCommentLightBox").setAttribute("post_id", id)
    $id("CommentEdit").value = '';
}
function submit_create_comment(){
    const param = {
        'comment': $id("CommentEdit").value,
        'post_id':$id("CreateCommentLightBox").getAttribute("post_id")
    }
    ajax('POST', '/create_comment', param, function (response){
        if (response[0]) {
            hidden_create_comment()
            Posts = response[1]
            ToPostContent($id("CreateCommentLightBox").getAttribute("post_id"))
        } else {
            alert("你没有评论的权限！")
        }
    },function (){
        alert("发布失败！网络错误")
    })
}

function find_post(event){
    if (event.key === "Enter") {
        create_post_list()
    }
}
function create_post_list(){
    let BottomPostsBox = $id("BottomPostsBox");
    // 删除content中的所有子节点
    while (BottomPostsBox.firstChild) {
        BottomPostsBox.removeChild(BottomPostsBox.firstChild);
    }
    const key = $id("FindForumInput").value;
    for (let i of Posts) {
        const PostBox = document.createElement("div")
        PostBox.className = 'PostBox';
        PostBox.onclick = function () {
            ToPostContent(i['id'])
        }
        PostBox.setAttribute("post_id", i['id'])
        const h1 = document.createElement("h1")
        h1.textContent = i['post']['title'];
        h1.style.color = '#163172'
        const img = document.createElement("img")
        img.src = `/static/levels/lv${i['author']['level']}.png`
        img.alt = "lv" + i['author']['level']
        img.className = "PostLevelImg";
        const h3 = document.createElement("h3")
        h3.style.display = 'inline';
        h3.style.color = '#1e56a0';
        h3.textContent = " " + i['author']['name']
        const br = document.createElement("br")
        const span = document.createElement("span")
        span.style.color = "#d6e4f0";
        span.style.fontSize = '12px';
        span.style.fontWeight = 'bold';
        span.textContent = "发布日期：" + i['time']
        PostBox.appendChild(h1)
        PostBox.appendChild(img)
        PostBox.appendChild(h3)
        PostBox.appendChild(br)
        PostBox.appendChild(span)
        if (i['post']['title'].indexOf(key) !== -1) {
            $id("BottomPostsBox").appendChild(PostBox)
        }
    }

}
function delete_post(post_id){
    if (confirm("你确定要删除该帖子吗？")){
        const param = {
            'post_id': post_id
        }
        ajax('POST', '/delete_post', param, function (response){
            if (response[0]){
                $id("PostRightMenu").style.width = "0";
                Posts = response[1];
                create_post_list()
            }else{
                $id("PostRightMenu").style.width = "0";
                alert("你没有权限删除该帖子！")
            }
        },function (){
            alert("删除失败！网络错误")
        })
    }
}
// 添加全局的上下文菜单（右键点击）事件监听器

document.addEventListener('contextmenu', function(event) {
    // 获取鼠标右键点击的目标元素
    let post_id = 0
    const targetElement = event.target;
    if (targetElement.className === "PostBox"){
        post_id = targetElement.getAttribute('post_id');
    }else if(targetElement.parentElement.className === "PostBox"){
        post_id = targetElement.parentElement.getAttribute('post_id');
    }
    if (post_id !== 0){
        event.preventDefault();
        const menu = $id("PostRightMenu");
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
        $id("PostRightMenu").onclick = function () {delete_post(post_id)};
    }
});
document.addEventListener('click', function(event) {
    // 获取鼠标右键点击的目标元素
    const targetElement = event.target;
    // 检查点击是否在菜单内或菜单元素本身
    if (!$id("PostRightMenu").contains(targetElement)) {
        $id("PostRightMenu").style.width = "0";
    }
});

// 添加全局的上下文菜单（右键点击）事件监听器
document.addEventListener('contextmenu', function(event) {
    // 获取鼠标右键点击的目标元素
    let comment_id = 0
    const targetElement = event.target;
    if (targetElement.className === "CommentBox"){
        comment_id = targetElement.getAttribute('comment_id');
    }else if(targetElement.parentElement.className === "CommentBox"){
        comment_id = targetElement.parentElement.getAttribute('comment_id');
    }
    if (comment_id !== 0){
        event.preventDefault();
        const menu = $id("CommentRightMenu");
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
        $id("CommentRightMenu").onclick = function () {delete_comment(comment_id)};
    }
});
document.addEventListener('click', function(event) {
    // 获取鼠标右键点击的目标元素
    const targetElement = event.target;
    // 检查点击是否在菜单内或菜单元素本身
    if (!$id("CommentRightMenu").contains(targetElement)) {
        $id("CommentRightMenu").style.width = "0";
    }
});
function delete_comment(comment_id){
    if (confirm("你确定要删除该评论吗？")){
        const param = {
            'comment_id':comment_id,
            'post_id': $id("PostContentBackground").getAttribute("post_id")
        }
        ajax('POST', '/delete_comment', param, function (response){
            if (response[0]){
                $id("CommentRightMenu").style.width = "0";
                Posts = response[1]
                ToPostContent($id("PostContentBackground").getAttribute("post_id"))
            }else{
                $id("CommentRightMenu").style.width = "0";
                alert("你没有权限删除该评论！")
            }
        },function (){
            alert("删除失败！网络错误")
        })
    }
}
$id('ToBrowseCode').addEventListener('mouseover', function() {
    $id('ToForumHomeButton').style.backgroundColor = '#163172';
    $id('ToForumHomeButton').style.color = '#f6f6f6';
    $id('ToForumHomeButton').style.fontSize = '30px';
});

$id('ToBrowseCode').addEventListener('mouseout', function() {
    $id('ToForumHomeButton').style.backgroundColor = '#f6f6f6';
    $id('ToForumHomeButton').style.color = '#163172';
    $id('ToForumHomeButton').style.fontSize = '40px';
});
