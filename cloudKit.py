import os
import config
import re
import kits
from pprint import pprint
import shutil


# 读取用户文件夹的内容，返回值为字典
def get_files(path):
    datas = {"d": {}, "w": {}, 'p': [], 'm3': [], 'm4': [], 'j': [], "z": [], "f": []}
    for i in os.listdir(path):
        file_extension = os.path.splitext(path + "/" + i)[1].lower()
        if os.path.isdir(path + "/" + i):
            datas["d"][i] = get_files(path + "/" + i)
        elif file_extension == ".weblink":
            nr = open((path + "/" + i)).read()
            datas["w"][i[:-8]] = nr
        elif file_extension == ".pdf":
            datas["p"].append(i)
        elif file_extension == ".mp3":
            datas["m3"].append(i)
        elif file_extension == ".mp4":
            datas["m4"].append(i)
        elif file_extension in ['.png', '.jpg', '.jpeg']:
            datas["j"].append(i)
        elif file_extension in ['.zip', '.rar', '.7z']:
            datas["z"].append(i)
        else:
            datas["f"].append(i)
    return datas


def create_dir(id, path, dirname):
    path = "files/" + str(id) + "/" + "/".join(path)
    path += f"/{kits.make_filename(path, dirname)}"
    try:
        os.makedirs(path, exist_ok=True)
        return True
    except Exception as e:
        return e


def delete_(id, path, filename):
    try:
        path = "files/" + str(id) + "/" + "/".join(path) + "/" + filename
        try:
            os.remove(path)
        except Exception as e:
            print(e, "<-- 可忽略错误")
            kits.delete_folder_contents(path)
            os.rmdir(path)
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def create_weblink(id, path, filename, nr):
    try:
        path = "files/" + str(id) + "/" + "/".join(path) + "/"
        with open(path + kits.make_filename(path, filename + ".weblink"), "w", encoding="utf-8") as f:
            f.write(str(nr))
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def rename(id, path, old_name, new_name):
    path = "files/" + str(id) + "/" + "/".join(path) + "/"
    old_path = path + old_name
    new_path = path + new_name
    try:
        os.rename(old_path, new_path)
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def move_file(id, old_path, new_path):
    full_old_path = config.files_path + "/" + str(id) + "/" + old_path
    full_new_path = config.files_path + "/" + str(id) + "/" + new_path
    shutil.move(full_old_path, full_new_path)


def custom_secure_filename(filename):
    allowed_chars = r'[^\w\s\.-]'
    filename = re.sub(allowed_chars, '', filename)
    return filename


def create_browse_code(id, path):
    path = config.files_path + str(id) + "/" + "/".join(path)
    sql_ = 'SELECT * FROM GUEST WHERE path = "{}"'.format(path)
    b = kits.sql(sql_)
    if len(b) == 0:
        code = kits.create_code(5, 1)
        back = kits.sql('SELECT * FROM GUEST WHERE code = "{}"'.format(code))
        while len(back) != 0:
            code = kits.create_code(5, 1)
            back = kits.sql('SELECT * FROM GUEST WHERE code = "{}"'.format(code))
        sql_ = 'INSERT INTO GUEST(sender_id, code, path) VALUES ("{}", "{}", "{}")'.format(id, code, path)
        kits.sql(sql_)
        return code
    else:
        return b[0][2]


def check_browse_code(code):
    back = {
        'pass': False,
    }
    sql_ = 'SELECT * FROM GUEST WHERE code = "{}"'.format(code)
    b = kits.sql(sql_)
    if len(b) != 0:
        back['sender_id'] = b[0][1]
        back['path'] = b[0][3]
        if os.path.exists(b[0][3]):
            back['pass'] = True
        else:
            sql_ = 'DELETE FROM GUEST WHERE code = "{}"'.format(code)
            kits.sql(sql_)
    return back


if __name__ == '__main__':
    pprint(get_files("./files/1"))
