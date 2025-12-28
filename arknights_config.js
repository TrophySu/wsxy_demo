// 明日方舟卫戍协议 - 完整干员和羁绊配置
// 基于用户提供的羁绊列表

// 羁绊定义
const ARKNIGHTS_FACTIONS = {
    // 阵营羁绊
    '萨尔贡': { name: '萨尔贡', type: 'region', desc: '萨尔贡干员' },
    '炎国': { name: '炎国', type: 'region', desc: '炎国干员' },
    '维多利亚': { name: '维多利亚', type: 'region', desc: '维多利亚干员' },
    '谢拉格': { name: '谢拉格', type: 'region', desc: '谢拉格干员' },
    '拉特兰': { name: '拉特兰', type: 'region', desc: '拉特兰干员' },
    '阿戈尔': { name: '阿戈尔', type: 'region', desc: '阿戈尔干员' },
    
    // 特性羁绊
    '远见': { name: '远见', type: 'trait', desc: '远见特性' },
    '精准': { name: '精准', type: 'trait', desc: '精准特性' },
    '坚守': { name: '坚守', type: 'trait', desc: '坚守特性' },
    '突袭': { name: '突袭', type: 'trait', desc: '突袭特性' },
    '奇迹': { name: '奇迹', type: 'trait', desc: '奇迹特性' },
    '不屈': { name: '不屈', type: 'trait', desc: '不屈特性' },
    '迅捷': { name: '迅捷', type: 'trait', desc: '迅捷特性' },
    '灵巧': { name: '灵巧', type: 'trait', desc: '灵巧特性' },
    '调和': { name: '调和', type: 'trait', desc: '调和特性' }
};

// 干员配置（1-6阶）
const ARKNIGHTS_OPERATORS = [
    // ===== 1阶干员 =====
    { name: '隐现', star: 1, cost: 1, hp: 120, atk: 30, def: 15, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['拉特兰'], aoe: false },
    { name: '讯使', star: 1, cost: 1, hp: 100, atk: 25, def: 12, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['谢拉格', '不屈'], aoe: false },
    { name: '惊蛰', star: 1, cost: 1, hp: 180, atk: 50, def: 25, range: 4, block: 1, type: 'caster', icon: '✨', factions: ['炎国'], aoe: false },
    { name: '幽灵鲨', star: 1, cost: 1, hp: 150, atk: 40, def: 20, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['阿戈尔'], aoe: false },
    { name: '红豆', star: 1, cost: 1, hp: 110, atk: 20, def: 15, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['不屈'], aoe: false },
    { name: '梅', star: 1, cost: 1, hp: 90, atk: 35, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['维多利亚', '精准'], aoe: false },
    { name: '拉普兰德', star: 1, cost: 1, hp: 160, atk: 45, def: 22, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['维多利亚'], aoe: false },
    { name: '德克萨斯', star: 1, cost: 1, hp: 120, atk: 25, def: 18, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['迅捷'], aoe: false },
    { name: '跃跃', star: 1, cost: 1, hp: 90, atk: 35, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['精准'], aoe: false },
    { name: '蛇屠箱', star: 1, cost: 1, hp: 200, atk: 15, def: 60, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['坚守'], aoe: false },
    { name: '远山', star: 1, cost: 1, hp: 90, atk: 35, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['远见', '奇迹'], aoe: false },
    { name: '狮蝎', star: 1, cost: 1, hp: 180, atk: 50, def: 25, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['萨尔贡', '突袭'], aoe: false },
    { name: '暴行', star: 1, cost: 1, hp: 170, atk: 48, def: 23, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['萨尔贡'], aoe: false },
    { name: '布丁', star: 1, cost: 1, hp: 120, atk: 30, def: 15, range: 4, block: 1, type: 'caster', icon: '✨', factions: ['灵巧'], aoe: false },
    
    // ===== 2阶干员 =====
    { name: '送葬人', star: 2, cost: 2, hp: 130, atk: 65, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['拉特兰', '精准'], aoe: false },
    { name: '赫默', star: 2, cost: 2, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 40, factions: ['远见'], aoe: false },
    { name: '角峰', star: 2, cost: 2, hp: 280, atk: 20, def: 100, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['谢拉格', '坚守'], aoe: false },
    { name: '万顷', star: 2, cost: 2, hp: 150, atk: 40, def: 20, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['炎国'], aoe: false },
    { name: '哈洛德', star: 2, cost: 2, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 40, factions: ['维多利亚', '谢拉格'], aoe: false },
    { name: '莎草', star: 2, cost: 2, hp: 110, atk: 30, def: 15, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['萨尔贡'], aoe: false },
    { name: '深巡', star: 2, cost: 2, hp: 280, atk: 20, def: 100, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['阿戈尔'], aoe: false },
    { name: '暴雨', star: 2, cost: 2, hp: 350, atk: 25, def: 120, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['萨尔贡', '坚守'], aoe: false },
    { name: '宴', star: 2, cost: 2, hp: 150, atk: 40, def: 20, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['突袭'], aoe: false },
    { name: '洛洛', star: 2, cost: 2, hp: 120, atk: 30, def: 15, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['维多利亚', '灵巧'], aoe: false },
    { name: '风丸', star: 2, cost: 2, hp: 150, atk: 40, def: 20, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['奇迹', '不屈'], aoe: false },
    { name: '砾', star: 2, cost: 2, hp: 110, atk: 20, def: 15, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['突袭', '不屈'], aoe: false },
    { name: '锡人', star: 2, cost: 2, hp: 150, atk: 40, def: 20, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['迅捷', '灵巧'], aoe: false },
    { name: '锡兰', star: 2, cost: 2, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 40, factions: ['维多利亚'], aoe: false },
    { name: '芳汀', star: 2, cost: 2, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 40, factions: ['拉特兰'], aoe: false },
    
    // ===== 3阶干员 =====
    { name: '能天使', star: 3, cost: 3, hp: 130, atk: 70, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['拉特兰', '奇迹'], aoe: true },
    { name: '极光', star: 3, cost: 3, hp: 280, atk: 20, def: 100, range: 1, block: 1, type: 'tank', icon: '🛡️', factions: ['谢拉格'], aoe: true },
    { name: '槐琥', star: 3, cost: 3, hp: 110, atk: 20, def: 15, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['炎国', '不屈'], aoe: true },
    { name: '玲琅诗怀雅', star: 3, cost: 3, hp: 110, atk: 50, def: 12, range: 1, block: 1, type: 'specialist', icon: '🎭', factions: ['炎国'], aoe: true },
    { name: '斯卡蒂', star: 3, cost: 3, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['阿戈尔', '坚守', '突袭'], aoe: true },
    { name: '菲莱', star: 3, cost: 3, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 45, factions: ['萨尔贡'], aoe: true },
    { name: '见行者', star: 3, cost: 3, hp: 150, atk: 40, def: 20, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['拉特兰'], aoe: true },
    { name: '海蒂', star: 3, cost: 3, hp: 80, atk: 0, def: 8, range: 3, block: 1, type: 'healer', icon: '💊', healPower: 35, factions: ['维多利亚'], aoe: true },
    { name: '蜜莓', star: 3, cost: 3, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 45, factions: ['维多利亚'], aoe: true },
    { name: '安哲拉', star: 3, cost: 3, hp: 90, atk: 35, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['阿戈尔', '精准'], aoe: true },
    { name: '雪猎', star: 3, cost: 3, hp: 90, atk: 40, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['谢拉格', '精准'], aoe: true },
    { name: '伊桑', star: 3, cost: 3, hp: 100, atk: 25, def: 12, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['炎国'], aoe: true },
    { name: '至简', star: 3, cost: 1, hp: 120, atk: 30, def: 15, range: 4, block: 1, type: 'caster', icon: '✨', factions: ['萨尔贡', '灵巧'], aoe: true },
    { name: '耶拉', star: 3, cost: 3, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 45, factions: ['谢拉格', '远见'], aoe: true },
    
    // ===== 4阶干员 =====
    { name: '信仰搅拌机', star: 4, cost: 4, hp: 380, atk: 30, def: 130, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['拉特兰', '坚守'], aoe: true },
    { name: '菲亚梅塔', star: 4, cost: 4, hp: 110, atk: 65, def: 15, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['拉特兰'], aoe: true },
    { name: '初雪', star: 4, cost: 4, hp: 90, atk: 40, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['谢拉格'], aoe: true },
    { name: '伊内斯', star: 4, cost: 4, hp: 120, atk: 35, def: 18, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['远见', '突袭'], aoe: true },
    { name: '森蚺', star: 4, cost: 4, hp: 120, atk: 0, def: 13, range: 5, block: 1, type: 'healer', icon: '💊', healPower: 55, factions: ['萨尔贡'], aoe: true },
    { name: '寒克', star: 4, cost: 4, hp: 90, atk: 40, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['精准'], aoe: true },
    { name: '风笛', star: 4, cost: 4, hp: 380, atk: 30, def: 130, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['维多利亚', '远见', '不屈'], aoe: true },
    { name: '山', star: 4, cost: 4, hp: 180, atk: 50, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['炎国'], aoe: true },
    { name: '水月', star: 4, cost: 4, hp: 120, atk: 25, def: 18, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['阿戈尔', '迅捷'], aoe: true },
    { name: '忍冬', star: 4, cost: 4, hp: 120, atk: 25, def: 18, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['突袭', '迅捷'], aoe: true },
    { name: '华法琳', star: 4, cost: 4, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 50, factions: ['奇迹'], aoe: true },
    { name: '星源', star: 4, cost: 4, hp: 100, atk: 15, def: 12, range: 4, block: 1, type: 'support', icon: '🔧', factions: ['奇迹'], aoe: true },
    { name: '灵知', star: 4, cost: 4, hp: 120, atk: 30, def: 15, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['谢拉格', '灵巧'], aoe: true },
    { name: '莱恩哈特', star: 4, cost: 4, hp: 130, atk: 70, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['精准', '迅捷'], aoe: true },
    { name: '桑葚', star: 4, cost: 4, hp: 90, atk: 40, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['炎国'], aoe: true },
    { name: '异德', star: 4, cost: 4, hp: 150, atk: 40, def: 20, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['突袭', '灵巧'], aoe: true },
    { name: '煌', star: 4, cost: 4, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['炎国', '维多利亚'], aoe: true },
    { name: '亚叶', star: 4, cost: 4, hp: 100, atk: 0, def: 10, range: 4, block: 1, type: 'healer', icon: '💊', healPower: 50, factions: ['炎国'], aoe: true },
    
    // ===== 5阶干员 =====
    { name: '圣葬', star: 5, cost: 5, hp: 130, atk: 75, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['拉特兰', '远见'], aoe: true },
    { name: '异客', star: 5, cost: 5, hp: 130, atk: 75, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['萨尔贡', '精准'], aoe: true },
    { name: '烛煌', star: 5, cost: 5, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['炎国', '维多利亚'], aoe: true },
    { name: '左乐', star: 5, cost: 5, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['炎国'], aoe: true },
    { name: '乌尔比安', star: 5, cost: 5, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['阿戈尔'], aoe: true },
    { name: '哥蕾蒂娅', star: 5, cost: 5, hp: 100, atk: 15, def: 12, range: 4, block: 1, type: 'support', icon: '🔧', factions: ['阿戈尔'], aoe: true },
    { name: '史尔特尔', star: 5, cost: 5, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['突袭'], aoe: true },
    { name: '异杰西卡', star: 5, cost: 5, hp: 90, atk: 40, def: 10, range: 5, block: 1, type: 'ranged', icon: '🏹', factions: ['维多利亚'], aoe: true },
    { name: '魔王', star: 5, cost: 5, hp: 110, atk: 65, def: 15, range: 5, block: 1, type: 'caster', icon: '✨', factions: ['奇迹'], aoe: true },
    { name: '铃兰', star: 5, cost: 5, hp: 100, atk: 15, def: 12, range: 4, block: 1, type: 'support', icon: '🔧', factions: ['远见'], aoe: true },
    { name: '塞雷亚', star: 5, cost: 5, hp: 380, atk: 30, def: 130, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['坚守'], aoe: true },
    { name: '林', star: 5, cost: 5, hp: 120, atk: 30, def: 15, range: 1, block: 1, type: 'melee', icon: '⚔️', factions: ['炎国', '灵巧'], aoe: true },
    { name: '归鲨', star: 5, cost: 5, hp: 380, atk: 30, def: 130, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['阿戈尔', '不屈'], aoe: true },
    { name: '银灰', star: 5, cost: 5, hp: 180, atk: 55, def: 25, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['谢拉格', '奇迹'], aoe: true },
    { name: '星棘', star: 5, cost: 5, hp: 130, atk: 75, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['奇迹', '迅捷'], aoe: true },
    { name: '白面鸮', star: 5, cost: 5, hp: 120, atk: 0, def: 13, range: 5, block: 1, type: 'healer', icon: '💊', healPower: 60, factions: ['远见'], aoe: true },
    { name: '瑰盐', star: 5, cost: 5, hp: 120, atk: 25, def: 18, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['迅捷'], aoe: true },
    { name: '提丰', star: 5, cost: 5, hp: 130, atk: 75, def: 15, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['精准', '灵巧'], aoe: true },
    
    // ===== 6阶干员 =====
    { name: '蕾缪安', star: 6, cost: 6, hp: 140, atk: 85, def: 18, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['拉特兰', '精准'], aoe: true },
    { name: '锏', star: 6, cost: 6, hp: 130, atk: 30, def: 22, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['谢拉格', '迅捷'], aoe: true },
    { name: '余', star: 6, cost: 6, hp: 450, atk: 35, def: 160, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['炎国', '坚守'], aoe: true },
    { name: '浊蒂', star: 6, cost: 6, hp: 200, atk: 65, def: 30, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['阿戈尔'], aoe: true },
    { name: '娜仁图亚', star: 6, cost: 6, hp: 130, atk: 30, def: 22, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['萨尔贡'], aoe: true },
    { name: '佩佩', star: 6, cost: 6, hp: 130, atk: 30, def: 22, range: 1, block: 2, type: 'vanguard', icon: '🎖️', factions: ['萨尔贡', '不屈'], aoe: true },
    { name: '异推王', star: 6, cost: 6, hp: 130, atk: 40, def: 22, range: 1, block: 0, type: 'specialist', icon: '🎭', factions: ['维多利亚', '奇迹'], aoe: true },
    { name: '澄闪', star: 6, cost: 6, hp: 200, atk: 65, def: 30, range: 2, block: 1, type: 'melee', icon: '⚔️', factions: ['维多利亚'], aoe: true },
    { name: '纯艾', star: 6, cost: 6, hp: 120, atk: 0, def: 15, range: 5, block: 1, type: 'healer', icon: '💊', healPower: 70, factions: ['远见'], aoe: true },
    { name: '死芒', star: 6, cost: 6, hp: 140, atk: 85, def: 18, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['迅捷'], aoe: true },
    { name: '缪尔赛思', star: 6, cost: 6, hp: 110, atk: 18, def: 15, range: 4, block: 1, type: 'support', icon: '🔧', factions: ['调和'], aoe: true },
    { name: '伊芙利特', star: 6, cost: 6, hp: 120, atk: 75, def: 18, range: 5, block: 1, type: 'caster', icon: '✨', factions: ['精准'], aoe: true },
    { name: '新能', star: 6, cost: 6, hp: 140, atk: 85, def: 18, range: 7, block: 1, type: 'ranged', icon: '🏹', factions: ['拉特兰'], aoe: true },
    { name: '流明', star: 6, cost: 6, hp: 120, atk: 0, def: 15, range: 5, block: 1, type: 'healer', icon: '💊', healPower: 70, factions: ['阿戈尔'], aoe: true },
    { name: '淬赫默', star: 6, cost: 6, hp: 120, atk: 0, def: 15, range: 5, block: 1, type: 'healer', icon: '💊', healPower: 70, factions: ['灵巧'], aoe: true },
    { name: '泥岩', star: 6, cost: 6, hp: 450, atk: 35, def: 160, range: 1, block: 3, type: 'tank', icon: '🛡️', factions: ['坚守', '不屈'], aoe: true }
];

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ARKNIGHTS_FACTIONS,
        ARKNIGHTS_OPERATORS
    };
}
