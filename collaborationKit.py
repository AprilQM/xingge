import config
import kits
import os
import json
import shutil


def create_project(user_id, project_name):
    code = kits.create_code(16, 1)
    while len(kits.sql("SELECT * FROM PROJECT WHERE code='{}'".format(code))) != 0:
        code = kits.create_code(16, 1)
    kits.sql("INSERT INTO PROJECT (code,project_name,owner_id) VALUES ('{}','{}','{}')".format(code, project_name, user_id))
    if not os.path.exists("projects"):
        os.mkdir("projects")
    os.mkdir("projects/{}".format(code))
    information = {
        "owner_id": user_id,
        "admins": [user_id],
        "members": [user_id],
        "project_name": project_name,
        "project_code": code,
        "project_id": kits.sql("SELECT id FROM PROJECT WHERE code='{}'".format(code))[0][0],
        "message": ""
    }
    with open("projects/{}/information.json".format(code), "w", encoding="utf-8") as f:
        json.dump(information, f, indent=4)
    os.mkdir("projects/{}/files".format(code))
    return information


def delete_project(user_id, project_id=None, project_code=None):
    user_lv = kits.sql("SELECT lv FROM USER_INFORMATION WHERE id={}".format(user_id))[0][0]
    if project_id is None:
        if project_code is None:
            return KeyError("没有搜素方式！")
        else:
            try:
                owner_id = kits.sql("SELECT owner_id FROM PROJECT WHERE code='{}'".format(project_code))[0][0]
                if owner_id == user_id or user_lv > 8:
                    kits.sql("DELETE FROM PROJECT WHERE code='{}'".format(project_code))
                    kits.delete_folder_contents("projects/{}".format(project_code))
                    os.rmdir("projects/{}".format(project_code))
                else:
                    return False
            except IndexError:
                return IndexError("找不到项目")
    else:
        project_id = int(project_id)
        try:
            code, owner_id = kits.sql("SELECT code, owner_id FROM PROJECT WHERE id={}".format(project_id))[0]
            if owner_id == user_id or user_lv > 8:
                kits.sql("DELETE FROM PROJECT WHERE id={}".format(project_id))
                kits.delete_folder_contents("projects/{}".format(code))
                os.rmdir("projects/{}".format(code))
            else:
                return False
        except IndexError:
            return IndexError("找不到项目")
    return True


def get_projects(user_id):
    project_list = []
    if not os.path.exists("projects"):
        os.mkdir("projects")
    for i in os.listdir("projects"):
        data = json.loads(open("projects/{}/information.json".format(i), "r", encoding="utf-8").read())
        if user_id in data['members']:
            owner_name, owner_lv = kits.sql("SELECT username,lv FROM USER_INFORMATION WHERE id={}".format(data["owner_id"]))[0]
            admins_id = data['admins']
            admins_name = []
            for j in admins_id:
                admins_name.append(kits.sql("SELECT username FROM USER_INFORMATION WHERE id={}".format(j))[0][0])
            members_id = data['members']
            members_name = []
            for j in members_id:
                members_name.append(kits.sql("SELECT username FROM USER_INFORMATION WHERE id={}".format(j))[0][0])
            temp = [data["project_name"], [data["owner_id"], owner_name, owner_lv], admins_name, members_name, data["message"], data["project_id"]]
            project_list.append(temp)
    return project_list


def update_message(project_id, message):
    try:
        project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
        data = json.loads(open("projects/{}/information.json".format(project_code)).read())
        data["message"] = message
        with open("projects/{}/information.json".format(project_code), "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        return False


def project_join_admin(admin_id, project_id, username):
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    data = json.loads(open("projects/{}/information.json".format(project_code)).read())
    if admin_id not in data['admins']:
        return PermissionError("你没有权限")
    else:
        b = kits.sql("SELECT id FROM USER_INFORMATION WHERE username='{}'".format(username))
        if len(b) == 0:
            return False, []
        else:
            user_id = b[0][0]
            data['members'].append(user_id)
            with open("projects/{}/information.json".format(project_code), "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
            return True, get_projects(admin_id)


def project_join_code(user_id, code):
    back = {
        "code": False,
        "joined": False
    }
    ba = kits.sql("SELECT * FROM PROJECT WHERE code='{}'".format(code))
    if len(ba) == 0:
        back["code"] = True
    else:
        data = json.loads(open("projects/{}/information.json".format(code)).read())
        if user_id not in data['members']:
            data['members'].append(user_id)
            with open("projects/{}/information.json".format(code), "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
        else:
            back["joined"] = True
    return back


def delete_member(user_id, project_id, member_name):
    member_id = kits.sql("SELECT id FROM USER_INFORMATION WHERE username='{}'".format(member_name))[0][0]
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    data = json.loads(open("projects/{}/information.json".format(project_code)).read())
    if user_id not in data['admins']:
        return False
    else:
        if member_id in data['admins']:
            return False
        else:
            data['members'].remove(member_id)
            with open("projects/{}/information.json".format(project_code), "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
            return True


def member_to_admin(user_id, project_id, member_name):
    member_id = kits.sql("SELECT id FROM USER_INFORMATION WHERE username='{}'".format(member_name))[0][0]
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    data = json.loads(open("projects/{}/information.json".format(project_code)).read())
    if user_id not in data['admins']:
        return False
    else:
        if member_id in data['admins']:
            return False
        else:
            data['admins'].append(member_id)
            with open("projects/{}/information.json".format(project_code), "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
            return True


def admin_to_member(user_id, project_id, admin_name):
    admin_id = kits.sql("SELECT id FROM USER_INFORMATION WHERE username='{}'".format(admin_name))[0][0]
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    data = json.loads(open("projects/{}/information.json".format(project_code)).read())
    if user_id not in data['admins']:
        return False
    else:
        if admin_id in data['members'] and admin_id not in data['admins']:
            return False
        else:
            data['admins'].remove(admin_id)
            with open("projects/{}/information.json".format(project_code), "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
            return True


def create_dir(project_id, path, dirname):
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    path = "projects/" + project_code + "/files/" + "/".join(path)
    path += f"/{kits.make_filename(path, dirname)}"
    try:
        os.makedirs(path, exist_ok=True)
        return True
    except Exception as e:
        return e


def create_weblink(project_id, path, filename, nr):
    try:
        project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
        path = "projects/" + project_code + "/files/" + "/".join(path) + "/"
        with open(path + kits.make_filename(path, filename + ".weblink"), "w", encoding="utf-8") as f:
            f.write(str(nr))
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def move_in(user_id, project_id, target_file, target_path):
    project_id = int(project_id)
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    path = "./projects/" + project_code + "/files/" + "/".join(target_path) + "/"
    target_file_path = config.files_path + str(user_id) + "/" + target_file
    try:
        if os.path.isdir(target_file_path):
            path = path + target_file_path[:-1][target_file_path[:-1].rfind("/")+1:]
            if not os.path.exists(path):
                os.mkdir(path)
            shutil.copytree(target_file_path, path, dirs_exist_ok=True)
        else:
            shutil.copy(target_file_path, path)
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def delete_project_file(project_id, path, project_file_name):
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    try:
        path = "./projects/{}/files/".format(project_code) + "/".join(path) + "/" + project_file_name
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


def rename(project_code, path, old_name, new_name):
    path = "./projects/{}/files/".format(project_code) + "/".join(path) + "/"
    old_path = path + old_name
    new_path = path + new_name
    try:
        os.rename(old_path, new_path)
        return True
    except Exception as e:
        print(e, "<-- 可忽略错误")
        return False


def move_file(project_id, old_path, new_path):
    project_code = kits.sql("SELECT code FROM PROJECT WHERE id={}".format(project_id))[0][0]
    full_old_path = config.projects_path + project_code + "/files/" + old_path
    full_new_path = config.projects_path + project_code + "/files/" + new_path
    shutil.move(full_old_path, full_new_path)


if __name__ == '__main__':
    # print(create_project(1, "测试项目"))
    # print(delete_project(1, project_id=1))
    # print(get_projects(1))
    print(move_in(1, 2, "config.py", []))
