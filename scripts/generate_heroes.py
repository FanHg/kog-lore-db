#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量生成稷下英雄JSON数据文件 - 从提取的文本文件读取"""
import json, os, re

output_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'heroes')
output_dir = os.path.normpath(output_dir)
os.makedirs(output_dir, exist_ok=True)

# 英雄基础数据 - 从文档提取
heroes_data = [
    {"id":"yao","name":"曜","title":"星辰之子","alias":["星之队队长","中二少年","天才剑客"],"faction":"jixia","factionName":"稷下学院","role":["战士"],"difficulty":3,"energy":"武道","region":"逐鹿","race":"人类","city":"稷下学院","height":"176cm","identity":"稷下学生"},
    {"id":"jing","name":"镜","title":"破镜之刃","alias":["阴曲专员","碎镜者"],"faction":"xuanyong","factionName":"玄雍","role":["刺客"],"difficulty":4,"energy":"武道","region":"逐鹿","race":"人类","city":"玄雍城","height":"170cm","identity":"阴曲情报专员"},
    {"id":"xishi","name":"西施","title":"梦之纱","alias":["施夷光","探宝者","宝藏少女"],"faction":"jixia","factionName":"稷下学院","role":["法师"],"difficulty":3,"energy":"魔道","region":"逐鹿","race":"人类","city":"稷下学院","height":"163cm","identity":"稷下学生"},
    {"id":"mengya","name":"蒙犽","title":"烈炮小子","alias":["火炮犽","叛逆少年"],"faction":"jixia","factionName":"稷下学院","role":["射手"],"difficulty":2,"energy":"机关","region":"逐鹿","race":"人类","city":"稷下学院","height":"150cm","identity":"稷下学生"},
    {"id":"sunbin","name":"孙膑","title":"时空旅者","alias":["爱哭鬼","机关天才"],"faction":"jixia","factionName":"稷下学院","role":["辅助"],"difficulty":3,"energy":"机关","region":"逐鹿","race":"人类","city":"稷下学院","height":"155cm","identity":"稷下学生"},
    {"id":"laofuzi","name":"老夫子","title":"至圣先师","alias":["人类最强","稷下院长","持戒者"],"faction":"jixia","factionName":"稷下学院","role":["战士"],"difficulty":3,"energy":"武道","region":"逐鹿","race":"人类","city":"稷下学院","height":"173cm","identity":"神职者，稷下三贤者"},
    {"id":"zhuangzhou","name":"庄周","title":"梦蝶贤者","alias":["骑鱼之人","梦之贤者"],"faction":"jixia","factionName":"稷下学院","role":["辅助"],"difficulty":2,"energy":"魔道","region":"逐鹿","race":"未知","city":"稷下学院","height":"175cm","identity":"稷下三贤者"},
    {"id":"mozi","name":"墨子","title":"和平守护者","alias":["机关术宗师","稷下建设者"],"faction":"jixia","factionName":"稷下学院","role":["战士"],"difficulty":2,"energy":"机关","region":"逐鹿","race":"人类","city":"稷下学院","height":"182/512cm","identity":"稷下三贤者"},
    {"id":"lubandashi","name":"鲁班大师","title":"机关造物主","alias":["班叔","怪大叔","留级生"],"faction":"jixia","factionName":"稷下学院","role":["辅助"],"difficulty":4,"energy":"机关","region":"逐鹿","race":"人类","city":"稷下学院","height":"192cm","identity":"稷下学生"},
    {"id":"lianpo","name":"廉颇","title":"不老战神","alias":["重量级战士","甘丹族长"],"faction":"jixia","factionName":"稷下学院","role":["坦克"],"difficulty":2,"energy":"武道","region":"逐鹿","race":"人类","city":"稷下学院","height":"190cm","identity":"军人"},
    {"id":"zhongwuyan","name":"钟无艳","title":"野蛮之锤","alias":["夺宝猎人","百万吨大锤"],"faction":"jixia","factionName":"稷下学院","role":["战士"],"difficulty":2,"energy":"武道","region":"逐鹿","race":"人魔混血","city":"稷下学院","height":"177cm","identity":"稷下学生"},
    {"id":"jixiaoman","name":"姬小满","title":"武道少女","alias":["摸鱼天才","小满"],"faction":"haidou","factionName":"海都家族","role":["战士"],"difficulty":3,"energy":"武道","region":"日落海","race":"人族","city":"海都","height":"163cm","identity":"稷下学生"},
    {"id":"mengtian","name":"蒙恬","title":"秩序之盾","alias":["护国大将军","蒙大将军"],"faction":"xuanyong","factionName":"玄雍","role":["战士"],"difficulty":3,"energy":"武道","region":"逐鹿","race":"人类","city":"玄雍城","height":"190cm","identity":"玄雍护国大将军"},
    {"id":"jiangziya","name":"姜子牙","title":"太古封神者","alias":["封神者","太古魔导"],"faction":"daoxuantian","factionName":"倒悬天","role":["法师"],"difficulty":4,"energy":"魔道","region":"建木","race":"人类","city":"倒悬天","height":"178cm","identity":"神职者，太古封神者"},
    {"id":"lubanqihao","name":"鲁班七号","title":"机关造物","alias":["小鲁班","七号"],"faction":"xuanyong","factionName":"玄雍","role":["射手"],"difficulty":1,"energy":"机关","region":"逐鹿","race":"人造人","city":"玄雍城","height":"149cm","identity":"鲁班所造之物"},
]

# 从文本文件读取详细内容
text_file = r'C:\Users\Administrator\Downloads\jixia_content.txt'
with open(text_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 解析文档结构
paragraphs = []
for line in lines:
    line = line.strip()
    if not line:
        continue
    # 格式: P123|Style|Content
    parts = line.split('|', 2)
    if len(parts) == 3:
        idx, style, content = parts
        paragraphs.append({'idx': int(idx[1:]), 'style': style, 'content': content})

# 按英雄分割文档
hero_sections = {}
current_hero = None
for p in paragraphs:
    if p['style'] == 'Title':
        continue
    if p['style'] == 'Heading 2' and '背景故事' in p['content']:
        hero_name = p['content'].replace('背景故事', '')
        current_hero = hero_name
        hero_sections[current_hero] = []
        continue
    if current_hero:
        hero_sections[current_hero].append(p)

# 英雄名字到ID映射
name_to_id = {}
for h in heroes_data:
    name_to_id[h['name']] = h['id']

# 提取每个英雄的字段
def extract_hero_fields(paragraphs_list, hero_id):
    description = ""
    info = {}
    lore_parts = []
    voice_parts = {"move": "", "skill": "", "interaction": "", "function": ""}
    
    phase = "desc"  # desc -> info -> lore -> voice
    
    for i, p in enumerate(paragraphs_list):
        text = p['content']
        
        if phase == "desc":
            if text == "英雄档案INFORMATION":
                phase = "info"
                continue
            description = text
            continue
        
        if phase == "info":
            if text == "英雄故事" or text == "常说的话：":
                phase = "lore"
                continue
            # Parse info fields
            if '：' in text:
                key, val = text.split('：', 1)
                info[key] = val
            continue
        
        if phase == "lore":
            # Check for voice line sections
            if text in ["移动语音", "移动语音："] or text.startswith("移动语音"):
                phase = "voice"
                voice_parts["move"] = ""
                continue
            lore_parts.append(text)
            continue
        
        if phase == "voice":
            if "技能语音" in text:
                continue
            elif "互动语音" in text:
                continue
            elif "功能语音" in text:
                continue
            elif "剧情语音" in text:
                continue
            elif "常说的话" in text:
                continue
            # Categorize voice lines
            elif i > 0 and paragraphs_list[i-1]['content'] in ["移动语音", "移动语音："] or (i > 0 and "移动语音" in paragraphs_list[i-1]['content']):
                voice_parts["move"] += text + " "
            elif i > 0 and "技能语音" in paragraphs_list[i-1]['content']:
                voice_parts["skill"] += text + " "
            elif i > 0 and "互动语音" in paragraphs_list[i-1]['content']:
                voice_parts["interaction"] += text + " "
            elif i > 0 and "功能语音" in paragraphs_list[i-1]['content']:
                voice_parts["function"] += text + " "
            else:
                # Try to append to the last known section
                for key in ["function", "interaction", "skill", "move"]:
                    if voice_parts[key]:
                        voice_parts[key] += text + " "
                        break
    
    # Clean up voice lines
    for key in voice_parts:
        voice_parts[key] = voice_parts[key].strip()
    
    lore_text = "\n\n".join(lore_parts)
    
    return description, info, lore_text, voice_parts

# 已写好的曜不需要重新生成
existing = os.listdir(output_dir)
existing_ids = [f.replace('.json', '') for f in existing if f.endswith('.json')]

# 关系数据
relations_map = {
    "yao": [
        {"targetId": "jing", "type": "sibling", "description": "曜与镜是姐弟，从小争夺第一，在环中梦竞赛中曜终于战胜了姐姐"},
        {"targetId": "zhuangzhou", "type": "teacher", "description": "庄周是曜的老师，举办了归虚梦演"},
        {"targetId": "xishi", "type": "teammate", "description": "星之队队友，一同参加归虚梦演"},
        {"targetId": "mengya", "type": "teammate", "description": "星之队队友，一同参加归虚梦演"},
        {"targetId": "sunbin", "type": "teammate", "description": "星之队队友，曜在危难中率队救出了孙膑"},
        {"targetId": "lubandashi", "type": "teammate", "description": "星之队队友，鲁班大师为孙膑改造了机关翼"}
    ],
    "jing": [
        {"targetId": "yao", "type": "sibling", "description": "镜是曜的姐姐，从小严苛对待弟弟，两人在环中梦竞赛中对决"},
        {"targetId": "mengtian", "type": "superior", "description": "镜是蒙恬麾下的阴曲情报专员"},
        {"targetId": "laofuzi", "type": "teacher", "description": "老夫子指引镜得知万镜之厅的存在"},
        {"targetId": "mengya", "type": "comrade", "description": "蒙犽与镜一同成为蒙恬麾下见习士兵"}
    ],
    "xishi": [
        {"targetId": "yao", "type": "teammate", "description": "星之队队友"},
        {"targetId": "mengya", "type": "teammate", "description": "星之队队友"},
        {"targetId": "zhuangzhou", "type": "teacher", "description": "庄周救了西施并带她来到稷下"},
        {"targetId": "lubandashi", "type": "teammate", "description": "星之队队友"},
        {"targetId": "lubanqihao", "type": "connection", "description": "西施曾捡到鲁班七号并试图倒卖"}
    ],
    "mengya": [
        {"targetId": "mengtian", "type": "parent", "description": "蒙恬是蒙犽的父亲，父子理念不合屡屡冲突"},
        {"targetId": "yao", "type": "teammate", "description": "星之队队友"},
        {"targetId": "jing", "type": "comrade", "description": "与镜一同成为蒙恬麾下见习士兵"},
        {"targetId": "lubandashi", "type": "teammate", "description": "星之队队友"}
    ],
    "sunbin": [
        {"targetId": "lubandashi", "type": "benefactor", "description": "鲁班大师为孙膑研究并改造了更先进的机关翼"},
        {"targetId": "yao", "type": "teammate", "description": "星之队队长，率队救出了被困废墟的孙膑"},
        {"targetId": "mozi", "type": "benefactor", "description": "墨子救出了失去双腿的孙膑，保住了他的性命"},
        {"targetId": "xishi", "type": "teammate", "description": "星之队队友"}
    ],
    "laofuzi": [
        {"targetId": "jiangziya", "type": "former_friend", "description": "曾与姜子牙一同踏上问神之路，后因理念分歧决裂"},
        {"targetId": "mozi", "type": "colleague", "description": "稷下三贤者之一，共同管理学院"},
        {"targetId": "zhuangzhou", "type": "colleague", "description": "稷下三贤者之一，共同管理学院"},
        {"targetId": "jixiaoman", "type": "guardian", "description": "姬小满被托付给老夫子，夫子将她当做亲孙女一般关照"}
    ],
    "zhuangzhou": [
        {"targetId": "laofuzi", "type": "colleague", "description": "稷下三贤者之一，与老夫子共同管理学院"},
        {"targetId": "mozi", "type": "colleague", "description": "稷下三贤者之一"},
        {"targetId": "yao", "type": "teacher", "description": "庄周是曜的老师，举办了归虚梦演"},
        {"targetId": "xishi", "type": "teacher", "description": "庄周救了西施并带她来到稷下"}
    ],
    "mozi": [
        {"targetId": "laofuzi", "type": "colleague", "description": "稷下三贤者之一，共同建设和管理学院"},
        {"targetId": "zhuangzhou", "type": "colleague", "description": "稷下三贤者之一"},
        {"targetId": "lubandashi", "type": "rival", "description": "鲁班大师是与墨子不分伯仲的机关天才"},
        {"targetId": "sunbin", "type": "benefactor", "description": "墨子救出了失去双腿的孙膑"}
    ],
    "lubandashi": [
        {"targetId": "lubanqihao", "type": "creator", "description": "鲁班七号是鲁班大师创造的具有生命力的机关造物"},
        {"targetId": "sunbin", "type": "benefactor", "description": "为孙膑研究并改造了更耐用更智能的机关翼"},
        {"targetId": "mozi", "type": "rival", "description": "与墨子不分伯仲的机关天才"},
        {"targetId": "yao", "type": "teammate", "description": "星之队队友"},
        {"targetId": "lianpo", "type": "connection", "description": "为廉颇改造了新的拳甲"}
    ],
    "lianpo": [
        {"targetId": "zhongwuyan", "type": "friend", "description": "钟无艳曾打劫甘丹部族，两人不打不相识"},
        {"targetId": "lubandashi", "type": "connection", "description": "鲁班大师为廉颇改造了新的拳甲"},
        {"targetId": "yao", "type": "friend", "description": "廉颇与曜在观星台比武后成为忘年交"}
    ],
    "zhongwuyan": [
        {"targetId": "lianpo", "type": "friend", "description": "曾打劫廉颇的甘丹部族，两人不打不相识"},
        {"targetId": "laofuzi", "type": "teacher", "description": "夫子多次包容钟无艳的出格行为"},
        {"targetId": "mozi", "type": "teacher", "description": "三贤者之一，钟无艳偷空过三贤者的积蓄"}
    ],
    "jixiaoman": [
        {"targetId": "laofuzi", "type": "guardian", "description": "被父亲托付给老夫子，夫子将她当做亲孙女关照"},
        {"targetId": "mengtian", "type": "connection", "description": "蒙恬认识姬小满的父亲，也关照小满"},
        {"targetId": "zhuangzhou", "type": "teacher", "description": "庄周鼓励小满前往海都完成母亲遗愿"},
        {"targetId": "jiangziya", "type": "connection", "description": "姬小满曾听老夫子讲述姜子牙的故事"}
    ],
    "mengtian": [
        {"targetId": "mengya", "type": "parent", "description": "蒙恬是蒙犽的父亲，父子理念不合但互相关心"},
        {"targetId": "jing", "type": "subordinate", "description": "镜是蒙恬麾下的阴曲情报专员"},
        {"targetId": "laofuzi", "type": "connection", "description": "蒙恬追子到稷下，与老夫子商议蒙犽入学事宜"},
        {"targetId": "mozi", "type": "connection", "description": "墨子将蒙犽划入机关学院"}
    ],
    "jiangziya": [
        {"targetId": "laofuzi", "type": "former_friend", "description": "曾一同踏上问神之路成为最初神职者，后因理念分歧决裂"},
        {"targetId": "jixiaoman", "type": "connection", "description": "姬小满曾从老夫子口中听闻姜子牙的传奇故事"}
    ],
    "lubanqihao": [
        {"targetId": "lubandashi", "type": "creator", "description": "鲁班七号是鲁班大师创造的机关造物"},
        {"targetId": "xishi", "type": "connection", "description": "西施曾捡到走丢的鲁班七号并试图倒卖"}
    ]
}

# 标签映射
tags_map = {
    "yao": ["稷下学院", "武道", "星之队", "剑客", "热血少年"],
    "jing": ["玄雍", "武道", "刺客", "神职者家族"],
    "xishi": ["稷下学院", "魔道", "星之队", "南荒", "探宝者"],
    "mengya": ["稷下学院", "机关", "星之队", "射手", "叛逆少年"],
    "sunbin": ["稷下学院", "机关", "星之队", "辅助", "时空"],
    "laofuzi": ["稷下学院", "武道", "稷下三贤者", "神职者", "院长"],
    "zhuangzhou": ["稷下学院", "魔道", "稷下三贤者", "梦境", "贤者"],
    "mozi": ["稷下学院", "机关", "稷下三贤者", "长安建造者", "和平守护者"],
    "lubandashi": ["稷下学院", "机关", "星之队", "造物主", "科学家"],
    "lianpo": ["稷下学院", "武道", "坦克", "南荒", "不老战神"],
    "zhongwuyan": ["稷下学院", "武道", "人魔混血", "夺宝猎人", "战士"],
    "jixiaoman": ["海都", "武道", "稷下学生", "摸鱼", "隐者"],
    "mengtian": ["玄雍", "武道", "将军", "规则与秩序", "军阵"],
    "jiangziya": ["倒悬天", "魔道", "神职者", "封神者", "太古"],
    "lubanqihao": ["玄雍", "机关", "人造人", "射手", "造物"]
}

# 生成文件
count = 0
for hero_base in heroes_data:
    hero_id = hero_base['id']
    if hero_id in existing_ids:
        print(f'SKIP (exists): {hero_id}.json')
        continue
    
    hero_name = hero_base['name']
    
    # 从文档提取内容
    desc = ""
    lore = ""
    voice = {"move": "", "skill": "", "interaction": "", "function": ""}
    
    if hero_name in hero_sections:
        desc, info, lore, voice = extract_hero_fields(hero_sections[hero_name], hero_id)
    
    hero_json = {
        "id": hero_id,
        "name": hero_name,
        "title": hero_base["title"],
        "alias": hero_base["alias"],
        "faction": hero_base["faction"],
        "factionName": hero_base["factionName"],
        "role": hero_base["role"],
        "difficulty": hero_base["difficulty"],
        "energy": hero_base["energy"],
        "region": hero_base["region"],
        "race": hero_base["race"],
        "city": hero_base["city"],
        "height": hero_base["height"],
        "identity": hero_base["identity"],
        "description": desc if desc else hero_base["title"],
        "lore": lore,
        "relations": relations_map.get(hero_id, []),
        "voiceLines": voice,
        "tags": tags_map.get(hero_id, []),
        "imageUrl": f"/images/heroes/{hero_id}.jpg",
        "avatarUrl": f"/images/heroes/{hero_id}_avatar.jpg",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2026-06-16T00:00:00Z"
    }
    
    filepath = os.path.join(output_dir, f'{hero_id}.json')
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(hero_json, f, ensure_ascii=False, indent=2)
    print(f'Created: {hero_id}.json ({hero_name})')
    count += 1

print(f'\nDone! Created {count} new hero files.')
