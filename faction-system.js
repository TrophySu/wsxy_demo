// 羁绊系统扩展 - 可叠加层数机制

// 羁绊状态（全局）
const factionState = {
    stacks: {}, // 每个羁绊的当前层数
    maxStacks: 999 // 最大层数
};

// 羁绊叠加方式定义
const FACTION_STACK_METHODS = {
    // 阵营羁绊
    '萨尔贡': { method: 'onDamage', desc: '3星+干员受到伤害时有概率层数+1', trigger: '受伤触发' },
    '炎国': { method: 'onAttack', desc: '3星+干员攻击时有概率层数+1', trigger: '攻击触发' },
    '维多利亚': { method: 'onAttack', desc: '3星+干员攻击时有概率层数+1', trigger: '攻击触发' },
    '谢拉格': { method: 'onDamage', desc: '3星+干员受到伤害时有概率层数+1', trigger: '受伤触发' },
    '拉特兰': { method: 'onRangedAttack', desc: '3星+远程干员攻击时有概率层数+1', trigger: '远程攻击触发' },
    '阿戈尔': { method: 'onMeleeAttack', desc: '3星+近战干员攻击时有概率层数+1', trigger: '近战攻击触发' },
    
    // 特性羁绊
    '远见': { method: 'onAttack', desc: '3星+干员攻击时有概率层数+1', trigger: '攻击触发' },
    '精准': { method: 'onRangedAttack', desc: '3星+远程干员攻击时有概率层数+1', trigger: '远程攻击触发' },
    '坚守': { method: 'onDamage', desc: '3星+干员受到伤害时有概率层数+1', trigger: '受伤触发' },
    '突袭': { method: 'onMeleeAttack', desc: '3星+近战干员攻击时有概率层数+1', trigger: '近战攻击触发' },
    '奇迹': { method: 'onAttack', desc: '3星+干员攻击时有概率层数+1', trigger: '攻击触发' },
    '不屈': { method: 'onDamage', desc: '3星+干员受到伤害时有概率层数+1', trigger: '受伤触发' },
    '迅捷': { method: 'onAttack', desc: '3星+干员攻击时有概率层数+1', trigger: '攻击触发' },
    '灵巧': { method: 'onMeleeAttack', desc: '3星+近战干员攻击时有概率层数+1', trigger: '近战攻击触发' },
    '调和': { method: 'onHeal', desc: '3星+医疗治疗时有概率层数+1', trigger: '治疗触发' }
};

// 计算当前羁绊加成（只统计战场上的干员，同名干员只算1个）
function calculateFactionBonuses() {
    const factionCounts = {};
    const activeBonuses = [];
    const uniqueOperators = new Set(); // 用于去重同名干员
    
    // 只统计战场上已部署的干员
    gameState.battlefield.filter(op => op !== null).forEach(op => {
        if (op && op.factions) {
            // 同名干员只算一次
            if (!uniqueOperators.has(op.name)) {
                uniqueOperators.add(op.name);
                
                // 统计该干员的所有羁绊
                op.factions.forEach(faction => {
                    factionCounts[faction] = (factionCounts[faction] || 0) + 1;
                });
            }
        }
    });
    
    // 检查激活的羁绊（需要3人）
    for (let faction in factionCounts) {
        const count = factionCounts[faction];
        const bonuses = FACTION_BONUSES[faction];
        
        if (bonuses && count >= 3) {
            const stacks = factionState.stacks[faction] || 0;
            activeBonuses.push({
                faction,
                count,
                threshold: 3,
                stacks,
                stackMethod: FACTION_STACK_METHODS[faction],
                ...bonuses[3]
            });
        }
    }
    
    return { factionCounts, activeBonuses };
}

// 增加羁绊层数（带概率判定）
function addFactionStack(faction, operator, amount = 1) {
    // 根据星级计算触发概率
    let probability = 0;
    if (operator.star === 3) probability = 0.25;
    else if (operator.star === 4) probability = 0.40;
    else if (operator.star === 5) probability = 0.50;
    else return; // 1-2星不触发羁绊叠加
    
    // 概率判定
    if (Math.random() > probability) return;
    
    if (!factionState.stacks[faction]) {
        factionState.stacks[faction] = 0;
    }
    factionState.stacks[faction] = Math.min(
        factionState.maxStacks,
        factionState.stacks[faction] + amount
    );
    updateFactionDisplay();
}

// 重置羁绊层数（回合开始时）
function resetFactionStacks() {
    factionState.stacks = {};
    updateFactionDisplay();
}

// 应用羁绊加成到干员（基于层数）
function applyFactionBonuses(operator, activeBonuses) {
    let modifiedOp = { ...operator };
    
    activeBonuses.forEach(bonus => {
        const b = bonus.bonus;
        const stacks = bonus.stacks || 0;
        const stackMultiplier = 1 + (stacks * 0.001); // 每层+0.1%效果
        
        // 全局加成
        if (b.hpMult) {
            const finalMult = 1 + ((b.hpMult - 1) * stackMultiplier);
            modifiedOp.maxHp = Math.floor(modifiedOp.maxHp * finalMult);
            modifiedOp.currentHp = Math.floor(modifiedOp.currentHp * finalMult);
        }
        if (b.atkMult) {
            const finalMult = 1 + ((b.atkMult - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        if (b.defMult) {
            const finalMult = 1 + ((b.defMult - 1) * stackMultiplier);
            modifiedOp.def = Math.floor(modifiedOp.def * finalMult);
        }
        
        // 职业特定加成
        if (b.casterBonus && modifiedOp.type === 'caster') {
            const finalMult = 1 + ((b.casterBonus - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        if (b.healerBonus && modifiedOp.type === 'healer' && modifiedOp.healPower) {
            const finalMult = 1 + ((b.healerBonus - 1) * stackMultiplier);
            modifiedOp.healPower = Math.floor(modifiedOp.healPower * finalMult);
        }
        if (b.tankDefBonus && modifiedOp.type === 'tank') {
            const finalMult = 1 + ((b.tankDefBonus - 1) * stackMultiplier);
            modifiedOp.def = Math.floor(modifiedOp.def * finalMult);
        }
        if (b.tankHpBonus && modifiedOp.type === 'tank') {
            const finalMult = 1 + ((b.tankHpBonus - 1) * stackMultiplier);
            modifiedOp.maxHp = Math.floor(modifiedOp.maxHp * finalMult);
            modifiedOp.currentHp = Math.floor(modifiedOp.currentHp * finalMult);
        }
        if (b.rangedBonus && modifiedOp.type === 'ranged') {
            const finalMult = 1 + ((b.rangedBonus - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        if (b.meleeBonus && modifiedOp.type === 'melee') {
            const finalMult = 1 + ((b.meleeBonus - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        if (b.vanguardBonus && modifiedOp.type === 'vanguard') {
            const finalMult = 1 + ((b.vanguardBonus - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        if (b.specialistBonus && modifiedOp.type === 'specialist') {
            const finalMult = 1 + ((b.specialistBonus - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        if (b.supportBonus && modifiedOp.type === 'support') {
            const finalMult = 1 + ((b.supportBonus - 1) * stackMultiplier);
            modifiedOp.atk = Math.floor(modifiedOp.atk * finalMult);
        }
        
        // 阻挡数加成
        if (b.tankBlockBonus && modifiedOp.type === 'tank') {
            modifiedOp.block += b.tankBlockBonus;
        }
        // 每100层阻挡+1
        if (b.tankBlockPer100 && modifiedOp.type === 'tank') {
            modifiedOp.block += Math.floor(stacks / 100) * b.tankBlockPer100;
        }
        
        // 攻速加成（每20层+5）
        if (b.attackSpeedPer20) {
            const speedBonus = Math.floor(stacks / 20) * b.attackSpeedPer20;
            if (!modifiedOp.attackSpeed) modifiedOp.attackSpeed = 100;
            modifiedOp.attackSpeed += speedBonus;
        }
        
        // 攻速基础加成
        if (b.attackSpeedBonus) {
            if (!modifiedOp.attackSpeed) modifiedOp.attackSpeed = 100;
            modifiedOp.attackSpeed += b.attackSpeedBonus;
        }
        
        if (b.rangedRangeBonus && modifiedOp.type === 'ranged') {
            modifiedOp.range += b.rangedRangeBonus;
        }
        
        // 龙门金币加成（不受层数影响）
        if (b.goldBonus) {
            // 金币加成在startBattle中单独处理
        }
    });
    
    return modifiedOp;
}

// 显示羁绊详细信息（点击按钮）
function displayFactionBonuses() {
    const { factionCounts, activeBonuses } = calculateFactionBonuses();
    
    let info = '═══ 羁绊系统详情 ═══\n\n';
    
    if (activeBonuses.length === 0) {
        info += '暂无激活的羁绊\n';
        info += '（需要3个同阵营干员在战场上）\n\n';
    } else {
        activeBonuses.forEach(bonus => {
            const stacks = bonus.stacks || 0;
            const stackMult = 1 + (stacks * 0.001);
            
            info += `【${bonus.faction}】${bonus.name}\n`;
            info += `战场人数: ${bonus.count}人 | 当前层数: ${stacks}/${factionState.maxStacks}\n`;
            info += `叠加方式: ${bonus.stackMethod.desc}\n`;
            info += `基础效果: ${bonus.desc}\n`;
            info += `当前加成: ${(stackMult * 100).toFixed(1)}%效果\n`;
            
            // 显示额外效果
            const b = bonus.bonus;
            if (b.tankBlockPer100) {
                const blockBonus = Math.floor(stacks / 100);
                info += `额外阻挡: +${blockBonus}\n`;
            }
            if (b.attackSpeedPer20) {
                const speedBonus = Math.floor(stacks / 20) * b.attackSpeedPer20;
                info += `额外攻速: +${speedBonus}\n`;
            }
            
            info += `─────────────────\n`;
        });
    }
    
    info += '\n战场阵营统计：\n';
    if (Object.keys(factionCounts).length > 0) {
        for (let faction in factionCounts) {
            const method = FACTION_STACK_METHODS[faction];
            const status = factionCounts[faction] >= 3 ? '✓激活' : '✗未激活';
            info += `${faction}: ${factionCounts[faction]}人 ${status}\n`;
        }
    } else {
        info += '战场上暂无干员\n';
    }
    
    info += '\n说明：\n';
    info += '• 需要3个同阵营干员在战场上才能激活羁绊\n';
    info += '• 备战区的干员不计入羁绊\n';
    info += '• 每层羁绊增加0.1%效果\n';
    info += '• 最大层数: 999层\n';
    info += '• 回合开始时重置层数\n';
    info += '• 仅3星及以上干员可叠加羁绊\n';
    info += '• 叠加概率: 3星25% | 4星40% | 5星50%\n';
    info += '• 特殊效果:\n';
    info += '  - 阻挡加成: 每100层+1阻挡\n';
    info += '  - 攻速加成: 每20层+5攻速\n';
    
    alert(info);
}

// 更新羁绊显示面板
function updateFactionDisplay() {
    const display = document.getElementById('faction-display');
    if (!display) return;
    
    const { factionCounts, activeBonuses } = calculateFactionBonuses();
    
    let html = '';
    
    // 显示激活的羁绊
    if (activeBonuses.length > 0) {
        activeBonuses.forEach(bonus => {
            const stacks = bonus.stacks || 0;
            const stackMult = (1 + (stacks * 0.001)) * 100;
            const stackBarWidth = Math.min(100, (stacks / factionState.maxStacks) * 100);
            
            // 计算额外效果
            let extraEffects = '';
            const b = bonus.bonus;
            if (b.tankBlockPer100) {
                const blockBonus = Math.floor(stacks / 100);
                extraEffects += ` | 阻挡+${blockBonus}`;
            }
            if (b.attackSpeedPer20) {
                const speedBonus = Math.floor(stacks / 20) * b.attackSpeedPer20;
                extraEffects += ` | 攻速+${speedBonus}`;
            }
            
            html += `
                <div class="faction-item" onclick="showFactionOperators('${bonus.faction}')">
                    <div class="faction-name">【${bonus.faction}】${bonus.name}</div>
                    <div class="faction-count">${bonus.count}人战场 | 层数: ${stacks}/${factionState.maxStacks}</div>
                    <div class="faction-stack-bar">
                        <div class="faction-stack-fill" style="width: ${stackBarWidth}%"></div>
                    </div>
                    <div class="faction-desc">${bonus.desc}</div>
                    <div class="faction-stack-method">${bonus.stackMethod.desc}</div>
                    <div class="faction-effect">当前效果: ${stackMult.toFixed(1)}%${extraEffects}</div>
                    <div style="font-size: 10px; color: #888; margin-top: 5px;">💡 点击查看该羁绊下的所有干员</div>
                </div>
            `;
        });
    } else {
        html += '<div style="text-align: center; opacity: 0.5; padding: 20px;">暂无激活的羁绊<br><small>需要3个同阵营干员在战场上</small></div>';
    }
    
    // 显示阵营统计
    if (Object.keys(factionCounts).length > 0) {
        html += '<div class="faction-stats">';
        for (let faction in factionCounts) {
            const method = FACTION_STACK_METHODS[faction];
            const status = factionCounts[faction] >= 3 ? '✓' : '✗';
            html += `<div class="faction-stat" title="${method.desc}" onclick="showFactionOperators('${faction}')" style="cursor: pointer;">${status} ${faction}: ${factionCounts[faction]}</div>`;
        }
        html += '</div>';
    }
    
    display.innerHTML = html;
}

// 群攻功能：查找范围内的所有敌人
function findEnemiesInRange(opX, opY, range, maxTargets = 3) {
    const enemies = [];
    
    gameState.enemies.forEach(enemy => {
        const dist = Math.abs(enemy.x - opX) + Math.abs(enemy.y - opY);
        if (dist <= range) {
            enemies.push({ enemy, dist });
        }
    });
    
    // 按距离排序，返回最近的几个
    enemies.sort((a, b) => a.dist - b.dist);
    return enemies.slice(0, maxTargets).map(e => e.enemy);
}

// 群体治疗
function healAlliesInRange(x, y, healer, maxTargets = 3) {
    const targets = [];
    
    gameState.battlefield.forEach((op, i) => {
        if (!op) return;
        const opX = i % CONFIG.GRID_WIDTH;
        const opY = Math.floor(i / CONFIG.GRID_WIDTH);
        const dist = Math.abs(opX - x) + Math.abs(opY - y);
        
        if (dist <= healer.range && op.currentHp < op.maxHp) {
            const hpPercent = op.currentHp / op.maxHp;
            targets.push({ op, hpPercent, index: i });
        }
    });
    
    // 按血量百分比排序，优先治疗血少的
    targets.sort((a, b) => a.hpPercent - b.hpPercent);
    
    targets.slice(0, maxTargets).forEach(({ op }) => {
        op.currentHp = Math.min(op.maxHp, op.currentHp + (healer.healPower || 30));
    });
}


// 显示羁绊下的所有干员
function showFactionOperators(factionName) {
    // 获取该羁绊下的所有干员（过滤掉只有禁用羁绊的干员）
    const allOperators = ARKNIGHTS_OPERATORS.filter(op => 
        op.factions && op.factions.includes(factionName)
    );
    
    // 过滤：只显示至少有一个未被禁用羁绊的干员
    const operators = allOperators.filter(op => {
        return op.factions.some(f => !gameState.bannedFactions.includes(f));
    });
    
    if (operators.length === 0) {
        alert(`羁绊【${factionName}】下暂无可用干员（所有干员的羁绊都被禁用）`);
        return;
    }
    
    // 获取羁绊效果
    const factionBonus = FACTION_BONUSES[factionName];
    const factionStackMethod = FACTION_STACK_METHODS[factionName];
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'faction-operators-modal';
    
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    };
    
    // 标题
    const title = document.createElement('h2');
    title.textContent = `羁绊【${factionName}】`;
    title.style.color = '#ffd700';
    title.style.marginBottom = '10px';
    
    // 羁绊效果
    if (factionBonus && factionBonus[3]) {
        const effectDiv = document.createElement('div');
        effectDiv.style.cssText = 'background: rgba(102, 126, 234, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #667eea;';
        effectDiv.innerHTML = `
            <div style="font-weight: bold; color: #4facfe; margin-bottom: 5px;">🌟 ${factionBonus[3].name}</div>
            <div style="color: #fff; margin-bottom: 5px;">${factionBonus[3].desc}</div>
            <div style="font-size: 12px; color: #aaa;">激活条件: 3个同羁绊干员</div>
        `;
        if (factionStackMethod) {
            effectDiv.innerHTML += `<div style="font-size: 12px; color: #ffd700; margin-top: 5px;">⚡ ${factionStackMethod.desc}</div>`;
        }
        modal.appendChild(effectDiv);
    }
    
    // 统计信息
    const stats = document.createElement('p');
    const filteredCount = allOperators.length - operators.length;
    if (filteredCount > 0) {
        stats.innerHTML = `共 ${operators.length} 个可用干员 <span style="color: #ff6b6b;">(${filteredCount}个被禁用)</span>`;
    } else {
        stats.textContent = `共 ${operators.length} 个干员`;
    }
    stats.style.color = '#4facfe';
    stats.style.marginBottom = '20px';
    
    // 干员网格
    const grid = document.createElement('div');
    grid.className = 'faction-operators-grid';
    
    operators.forEach(op => {
        const item = document.createElement('div');
        item.className = 'faction-operator-item';
        const stars = '⭐'.repeat(op.star);
        
        // 检查是否有其他羁绊被禁用
        const bannedFactions = op.factions.filter(f => gameState.bannedFactions.includes(f));
        const hasBannedFaction = bannedFactions.length > 0;
        
        item.innerHTML = `
            <div style="font-size: 24px;">${op.icon}</div>
            <div style="font-weight: bold; margin: 5px 0;">${op.name}</div>
            <div style="font-size: 12px; color: #ffd700;">${stars}</div>
            ${hasBannedFaction ? `<div style="font-size: 10px; color: #ff6b6b;">部分羁绊被禁</div>` : ''}
        `;
        grid.appendChild(item);
    });
    
    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(stats);
    modal.appendChild(grid);
    
    // 点击遮罩层关闭
    overlay.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    };
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}
