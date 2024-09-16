import os
import json
import kits
from pprint import pprint


def get_posts():
    if not os.path.exists('posts'):
        os.mkdir('posts')
    back = []
    for i in os.listdir('posts'):
        post = json.loads(open("posts/" + i, 'r', encoding='utf-8').read())
        post['post']['content'] = post['post']['content'].split('$')
        author_name, lv = kits.sql("SELECT username, lv FROM USER_INFORMATION WHERE id = {}".format(post['author']['id']))[0]
        post['author']['name'] = author_name
        post['author']['level'] = lv
        for j in post['post']['comments']:
            commentator_name, lv = kits.sql("SELECT username, lv FROM USER_INFORMATION WHERE id = {}".format(j['commentator']['id']))[0]
            j["commentator"]["name"] = commentator_name
            j["commentator"]["level"] = lv
        back.append(post)

    t_back = [[back[i]["id"], i] for i in range(len(back))]

    n = len(t_back)
    for i in range(n):
        for j in range(0, n-i-1):
            if t_back[j][0] > t_back[j + 1 ][0]:
                t_back[j], t_back[j + 1] = t_back[j + 1], t_back[j]

    return [back[t_back[i][1]] for i in range(n)]


def create_post(id, title, content):
    post_list = os.listdir('posts')
    post_id = 0
    for i in range(len(post_list)):
        if str(i + 1) + ".json" not in post_list:
            post_id = i + 1
            break
    if post_id == 0:
        post_id = len(post_list) + 1
    post_dic = {
        'id': post_id,
        'author': {
            "id": id,
        },
        'post': {
            'title': title,
            'content': content,
            'comment_num': 0,
            'comments': []
        },
        'time': kits.get_time()
    }
    with open('posts/' + str(post_id) + ".json", 'w', encoding='utf-8') as json_file:
        json.dump(post_dic, json_file, indent=4)
    return True


def create_comment(id, comment, post_id):
    try:
        post = json.loads(open('posts/' + str(post_id) + ".json", encoding='utf-8').read())
        post['post']['comments'].append({
            'commentator': {
                "id": id,
            },
            'content': comment
        })
        post['post']['comment_num'] += 1
        with open('posts/' + str(post_id) + ".json", 'w', encoding='utf-8') as json_file:
            json.dump(post, json_file, indent=4)
        return True
    except Exception as e:
        print(str(e))
        return False


def delete_post(id, lv, post_id):
    id = int(id)
    post = json.loads(open('posts/' + str(post_id) + ".json", encoding='utf-8').read())
    if post['author']['id'] == id or lv == 9:
        os.remove('posts/' + str(post_id) + ".json")
        return True
    else:
        return False


def delete_comment(id, lv, post_id, comment_id):
    id = int(id)
    post = json.loads(open('posts/' + str(post_id) + ".json", encoding='utf-8').read())
    if post['author']['id'] == id or lv == 9:
        post['post']['comments'].pop(int(comment_id))
        with open('posts/' + str(post_id) + ".json", 'w', encoding='utf-8') as json_file:
            json.dump(post, json_file, indent=4)
        return True
    else:
        return False


if __name__ == '__main__':
    pprint(get_posts())
