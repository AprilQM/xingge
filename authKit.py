import config
import kits
import time
import os
from datetime import datetime
import smtplib
from email.mime.text import MIMEText


# 验证登录函数
def login(username, password):
    back = {
        'pass': False,
        'username': False,
        'password': False
    }
    s = kits.sql('SELECT * FROM USER_INFORMATION WHERE username == "{}"'.format(username))
    if len(s) == 0:
        back['username'] = True
    else:
        if password == kits.decrypt_message(s[0][2]):
            back['pass'] = True
        else:
            back['password'] = True
    try:
        information = s[0]
    except IndexError:
        information = (1, 4, 0, 7, 2, 8, 1, 4, 0, 7, 2, 8, 1, 4, 0, 7, 2, 8)
    if not os.path.exists(config.files_path):
        os.mkdir(config.files_path)
    if not os.path.exists(config.files_path+str(information[0])):
        os.mkdir(config.files_path+str(information[0]))
    return back, information


# 重新测算等级
def reload_level(register_time, add_time, level, id):
    # 开启邀请码
    def start_code(Id, lv):
        if lv >= 6:
            sql_ = 'SELECT * FROM USER_INFORMATION WHERE id = {}'.format(Id)
            if kits.sql(sql_)[0][9] == 'None':
                code = kits.create_code(16, 1)
                sql_ = 'SELECT * FROM USER_INFORMATION WHERE invite_code = "{}"'.format(code)
                while len(kits.sql(sql_)) != 0:
                    code = kits.create_code(16, 1)
                    sql_ = 'SELECT * FROM USER_INFORMATION WHERE invite_code = "{}"'.format(code)
                sql_ = 'UPDATE USER_INFORMATION SET invite_code = "{}" WHERE id = {}'.format(code, Id)
                kits.sql(sql_)
    now_time = time.time()

    # 将时间字符串转换为datetime对象
    dt_object = datetime.strptime(register_time, "%Y-%m-%d")

    # 将datetime对象转换为时间戳（秒）
    register_time = dt_object.timestamp()

    days = (now_time - register_time) / (60 * 60 * 24)
    days += add_time
    if level != 9 and level != 0:
        if 0 <= days < 4:
            level = 1
        elif days < 12:
            level = 2
        elif days < 30:
            level = 3
        elif days < 63:
            level = 4
        elif days < 126:
            level = 5
        elif days < 254:
            level = 6
            start_code(id, level)
        elif days < 510:
            level = 7
            start_code(id, level)
        else:
            level = 8
            start_code(id, level)
        kits.sql("UPDATE USER_INFORMATION SET lv = {} WHERE id = {}".format(level, id))
    if level == 9:
        start_code(id, level)
    return level


def get_level_state(register_time, add_time, level):
    back = ""
    if level == 9:
        back = "管理员"
    elif level == 0:
        back = "你被封禁"
    else:
        now_time = time.time()

        # 将时间字符串转换为datetime对象
        dt_object = datetime.strptime(register_time, "%Y-%m-%d")

        # 将datetime对象转换为时间戳（秒）
        register_time = dt_object.timestamp()

        days = (now_time - register_time) / (60 * 60 * 24)
        days += add_time

        need = {1: "4", 2: "12", 3: '30', 4: '63', 5: '126', 6: '254', 7: '510', 8: "∞"}[level]
        days = int(days)
        back = str(days)+"/"+need

    return back


def register(name, password, code):
    sql_ = 'SELECT * FROM USER_INFORMATION WHERE invite_code = "{}"'.format(code)
    b = kits.sql(sql_)
    back = {
        'username': False,
        'code': False,
        'password': False,
    }
    if len(b) == 0:
        back['code'] = True
    else:
        flag = True
        for i in password:
            if ord(i) >= 128:
                flag = False
                back['password'] = True
                break
        if flag:
            # 获取邀请人的信息
            inviter_invited = b[0][8]
            inviter_id = b[0][0]
            inviter_lv = b[0][5]
            inviter_code_use_time = b[0][10]
            if inviter_lv != 0:
                cd = {6: 7, 7: 3, 8: 1, 9: 0}[inviter_lv] - kits.get_code_cd_time_difference(inviter_code_use_time)
                if cd > 0:
                    back['code'] = True
                else:
                    if len(kits.sql('SELECT * FROM USER_INFORMATION WHERE username = "{}"'.format(name))) == 0:
                        # 数据库新添一行
                        sql_ = 'INSERT INTO USER_INFORMATION (username, password, email, register_time, lv, add_time, inviter, invited, invite_code, invite_code_use_time) VALUES ("{}", "{}", "{}", "{}", 1, 0, "{}", 0, "{}", "{}")'.format(
                            name, kits.encrypt_message(password).decode(), 'None', kits.get_time(), inviter_id, 'None', kits.get_time())
                        kits.sql(sql_)
                        os.mkdir(config.files_path + str(kits.get_length()))
                        # 设置邀请人的信息
                        sql_ = 'UPDATE USER_INFORMATION SET invited={}, invite_code_use_time="{}" WHERE id = {}'.format(inviter_invited + 1, kits.get_time(), inviter_id)
                        kits.sql(sql_)
                        sql_ = 'INSERT INTO EXCHANGE_WHO_HAVE(user_id) VALUES ({})'.format(kits.get_length())
                        kits.sql(sql_)

                        with open(config.files_path + str(kits.get_length()) + '/星阁使用文档.weblink', 'w', encoding='utf-8') as f:
                            f.write("/instructions")

                    else:
                        back['username'] = True
            else:
                back['code'] = True
    return back


def get_information(id):
    sql_ = 'SELECT * FROM USER_INFORMATION WHERE id = {}'.format(id)
    return kits.sql(sql_)


def check_email(mail):
    sql_ = 'SELECT * FROM USER_INFORMATION WHERE email = "{}"'.format(mail)
    b = kits.sql(sql_)
    if len(b) == 0:
        return True
    else:
        return False


# 发送验证码
def send_code(mail):
    try:
        code = kits.create_code(4, 2)
        content = f"【星阁】\n\n您的验证码为:{code}\n\n如果不是本人操作，请忽略此信息。"
        message = MIMEText(content, "plain", "utf-8")
        message["From"] = config.send_by
        message["To"] = mail
        message["Subject"] = "【星阁验证码】"
        # 使用第三方服务发送
        smtp = smtplib.SMTP_SSL(config.mail_host, config.mail_port, "utf-8")
        smtp.login(config.send_by, config.mail_password)
        smtp.sendmail(config.send_by, mail, message.as_string())
        return code
    except Exception as e:
        return e


def change_password_find_password(mail, pwd):
    sql_ = 'UPDATE USER_INFORMATION SET password = "{}" WHERE email = "{}"'.format(kits.encrypt_message(pwd).decode(), mail)
    try:
        kits.sql(sql_)
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def check_name(name):
    sql_ = 'SELECT * FROM USER_INFORMATION WHERE username = "{}"'.format(name)
    b = kits.sql(sql_)
    if len(b) == 0:
        return True
    else:
        return False

