import os.path

version = "v1.4.11"

files_path = "./files/"
projects_path = "./projects/"

# 在打包后的windows系统由于不知名原因项目根目录位置发生偏移， 该方法用于矫正

if os.path.basename(__file__).split(".")[-1].lower() == "pyc":
    send_files_path = "../files/"
    send_project_files_path = "../projects/"
else:
    send_files_path = "./files/"
    send_project_files_path = "./projects/"


# 验证码
send_by = "2173840670@qq.com"
mail_password = "zysdlrricebjdihe"
mail_host = "smtp.qq.com"
mail_port = 465