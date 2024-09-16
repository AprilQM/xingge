import requests
import base64
import config  # 假设config.py文件中包含了管理员密码的配置

admin_password = config.admin_password
admin_port = config.admin_port
proxy_address = config.proxy_address


def accountcreate(username, password, connection, bandwidth, disabledate, disabletime):
    url = f"http://{proxy_address}:{admin_port}/account"
    auth = base64.b64encode(f"admin:{admin_password}".encode()).decode()

    data = {
        'add': '1',
        'autodisable': '1',
        'enable': '1',
        'usepassword': '1',
        'enablesocks': '1',
        'enablewww': '0',
        'enabletelnet': '0',
        'enabledial': '0',
        'enableftp': '0',
        'enableothers': '0',
        'enablemail': '0',
        'username': username,
        'password': password,
        'connection': connection,
        'bandwidth': bandwidth,
        'disabledate': disabledate,
        'disabletime': disabletime,
        'userid': '-1'
    }

    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        print(f"User '{username}' created successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error creating user '{username}': {e}")


def accountedit(username, password, connection, bandwidth, disabledate, disabletime):
    url = f"http://{proxy_address}:{admin_port}/account"
    auth = base64.b64encode(f"admin:{admin_password}".encode()).decode()

    data = {
        'edit': '1',
        'autodisable': '1',
        'enable': '1',
        'usepassword': '1',
        'enablesocks': '1',
        'enablewww': '0',
        'enabletelnet': '0',
        'enabledial': '0',
        'enableftp': '0',
        'enableothers': '0',
        'enablemail': '0',
        'username': username,
        'password': password,
        'connection': connection,
        'bandwidth': bandwidth,
        'disabledate': disabledate,
        'disabletime': disabletime,
        'userid': username  # 注意这里使用 username 作为 userid
    }

    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        print(f"User '{username}' edited successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error editing user '{username}': {e}")


def accountdelete(username):
    url = f"http://{proxy_address}:{admin_port}/account"
    auth = base64.b64encode(f"admin:{admin_password}".encode()).decode()

    data = {
        'delete': '1',
        'userid': username
    }

    headers = {
        'Authorization': f'Basic {auth}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        print(f"User '{username}' deleted successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Error deleting user '{username}': {e}")


def getconn():
    url = f"http://{proxy_address}:{admin_port}/accountinfo"
    auth = base64.b64encode(f"admin:{admin_password}".encode()).decode()

    headers = {
        'Authorization': f'Basic {auth}'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.text.split('\n')  # 假设返回的是多行数据，根据具体返回内容解析
        conn = data[0] if len(data) > 0 else ''
        active = data[1] if len(data) > 1 else ''
        print(f"Connection: {conn}, Active: {active}")
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving connection info: {e}")
