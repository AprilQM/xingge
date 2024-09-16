# -*- coding: utf-8 -*-

# 该程序仅为登录管理和视图导航
# 以及少量的初始化代码

from flask import Flask, redirect, render_template, send_file, request, jsonify, session, send_from_directory, abort

from flask_session import Session
from flask_login import (
    login_user,
    logout_user,
    login_required,
    LoginManager,
    UserMixin,
    current_user,
)
import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime
from zipfile import ZipFile
from io import BytesIO

# 自建库的导入
import homeKit
import kits
import authKit
import userInformationKit
import adminKit
import cloudKit
import forumKit
import collaborationKit
import config

# 创建网站app
app = Flask(__name__)
# 创建代理app
app_proxy = Flask(__name__)

# =============登录保护区=============
# 设置密钥
app.secret_key = '140728'

# 设置cookie
app.session_cookie_name = "xingge"

# 创建登录保护管理器
login_manager = LoginManager()
login_manager.init_app(app)

# 设置踢出路由
login_manager.login_view = "/auth"


# 以下两个为设置登录信息
class User(UserMixin):
    def __init__(self, id, username, pwd, email, register_time, lv, add_time, inviter, invited, invite_code,
                invite_code_use_time):
        self.id = id
        self.username = username
        self.pwd = pwd
        self.email = email
        self.register_time = register_time
        self.lv = lv
        self.add_time = add_time
        self.inviter = inviter
        self.invited = invited
        self.invite_code = invite_code
        self.invite_code_use_time = invite_code_use_time

    def get_id(self):
        return self.id


@login_manager.user_loader
def login(user_id):
    try:
        p = kits.sql(
            "SELECT id, username, password, email, register_time, lv, add_time, inviter, invited, invite_code, invite_code_use_time FROM USER_INFORMATION WHERE id==" + str(
                user_id)
        )[0]
        return User(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10])
    except AttributeError as e:
        print(e, "<-- 可忽略错误")
        return None


# Session管理不同访问设备的数据
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# ===========================设置日志===========================
# 配置日志记录
if not os.path.exists("Logs"):
    os.mkdir("Logs")
handler = RotatingFileHandler('./Logs/xing_ge.log', maxBytes=1024 * 1024, backupCount=3, encoding='utf-8')
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(message)s')
handler.setFormatter(formatter)
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)


@app.before_request
def log_request_info():
    ip_address = request.remote_addr
    path = request.path
    method = request.method
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    app.logger.info(f'{timestamp} - {ip_address} - {method} - {path}')


@app.before_request
def block_banned_ips():
    if adminKit.check_ban(request.remote_addr):
        return render_template("ban.html", light="您已被管理员封禁，详情可联系管理员")


@app.before_request
def block_banned_ips():
    # 清空验证码
    path = request.path
    if path in ['/user_information', '/information']:
        session.pop('verification_code', None)
    if path == '/find_password':
        session.pop('verification_code_find_password', None)


# 127.0.0.1管理员登录
@app.route("/l", methods=['GET'])
def l():
    if request.remote_addr == "127.0.0.1":
        login_user(User(*admin_information[:-1]))
        return redirect("/")
    elif current_user.is_authenticated:
        return render_template("ban.html", light="您已被管理员封禁，详情可联系管理员")
    else:
        abort(404)


# region 主页
# ===========================主页===========================
# 重定向到主页
@app.route('/')
def main():
    return redirect("/home")


# 主页视图
@app.route('/home')
def home():
    announcements = homeKit.get_announcement()
    light_announcements = False
    if current_user.is_authenticated:
        light_announcements = homeKit.light_announcements(current_user.id)
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template("home.html", announcements=announcements, username=username,
                           version=config.version, light_announcements=light_announcements)


# ======================================================
# endregion


# region 授权
# ===========================授权===========================
# 授权视图
@app.route('/auth')
def auth():
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template("auth.html", username=username)


# 登录表单
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    pwd = data.get("password")
    back, information = authKit.login(username, pwd)
    # 登录
    if back['pass']:
        login_user(User(information[0], information[1], information[2], information[3], information[4], information[5],
                        information[6], information[7], information[8], information[9], information[10]))
        # 重新测算等级
        lv = authKit.reload_level(current_user.register_time, current_user.add_time,
                                  current_user.lv, current_user.id)
        current_user.lv = lv
    return jsonify(back)


# 找回密码视图
@app.route('/find_password')
def find_password():
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template("find_password.html", username=username)


# 前往注册
@app.route('/to_register')
def to_register():
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template("register.html", username=username)


# 注册视图
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("username")
    code = data.get("code")
    password = data.get("password")
    back = authKit.register(username, password, code)
    if not back['code'] and not back['username']:
        information = authKit.get_information(kits.get_length())[0]
        login_user(User(information[0], information[1], information[2], information[3], information[4], information[5],
                        information[6], information[7], information[8], information[9], information[10]))
    return jsonify(back)


# 忘记密码发送验证码视图
@app.route('/send_code_find_password', methods=['POST'])
def send_code_find_password():
    data = request.get_json()
    mail = data.get("mail")
    back = {'pass': False, "mail": False}

    if authKit.check_email(mail):
        back['mail'] = True
    else:
        code = authKit.send_code(mail)
        session['verification_code_find_password'] = code
        back['pass'] = True

    return jsonify(back)


# 忘记密码修改密码视图
@app.route('/change_password_find_password', methods=['POST'])
def change_password_find_password():
    data = request.get_json()
    mail = data.get("mail")
    code = data.get("code")
    new_pwd = data.get("new_pwd")
    back = {'pass': False, 'code': False}

    if code == session.get("verification_code_find_password"):
        if authKit.change_password_find_password(mail, new_pwd):
            back['pass'] = True
            back["username"] = kits.sql("SELECT username FROM USER_INFORMATION WHERE email='{}'".format(mail))[0][0]
            session.pop('verification_code_find_password', None)
    else:
        back['code'] = True
    logout_user()
    return jsonify(back)


# ======================================================
# endregion


# region 用户资料
# ===========================用户资料===========================
# 用户资料视图
@app.route('/user_information')
@login_required
def user_information():
    id = current_user.id
    username = current_user.username
    email = current_user.email
    register_time = current_user.register_time
    lv = current_user.lv
    add_time = current_user.add_time
    try:
        inviter = kits.sql("SELECT username FROM USER_INFORMATION WHERE id==" + str(current_user.inviter))[0][0]
    except IndexError:
        inviter = "无"
    invited = current_user.invited
    invite_code = current_user.invite_code
    invite_code_use_time = current_user.invite_code_use_time
    time_difference = kits.get_code_cd_time_difference(invite_code_use_time)
    try:
        cd = {6: 7, 7: 3, 8: 1, 9: 0}[lv] - time_difference
    except Exception as e:
        print(e, "<-- 可忽略错误")
        cd = "邀请码未解锁"
    level_state = authKit.get_level_state(register_time, add_time, lv)
    return render_template("user_information.html", id=id, username=username, email=email, register_time=register_time,
                           lv=str(lv), add_time=add_time, inviter=inviter, invited=invited, invite_code=invite_code,
                           cd=cd, level_state=level_state)


# 退出登录视图
@app.route('/logout')
def logout():
    logout_user()
    return redirect("/")


# 修改用户名
@app.route('/change_name', methods=['POST'])
@login_required
def change_name():
    data = request.get_json()
    new_name = data.get("new_name")
    back = {'pass': False}
    if authKit.check_name(new_name):
        information = userInformationKit.change_name(new_name, current_user.id)[0]
        login_user(User(information[0], information[1], information[2], information[3], information[4], information[5],
                        information[6], information[7], information[8], information[9], information[10]))
        back['pass'] = True
    return jsonify(back)


# 修改密码
@app.route('/change_password', methods=['POST'])
@login_required
def change_password():
    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")
    back = {'pass': False}
    if old_password == kits.decrypt_message(current_user.pwd):
        sql_ = 'UPDATE USER_INFORMATION SET password="{}" WHERE id={}'.format(
            kits.encrypt_message(new_password).decode(), current_user.id)
        kits.sql(sql_)
        login_user(User(current_user.id, current_user.username, kits.encrypt_message(new_password).decode(),
                        current_user.email, current_user.register_time, current_user.lv, current_user.add_time,
                        current_user.inviter, current_user.invited, current_user.invite_code,
                        current_user.invite_code_use_time))
        back['pass'] = True
    return jsonify(back)


# 发送验证码视图
@app.route('/send_code', methods=['POST'])
def send_code():
    data = request.get_json()
    mail = data.get("mail")
    back = {'pass': False}

    if authKit.check_email(mail):
        code = authKit.send_code(mail)
        session['verification_code'] = code

        back['pass'] = True

    return jsonify(back)


# 修改邮箱视图
@app.route('/change_mail', methods=['POST'])
@login_required
def change_mail():
    data = request.get_json()
    mail = data.get("mail")
    code = data.get("code")
    back = {'code': False, 'mail': False}

    if authKit.check_email(mail):
        stored_code = session.get('verification_code')  # 从 session 中获取验证码

        if code != stored_code:
            back['code'] = True  # 验证码不匹配
        else:
            userInformationKit.change_mail(current_user.id, mail)
            session.pop('verification_code', None)  # 邮箱修改成功后移除验证码
    else:
        back['mail'] = True

    return jsonify(back)


# 适配手机版的信息视图
@app.route('/information')
@login_required
def information():
    ui = request.args.get("ui")
    try:
        return render_template(ui + ".html", username=current_user.username)
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return redirect("/home")


# 兑换码视图
@app.route('/exchange')
@login_required
def exchange_ui():
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template('exchange.html', username=username)


# 兑换视图
@app.route('/check_exchange', methods=['POST'])
@login_required
def check_exchange():
    data = request.get_json()
    code = data.get("code")
    back = userInformationKit.check_exchange_code(current_user.id, code)
    if back['pass']:
        authKit.reload_level(current_user.register_time, current_user.add_time + back['reward'], current_user.lv, current_user.id)
        login_user(User(current_user.id, current_user.username, current_user.pwd, current_user.email,
                        current_user.register_time, current_user.lv, current_user.add_time + back['reward'],
                        current_user.inviter, current_user.invited, current_user.invite_code,
                        current_user.invite_code_use_time))
    return jsonify(back)


# ======================================================
# endregion


# region 管理员界面
# ===========================管理员界面===========================
# 管理员页面
@app.route('/admin_pwd')
def admin_pwd():
    p = kits.initialize()
    print(f"Id为1的账号“{p[0]}”的密码为：“{p[1]}”")
    return redirect("/home")


# 管理员获取日志
@app.route('/get_logs', methods=['POST'])
@login_required
def get_logs():
    if current_user.lv < 9:
        return redirect("/home")
    logs = open("./Logs/xing_ge.log", 'r', encoding='utf-8').read().replace("\n", "（n）").replace("\\", '/').replace("'", '"')
    return jsonify(logs)


@app.route('/admin')
@login_required
def admin():
    if current_user.lv < 9:
        return redirect("/home")
    announcements = {}
    for i in os.listdir("announcements"):
        announcements[i.replace(".txt", '')] = open("announcements/" + i, encoding='utf-8').read()
    ban_ips = adminKit.get_ban_ip()
    exchange_who_have_table = kits.sql('SELECT * FROM EXCHANGE_WHO_HAVE')
    exchange_description_table = kits.sql('SELECT * FROM EXCHANGE_DESCRIPTION')
    exchanges = [i[1] for i in exchange_description_table]
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template('admin.html', announcements=announcements, charts=adminKit.analyze_log(), ban_ips=ban_ips,
                           exchange_who_have_table=exchange_who_have_table,
                           exchange_description=exchange_description_table, exchanges=exchanges, username=username)


# 管理员查找用户视图
@app.route('/find_user', methods=['GET', 'POST'])
@login_required
def find_user():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')

    data = request.get_json()
    expression = data.get("expression")
    try:
        return jsonify({"pass": True, 'values': adminKit.admin_find_user(expression)})
    except Exception as e:
        return jsonify({"pass": False, "error": str(e)})


# 管理员获取密码
@app.route('/get_password', methods=['GET', 'POST'])
@login_required
def get_password():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    id = data.get("id")
    if current_user.id == 1:
        return jsonify(adminKit.get_password(id))
    else:
        return jsonify("权限不足！")


# 管理员修改用户数据
@app.route('/admin_change_user_value', methods=['GET', 'POST'])
@login_required
def admin_change_user_value():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    id = data.get("id")
    column = data.get("column")
    new_value = data.get("new_value")
    try:
        if column == "2" or column == "0":
            if current_user.id == 1:
                return jsonify(adminKit.change_user_value(id, column, new_value))
            else:
                return jsonify(False)
        else:
            return jsonify(adminKit.change_user_value(id, column, new_value))
    except Exception as e:
        return jsonify({"pass": False, "error": str(e)})


# 重置Id1用户等级为lv9
@app.route('/reload_admin_lv')
def reload_admin_lv():
    print("Id为1的用户等级已经被重置！")
    sql_ = 'UPDATE USER_INFORMATION SET lv=9 WHERE id=1'
    kits.sql(sql_)
    return redirect('/home')


# 管理员上传公告视图
@app.route('/upload_announcement', methods=['GET', 'POST'])
@login_required
def upload_announcement():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    title = data.get("title")
    value = data.get("value")
    return jsonify(adminKit.upload_announcement(title, value))


# 管理员新建公告视图
@app.route('/create_announcement', methods=['GET', 'POST'])
@login_required
def create_announcement():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    title = data.get("title")
    return jsonify(adminKit.upload_announcement(title, ""))


# 管理员删除公告视图
@app.route('/delete_announcement', methods=['GET', 'POST'])
@login_required
def delete_announcement():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    title = data.get("title")
    return jsonify(adminKit.delete_announcement(title))


# 管理员封禁ip视图
@app.route('/ban_ip_in', methods=['GET', 'POST'])
@login_required
def ban_ip_in():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    ip = data.get("ip")
    return jsonify(adminKit.ban_ip_in(ip))


# 管理员解封ip视图
@app.route('/ban_ip_off', methods=['GET', 'POST'])
@login_required
def ban_ip_off():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    ip = data.get("ip")
    return jsonify(adminKit.ban_ip_off(ip))


# 管理员创建兑换码视图
@app.route('/create_exchange', methods=['GET', 'POST'])
@login_required
def create_exchange():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    code = data.get("code")
    back = {
        'pass': True
    }
    if adminKit.create_exchange_code(code):
        exchange_who_have_table = kits.sql('SELECT * FROM EXCHANGE_WHO_HAVE')
        exchange_description_table = kits.sql('SELECT * FROM EXCHANGE_DESCRIPTION')
        exchanges = [i[1] for i in exchange_description_table]
        back['exchange_who_have_table'] = exchange_who_have_table
        back['exchange_description_table'] = exchange_description_table
        back['exchanges'] = exchanges
        return jsonify(back)
    else:
        back['pass'] = False
        return jsonify(back)


# 管理员更新兑换码视图
@app.route('/update_exchange', methods=['GET', 'POST'])
@login_required
def update_exchange():
    # 访问控制
    if current_user.lv < 9:
        return redirect('/home')
    data = request.get_json()
    table = data.get("table")
    row = data.get("row")
    column = data.get("column")
    value = data.get("value")
    adminKit.update_exchange(table, row, column, value)
    exchange_who_have_table = kits.sql('SELECT * FROM EXCHANGE_WHO_HAVE')
    exchange_description_table = kits.sql('SELECT * FROM EXCHANGE_DESCRIPTION')
    exchanges = [i[1] for i in exchange_description_table]
    return jsonify([adminKit.update_exchange(table, row, column, value),
                    [exchange_who_have_table, exchange_description_table, exchanges]])


# ======================================================
# endregion


# region 云盘
# ===========================云盘===========================
# 云盘界面
@app.route('/cloud')
@login_required
def cloud():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    files = cloudKit.get_files(config.files_path + str(current_user.id))
    return render_template("cloud.html", username=current_user.username, files=files, lv=current_user.lv, charset='utf-8')


# 创建文件夹界面
@app.route('/create_dir', methods=['POST'])
@login_required
def create_dir():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    if current_user.lv < 2:
        return jsonify(False)
    data = request.get_json()
    path = data.get("path")
    filename = data.get("filename")
    return jsonify(
        [cloudKit.create_dir(current_user.id, path, filename), cloudKit.get_files(config.files_path + str(current_user.id))])


# 删除文件视图
@app.route('/delete', methods=['POST'])
@login_required
def delete():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    data = request.get_json()
    path = data.get("path")
    filename = data.get("filename")
    return jsonify(
        [cloudKit.delete_(current_user.id, path, filename), cloudKit.get_files(config.files_path + str(current_user.id))])


# 创建网络链接视图
@app.route('/weblink', methods=['POST'])
@login_required
def weblink():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    data = request.get_json()
    path = data.get("path")
    filename = data.get("filename")
    nr = data.get("nr")
    return jsonify([cloudKit.create_weblink(current_user.id, path, filename, nr),
                    cloudKit.get_files(config.files_path + str(current_user.id))])


# 重命名文件视图
@app.route('/rename', methods=['POST'])
@login_required
def rename():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    data = request.get_json()
    path = data.get("path")
    old_name = data.get("old_name")
    new_name = data.get("new_name")
    return jsonify([cloudKit.rename(current_user.id, path, old_name, new_name),
                    cloudKit.get_files(config.files_path + str(current_user.id))])


app.config['UPLOAD_FOLDER'] = config.files_path


# 上传文件视图
@app.route('/upload', methods=['POST'])
@login_required  # 需要登录才能访问
def upload():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    if 'files' not in request.files:
        return redirect(request.url)

    files = request.files.getlist('files')
    data = request.form
    path = data.get("path")

    # 创建目标路径
    target_path = os.path.join(app.config['UPLOAD_FOLDER'] + "/" + str(current_user.id), *path.split("/"))
    if not os.path.exists(target_path):
        os.makedirs(target_path)

    for file in files:
        if file.filename == '':
            return jsonify({"error": "没有文件名！"}), 400
        if file:
            filename = kits.make_filename(target_path, cloudKit.custom_secure_filename(file.filename))
            file_path = os.path.join(target_path, filename)
            file.save(file_path)  # 确保file_path是一个字符串

    return jsonify(cloudKit.get_files(config.files_path + str(current_user.id)))


# 下载视图
@app.route('/download', methods=['GET'])
@login_required
def download():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    filename = request.args.get("filename")
    path = request.args.get("path")
    path = config.send_files_path + str(current_user.id) + "/" + path + "/" + filename
    return send_file(path, as_attachment=True)


# 下载列表视图
@app.route('/download_more', methods=['GET'])
@login_required
def download_files():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    # 定义需要打包的文件列表（使用绝对路径）
    paths = [config.files_path + str(current_user.id) + "/" + i for i in request.args.get("paths").split("@")]

    # 创建一个字节流来保存zip文件
    memory_file = BytesIO()

    # 创建一个zip文件
    with ZipFile(memory_file, 'w') as zipf:
        for file in paths:
            zipf.write(file, os.path.basename(file))

    # 重置文件指针
    memory_file.seek(0)

    # 返回zip文件
    return send_file(memory_file, download_name=kits.create_code(16, 1) + '.zip', as_attachment=True)


# 预览视图
@app.route('/preview', methods=['GET'])
@login_required
def preview():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    filename = request.args.get("filename")
    hz = filename.split(".")[-1]
    path = request.args.get("path")
    path = config.send_files_path + str(current_user.id) + "/" + path + "/"
    if current_user.lv < 5:
        return render_template("ban.html", light="你没有预览权限")
    elif hz.lower() in ["pdf", "mp3", "mp4", "jpg", "jpeg", "png"]:
        return send_from_directory(path, filename)


# 移动文件视图
@app.route('/move_file', methods=['POST'])
@login_required
def move_file():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    elif current_user.lv < 4:
        return jsonify([False, ""])
    else:
        data = request.get_json()
        old_path = data.get("old_path")
        new_path = data.get("new_path")
        cloudKit.move_file(current_user.id, old_path, new_path)
        return jsonify([True, cloudKit.get_files(config.files_path + str(current_user.id))])

# ======================================================
# endregion


# region 浏览
# ===========================浏览===========================
# 浏览码界面视图
@app.route('/browse_code', methods=['GET'])
def browse_code():
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    return render_template("browse_code.html", username=username)


# 生成浏览码
@app.route('/create_browse_code', methods=['POST'])
@login_required
def create_browse_code():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入云盘")
    data = request.get_json()
    path = data.get("path")
    if current_user.lv < 4:
        return jsonify(False)
    else:
        return jsonify(cloudKit.create_browse_code(current_user.id, path))


# 检查浏览码，通过之后进入
@app.route('/check_browse', methods=['POST'])
def check_browse():
    data = request.get_json()
    code = data.get("code")
    if cloudKit.check_browse_code(code)['pass']:
        return jsonify("/browse?code={}".format(code))
    else:
        return jsonify(False)


# 浏览主界面
@app.route('/browse', methods=['GET'])
def browse():
    code = request.args.get("code")
    b = cloudKit.check_browse_code(code)
    if b['pass']:
        sender = kits.sql("SELECT username FROM USER_INFORMATION WHERE id={}".format(b['sender_id']))[0][0]
        files = cloudKit.get_files(b['path'])
        # 设置界面右上角的用户按钮
        try:
            username = current_user.username
        except AttributeError:
            username = "未登录"
        return render_template('browse.html', sender=sender, files=files, code=code, username=username)
    else:
        return redirect("/browse_code")


# 浏览下载视图
@app.route('/browse_download', methods=['GET'])
def browse_download():
    filename = request.args.get("filename")
    path = request.args.get("path")
    code = request.args.get("code")
    code_path = kits.sql("SELECT path FROM GUEST WHERE code='{}'".format(code))[0][0]
    real_path = config.send_files_path + code_path[code_path.find("/") + 1:][code_path[code_path.find("/") + 1:].find(
        "/") + 1:] + "/" + path + "/" + filename
    return send_file(real_path, as_attachment=True)


# ======================================================
# endregion


# region 论坛
# ===========================论坛===========================
@app.route('/forum')
def forum():
    # 设置界面右上角的用户按钮
    try:
        username = current_user.username
    except AttributeError:
        username = "未登录"
    posts = forumKit.get_posts()
    return render_template("forum.html", username=username, posts=posts)


# 创建帖子视图
@app.route('/create_post', methods=['POST'])
@login_required
def create_post():
    if current_user.lv < 4:
        return jsonify(False)
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")
    return jsonify(forumKit.create_post(current_user.id, title, content))


# 创建评论视图
@app.route('/create_comment', methods=['POST'])
@login_required
def create_comment():
    if current_user.lv == 0:
        return jsonify([False, ""])
    data = request.get_json()
    comment = data.get("comment")
    post_id = data.get("post_id")
    return jsonify([forumKit.create_comment(current_user.id, comment, post_id), forumKit.get_posts()])


# 删除帖子视图
@app.route('/delete_post', methods=['POST'])
@login_required
def delete_post():
    data = request.get_json()
    post_id = data.get("post_id")
    return jsonify([forumKit.delete_post(current_user.id, current_user.lv, post_id), forumKit.get_posts()])


# 删除评论视图
@app.route('/delete_comment', methods=['POST'])
@login_required
def delete_comment():
    data = request.get_json()
    post_id = data.get("post_id")
    comment_id = data.get("comment_id")
    return jsonify([forumKit.delete_comment(current_user.id, current_user.lv, post_id, comment_id), forumKit.get_posts()])
# ======================================================
# endregion


# region 协作
# ===========================协作===========================
# 进入协作部分视图
@app.route('/collaboration')
@login_required
def collaboration():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    return render_template("collaboration.html", username=current_user.username, project_list=collaborationKit.get_projects(current_user.id), user_id=current_user.id)


# 创建项目视图
@app.route('/create_project', methods=['POST'])
@login_required
def create_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    title = data.get("title")
    collaborationKit.create_project(current_user.id, title)
    return jsonify(True)


# 修改留言板视图
@app.route('/update_message_board', methods=['POST'])
@login_required
def update_message_board():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    message = data.get("message")
    return jsonify(collaborationKit.update_message(project_id, message))


# 获取加入吗
@app.route('/get_join_code', methods=['POST'])
@login_required
def get_join_code():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    return jsonify(kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0])


# 项目管理员加人
@app.route('/project_join_admin', methods=['POST'])
@login_required
def project_join_admin():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    username = data.get("username")
    return jsonify(collaborationKit.project_join_admin(current_user.id, project_id, username))


# 删除项目
@app.route("/delete_project", methods=['POST'])
@login_required
def delete_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    return jsonify(collaborationKit.delete_project(current_user.id, project_id))


# 踢出用户
@app.route("/kick_member", methods=['POST'])
@login_required
def kick_member():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    member_name = data.get("member_name")
    project_id = data.get("project_id")
    return jsonify([collaborationKit.delete_member(current_user.id, project_id, member_name), collaborationKit.get_projects(current_user.id)])


# 成员升管理
@app.route("/member_to_admin", methods=['POST'])
@login_required
def member_to_admin():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    member_name = data.get("member_name")
    project_id = data.get("project_id")
    return jsonify([collaborationKit.member_to_admin(current_user.id, project_id, member_name), collaborationKit.get_projects(current_user.id)])


# 管理降成员
@app.route("/admin_to_member", methods=['POST'])
@login_required
def admin_to_member():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    admin_id = data.get("admin_id")
    project_id = data.get("project_id")
    return jsonify([collaborationKit.admin_to_member(current_user.id, project_id, admin_id), collaborationKit.get_projects(current_user.id)])


# 进入加入码界面
@app.route("/join_code")
@login_required
def join_code():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    return render_template("project_join.html", username=current_user.username)


# 加入项目
@app.route("/join_project", methods=['POST'])
@login_required
def join_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    code = data.get("code")
    return jsonify(collaborationKit.project_join_code(current_user.id, code))


# 获取项目网盘路径
@app.route('/get_project_cloud_files', methods=['POST'])
@login_required
def get_project_cloud_files():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    return jsonify(cloudKit.get_files("./projects/{}/files".format(project_code)))


# 在项目云盘中创建文件夹
@app.route('/create_project_dir', methods=['POST'])
@login_required
def create_project_dir():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    filename = data.get("filename")
    path = data.get("path")
    if current_user.lv < 2:
        return jsonify([False, ""])
    else:
        project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
        return jsonify([collaborationKit.create_dir(project_id, path, filename), cloudKit.get_files("./projects/{}/files".format(project_code))])


# 在项目云盘中创建网络链接
@app.route('/weblink_project', methods=['POST'])
@login_required
def weblink_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    filename = data.get("filename")
    nr = data.get("nr")
    path = data.get("path")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    return jsonify([collaborationKit.create_weblink(project_id, path, filename, nr), cloudKit.get_files("./projects/{}/files".format(project_code))])


# 获取用户云盘的文件路径字典
@app.route("/get_user_files", methods=['POST'])
@login_required
def get_user_files():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    return jsonify(cloudKit.get_files(config.files_path + str(current_user.id)))


# 从用户云盘中移动进项目云盘
@app.route("/move_file_from_userCloud_to_projectCloud", methods=['POST'])
@login_required
def move_file_from_userCloud_to_projectCloud():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    target_path = data.get("target_path")
    target_file = data.get("target_file")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    return jsonify([collaborationKit.move_in(current_user.id, project_id, target_file, target_path), cloudKit.get_files("./projects/{}/files".format(project_code))])


# 上传项目文件视图
@app.route('/upload_project', methods=['POST'])
@login_required
def upload_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    if 'files' not in request.files:
        return redirect(request.url)

    files = request.files.getlist('files')
    data = request.form
    path = data.get("path")
    project_id = data.get("project_id")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]

    # 创建目标路径
    target_path = os.path.join(config.projects_path + project_code + "/files/", *path.split("/"))
    if not os.path.exists(target_path):
        os.makedirs(target_path)

    for file in files:
        if file.filename == '':
            return jsonify({"error": "没有文件名！"}), 400
        if file:
            filename = kits.make_filename(target_path, cloudKit.custom_secure_filename(file.filename))
            file_path = os.path.join(target_path, filename)
            file.save(file_path)

    return jsonify(cloudKit.get_files(config.projects_path + project_code + "/files/"))


# 删除项目文件
@app.route('/delete_project_file', methods=['POST'])
@login_required
def delete_project_file():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    project_id = data.get("project_id")
    project_file_name = data.get("project_file_name")
    path = data.get("path")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    return jsonify([collaborationKit.delete_project_file(project_id, path, project_file_name), cloudKit.get_files("./projects/{}/files".format(project_code))])


# 重命名项目文件视图
@app.route('/rename_project', methods=['POST'])
@login_required
def rename_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    data = request.get_json()
    path = data.get("path")
    project_id = data.get("project_id")
    old_name = data.get("old_name")
    new_name = data.get("new_name")

    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]

    return jsonify([collaborationKit.rename(project_code, path, old_name, new_name),
                    cloudKit.get_files("./projects/{}/files".format(project_code))])


# 移动项目文件视图
@app.route('/move_file_project', methods=['POST'])
@login_required
def move_file_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    elif current_user.lv < 4:
        return jsonify([False, ""])
    else:
        data = request.get_json()
        project_id = data.get("project_id")
        old_path = data.get("old_path")
        new_path = data.get("new_path")
        collaborationKit.move_file(project_id, old_path, new_path)
        project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
        return jsonify([True, cloudKit.get_files("./projects/{}/files".format(project_code))])


# 下载项目视图
@app.route('/download_project', methods=['GET'])
@login_required
def download_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    filename = request.args.get("filename")
    path = request.args.get("path")
    project_id = request.args.get("project_id")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    path = config.send_project_files_path + project_code + "/files/" + path + "/" + filename
    return send_file(path, as_attachment=True)


# 预览项目视图
@app.route('/preview_project', methods=['GET'])
@login_required
def preview_project():
    if current_user.lv == 0:
        return render_template("ban.html", light="你的账号被禁止进入协作")
    project_id = request.args.get("project_id")
    filename = request.args.get("filename")
    hz = filename.split(".")[-1]
    path = request.args.get("path")
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    path = config.send_project_files_path + project_code + "/files/" + path + "/"
    if current_user.lv < 5:
        return render_template("ban.html", light="你没有预览权限")
    elif hz.lower() in ["pdf", "mp3", "mp4", "jpg", "jpeg", "png"]:
        return send_from_directory(path, filename)
# ======================================================
# endregion


# 星阁使用文档视图
@app.route("/instructions", methods=['GET'])
@login_required
def introductions():
    return render_template("instructions.html", username=current_user.username)


if __name__ == '__main__':
    # 初始化
    admin_information = kits.initialize()
    print(f"Id为1的账号“{admin_information[1]}”的密码为：“{admin_information[2]}”")
    # 启动
    app.run(host='0.0.0.0', port=5000)
