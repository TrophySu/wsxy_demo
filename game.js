// ========== 游戏配置 ==========
const CONFIG = {
    GRID_WIDTH: 9,
    GRID_HEIGHT: 4,
    BENCH_SIZE: 12,
    MERGE_COUNT: 3,
    SHOP_REFRESH_COST: 2,
    SELL_PRICE: 1,
    ROUND_GOLD: 3,
    GOLD_PER_ROUND_INCREASE: 1
};

// ========== 干员模板（按星级和精英化） ==========
const OPERATOR_TEMPLATES = {
    1: [
        { name: '新兵', cost: 1, hp: 100, atk: 20, def: 10, range: 1, block: 1, type: 'melee', icon: '⚔️', star: 1, elite: 0 },
        { name: '见习生', cost: 1, hp: 110, atk: 18, def: 12, range: 1, block: 2, type: 'vanguard', icon: '🎖️', star: 1, elite: 0 }
    ],
    2: [
        { name: '近卫', cost: 2, hp: 150, atk: 35, def: 20, range: 1, block: 1, type: 'melee', icon: '⚔️', star: 2, elite: 0 },
        { name: '狙击', cost: 2, hp: 120, atk: 50, def: 15, range: 4, block: 0, type: 'ranged', icon: '🏹', star: 2, elite: 0 },
        { name: '重装', cost: 2, hp: 280, atk: 25, def: 80, range: 1, block: 3, type: 'tank', icon: '🛡️', star: 2, elite: 0 },
        { name: '先锋', cost: 2, hp: 160, atk: 30, def: 25, range: 1, block: 2, type: 'vanguard', icon: '🎖️', star: 2, elite: 0 }
    ],
    3: [
        { name: '精英近卫', cost: 3, hp: 200, atk: 50, def: 30, range: 1, block: 1, type: 'melee', icon: '⚔️', star: 3, elite: 0 },
        { name: '神射手', cost: 3, hp: 150, atk: 70, def: 20, range: 5, block: 0, type: 'ranged', icon: '🏹', star: 3, elite: 0 },
        { name: '铁壁', cost: 3, hp: 350, atk: 30, def: 120, range: 1, block: 3, type: 'tank', icon: '🛡️', star: 3, elite: 0 },
        { name: '医疗', cost: 3, hp: 130, atk: 0, def: 15, range: 3, block: 0, type: 'healer', icon: '💊', star: 3, elite: 0, healPower: 40 },
        { name: '术师', cost: 3, hp: 120, atk: 65, def: 18, range: 3, block: 0, type: 'caster', icon: '✨', star: 3, elite: 0 }
    ],
    4: [
        { name: '剑圣', cost: 4, hp: 250, atk: 70, def: 40, range: 1, block: 1, type: 'melee', icon: '⚔️', star: 4, elite: 0 },
        { name: '狙击大师', cost: 4, hp: 180, atk: 95, def: 25, range: 6, block: 0, type: 'ranged', icon: '🏹', star: 4, elite: 0 },
        { name: '守护者', cost: 4, hp: 450, atk: 40, def: 160, range: 1, block: 3, type: 'tank', icon: '🛡️', star: 4, elite: 0 },
        { name: '名医', cost: 4, hp: 160, atk: 0, def: 20, range: 4, block: 0, type: 'healer', icon: '💊', star: 4, elite: 0, healPower: 60 },
        { name: '大法师', cost: 4, hp: 150, atk: 90, def: 22, range: 4, block: 0, type: 'caster', icon: '✨', star: 4, elite: 0 }
    ],
    5: [
        { name: '剑豪', cost: 5, hp: 320, atk: 100, def: 50, range: 2, block: 1, type: 'melee', icon: '⚔️', star: 5, elite: 0 },
        { name: '鹰眼', cost: 5, hp: 220, atk: 130, def: 30, range: 7, block: 0, type: 'ranged', icon: '🏹', star: 5, elite: 0 },
        { name: '不朽之盾', cost: 5, hp: 580, atk: 50, def: 200, range: 1, block: 3, type: 'tank', icon: '🛡️', star: 5, elite: 0 },
        { name: '圣手', cost: 5, hp: 190, atk: 0, def: 25, range: 5, block: 0, type: 'healer', icon: '💊', star: 5, elite: 0, healPower: 85 },
        { name: '魔导师', cost: 5, hp: 180, atk: 120, def: 28, range: 5, block: 0, type: 'caster', icon: '✨', star: 5, elite: 0 }
    ]
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
    life: 20,
    phase: 'prepare',
    shopLevel: 1,
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
    
    document.getElementById('start-battle').addEventListener('click', startBattle);
    document.getElementById('refresh-shop').addEventListener('click', () => {
        if (gameState.gold >= CONFIG.SHOP_REFRESH_COST) {
            gameState.gold -= CONFIG.SHOP_REFRESH_COST;
            refreshShop();
            updateUI();
        }
    });
    document.getElementById('upgrade-shop').addEventListener('click', upgradeShop);
    document.getElementById('show-next-wave').addEventListener('click', showNextWave);
}

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
    
    for (let i = 0; i < 5; i++) {
        const star = getRandomStarByShopLevel();
        const templates = OPERATOR_TEMPLATES[star];
        const template = templates[Math.floor(Math.random() * templates.length)];
        const operator = createOperator(template);
        
        const card = createOperatorCard(operator);
        card.addEventListener('click', () => buyOperator(operator, card));
        
        shop.appendChild(card);
    }
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
        updateUI();
        alert(`🎉 商店升级到 ${gameState.shopLevel} 级！`);
    } else if (gameState.shopLevel >= 5) {
        alert('商店已达到最高等级！');
    }
}

// ========== 干员系统 ==========
function createOperator(template) {
    return {
        id: Date.now() + Math.random(),
        ...JSON.parse(JSON.stringify(template)),
        maxHp: template.hp,
        currentHp: template.hp
    };
}

function createOperatorCard(operator) {
    const card = document.createElement('div');
    card.className = 'operator-card';
    card.draggable = true;
    card.dataset.operatorId = operator.id;
    card.dataset.type = operator.type;
    card.dataset.name = operator.name;
    card.dataset.elite = operator.elite;
    
    const stars = '⭐'.repeat(operator.star);
    const eliteText = operator.elite === 2 ? ' 精二' : operator.elite === 1 ? ' 精一' : '';
    
    card.innerHTML = `
        <div class="operator-name">${operator.icon} ${operator.name}${eliteText}</div>
        <div class="operator-stars">${stars}</div>
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
    
    for (let key in operatorGroups) {
        const group = operatorGroups[key];
        if (group.length >= CONFIG.MERGE_COUNT) {
            const [name, elite] = key.split('_');
            const eliteLevel = parseInt(elite);
            
            if (eliteLevel < 2) {
                mergeOperators(group.slice(0, CONFIG.MERGE_COUNT), eliteLevel + 1);
                return checkMerge();
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
    updateBench();
    updateBattlefield();
    alert(`✨ ${newOperator.name} 合成为精${newElite === 1 ? '一' : '二'}！`);
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
        // 部署干员
        const op = gameState.bench.splice(gameState.selectedOperator, 1)[0];
        gameState.battlefield[index] = op;
        gameState.selectedOperator = null;
        updateBench();
        updateBattlefield();
        checkMerge();
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
            const operator = gameState.bench.splice(benchIndex, 1)[0];
            gameState.battlefield[index] = operator;
            updateBench();
            updateBattlefield();
            checkMerge();
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
        }
    }
}

// ========== 攻击范围显示 ==========
function showOperatorRange(operator, opX, opY) {
    clearRangeDisplay();
    const range = operator.range;
    
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            const dist = Math.abs(x - opX) + Math.abs(y - opY);
            if (dist <= range && dist > 0) {
                const index = y * CONFIG.GRID_WIDTH + x;
                const cell = document.querySelector(`[data-index="${index}"]`);
                if (cell) {
                    cell.classList.add('in-range');
                    gameState.rangeDisplay.push(index);
                }
            }
        }
    }
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
            
            const opDiv = document.createElement('div');
            opDiv.className = 'operator-on-field';
            opDiv.draggable = true;
            opDiv.dataset.operatorId = operator.id;
            
            opDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('operatorId', operator.id);
                e.dataTransfer.setData('fromBench', 'false');
            });
            
            opDiv.innerHTML = `
                <div class="name">${operator.icon}${eliteText}</div>
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
    
    // 禁用操作按钮
    document.getElementById('refresh-shop').disabled = true;
    document.getElementById('upgrade-shop').disabled = true;
    
    clearRangeDisplay();
    
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
    
    // 重置所有干员的阻挡计数
    gameState.battlefield.forEach(op => {
        if (op) {
            op.blockingCount = 0; // 当前阻挡的敌人数量
            op.blockingEnemies = []; // 被阻挡的敌人ID列表
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
        
        const target = findNearestEnemy(x, y, operator.range);
        if (target) {
            if (operator.type === 'healer') {
                healAlly(x, y, operator);
            } else {
                const damage = Math.max(1, operator.atk - target.def);
                target.hp -= damage;
                if (target.hp <= 0) {
                    gameState.enemies = gameState.enemies.filter(e => e.id !== target.id);
                    gameState.gold += 1;
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
                    gameState.life -= 1;
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

function endBattle(victory) {
    gameState.phase = 'prepare';
    document.getElementById('start-battle').disabled = false;
    
    // 恢复可操作状态
    document.getElementById('refresh-shop').disabled = false;
    document.getElementById('upgrade-shop').disabled = false;
    
    if (victory) {
        gameState.round++;
        
        // 金币计算：第1回合5金币，第2回合3金币，之后每回合+1
        if (gameState.round === 1) {
            gameState.maxGold = 5;
        } else if (gameState.round === 2) {
            gameState.maxGold = 3;
        } else {
            gameState.maxGold = 3 + (gameState.round - 2);
        }
        gameState.maxGold = Math.min(10, gameState.maxGold);
        gameState.gold = gameState.maxGold;
        
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
        alert(`🎉 胜利！进入第 ${gameState.round} 回合\n${revivedCount} 个干员已复活并恢复满血\n获得 ${gameState.maxGold} 金币`);
    } else {
        alert('💀 失败！游戏结束');
        location.reload();
    }
    
    refreshShop();
    updateBattlefield();
    updateUI();
}

function updateUI() {
    document.getElementById('round').textContent = gameState.round;
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('max-gold').textContent = gameState.maxGold;
    document.getElementById('life').textContent = gameState.life;
    document.getElementById('shop-level').textContent = gameState.shopLevel;
    document.getElementById('upgrade-cost').textContent = gameState.shopLevel * 5;
}

initGame();
