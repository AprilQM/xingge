import kits


def change_name(new_name, id):
    sql_ = 'UPDATE USER_INFORMATION SET username = "{}" WHERE id = {}'.format(new_name, id)
    kits.sql(sql_)
    sql_ = 'SELECT * FROM USER_INFORMATION WHERE id = {}'.format(id)
    return kits.sql(sql_)


def change_mail(id, mail):
    b = kits.sql('SELECT * FROM USER_INFORMATION WHERE id = {}'.format(id))[0]
    old_mail = b[3]
    inviter_id = b[7]
    try:
        ba = kits.sql('SELECT * FROM USER_INFORMATION WHERE id = {}'.format(inviter_id))[0]
        inviter_add_time = ba[6]
        if old_mail == 'None':
            # 设置邀请人的信息
            sql_ = 'UPDATE USER_INFORMATION SET add_time = {} WHERE id = {}'.format(
                inviter_add_time + 20, inviter_id)
            kits.sql(sql_)
    except Exception as e:
        print(e, "<-- 可忽略错误")
    sql_ = 'UPDATE USER_INFORMATION SET email = "{}" WHERE id = {}'.format(mail, id)
    kits.sql(sql_)


def check_exchange_code(id, code):
    back = {
        'pass': False,  # 通过
        'code': False,  # 兑换码不存在
        'had': False,  # 已经领过
        'time': False  # 兑换码时效已过
    }
    sql_ = 'SELECT * FROM EXCHANGE_DESCRIPTION WHERE code = "{}"'.format(code)
    b = kits.sql(sql_)
    if len(b) == 0:
        back['code'] = True
    else:
        code_id = b[0][0]
        sql_ = 'SELECT * FROM EXCHANGE_WHO_HAVE WHERE user_id == {}'.format(id)
        ba = kits.sql(sql_)
        if ba[0][code_id + 1] == "有":
            back['had'] = True
        elif kits.get_time() > b[0][3]:
            back['time'] = True
        else:
            # 更新兑换码的拥有人数
            sql_ = 'UPDATE EXCHANGE_DESCRIPTION SET had = {} WHERE id = {}'.format(b[0][4] + 1, code_id)
            kits.sql(sql_)

            # 更新用户拥有兑换码
            sql_ = 'UPDATE EXCHANGE_WHO_HAVE SET "{}" = "有" WHERE user_id = {}'.format(b[0][1], id)
            kits.sql(sql_)

            # 更新用户的时间增加
            old_add_time = kits.sql('SELECT add_time FROM USER_INFORMATION WHERE id = {}'.format(id))[0][0]
            sql_ = 'UPDATE USER_INFORMATION SET  add_time = {} WHERE id = {}'.format(old_add_time + b[0][2], id)
            kits.sql(sql_)

            back['pass'] = True
            back['reward'] = b[0][2]
    return back
