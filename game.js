// ========== 游戏配置 ==========
const CONFIG = {
    GRID_WIDTH: 9,
    GRID_HEIGHT: 4,
    BENCH_SIZE: 12,
    MERGE_COUNT: 3,
    SHOP_REFRESH_COST: 1,
    SELL_PRICE: 1,
    ROUND_GOLD: 3,
    GOLD_PER_ROUND_INCREASE: 1
};

// ========== 干员模板（明日方舟卫戍协议版本） ==========
// 从arknights_config.js导入干员配置
const ARKNIGHTS_OPERATORS_BY_STAR = (() => {
    const byStaroperators = {};
    ARKNIGHTS_OPERATORS.forEach(op => {
        if (!byStaroperators[op.star]) {
            byStaroperators[op.star] = [];
        }
        byStaroperators[op.star].push({ ...op, elite: 0 });
    });
    return byStaroperators;
})();

const OPERATOR_TEMPLATES = ARKNIGHTS_OPERATORS_BY_STAR;

// ========== 羁绊系统 ==========
const FACTION_BONUSES = {
    // 阵营羁绊
    '萨尔贡': {
        3: { 
            name: '沙漠之力', 
            desc: '所有干员生命+15%', 
            bonus: { hpMult: 1.15 } 
        }
    },
    '炎国': {
        3: { 
            name: '炎之力', 
            desc: '所有干员攻击+15%', 
            bonus: { atkMult: 1.15 } 
        }
    },
    '维多利亚': {
        3: { 
            name: '帝国荣耀', 
            desc: '所有干员攻击+12%，防御+12%', 
            bonus: { atkMult: 1.12, defMult: 1.12 } 
        }
    },
    '谢拉格': {
        3: { 
            name: '雪境之力', 
            desc: '所有干员防御+20%', 
            bonus: { defMult: 1.2 } 
        }
    },
    '拉特兰': {
        3: { 
            name: '神圣庇护', 
            desc: '所有干员攻击+18%', 
            bonus: { atkMult: 1.18 } 
        }
    },
    '阿戈尔': {
        3: { 
            name: '深海之力', 
            desc: '近卫攻击+25%，生命+15%', 
            bonus: { meleeBonus: 1.25, hpMult: 1.15 } 
        }
    },
    
    // 特性羁绊
    '远见': {
        3: {
            name: '战术洞察',
            desc: '所有干员攻击范围+1',
            bonus: { rangeBonus: 1 }
        }
    },
    '精准': {
        3: {
            name: '精准打击',
            desc: '狙击攻击+30%',
            bonus: { rangedBonus: 1.3 }
        }
    },
    '坚守': {
        3: {
            name: '坚守阵地',
            desc: '重装防御+35%，生命+20%',
            bonus: { tankDefBonus: 1.35, tankHpBonus: 1.2 }
        }
    },
    '突袭': {
        3: {
            name: '突袭战术',
            desc: '近卫攻击+30%，攻速+15',
            bonus: { meleeBonus: 1.3, attackSpeedBonus: 15 }
        }
    },
    '奇迹': {
        3: {
            name: '奇迹之力',
            desc: '所有干员攻击+20%，生命+10%',
            bonus: { atkMult: 1.2, hpMult: 1.1 }
        }
    },
    '不屈': {
        3: {
            name: '不屈意志',
            desc: '所有干员生命+25%，防御+15%',
            bonus: { hpMult: 1.25, defMult: 1.15 }
        }
    },
    '迅捷': {
        3: {
            name: '迅捷行动',
            desc: '所有干员攻速+20，每20层额外+5',
            bonus: { attackSpeedBonus: 20, attackSpeedPer20: 5 }
        }
    },
    '灵巧': {
        3: {
            name: '灵巧身手',
            desc: '所有干员攻击+15%，防御+10%',
            bonus: { atkMult: 1.15, defMult: 1.1 }
        }
    },
    '调和': {
        3: {
            name: '调和之力',
            desc: '所有干员生命+20%，攻击+10%',
            bonus: { hpMult: 1.2, atkMult: 1.1 }
        }
    }
};

// ========== 敌人类型 ==========
const ENEMY_TYPES = [
    { name: '小兵', hp: 80, atk: 15, def: 5, speed: 1, icon: '👹' },
    { name: '精英兵', hp: 150, atk: 25, def: 15, speed: 0.8, icon: '😈' },
    { name: '重甲兵', hp: 250, atk: 20, def: 50, speed: 0.6, icon: '🛡️' },
    { name: '飞行兵', hp: 100, atk: 30, def: 10, speed: 1.2, icon: '🦅', flying: true },
    { name: '首领', hp: 400, atk: 50, def: 30, speed: 0.5, icon: '👺' }
];

// ========== 游戏状态 ==========
const gameState = {
    round: 1,
    gold: 5,
    maxGold: 5,
    life: 50, // 改为50
    maxLife: 50, // 改为50
    roundLifeLoss: 0, // 当前回合已扣除的生命值
    maxRoundLifeLoss: 10, // 每回合最多扣除10点生命值
    phase: 'prepare',
    shopLevel: 1,
    deployLimit: 6, // 部署上限
    shopFrozen: false, // 商店是否冻结
    bannedFactions: [], // 禁用的羁绊
    roundTimeLimit: 100, // 每回合限时100秒
    roundTimeRemaining: 100, // 剩余时间
    timerInterval: null, // 计时器
    bench: [],
    battlefield: Array(CONFIG.GRID_WIDTH * CONFIG.GRID_HEIGHT).fill(null),
    preBattleOperators: null,
    enemies: [],
    nextWaveEnemies: [],
    map: null,
    selectedOperator: null,
    selectedCell: null,
    battleInterval: null,
    enemyMoveInterval: null,
    showingRange: false,
    rangeDisplay: []
};

// ========== 地图系统 ==========
class GameMap {
    constructor() {
        this.width = CONFIG.GRID_WIDTH;
        this.height = CONFIG.GRID_HEIGHT;
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
        this.spawnPoints = [];
        this.goalPoint = null;
        this.paths = [];
        this.generateMap();
    }
    
    generateMap() {
        // 设置敌方入侵点（右上角和右下角）
        this.spawnPoints = [
            { x: this.width - 1, y: 0 },
            { x: this.width - 1, y: this.height - 1 }
        ];
        
        // 设置我方保护点（左下角）
        this.goalPoint = { x: 0, y: this.height - 1 };
        
        // 先生成路径确保可达
        this.spawnPoints.forEach(spawn => {
            const path = this.generatePath(spawn, this.goalPoint);
            this.paths.push(path);
        });
        
        // 添加随机障碍物，但不能阻挡路径
        let attempts = 0;
        let obstaclesPlaced = 0;
        const maxObstacles = 6;
        
        while (obstaclesPlaced < maxObstacles && attempts < 50) {
            attempts++;
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            
            // 检查是否是特殊位置
            if (this.spawnPoints.some(p => p.x === x && p.y === y) ||
                (this.goalPoint.x === x && this.goalPoint.y === y) ||
                this.grid[y][x] === 2) {
                continue;
            }
            
            // 临时放置障碍物
            this.grid[y][x] = 2;
            
            // 检查所有入侵点是否仍能到达保护点
            let allPathsValid = true;
            for (let spawn of this.spawnPoints) {
                const testPath = this.generatePath(spawn, this.goalPoint);
                if (testPath.length === 0 || testPath.length > this.width * this.height) {
                    allPathsValid = false;
                    break;
                }
            }
            
            if (allPathsValid) {
                obstaclesPlaced++;
                // 重新生成路径
                this.paths = [];
                this.spawnPoints.forEach(spawn => {
                    const path = this.generatePath(spawn, this.goalPoint);
                    this.paths.push(path);
                });
            } else {
                // 移除障碍物
                this.grid[y][x] = 0;
            }
        }
    }

    generatePath(start, goal) {
        // A*寻路算法，避开障碍物
        const openSet = [{ ...start, g: 0, h: this.heuristic(start, goal), f: 0, parent: null }];
        const closedSet = new Set();
        
        while (openSet.length > 0) {
            // 找到f值最小的节点
            openSet.sort((a, b) => a.f - b.f);
            const current = openSet.shift();
            
            // 到达目标
            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(current);
            }
            
            closedSet.add(`${current.x},${current.y}`);
            
            // 检查四个方向的邻居
            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];
            
            for (let neighbor of neighbors) {
                // 检查边界
                if (neighbor.x < 0 || neighbor.x >= this.width || 
                    neighbor.y < 0 || neighbor.y >= this.height) {
                    continue;
                }
                
                // 检查障碍物
                if (this.grid[neighbor.y][neighbor.x] === 2) {
                    continue;
                }
                
                const key = `${neighbor.x},${neighbor.y}`;
                if (closedSet.has(key)) {
                    continue;
                }
                
                const g = current.g + 1;
                const h = this.heuristic(neighbor, goal);
                const f = g + h;
                
                const existing = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (!existing) {
                    openSet.push({ ...neighbor, g, h, f, parent: current });
                } else if (g < existing.g) {
                    existing.g = g;
                    existing.f = f;
                    existing.parent = current;
                }
            }
        }
        
        // 如果找不到路径，返回直线路径（不应该发生）
        return this.generateStraightPath(start, goal);
    }
    
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    reconstructPath(node) {
        const path = [];
        let current = node;
        while (current) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }
        return path;
    }
    
    generateStraightPath(start, goal) {
        const path = [];
        let current = { ...start };
        
        while (current.x !== goal.x || current.y !== goal.y) {
            path.push({ ...current });
            
            const dx = goal.x - current.x;
            const dy = goal.y - current.y;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                current.x += dx > 0 ? 1 : -1;
            } else {
                current.y += dy > 0 ? 1 : -1;
            }
        }
        
        path.push({ ...goal });
        return path;
    }
    
    isDeployable(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }
    
    isObstacle(x, y) {
        return this.grid[y] && this.grid[y][x] === 2;
    }
    
    getPathForPosition(x, y) {
        // 根据出生点找到对应的路径
        for (let i = 0; i < this.spawnPoints.length; i++) {
            const spawn = this.spawnPoints[i];
            if (spawn.x === x && spawn.y === y) {
                return this.paths[i];
            }
        }
        // 如果不是出生点，返回第一条路径
        return this.paths[0];
    }
}

// ========== 初始化游戏 ==========
function initGame() {
    gameState.map = new GameMap();
    createBattlefield();
    createBench();
    refreshShop();
    generateNextWave();
    updateUI();
    updateFactionDisplay(); // 初始化时更新羁绊显示
    
    document.getElementById('start-battle').addEventListener('click', startBattle);
    document.getElementById('refresh-shop').addEventListener('click', () => {
        if (gameState.gold >= CONFIG.SHOP_REFRESH_COST) {
            gameState.gold -= CONFIG.SHOP_REFRESH_COST;
            refreshShop();
            updateUI();
        }
    });
    document.getElementById('freeze-shop').addEventListener('click', toggleFreezeShop);
    document.getElementById('upgrade-shop').addEventListener('click', upgradeShop);
    document.getElementById('show-next-wave').addEventListener('click', showNextWave);
    
    // 羁绊详情按钮
    const factionDetailBtn = document.getElementById('show-faction-details');
    if (factionDetailBtn) {
        factionDetailBtn.addEventListener('click', displayFactionBonuses);
    }
    
    // 查看禁用羁绊按钮
    const bannedFactionsBtn = document.getElementById('show-banned-factions');
    if (bannedFactionsBtn) {
        bannedFactionsBtn.addEventListener('click', showBannedFactions);
    }
    
    // 初始化计时器显示（但不启动倒计时）
    gameState.roundTimeRemaining = gameState.roundTimeLimit;
    updateUI();
}

// 冻结/解冻商店
function toggleFreezeShop() {
    gameState.shopFrozen = !gameState.shopFrozen;
    const btn = document.getElementById('freeze-shop');
    if (gameState.shopFrozen) {
        btn.classList.add('frozen');
        btn.textContent = '🔓 解冻仓库';
    } else {
        btn.classList.remove('frozen');
        btn.textContent = '❄️ 冻结仓库';
    }
}

// 游戏开始界面
function showStartScreen() {
    const startBtn = document.getElementById('start-game-btn');
    startBtn.addEventListener('click', () => {
        // 禁用按钮，防止重复点击
        startBtn.disabled = true;
        startBtn.textContent = '正在加载...';
        
        // 随机选择5个羁绊禁用
        const allFactions = Object.keys(ARKNIGHTS_FACTIONS);
        const numBanned = 5; // 改为5个
        const banned = [];
        
        while (banned.length < numBanned) {
            const randomFaction = allFactions[Math.floor(Math.random() * allFactions.length)];
            if (!banned.includes(randomFaction)) {
                banned.push(randomFaction);
            }
        }
        
        gameState.bannedFactions = banned;
        
        // 显示禁用羁绊
        const bannedDisplay = document.getElementById('banned-factions-display');
        const bannedList = document.getElementById('banned-factions-list');
        bannedDisplay.style.display = 'block';
        bannedList.innerHTML = banned.map(f => 
            `<span class="banned-faction-tag">${f}</span>`
        ).join('');
        
        // 2秒后开始游戏
        setTimeout(() => {
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            initGame();
        }, 2000);
    }, { once: true }); // 添加once选项，确保只触发一次
}

// 页面加载时显示开始界面
window.addEventListener('DOMContentLoaded', showStartScreen);

// ========== 创建战场 ==========
function createBattlefield() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            const cell = document.createElement('div');
            const index = y * CONFIG.GRID_WIDTH + x;
            cell.className = 'grid-cell';
            cell.dataset.index = index;
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // 根据地图类型设置样式
            if (gameState.map.isObstacle(x, y)) {
                cell.classList.add('obstacle');
                cell.innerHTML = '<div class="obstacle-icon">🗿</div>';
            }
            
            // 标记入侵点和保护点
            if (gameState.map.spawnPoints.some(p => p.x === x && p.y === y)) {
                cell.classList.add('spawn-point');
                cell.innerHTML = '<div class="spawn-icon">🚪</div>';
            }
            if (gameState.map.goalPoint.x === x && gameState.map.goalPoint.y === y) {
                cell.classList.add('goal-point');
                cell.innerHTML = '<div class="goal-icon">🏠</div>';
            }
            
            cell.addEventListener('click', () => handleCellClick(index, x, y));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleCellRightClick(index);
            });
            cell.addEventListener('dragover', (e) => e.preventDefault());
            cell.addEventListener('drop', (e) => handleDrop(e, index, x, y));
            
            grid.appendChild(cell);
        }
    }
}

// ========== 创建备战区 ==========
function createBench() {
    const bench = document.getElementById('bench');
    bench.innerHTML = '';
    
    for (let i = 0; i < CONFIG.BENCH_SIZE; i++) {
        const slot = document.createElement('div');
        slot.className = 'bench-slot';
        slot.dataset.index = i;
        bench.appendChild(slot);
    }
    updateBench();
}

// ========== 商店系统 ==========
function refreshShop() {
    const shop = document.getElementById('shop');
    shop.innerHTML = '';
    
    // 获取场上所有干员（地图+备战区）
    const allOperators = [...gameState.bench, ...gameState.battlefield.filter(op => op !== null)];
    
    // 获取所有可用的干员（至少有一个羁绊不在禁用列表中）
    const availableOperators = ARKNIGHTS_OPERATORS.filter(op => {
        // 如果干员的所有羁绊都被禁用，则不可用
        return op.factions.some(f => !gameState.bannedFactions.includes(f));
    });
    
    if (availableOperators.length === 0) {
        // 如果没有可用干员，显示提示
        shop.innerHTML = '<div style="text-align:center;padding:20px;color:#ff6b6b;">暂无可用干员</div>';
        return;
    }
    
    for (let i = 0; i < 5; i++) {
        let operator = null;
        let attempts = 0;
        
        // 尝试生成不在禁用羁绊中的干员
        while (attempts < 100 && !operator) {
            const star = getRandomStarByShopLevel();
            
            // 从可用干员中筛选对应星级的干员
            const starOperators = availableOperators.filter(op => op.star === star);
            
            if (starOperators.length > 0) {
                const template = starOperators[Math.floor(Math.random() * starOperators.length)];
                // 确保模板有elite字段
                operator = createOperator({ ...template, elite: 0 });
                break;
            }
            
            attempts++;
        }
        
        // 如果还是找不到，从所有可用干员中随机选一个
        if (!operator && availableOperators.length > 0) {
            const template = availableOperators[Math.floor(Math.random() * availableOperators.length)];
            // 确保模板有elite字段
            operator = createOperator({ ...template, elite: 0 });
        }
        
        if (!operator) continue; // 如果还是找不到，跳过
        
        // 检查是否可以合成（场上有同名同精英等级的干员）
        const canMerge = allOperators.some(op => 
            op.name === operator.name && op.elite === operator.elite
        );
        
        const card = createOperatorCard(operator, canMerge);
        card.addEventListener('click', () => buyOperator(operator, card));
        
        shop.appendChild(card);
    }
}

// 更新商店中干员的闪烁状态（不重新生成干员）
function updateShopGlow() {
    const shop = document.getElementById('shop');
    const shopCards = shop.querySelectorAll('.operator-card');
    
    // 获取场上所有干员（地图+备战区）
    const allOperators = [...gameState.bench, ...gameState.battlefield.filter(op => op !== null)];
    
    console.log('更新商店闪烁，场上干员:', allOperators.map(op => `${op.name}(精${op.elite})`));
    
    shopCards.forEach(card => {
        const operatorName = card.dataset.name;
        const operatorElite = parseInt(card.dataset.elite);
        
        // 检查是否可以合成
        const canMerge = allOperators.some(op => 
            op.name === operatorName && op.elite === operatorElite
        );
        
        console.log(`商店干员: ${operatorName}(精${operatorElite}), 可合成: ${canMerge}`);
        
        if (canMerge) {
            card.classList.add('can-merge');
        } else {
            card.classList.remove('can-merge');
        }
    });
}

function getRandomStarByShopLevel() {
    const rand = Math.random() * 100;
    const level = gameState.shopLevel;
    
    if (level === 1) {
        if (rand < 60) return 1;
        if (rand < 95) return 2;
        return 3;
    } else if (level === 2) {
        if (rand < 40) return 1;
        if (rand < 70) return 2;
        if (rand < 95) return 3;
        return 4;
    } else if (level === 3) {
        if (rand < 20) return 2;
        if (rand < 50) return 3;
        if (rand < 85) return 4;
        return 5;
    } else if (level === 4) {
        if (rand < 30) return 3;
        if (rand < 65) return 4;
        return 5;
    } else {
        if (rand < 40) return 4;
        return 5;
    }
}

function upgradeShop() {
    const cost = gameState.shopLevel * 5;
    if (gameState.gold >= cost && gameState.shopLevel < 5) {
        gameState.gold -= cost;
        gameState.shopLevel++;
        // 商店升级时增加部署上限
        gameState.deployLimit = 6 + gameState.shopLevel;
        updateUI();
        alert(`🎉 商店升级到 ${gameState.shopLevel} 级！\n部署上限提升至 ${gameState.deployLimit} 个干员`);
    } else if (gameState.shopLevel >= 5) {
        alert('商店已达到最高等级！');
    }
}

// ========== 干员系统 ==========
function createOperator(template) {
    const operator = {
        id: Date.now() + Math.random(),
        ...JSON.parse(JSON.stringify(template)),
        maxHp: template.hp,
        currentHp: template.hp,
        direction: 'right' // 默认朝向：上下左右 (up, down, left, right)
    };
    
    // 确保elite字段存在
    if (operator.elite === undefined) {
        operator.elite = 0;
    }
    
    return operator;
}

// 根据职业类型获取攻击范围形状
function getAttackRangeByType(type) {
    // 先锋与近卫：1*2
    if (type === 'vanguard' || type === 'melee') {
        return { width: 1, height: 2 };
    }
    // 重装：1*1
    else if (type === 'tank') {
        return { width: 1, height: 1 };
    }
    // 射手、术士、医疗、特种：3*4
    else if (type === 'ranged' || type === 'caster' || type === 'healer' || type === 'specialist' || type === 'support') {
        return { width: 3, height: 4 };
    }
    // 默认
    return { width: 1, height: 1 };
}

// 根据朝向和范围形状计算实际攻击范围格子（从身后一格开始）
function calculateAttackRange(opX, opY, direction, rangeShape) {
    const cells = [];
    const { width, height } = rangeShape;
    
    // 根据朝向旋转范围，从身后一格开始计算
    if (direction === 'right') {
        // 向右：从身后（左侧）一格开始
        for (let dx = -1; dx < height; dx++) {
            for (let dy = -Math.floor(width / 2); dy <= Math.floor(width / 2); dy++) {
                const x = opX + dx;
                const y = opY + dy;
                if (x >= 0 && x < CONFIG.GRID_WIDTH && y >= 0 && y < CONFIG.GRID_HEIGHT) {
                    cells.push({ x, y });
                }
            }
        }
    } else if (direction === 'left') {
        // 向左：从身后（右侧）一格开始
        for (let dx = 1; dx > -height; dx--) {
            for (let dy = -Math.floor(width / 2); dy <= Math.floor(width / 2); dy++) {
                const x = opX + dx;
                const y = opY + dy;
                if (x >= 0 && x < CONFIG.GRID_WIDTH && y >= 0 && y < CONFIG.GRID_HEIGHT) {
                    cells.push({ x, y });
                }
            }
        }
    } else if (direction === 'up') {
        // 向上：从身后（下方）一格开始
        for (let dy = 1; dy > -height; dy--) {
            for (let dx = -Math.floor(width / 2); dx <= Math.floor(width / 2); dx++) {
                const x = opX + dx;
                const y = opY + dy;
                if (x >= 0 && x < CONFIG.GRID_WIDTH && y >= 0 && y < CONFIG.GRID_HEIGHT) {
                    cells.push({ x, y });
                }
            }
        }
    } else if (direction === 'down') {
        // 向下：从身后（上方）一格开始
        for (let dy = -1; dy < height; dy++) {
            for (let dx = -Math.floor(width / 2); dx <= Math.floor(width / 2); dx++) {
                const x = opX + dx;
                const y = opY + dy;
                if (x >= 0 && x < CONFIG.GRID_WIDTH && y >= 0 && y < CONFIG.GRID_HEIGHT) {
                    cells.push({ x, y });
                }
            }
        }
    }
    
    return cells;
}

function createOperatorCard(operator, canMerge = false) {
    const card = document.createElement('div');
    card.className = 'operator-card';
    if (canMerge) {
        card.classList.add('can-merge'); // 添加闪烁效果
    }
    card.draggable = true;
    card.dataset.operatorId = operator.id;
    card.dataset.type = operator.type;
    card.dataset.name = operator.name;
    card.dataset.elite = operator.elite;
    
    const stars = '⭐'.repeat(operator.star);
    const eliteText = operator.elite === 2 ? ' 精二' : operator.elite === 1 ? ' 精一' : '';
    
    // 获取羁绊信息
    let factionsText = '';
    if (operator.factions && operator.factions.length > 0) {
        factionsText = operator.factions.join(' | ');
    }
    
    // 获取羁绊叠加概率
    let stackProbText = '';
    if (operator.star >= 3) {
        let probability = 0;
        if (operator.star === 3) probability = 25;
        else if (operator.star === 4) probability = 40;
        else if (operator.star === 5) probability = 50;
        stackProbText = `叠加概率 ${probability}%`;
    } else {
        stackProbText = '不可叠加';
    }
    
    card.innerHTML = `
        <div class="operator-name">${operator.icon} ${operator.name}${eliteText}</div>
        <div class="operator-stars">${stars}</div>
        <div class="operator-factions">🤝 ${factionsText}</div>
        <div class="operator-stack-method">${stackProbText}</div>
        <div class="operator-cost">💰 ${operator.cost}</div>
        <div class="operator-stats">
            ❤️ ${operator.hp} | ⚔️ ${operator.atk}<br>
            🛡️ ${operator.def} | 📏 ${operator.range}<br>
            🚧 阻挡: ${operator.block}
        </div>
    `;
    
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('operatorId', operator.id);
        e.dataTransfer.setData('fromBench', 'true');
    });
    
    return card;
}

function buyOperator(operator, card) {
    if (gameState.phase !== 'prepare') return; // 战斗中不能购买
    if (gameState.gold >= operator.cost && gameState.bench.length < CONFIG.BENCH_SIZE) {
        gameState.gold -= operator.cost;
        gameState.bench.push(operator);
        card.remove();
        updateBench();
        checkMerge();
        updateUI();
        updateFactionDisplay(); // 购买干员后更新羁绊显示
        updateShopGlow(); // 更新商店闪烁状态
    }
}

// ========== 合成系统 ==========
function checkMerge() {
    const allOperators = [...gameState.bench, ...gameState.battlefield.filter(op => op !== null)];
    const operatorGroups = {};
    
    allOperators.forEach(op => {
        const key = `${op.name}_${op.elite}`;
        if (!operatorGroups[key]) {
            operatorGroups[key] = [];
        }
        operatorGroups[key].push(op);
    });
    
    console.log('检查合成:', operatorGroups); // 调试信息
    console.log('所有干员:', allOperators.map(op => `${op.name}(精${op.elite})`)); // 调试信息
    
    for (let key in operatorGroups) {
        const group = operatorGroups[key];
        if (group.length >= CONFIG.MERGE_COUNT) {
            const [name, elite] = key.split('_');
            const eliteLevel = parseInt(elite);
            
            console.log(`发现可合成: ${name} (精${eliteLevel}) x${group.length}`); // 调试信息
            
            if (eliteLevel < 2) {
                mergeOperators(group.slice(0, CONFIG.MERGE_COUNT), eliteLevel + 1);
                return checkMerge();
            } else {
                console.log(`${name} 已达到精二，无法继续合成`);
            }
        }
    }
}

function mergeOperators(operators, newElite) {
    const template = operators[0];
    const newOperator = createOperator({
        ...template,
        elite: newElite,
        hp: Math.floor(template.hp * (1 + newElite * 0.5)),
        atk: Math.floor(template.atk * (1 + newElite * 0.5)),
        def: Math.floor(template.def * (1 + newElite * 0.5)),
        healPower: template.healPower ? Math.floor(template.healPower * (1 + newElite * 0.5)) : undefined
    });
    
    operators.forEach(op => {
        const benchIndex = gameState.bench.findIndex(b => b.id === op.id);
        if (benchIndex !== -1) {
            gameState.bench.splice(benchIndex, 1);
        } else {
            const fieldIndex = gameState.battlefield.findIndex(b => b && b.id === op.id);
            if (fieldIndex !== -1) {
                gameState.battlefield[fieldIndex] = null;
            }
        }
    });
    
    gameState.bench.push(newOperator);
    
    // 合成奖励：赠送一个高于当前商店等级一星的随机干员
    const bonusStar = Math.min(6, gameState.shopLevel + 1);
    const bonusTemplates = OPERATOR_TEMPLATES[bonusStar];
    if (bonusTemplates && bonusTemplates.length > 0 && gameState.bench.length < CONFIG.BENCH_SIZE) {
        const bonusTemplate = bonusTemplates[Math.floor(Math.random() * bonusTemplates.length)];
        const bonusOperator = createOperator(bonusTemplate);
        gameState.bench.push(bonusOperator);
        alert(`✨ ${newOperator.name} 合成为精${newElite === 1 ? '一' : '二'}！\n🎁 合成奖励：获得 ${bonusStar}阶干员 ${bonusOperator.name}！`);
    } else {
        alert(`✨ ${newOperator.name} 合成为精${newElite === 1 ? '一' : '二'}！`);
    }
    
    updateBench();
    updateBattlefield();
    updateFactionDisplay(); // 合成干员后更新羁绊显示
    updateShopGlow(); // 更新商店闪烁状态
}

// ========== 备战区更新 ==========
function updateBench() {
    const benchEl = document.getElementById('bench');
    const slots = benchEl.querySelectorAll('.bench-slot');
    
    slots.forEach((slot, i) => {
        slot.innerHTML = '';
        slot.className = 'bench-slot';
        
        if (i < gameState.bench.length) {
            const operator = gameState.bench[i];
            const card = createOperatorCard(operator);
            
            card.addEventListener('click', (e) => {
                if (e.ctrlKey) {
                    sellOperator(i);
                } else {
                    selectOperatorFromBench(i);
                }
            });
            
            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                sellOperator(i);
            });
            
            slot.appendChild(card);
        } else {
            slot.innerHTML = '<div class="empty-slot">空位</div>';
        }
    });
}

function selectOperatorFromBench(index) {
    gameState.selectedOperator = index;
    updateBench();
}

function sellOperator(index) {
    if (gameState.phase !== 'prepare') return; // 战斗中不能卖出
    if (index < gameState.bench.length) {
        gameState.bench.splice(index, 1);
        gameState.gold += CONFIG.SELL_PRICE;
        updateBench();
        updateUI();
        updateFactionDisplay(); // 卖出干员后更新羁绊显示
        updateShopGlow(); // 更新商店闪烁状态
    }
}

// ========== 战场交互 ==========
function handleCellClick(index, x, y) {
    if (gameState.phase !== 'prepare') return; // 战斗中不能操作
    
    const operator = gameState.battlefield[index];
    
    if (operator) {
        // 点击已部署的干员
        if (gameState.showingRange && gameState.selectedCell === index) {
            // 再次点击取消显示范围
            gameState.showingRange = false;
            gameState.selectedCell = null;
            clearRangeDisplay();
        } else {
            // 显示攻击范围
            gameState.showingRange = true;
            gameState.selectedCell = index;
            showOperatorRange(operator, x, y);
        }
    } else if (gameState.selectedOperator !== null && gameState.map.isDeployable(x, y)) {
        // 从备战区部署干员
        const deployedCount = gameState.battlefield.filter(op => op !== null).length;
        if (deployedCount >= gameState.deployLimit) {
            alert(`⚠️ 已达到部署上限！当前上限：${gameState.deployLimit}个干员\n升级商店可提升部署上限`);
            return;
        }
        
        const op = gameState.bench.splice(gameState.selectedOperator, 1)[0];
        gameState.battlefield[index] = op;
        gameState.selectedOperator = null;
        updateBench();
        updateBattlefield();
        checkMerge();
        updateFactionDisplay();
        updateShopGlow(); // 更新商店闪烁状态
    } else if (gameState.selectedCell !== null && gameState.map.isDeployable(x, y)) {
        // 从战场移动干员到另一位置
        const sourceOp = gameState.battlefield[gameState.selectedCell];
        if (sourceOp && !operator) {
            gameState.battlefield[index] = sourceOp;
            gameState.battlefield[gameState.selectedCell] = null;
            gameState.selectedCell = null;
            gameState.showingRange = false;
            clearRangeDisplay();
            updateBattlefield();
            updateFactionDisplay();
            updateShopGlow(); // 更新商店闪烁状态
        }
    }
}

// 右键点击战场格子，切换干员朝向或返回备战区
function handleCellRightClick(index) {
    if (gameState.phase !== 'prepare') return; // 战斗中不能操作
    
    const operator = gameState.battlefield[index];
    if (operator) {
        // 如果按住Shift，返回备战区
        if (event.shiftKey && gameState.bench.length < CONFIG.BENCH_SIZE) {
            gameState.battlefield[index] = null;
            gameState.bench.push(operator);
            gameState.showingRange = false;
            gameState.selectedCell = null;
            clearRangeDisplay();
            updateBench();
            updateBattlefield();
            updateFactionDisplay();
            updateShopGlow(); // 更新商店闪烁状态
        } else {
            // 否则切换朝向
            const directions = ['right', 'down', 'left', 'up'];
            const currentIndex = directions.indexOf(operator.direction);
            operator.direction = directions[(currentIndex + 1) % 4];
            
            // 更新攻击范围显示
            const x = index % CONFIG.GRID_WIDTH;
            const y = Math.floor(index / CONFIG.GRID_WIDTH);
            if (gameState.showingRange && gameState.selectedCell === index) {
                showOperatorRange(operator, x, y);
            }
            
            updateBattlefield();
        }
    }
}

function handleDrop(e, index, x, y) {
    e.preventDefault();
    if (gameState.phase !== 'prepare') return; // 战斗中不能操作
    
    const operatorId = e.dataTransfer.getData('operatorId');
    const fromBench = e.dataTransfer.getData('fromBench') === 'true';
    
    if (fromBench) {
        const benchIndex = gameState.bench.findIndex(op => op.id == operatorId);
        if (benchIndex !== -1 && gameState.map.isDeployable(x, y) && !gameState.battlefield[index]) {
            // 检查部署上限
            const deployedCount = gameState.battlefield.filter(op => op !== null).length;
            if (deployedCount >= gameState.deployLimit) {
                alert(`⚠️ 已达到部署上限！当前上限：${gameState.deployLimit}个干员\n升级商店可提升部署上限`);
                return;
            }
            
            const operator = gameState.bench.splice(benchIndex, 1)[0];
            gameState.battlefield[index] = operator;
            updateBench();
            updateBattlefield();
            checkMerge();
            updateFactionDisplay(); // 部署干员后更新羁绊显示
            updateShopGlow(); // 更新商店闪烁状态
        }
    } else {
        // 从战场拖回备战区
        const fieldIndex = gameState.battlefield.findIndex(op => op && op.id == operatorId);
        if (fieldIndex !== -1 && gameState.bench.length < CONFIG.BENCH_SIZE) {
            const operator = gameState.battlefield[fieldIndex];
            gameState.battlefield[fieldIndex] = null;
            gameState.bench.push(operator);
            updateBench();
            updateBattlefield();
            updateFactionDisplay(); // 撤回干员后更新羁绊显示
            updateShopGlow(); // 更新商店闪烁状态
        }
    }
}

// ========== 攻击范围显示 ==========
function showOperatorRange(operator, opX, opY) {
    clearRangeDisplay();
    const rangeShape = getAttackRangeByType(operator.type);
    const rangeCells = calculateAttackRange(opX, opY, operator.direction, rangeShape);
    
    rangeCells.forEach(cell => {
        const index = cell.y * CONFIG.GRID_WIDTH + cell.x;
        const cellEl = document.querySelector(`[data-index="${index}"]`);
        if (cellEl) {
            cellEl.classList.add('in-range');
            gameState.rangeDisplay.push(index);
        }
    });
}

function clearRangeDisplay() {
    gameState.rangeDisplay.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.classList.remove('in-range');
        }
    });
    gameState.rangeDisplay = [];
}

// ========== 战场更新 ==========
function updateBattlefield() {
    const cells = document.querySelectorAll('.grid-cell');
    
    // 先清除所有敌人和干员显示（保留地图元素）
    cells.forEach((cell, index) => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        const isSpawn = gameState.map.spawnPoints.some(p => p.x === x && p.y === y);
        const isGoal = gameState.map.goalPoint.x === x && gameState.map.goalPoint.y === y;
        const isObstacle = gameState.map.isObstacle(x, y);
        
        // 移除旧的干员和敌人
        cell.classList.remove('occupied', 'enemy');
        const oldOp = cell.querySelector('.operator-on-field');
        const oldEnemy = cell.querySelector('.enemy-on-field');
        if (oldOp) oldOp.remove();
        if (oldEnemy) oldEnemy.remove();
        
        // 保留地图标记
        if (isObstacle && !cell.querySelector('.obstacle-icon')) {
            cell.innerHTML = '<div class="obstacle-icon">🗿</div>';
        } else if (isSpawn && !cell.querySelector('.spawn-icon')) {
            cell.innerHTML = '<div class="spawn-icon">🚪</div>';
        } else if (isGoal && !cell.querySelector('.goal-icon')) {
            cell.innerHTML = '<div class="goal-icon">🏠</div>';
        }
    });
    
    // 显示干员
    gameState.battlefield.forEach((operator, index) => {
        if (!operator) return;
        
        const cell = cells[index];
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        const isSpawn = gameState.map.spawnPoints.some(p => p.x === x && p.y === y);
        const isGoal = gameState.map.goalPoint.x === x && gameState.map.goalPoint.y === y;
        const isObstacle = gameState.map.isObstacle(x, y);
        
        if (!isSpawn && !isGoal && !isObstacle) {
            const hpPercent = (operator.currentHp / operator.maxHp) * 100;
            const eliteText = operator.elite === 2 ? '★★' : operator.elite === 1 ? '★' : '';
            const blockInfo = operator.blockingCount !== undefined ? `${operator.blockingCount}/${operator.block}` : '';
            
            // 朝向箭头
            const directionArrows = {
                'up': '↑',
                'down': '↓',
                'left': '←',
                'right': '→'
            };
            const directionArrow = directionArrows[operator.direction] || '→';
            
            const opDiv = document.createElement('div');
            opDiv.className = 'operator-on-field';
            opDiv.draggable = true;
            opDiv.dataset.operatorId = operator.id;
            
            opDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('operatorId', operator.id);
                e.dataTransfer.setData('fromBench', 'false');
            });
            
            opDiv.innerHTML = `
                <div class="name">${operator.icon}${eliteText} ${directionArrow}</div>
                ${blockInfo ? `<div class="block-info">${blockInfo}</div>` : ''}
                <div class="hp-bar">
                    <div class="hp-fill" style="width: ${hpPercent}%"></div>
                </div>
            `;
            cell.appendChild(opDiv);
            cell.classList.add('occupied');
        }
    });
    
    // 显示敌人（只显示当前位置，支持重叠显示）
    const enemyPositions = {};
    gameState.enemies.forEach(enemy => {
        const key = `${enemy.x},${enemy.y}`;
        if (!enemyPositions[key]) {
            enemyPositions[key] = [];
        }
        enemyPositions[key].push(enemy);
    });
    
    for (let key in enemyPositions) {
        const enemies = enemyPositions[key];
        const [x, y] = key.split(',').map(Number);
        const index = y * CONFIG.GRID_WIDTH + x;
        const cell = cells[index];
        
        if (cell) {
            // 显示第一个敌人的信息和数量
            const firstEnemy = enemies[0];
            const hpPercent = (firstEnemy.hp / firstEnemy.maxHp) * 100;
            const enemyDiv = document.createElement('div');
            enemyDiv.className = 'enemy-on-field';
            enemyDiv.innerHTML = `
                <div class="name">${firstEnemy.icon}${enemies.length > 1 ? ` x${enemies.length}` : ''}</div>
                <div class="hp-bar">
                    <div class="hp-fill enemy-hp" style="width: ${hpPercent}%"></div>
                </div>
                <div class="hp-text">${Math.ceil(firstEnemy.hp)}/${firstEnemy.maxHp}</div>
            `;
            cell.appendChild(enemyDiv);
            cell.classList.add('enemy');
        }
    }
}

// ========== 敌人系统 ==========
function generateNextWave() {
    const round = gameState.round;
    const enemyCount = 5 + round * 2;
    gameState.nextWaveEnemies = [];
    
    for (let i = 0; i < enemyCount; i++) {
        const typeIndex = Math.min(Math.floor(round / 3), ENEMY_TYPES.length - 1);
        const possibleTypes = ENEMY_TYPES.slice(0, typeIndex + 1);
        const type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
        
        const spawnPoint = gameState.map.spawnPoints[i % gameState.map.spawnPoints.length];
        
        gameState.nextWaveEnemies.push({
            ...type,
            hp: Math.floor(type.hp * (1 + round * 0.3)),
            maxHp: Math.floor(type.hp * (1 + round * 0.3)),
            atk: Math.floor(type.atk * (1 + round * 0.2)),
            spawnPoint: spawnPoint
        });
    }
}

function showNextWave() {
    let info = `下一波敌人 (第${gameState.round}回合):\n\n`;
    const enemyCount = {};
    
    gameState.nextWaveEnemies.forEach(enemy => {
        const key = enemy.name;
        if (!enemyCount[key]) {
            enemyCount[key] = { count: 0, enemy: enemy };
        }
        enemyCount[key].count++;
    });
    
    for (let key in enemyCount) {
        const { count, enemy } = enemyCount[key];
        info += `${enemy.icon} ${enemy.name} x${count}\n`;
        info += `  HP: ${enemy.hp} | 攻击: ${enemy.atk} | 防御: ${enemy.def}\n\n`;
    }
    
    alert(info);
}

function spawnEnemies() {
    gameState.enemies = [];
    
    gameState.nextWaveEnemies.forEach((enemyTemplate, i) => {
        // 前3回合，右上角入侵点（第一个入侵点）不刷新敌人
        if (gameState.round <= 3 && enemyTemplate.spawnPoint === gameState.map.spawnPoints[0]) {
            return; // 跳过右上角的敌人
        }
        
        setTimeout(() => {
            const enemy = {
                id: Date.now() + Math.random(),
                ...enemyTemplate,
                x: enemyTemplate.spawnPoint.x,
                y: enemyTemplate.spawnPoint.y,
                path: gameState.map.getPathForPosition(enemyTemplate.spawnPoint.x, enemyTemplate.spawnPoint.y),
                pathIndex: 0,
                moveTimer: 0
            };
            gameState.enemies.push(enemy);
            updateBattlefield();
        }, i * 500);
    });
}

// ========== 战斗系统 ==========
function startBattle() {
    if (gameState.phase === 'battle') return;
    
    gameState.phase = 'battle';
    document.getElementById('start-battle').disabled = true;
    
    // 重置回合生命值损失计数
    gameState.roundLifeLoss = 0;
    
    // 开始战斗阶段计时器（100秒限时）
    startRoundTimer();
    
    // 禁用操作按钮
    document.getElementById('refresh-shop').disabled = true;
    document.getElementById('upgrade-shop').disabled = true;
    
    clearRangeDisplay();
    
    // 不再重置羁绊层数，保留累积的层数
    // resetFactionStacks(); // 已移除
    
    // 计算并应用羁绊加成
    const { activeBonuses } = calculateFactionBonuses();
    
    // 保存战前干员状态（用于回合结束复活）
    gameState.preBattleOperators = gameState.battlefield.map(op => {
        if (op) {
            return {
                ...op,
                position: gameState.battlefield.indexOf(op)
            };
        }
        return null;
    });
    
    // 应用羁绊加成到所有干员
    gameState.battlefield.forEach((op, index) => {
        if (op) {
            gameState.battlefield[index] = applyFactionBonuses(op, activeBonuses);
            gameState.battlefield[index].blockingCount = 0; // 当前阻挡的敌人数量
            gameState.battlefield[index].blockingEnemies = []; // 被阻挡的敌人ID列表
        }
    });
    
    // 应用龙门羁绊的金币加成
    activeBonuses.forEach(bonus => {
        if (bonus.bonus.goldBonus) {
            gameState.gold += bonus.bonus.goldBonus;
        }
    });
    
    spawnEnemies();
    
    gameState.battleInterval = setInterval(() => {
        updateBattle();
        
        if (gameState.enemies.length === 0) {
            clearInterval(gameState.battleInterval);
            endBattle(true);
        } else if (gameState.life <= 0) {
            clearInterval(gameState.battleInterval);
            endBattle(false);
        }
    }, 500);
}

function updateBattle() {
    // 重置所有干员的阻挡计数
    gameState.battlefield.forEach(op => {
        if (op) {
            op.blockingCount = 0;
            op.blockingEnemies = []; // 记录被阻挡的敌人ID
            // 初始化攻击计时器
            if (op.attackTimer === undefined) op.attackTimer = 0;
        }
    });
    
    // 为每个敌人分配阻挡干员
    gameState.enemies.forEach(enemy => {
        if (!enemy.isBlocked) {
            enemy.isBlocked = false;
        }
        
        // 检查当前位置是否有干员
        const blockingOp = findBlockingOperator(enemy.x, enemy.y);
        if (blockingOp && blockingOp.blockingCount < blockingOp.block) {
            // 干员还有阻挡容量
            blockingOp.blockingCount++;
            blockingOp.blockingEnemies.push(enemy.id);
            enemy.isBlocked = true;
            enemy.blockedBy = blockingOp.id;
        } else {
            enemy.isBlocked = false;
            enemy.blockedBy = null;
        }
    });
    
    // 干员攻击
    gameState.battlefield.forEach((operator, index) => {
        if (!operator) return;
        
        const x = index % CONFIG.GRID_WIDTH;
        const y = Math.floor(index / CONFIG.GRID_WIDTH);
        
        // 攻速计算（默认100，每次攻击间隔 = 100 / attackSpeed）
        const attackSpeed = operator.attackSpeed || 100;
        operator.attackTimer = (operator.attackTimer || 0) + attackSpeed;
        
        // 攻击间隔判定（100为基准，攻速越高攻击越快）
        if (operator.attackTimer < 100) return;
        operator.attackTimer = 0;
        
        // 获取攻击范围
        const rangeShape = getAttackRangeByType(operator.type);
        const rangeCells = calculateAttackRange(x, y, operator.direction, rangeShape);
        
        // 3星及以上干员使用群攻
        if (operator.star >= 3 && operator.aoe) {
            if (operator.type === 'healer') {
                // 检查范围内是否有受伤的友军
                const injuredAllies = findInjuredAlliesInRangeCells(rangeCells);
                if (injuredAllies.length > 0) {
                    // 群体治疗
                    healAlliesInRangeCells(rangeCells, operator, 3);
                    // 调和羁绊：治疗时增加层数
                    if (operator.factions && operator.factions.includes('调和')) {
                        addFactionStack('调和', operator);
                    }
                }
            } else {
                // 检查范围内是否有敌人
                const targets = findEnemiesInRangeCells(rangeCells, 3);
                if (targets.length > 0) {
                    // 攻击触发羁绊
                    if (operator.factions) {
                        operator.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onAttack') {
                                addFactionStack(faction, operator);
                            }
                        });
                    }
                    // 近战攻击触发羁绊
                    if (operator.type === 'melee' && operator.factions) {
                        operator.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onMeleeAttack') {
                                addFactionStack(faction, operator);
                            }
                        });
                    }
                    // 远程攻击触发羁绊
                    if (operator.type === 'ranged' && operator.factions) {
                        operator.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onRangedAttack') {
                                addFactionStack(faction, operator);
                            }
                        });
                    }
                    
                    targets.forEach(target => {
                        const damage = Math.max(1, operator.atk - target.def);
                        target.hp -= damage;
                        if (target.hp <= 0) {
                            gameState.enemies = gameState.enemies.filter(e => e.id !== target.id);
                            gameState.gold += 1;
                        }
                    });
                }
            }
        } else {
            // 单体攻击
            if (operator.type === 'healer') {
                // 检查范围内是否有受伤的友军
                const target = findInjuredAllyInRangeCells(rangeCells);
                if (target) {
                    healAlly(x, y, operator);
                    // 调和羁绊：治疗时增加层数
                    if (operator.factions && operator.factions.includes('调和')) {
                        addFactionStack('调和', operator);
                    }
                }
            } else {
                // 检查范围内是否有敌人
                const target = findNearestEnemyInRangeCells(rangeCells);
                if (target) {
                    // 攻击触发羁绊
                    if (operator.factions) {
                        operator.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onAttack') {
                                addFactionStack(faction, operator);
                            }
                        });
                    }
                    // 近战攻击触发羁绊
                    if (operator.type === 'melee' && operator.factions) {
                        operator.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onMeleeAttack') {
                                addFactionStack(faction, operator);
                            }
                        });
                    }
                    // 远程攻击触发羁绊
                    if (operator.type === 'ranged' && operator.factions) {
                        operator.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onRangedAttack') {
                                addFactionStack(faction, operator);
                            }
                        });
                    }
                    
                    const damage = Math.max(1, operator.atk - target.def);
                    target.hp -= damage;
                    if (target.hp <= 0) {
                        gameState.enemies = gameState.enemies.filter(e => e.id !== target.id);
                        gameState.gold += 1;
                    }
                }
            }
        }
    });
    
    // 敌人移动和攻击
    gameState.enemies.forEach(enemy => {
        enemy.moveTimer += enemy.speed;
        
        if (enemy.moveTimer >= 1) {
            enemy.moveTimer = 0;
            
            // 如果被阻挡，攻击阻挡的干员
            if (enemy.isBlocked) {
                const blockingOp = gameState.battlefield.find(op => op && op.id === enemy.blockedBy);
                if (blockingOp) {
                    blockingOp.currentHp -= enemy.atk;
                    // 受伤触发羁绊
                    if (blockingOp.factions) {
                        blockingOp.factions.forEach(faction => {
                            const method = FACTION_STACK_METHODS[faction];
                            if (method && method.method === 'onDamage') {
                                addFactionStack(faction, blockingOp);
                            }
                        });
                    }
                    if (blockingOp.currentHp <= 0) {
                        const index = gameState.battlefield.findIndex(op => op && op.id === blockingOp.id);
                        if (index !== -1) {
                            gameState.battlefield[index] = null;
                        }
                    }
                }
            } else {
                // 未被阻挡，继续移动
                enemy.pathIndex++;
                if (enemy.pathIndex < enemy.path.length) {
                    enemy.x = enemy.path[enemy.pathIndex].x;
                    enemy.y = enemy.path[enemy.pathIndex].y;
                } else {
                    // 到达终点
                    if (gameState.roundLifeLoss < gameState.maxRoundLifeLoss) {
                        gameState.life -= 1;
                        gameState.roundLifeLoss += 1;
                    }
                    gameState.enemies = gameState.enemies.filter(e => e.id !== enemy.id);
                }
            }
        }
    });
    
    updateBattlefield();
    updateUI();
}

function findNearestEnemy(opX, opY, range) {
    let nearest = null;
    let minDist = Infinity;
    
    gameState.enemies.forEach(enemy => {
        const dist = Math.abs(enemy.x - opX) + Math.abs(enemy.y - opY);
        if (dist <= range && dist < minDist) {
            minDist = dist;
            nearest = enemy;
        }
    });
    
    return nearest;
}

// 基于范围格子查找最近的敌人
function findNearestEnemyInRangeCells(rangeCells) {
    let nearest = null;
    
    for (let cell of rangeCells) {
        const enemy = gameState.enemies.find(e => e.x === cell.x && e.y === cell.y);
        if (enemy) {
            nearest = enemy;
            break;
        }
    }
    
    return nearest;
}

// 基于范围格子查找多个敌人
function findEnemiesInRangeCells(rangeCells, maxTargets = 3) {
    const enemies = [];
    
    rangeCells.forEach(cell => {
        const enemy = gameState.enemies.find(e => e.x === cell.x && e.y === cell.y);
        if (enemy && enemies.length < maxTargets) {
            enemies.push(enemy);
        }
    });
    
    return enemies;
}

// 基于范围格子查找受伤的友军（单个）
function findInjuredAllyInRangeCells(rangeCells) {
    let lowestHp = Infinity;
    let target = null;
    
    rangeCells.forEach(cell => {
        const index = cell.y * CONFIG.GRID_WIDTH + cell.x;
        const op = gameState.battlefield[index];
        
        if (op && op.currentHp < op.maxHp) {
            const hpPercent = op.currentHp / op.maxHp;
            if (hpPercent < lowestHp) {
                lowestHp = hpPercent;
                target = op;
            }
        }
    });
    
    return target;
}

// 基于范围格子查找受伤的友军（多个）
function findInjuredAlliesInRangeCells(rangeCells) {
    const injured = [];
    
    rangeCells.forEach(cell => {
        const index = cell.y * CONFIG.GRID_WIDTH + cell.x;
        const op = gameState.battlefield[index];
        
        if (op && op.currentHp < op.maxHp) {
            injured.push(op);
        }
    });
    
    return injured;
}

// 基于范围格子群体治疗
function healAlliesInRangeCells(rangeCells, healer, maxTargets = 3) {
    const targets = [];
    
    rangeCells.forEach(cell => {
        const index = cell.y * CONFIG.GRID_WIDTH + cell.x;
        const op = gameState.battlefield[index];
        
        if (op && op.currentHp < op.maxHp) {
            const hpPercent = op.currentHp / op.maxHp;
            targets.push({ op, hpPercent });
        }
    });
    
    // 按血量百分比排序，优先治疗血少的
    targets.sort((a, b) => a.hpPercent - b.hpPercent);
    
    targets.slice(0, maxTargets).forEach(({ op }) => {
        op.currentHp = Math.min(op.maxHp, op.currentHp + (healer.healPower || 30));
    });
}

function findBlockingOperator(x, y) {
    const index = y * CONFIG.GRID_WIDTH + x;
    const operator = gameState.battlefield[index];
    
    if (operator && operator.block > 0) {
        return operator;
    }
    return null;
}

function healAlly(x, y, healer) {
    let lowestHp = Infinity;
    let target = null;
    
    gameState.battlefield.forEach((op, i) => {
        if (!op) return;
        const opX = i % CONFIG.GRID_WIDTH;
        const opY = Math.floor(i / CONFIG.GRID_WIDTH);
        const dist = Math.abs(opX - x) + Math.abs(opY - y);
        
        if (dist <= healer.range && op.currentHp < op.maxHp) {
            const hpPercent = op.currentHp / op.maxHp;
            if (hpPercent < lowestHp) {
                lowestHp = hpPercent;
                target = op;
            }
        }
    });
    
    if (target) {
        target.currentHp = Math.min(target.maxHp, target.currentHp + (healer.healPower || 30));
    }
}

// 检查范围内是否有受伤的友军（单个）
function findInjuredAllyInRange(x, y, range) {
    let lowestHp = Infinity;
    let target = null;
    
    gameState.battlefield.forEach((op, i) => {
        if (!op) return;
        const opX = i % CONFIG.GRID_WIDTH;
        const opY = Math.floor(i / CONFIG.GRID_WIDTH);
        const dist = Math.abs(opX - x) + Math.abs(opY - y);
        
        if (dist <= range && op.currentHp < op.maxHp) {
            const hpPercent = op.currentHp / op.maxHp;
            if (hpPercent < lowestHp) {
                lowestHp = hpPercent;
                target = op;
            }
        }
    });
    
    return target;
}

// 检查范围内是否有受伤的友军（多个）
function findInjuredAlliesInRange(x, y, range) {
    const injured = [];
    
    gameState.battlefield.forEach((op, i) => {
        if (!op) return;
        const opX = i % CONFIG.GRID_WIDTH;
        const opY = Math.floor(i / CONFIG.GRID_WIDTH);
        const dist = Math.abs(opX - x) + Math.abs(opY - y);
        
        if (dist <= range && op.currentHp < op.maxHp) {
            injured.push(op);
        }
    });
    
    return injured;
}

function endBattle(victory) {
    gameState.phase = 'prepare';
    document.getElementById('start-battle').disabled = false;
    
    // 恢复可操作状态
    document.getElementById('refresh-shop').disabled = false;
    document.getElementById('upgrade-shop').disabled = false;
    
    if (victory) {
        gameState.round++;
        
        // 金币计算：第1回合5金币，第2回合3金币，之后每回合+1（无上限）
        if (gameState.round === 1) {
            gameState.gold = 5;
        } else if (gameState.round === 2) {
            gameState.gold = 3;
        } else {
            gameState.gold = 3 + (gameState.round - 2);
        }
        // 不再限制金币上限
        
        // 复活所有战前部署的干员并恢复满血
        let revivedCount = 0;
        if (gameState.preBattleOperators) {
            gameState.preBattleOperators.forEach((op, index) => {
                if (op) {
                    // 恢复干员到原位置，满血复活
                    gameState.battlefield[index] = {
                        ...op,
                        currentHp: op.maxHp,
                        blockingCount: 0,
                        blockingEnemies: []
                    };
                    revivedCount++;
                }
            });
        }
        
        generateNextWave();
        
        // 如果商店未冻结，刷新商店
        if (!gameState.shopFrozen) {
            refreshShop();
        }
        
        updateBattlefield();
        updateUI();
        updateFactionDisplay(); // 战斗结束后更新羁绊显示
        
        // 重置计时器显示（但不启动倒计时）
        gameState.roundTimeRemaining = gameState.roundTimeLimit;
        updateUI();
        
        alert(`🎉 胜利！进入第 ${gameState.round} 回合\n${revivedCount} 个干员已复活并恢复满血\n获得 ${gameState.gold} 金币`);
    } else {
        alert('💀 失败！游戏结束');
        location.reload();
    }
}
function updateUI() {
    document.getElementById('round').textContent = gameState.round;
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('max-gold').textContent = '∞'; // 取消金币上限显示
    document.getElementById('life').textContent = gameState.life;
    document.getElementById('shop-level').textContent = gameState.shopLevel;
    document.getElementById('upgrade-cost').textContent = gameState.shopLevel * 5;
    
    // 更新计时器显示
    const timerEl = document.getElementById('timer');
    if (timerEl) {
        timerEl.textContent = gameState.roundTimeRemaining;
        // 时间少于30秒时变红
        if (gameState.roundTimeRemaining <= 30) {
            timerEl.style.color = '#ff6b6b';
        } else {
            timerEl.style.color = '#ffd700';
        }
    }
    
    // 更新部署信息
    const deployedCount = gameState.battlefield.filter(op => op !== null).length;
    const deployInfo = document.getElementById('deploy-info');
    if (deployInfo) {
        deployInfo.textContent = `${deployedCount}/${gameState.deployLimit}`;
    }
}

// ========== 计时器系统 ==========
function startRoundTimer() {
    // 清除旧计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // 重置时间
    gameState.roundTimeRemaining = gameState.roundTimeLimit;
    updateUI();
    
    // 只在战斗阶段计时
    if (gameState.phase === 'battle') {
        gameState.timerInterval = setInterval(() => {
            if (gameState.phase === 'battle') {
                gameState.roundTimeRemaining--;
                updateUI();
                
                // 时间到
                if (gameState.roundTimeRemaining <= 0) {
                    clearInterval(gameState.timerInterval);
                    handleTimeout();
                }
            }
        }, 1000);
    }
}

function stopRoundTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function handleTimeout() {
    // 超时：战斗阶段100秒内未消灭所有敌人，存活敌人视为入侵保护点
    const aliveEnemies = gameState.enemies.length;
    if (aliveEnemies > 0) {
        // 每回合最多扣10点生命值（考虑已经扣除的）
        const remainingLifeLoss = gameState.maxRoundLifeLoss - gameState.roundLifeLoss;
        const lifeLoss = Math.min(remainingLifeLoss, aliveEnemies);
        gameState.life -= lifeLoss;
        gameState.roundLifeLoss += lifeLoss;
        
        if (lifeLoss < aliveEnemies) {
            alert(`⏰ 战斗超时！${aliveEnemies}个敌人入侵保护点\n生命值 -${lifeLoss}（本回合已达上限10点）`);
        } else {
            alert(`⏰ 战斗超时！${aliveEnemies}个敌人入侵保护点\n生命值 -${lifeLoss}`);
        }
        gameState.enemies = [];
        
        // 停止战斗
        if (gameState.battleInterval) {
            clearInterval(gameState.battleInterval);
        }
        
        updateBattlefield();
        updateUI();
        
        if (gameState.life <= 0) {
            endBattle(false);
        } else {
            endBattle(true);
        }
    } else {
        // 没有敌人，正常结束
        if (gameState.battleInterval) {
            clearInterval(gameState.battleInterval);
        }
        endBattle(true);
    }
}

// ========== 查看禁用羁绊 ==========
function showBannedFactions() {
    let info = '═══ 本局禁用羁绊 ═══\n\n';
    
    if (gameState.bannedFactions.length === 0) {
        info += '本局没有禁用羁绊\n';
    } else {
        info += `共禁用 ${gameState.bannedFactions.length} 个羁绊：\n\n`;
        gameState.bannedFactions.forEach((faction, index) => {
            const factionInfo = ARKNIGHTS_FACTIONS[faction];
            if (factionInfo) {
                info += `${index + 1}. ${faction} (${factionInfo.type === 'region' ? '阵营' : '特性'})\n`;
            }
        });
    }
    
    info += '\n说明：\n';
    info += '• 禁用羁绊的干员仍可能出现在商店\n';
    info += '• 只要干员有其他未被禁用的羁绊即可\n';
    info += '• 多羁绊干员更有价值\n';
    
    alert(info);
}

initGame();
