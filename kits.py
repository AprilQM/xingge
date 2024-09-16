# 主要的工具库
import os
import random
import sqlite3
import time
import config
import smtplib
from email.mime.text import MIMEText
import re
import json
from pprint import pprint
import requests
import base64
from datetime import datetime
from cryptography.fernet import Fernet


def get_time():
    t = time.localtime()
    now_time = f"{t.tm_year}-{t.tm_mon:02}-{t.tm_mday:02}"
    return now_time


# 生成密钥并将其保存到一个文件中
def generate_key():
    key = Fernet.generate_key()
    with open("secret.key", "wb") as key_file:
        key_file.write(key)


# 从文件中加载密钥
def load_key():
    return open("secret.key", "rb").read()


# 加密消息
def encrypt_message(msg):
    key = load_key()
    f = Fernet(key)
    encrypted_message = f.encrypt(msg.encode())
    return encrypted_message


def make_filename(path, filename):
    hz = ""
    if "." in filename:
        hz = "." + filename.split('.')[-1]
        filename = filename[:filename.rfind('.')]
    if filename + hz in os.listdir(path):
        a = "2"
        while filename + f"({a})" + hz in os.listdir(path):
            a = str(int(a) + 1)
        filename += f"({a})"
    return filename + hz

# 解密消息
def decrypt_message(encrypted_message):
	# 确保 encrypted_message 是字节类型
	if isinstance(encrypted_message, str):
		encrypted_message = encrypted_message.encode('utf-8')

	f = Fernet(load_key())
	decrypted_message = f.decrypt(encrypted_message)
	return decrypted_message.decode()


def delete_folder_contents(folder_path):
    # 判断路径是否存在
    if not os.path.exists(folder_path):
        print(f"文件夹 '{folder_path}' 不存在。")
        return

    # 遍历文件夹中的所有内容
    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        # 如果是文件，则直接删除
        if os.path.isfile(item_path):
            os.remove(item_path)
        # 如果是文件夹，则递归调用删除函数
        elif os.path.isdir(item_path):
            delete_folder_contents(item_path)
            # 删除空文件夹
            if not os.listdir(item_path):
                os.rmdir(item_path)




# 获取邀请码cd
def get_code_cd_time_difference(t):
    def to_time(key):
        # 将时间字符串转换为datetime对象
        dt_object = datetime.strptime(key, "%Y-%m-%d")

        # 将datetime对象转换为时间戳（秒）
        timestamp = dt_object.timestamp()
        return timestamp

    now = get_time()
    now_time = to_time(now)
    that_time = to_time(t)
    time_difference = now_time - that_time
    return time_difference / (60 * 60 * 24)


# 生成随机码
def create_code(length=16, state=0):
    s = ""
    for i in range(length):
        if state == 0:
            s += chr(random.randint(33, 126))
        elif state == 1:
            up = chr(random.randint(65, 90))
            low = chr(random.randint(97, 122))
            num = str(random.randint(0, 9))
            choice = (up, low, num)
            s += random.choice(choice)
        elif state == 2:
            s += str(random.randint(0, 9))
    return s


def get_creation_time(file_path):
    # 获取文件的创建时间戳
    creation_time = os.path.getctime(file_path)

    # 转换为可读的时间格式
    created_time = str(datetime.fromtimestamp(creation_time))

    return created_time

# 读写数据库
def sql(cmd):
    connect = sqlite3.connect("star.db")  # 与数据库取得连接
    cursor = connect.cursor()  # 创建游标
    cursor.execute(cmd)
    s = cursor.fetchall()
    connect.commit()
    cursor.close()
    connect.close()
    return s


# 初始化程序
def initialize():
    # user_information 有 id username password e-mail register_time lv add_time inviter invited invite_code 列
    # 连接到SQLite数据库
    conn = sqlite3.connect('star.db')
    c = conn.cursor()

    # 创建用户信息表的SQL语句
    sql_ = """CREATE TABLE IF NOT EXISTS USER_INFORMATION (
                    id INTEGER PRIMARY KEY NOT NULL,
                    username TEXT NOT NULL,
                    password CHAR(100) NOT NULL,
                    email TEXT,
                    register_time CHAR(10) NOT NULL,
                    lv INTEGER,
                    add_time INTEGER,
                    inviter INTEGER NOT NULL,
                    invited INTEGER,
                    invite_code CHAR(32),
                    invite_code_use_time CHAR(10),
                    announcements TEXT DEFAULT ""
                    );"""

    # 执行创建表的SQL语句
    c.execute(sql_)

    # 创建BAN_IP表
    sql_ = """CREATE TABLE IF NOT EXISTS BAN_IP (
    id INTEGER PRIMARY KEY NOT NULL,
    ip TEXT NOT NULL);"""

    c.execute(sql_)

    # 创建EXCHANGE_WHO_HAVE表
    sql_ = """CREATE TABLE IF NOT EXISTS EXCHANGE_WHO_HAVE (
        id INTEGER PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL,
        '03504202' INTEGER NOT NULL DEFAULT "无");"""

    c.execute(sql_)

    # 创建EXCHANGE_DESCRIPTION表
    sql_ = """CREATE TABLE IF NOT EXISTS EXCHANGE_DESCRIPTION (
            id INTEGER PRIMARY KEY NOT NULL,
            code TEXT NOT NULL,
            reward INTEGER NOT NULL,
            over_time CHAR(10) NOT NULL,
            had INTEGER NOT NULL
            );"""

    c.execute(sql_)

    # 创建 GUEST表
    sql_ = """CREATE TABLE IF NOT EXISTS GUEST (
                    id INTEGER PRIMARY KEY NOT NULL,
                    sender_id TEXT NOT NULL,
                    code CHAR(8) NOT NULL,
                    path TEXT NOT NULL
                    );"""

    c.execute(sql_)

    # 创建 PROJECT表
    sql_ = """CREATE TABLE IF NOT EXISTS PROJECT (
                        id INTEGER PRIMARY KEY NOT NULL,
                        project_name TEXT NOT NULL,
                        code CHAR(16) NOT NULL,
                        owner_id INTEGER NOT NULL
                        );"""

    c.execute(sql_)

    if len(sql('SELECT * FROM EXCHANGE_DESCRIPTION WHERE code="03504202"')) == 0:
        sql_ = 'INSERT INTO EXCHANGE_WHO_HAVE(user_id, "03504202") VALUES (1, "无")'
        c.execute(sql_)
        sql_ = 'INSERT INTO EXCHANGE_DESCRIPTION(code, reward, over_time, had) VALUES ("03504202", 20, "2300-01-01", 0)'
        c.execute(sql_)

    s = c.execute("SELECT * FROM USER_INFORMATION WHERE id = 1").fetchall()
    if len(s) == 0:
        now_time = get_time()
        pwd = create_code(6, 1)
        en_pwd = encrypt_message(pwd).decode("utf-8")
        sql_ = f'''INSERT INTO USER_INFORMATION (username, password, email, register_time, lv, add_time, inviter, invited, invite_code, invite_code_use_time) 
        VALUES ("Admin", "{en_pwd}", 'None', "{now_time}", 9, 510, 0, 0, '{create_code(16, 1)}', "{now_time}")'''
        # 执行创建表的SQL语句
        c.execute(sql_)
    s = c.execute("SELECT * FROM USER_INFORMATION WHERE id = 1").fetchall()
    t_s = [i for i in s[0]]
    t_s[2] = decrypt_message(t_s[2])

    # 提交事务
    conn.commit()

    # 关闭连接
    conn.close()

    return t_s


def get_length():
    sql_ = f'SELECT COUNT(*) FROM USER_INFORMATION'
    return sql(sql_)[0][0]


# 生成密钥
if not os.path.exists("secret.key"):
    generate_key()


if __name__ == "__main__":
    # print(get_length())
    # (register('April', '123123', '2JO2jEc2mjxH8rE4'))
    initialize()
    # print(update_exchange('EXCHANGE_WHO_HAVE', 0, 1, 0))
    # print(light_announcements(1))
    # create_post(1, "1", "1")
    # pprint(get_files("files/1"))
    # move_file(1, "main.pak", "测试文件夹")
    pass
