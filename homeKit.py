# 这是主页相关的代码库

import os
import kits


# 获取更新日记
def get_announcement():
    if not os.path.exists("./announcements"):
        os.mkdir("./announcements")
    announcements = {}
    create_times = []
    for title in os.listdir('announcements'):
        create_times.append([kits.get_creation_time('announcements/'+title), title])
        content = open('announcements/'+title, encoding='utf-8').read()
        announcements[title] = content

    # 将最新的公告放在最前面
    # 冒泡排序
    for j in range(len(create_times)):
        for k in range(len(create_times) - 1, j, -1):
            if create_times[k][0] > create_times[k - 1][0]:
                create_times[k], create_times[k - 1] = create_times[k - 1], create_times[k]
    t = {}
    for i in create_times:
        t[i[1]] = announcements[i[1]]

    return t


def get_update():
    if not os.path.exists("./updateLogs"):
        os.mkdir("./updateLogs")
    updateLogs = {}
    for i in os.listdir('updateLogs'):
        txt = open('updateLogs/'+i, encoding='utf-8')
        title = txt.readline()[:-1]
        content = txt.read()
        updateLogs[title+f"({i.replace('.txt','')})"] = content
    # 将最新的 更新日记放在最前面
    titles = [i for i in updateLogs.keys()][::-1]
    temp_updateLogs = {}
    for i in titles:
        temp_updateLogs[i] = updateLogs[i]
    return temp_updateLogs


# 获取头像列表
def get_tx_list():
    if not os.path.exists("./tx"):
        os.mkdir("./tx")
    return os.listdir("./tx")


def light_announcements(id):
    user_announcements = kits.sql('SELECT * FROM USER_INFORMATION WHERE id = {}'.format(id))[0][11]
    announcements = "$$".join([i[:i.rfind(".")] for i in os.listdir('announcements')])
    sql_ = 'UPDATE USER_INFORMATION SET announcements = "{}" WHERE id = {}'.format(announcements, id)
    if announcements in user_announcements:
        kits.sql(sql_)
        return False
    else:
        kits.sql(sql_)
        return True


# 测试用
if __name__ == '__main__':
    get_announcement()
