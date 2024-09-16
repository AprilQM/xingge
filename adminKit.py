import kits
import re
import os


def get_ban_ip():
    sql_ = 'SELECT * FROM BAN_IP'
    b = [i[1] for i in kits.sql(sql_)]
    return b


def analyze_log():
    log = open(f'./Logs/xing_ge.log', 'r', encoding='utf-8').readlines()
    temp = {
        "ip": {},
        "time(d)": {},  # 以天分割
        "time(h)": {},  # 以小时分割
        "method": {},
        "url": {},
        'error': {}
    }
    right_re_obj = re.compile(
        "^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - ([\d.]+) - (GET|POST|PUT|DELETE|OPTIONS|HEAD) - (/.*)$")
    for i in log:
        t = right_re_obj.match(i)
        if t:
            t_all, ip, method, url = t.groups()
            if url[:7] != "/static":
                t_day = t_all.split()[0]
                t_hour = t_all.split()[1][:2] + "点"
                if ip in temp['ip']:
                    temp['ip'][ip] += 1
                else:
                    temp['ip'][ip] = 1

                if t_day in temp['time(d)']:
                    temp['time(d)'][t_day] += 1
                else:
                    temp['time(d)'][t_day] = 1

                if t_hour in temp['time(h)']:
                    temp['time(h)'][t_hour] += 1
                else:
                    temp['time(h)'][t_hour] = 1

                if method in temp['method']:
                    temp['method'][method] += 1
                else:
                    temp['method'][method] = 1

                if url in temp['url']:
                    temp['url'][url] += 1
                else:
                    temp['url'][url] = 1

        else:
            error_pos = re.compile(r'^Exception on (/\S*) \[(GET|POST|PUT|DELETE|OPTIONS|HEAD)]$')
            if error_pos.match(i):
                pos, func = error_pos.match(i).groups()
                if pos in temp['error']:
                    temp['error'][pos] += 1
                else:
                    temp['error'][pos] = 1

                if func in temp['method']:
                    temp['method'][func] += 1
                else:
                    temp['method'][func] = 1
    # 初始化 back 字典
    back = {
        "ip": {},
        "time(d)": {},  # 以天分割
        "time(h)": {},  # 以小时分割
        "method": {},
        "url": {},
        'error': {}
    }

    for i in temp:
        # 冒泡排序
        sort_values = [(temp[i][j], j) for j in temp[i]]
        for j in range(len(sort_values)):
            for k in range(len(sort_values) - 1, j, -1):
                if sort_values[k][0] > sort_values[k - 1][0]:
                    sort_values[k], sort_values[k - 1] = sort_values[k - 1], sort_values[k]

        # 加入到back
        for j in sort_values:
            back[i][j[1]] = j[0]
    return back


def admin_find_user(expression):
    sql_ = 'SELECT * FROM USER_INFORMATION WHERE {} '.format(expression)
    b = kits.sql(sql_)
    back = []
    for i in range(len(b)):
        back.append([])
        for j in range(11):
            if j == 2:
                back[i].append("******")
            else:
                back[i].append(b[i][j])
    return back


def get_password(id):
    sql_ = 'SELECT password FROM USER_INFORMATION WHERE id = {}'.format(id)
    b = kits.decrypt_message(kits.sql(sql_)[0][0])
    return b


def change_user_value(id, column, value):
    column_name = ['id', 'username', 'password', 'email', 'register_time', 'lv', 'add_time', 'inviter', 'invited', 'invite_code', 'invite_code_use_time'][int(column)]
    if column_name in ['username', 'email', 'register_time', 'invite_code', 'invite_code_use_time']:
        value = "'" + value + "'"
    if column_name == 'password':
        value = "'" + kits.encrypt_message(value).decode('utf-8') + "'"
    sql_ = 'UPDATE USER_INFORMATION SET {} = {} WHERE id = {}'.format(column_name, value, id)
    try:
        kits.sql(sql_)
        return True
    except Exception as e:
        return e


def upload_announcement(title, value):
    try:
        txt = open(f"announcements/{title}.txt", "w", encoding='utf-8')
        txt.write(value)
        txt.close()
        return True
    except Exception as e:
        return e


def delete_announcement(title):
    try:
        os.remove(f"announcements/{title}.txt")
        return True
    except Exception as e:
        return e


def ban_ip_in(ip):
    sql_ = 'INSERT INTO BAN_IP(ip) VALUES ("{}")'.format(ip)
    try:
        kits.sql(sql_)
        return True
    except Exception as e:
        return e


def ban_ip_off(ip):
    sql_ = 'DELETE FROM BAN_IP WHERE ip = "{}"'.format(ip)
    try:
        kits.sql(sql_)
        return True
    except Exception as e:
        return e


def create_exchange_code(code):
    sql_ = 'SELECT * FROM EXCHANGE_DESCRIPTION WHERE code = "{}"'.format(code)
    if len(kits.sql(sql_)) == 0:
        sql_ = 'INSERT INTO EXCHANGE_DESCRIPTION (code, reward, over_time, had) VALUES ("{}", {}, "{}", {})'.format(
            code, 0, kits.get_time(), 0)
        kits.sql(sql_)
        sql_ = 'ALTER TABLE EXCHANGE_WHO_HAVE ADD "{}" TEXT DEFAULT "无";'.format(code)
        kits.sql(sql_)
        return True
    else:
        return False


def update_exchange(table, row, column, value):
    column_name = ''
    row, column = int(row), int(column)
    exchange_description_table = kits.sql('SELECT * FROM EXCHANGE_DESCRIPTION')
    exchanges = [i[1] for i in exchange_description_table]
    try:
        if table.upper() == 'EXCHANGEWHOHAVETABLE':
            table = 'EXCHANGE_WHO_HAVE'
            column_list = ['id', 'user_id'] + exchanges
            column_name = column_list[column]
        elif table.upper() == 'EXCHANGEDESCRIPTIONTABLE':
            table = 'EXCHANGE_DESCRIPTION'
            column_name = ['id', 'code', 'reward', 'over_time', 'had'][column]
    except Exception as e:
        return str(e)
    try:
        sql_ = f'UPDATE {table} SET "{column_name}" = "{value}" WHERE id = {row + 1}'
        kits.sql(sql_)
        return True
    except Exception as e:
        return str(e)


def check_ban(ip):
    sql_ = 'SELECT * FROM BAN_IP WHERE ip = "{}"'.format(ip)
    b = kits.sql(sql_)
    if len(b) == 0:
        return False
    else:
        return True
