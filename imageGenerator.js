// 图像生成器 - 生成可爱的二次元风格角色和特效

class ImageGenerator {
    constructor() {
        this.canvas = document.getElementById('imageCanvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    // 生成干员立绘
    generateOperatorImage(operator, size = 80) {
        this.canvas.width = size;
        this.canvas.height = size;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, size, size);
        
        // 根据职业选择配色
        const colors = this.getOperatorColors(operator.type);
        
        // 绘制背景光晕
        const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        gradient.addColorStop(0, colors.glow + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // 绘制身体
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.ellipse(size/2, size*0.65, size*0.25, size*0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制头部
        ctx.fillStyle = colors.skin;
        ctx.beginPath();
        ctx.arc(size/2, size*0.35, size*0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼睛
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(size*0.42, size*0.33, size*0.03, 0, Math.PI * 2);
        ctx.arc(size*0.58, size*0.33, size*0.03, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制眼睛高光
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(size*0.43, size*0.32, size*0.015, 0, Math.PI * 2);
        ctx.arc(size*0.59, size*0.32, size*0.015, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制嘴巴
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(size/2, size*0.38, size*0.08, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // 绘制头发
        ctx.fillStyle = colors.hair;
        ctx.beginPath();
        ctx.arc(size/2, size*0.28, size*0.22, 0, Math.PI, true);
        ctx.fill();
        
        // 绘制职业特征
        this.drawClassFeature(ctx, operator.type, size, colors);
        
        // 绘制武器/装备
        this.drawWeapon(ctx, operator.type, size, colors);
        
        // 星级标识
        this.drawStars(ctx, operator.star || 1, size);
        
        return this.canvas.toDataURL();
    }
    
    // 生成敌人图像
    generateEnemyImage(enemy, size = 60) {
        this.canvas.width = size;
        this.canvas.height = size;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, size, size);
        
        // 敌人配色（偏暗红色）
        const colors = {
            body: '#8B0000',
            accent: '#DC143C',
            eye: '#FF4500',
            glow: '#FF0000'
        };
        
        // 背景光晕
        const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        gradient.addColorStop(0, colors.glow + '30');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // 身体
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.ellipse(size/2, size*0.6, size*0.3, size*0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 头部
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(size/2, size*0.35, size*0.18, 0, Math.PI * 2);
        ctx.fill();
        
        // 邪恶的眼睛
        ctx.fillStyle = colors.eye;
        ctx.beginPath();
        ctx.ellipse(size*0.4, size*0.33, size*0.05, size*0.08, -0.3, 0, Math.PI * 2);
        ctx.ellipse(size*0.6, size*0.33, size*0.05, size*0.08, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 尖角
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.moveTo(size*0.35, size*0.25);
        ctx.lineTo(size*0.3, size*0.1);
        ctx.lineTo(size*0.4, size*0.22);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(size*0.65, size*0.25);
        ctx.lineTo(size*0.7, size*0.1);
        ctx.lineTo(size*0.6, size*0.22);
        ctx.fill();
        
        return this.canvas.toDataURL();
    }
    
    // 生成攻击特效
    generateAttackEffect(type, size = 40) {
        this.canvas.width = size;
        this.canvas.height = size;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, size, size);
        
        switch(type) {
            case 'melee':
                // 斩击特效
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#FFA500';
                ctx.beginPath();
                ctx.moveTo(size*0.2, size*0.8);
                ctx.lineTo(size*0.8, size*0.2);
                ctx.stroke();
                break;
                
            case 'ranged':
                // 箭矢特效
                ctx.fillStyle = '#00CED1';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#00CED1';
                ctx.beginPath();
                ctx.moveTo(size*0.8, size*0.5);
                ctx.lineTo(size*0.2, size*0.45);
                ctx.lineTo(size*0.2, size*0.55);
                ctx.fill();
                break;
                
            case 'magic':
                // 魔法特效
                ctx.fillStyle = '#9370DB';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#9370DB';
                for(let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 / 5) * i;
                    const x = size/2 + Math.cos(angle) * size*0.3;
                    const y = size/2 + Math.sin(angle) * size*0.3;
                    ctx.beginPath();
                    ctx.arc(x, y, size*0.08, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'heal':
                // 治疗特效
                ctx.fillStyle = '#32CD32';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#32CD32';
                ctx.fillRect(size*0.4, size*0.2, size*0.2, size*0.6);
                ctx.fillRect(size*0.2, size*0.4, size*0.6, size*0.2);
                break;
        }
        
        return this.canvas.toDataURL();
    }
    
    // 获取干员配色
    getOperatorColors(type) {
        const colorSchemes = {
            'GUARD': { body: '#FF6B6B', skin: '#FFE4C4', hair: '#8B4513', glow: '#FF0000', accent: '#DC143C' },
            'SNIPER': { body: '#4ECDC4', skin: '#FFE4C4', hair: '#2C3E50', glow: '#00CED1', accent: '#20B2AA' },
            'DEFENDER': { body: '#95A5A6', skin: '#FFE4C4', hair: '#34495E', glow: '#7F8C8D', accent: '#BDC3C7' },
            'MEDIC': { body: '#F8B500', skin: '#FFE4C4', hair: '#FFD700', glow: '#FFA500', accent: '#FF8C00' },
            'CASTER': { body: '#9B59B6', skin: '#FFE4C4', hair: '#8E44AD', glow: '#9370DB', accent: '#BA55D3' },
            'VANGUARD': { body: '#3498DB', skin: '#FFE4C4', hair: '#2980B9', glow: '#1E90FF', accent: '#4169E1' },
            'SUPPORTER': { body: '#1ABC9C', skin: '#FFE4C4', hair: '#16A085', glow: '#00FA9A', accent: '#3CB371' },
            'SPECIALIST': { body: '#E67E22', skin: '#FFE4C4', hair: '#D35400', glow: '#FF8C00', accent: '#FF6347' }
        };
        
        return colorSchemes[type] || colorSchemes['GUARD'];
    }
    
    // 绘制职业特征
    drawClassFeature(ctx, type, size, colors) {
        ctx.fillStyle = colors.accent;
        
        switch(type) {
            case 'GUARD':
                // 剑士标记
                ctx.fillRect(size*0.7, size*0.5, size*0.08, size*0.3);
                break;
            case 'DEFENDER':
                // 盾牌
                ctx.beginPath();
                ctx.arc(size*0.25, size*0.6, size*0.12, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'MEDIC':
                // 十字标记
                ctx.fillRect(size*0.15, size*0.55, size*0.06, size*0.15);
                ctx.fillRect(size*0.12, size*0.6, size*0.12, size*0.06);
                break;
        }
    }
    
    // 绘制武器
    drawWeapon(ctx, type, size, colors) {
        ctx.fillStyle = colors.accent;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        
        switch(type) {
            case 'GUARD':
                // 剑
                ctx.fillRect(size*0.72, size*0.45, size*0.04, size*0.25);
                ctx.fillRect(size*0.7, size*0.44, size*0.08, size*0.04);
                break;
            case 'SNIPER':
                // 弓
                ctx.beginPath();
                ctx.arc(size*0.75, size*0.6, size*0.1, -Math.PI/2, Math.PI/2);
                ctx.stroke();
                break;
        }
    }
    
    // 绘制星级
    drawStars(ctx, star, size) {
        ctx.fillStyle = '#FFD700';
        const starSize = size * 0.06;
        const startX = size * 0.1;
        const y = size * 0.9;
        
        for(let i = 0; i < star; i++) {
            this.drawStar(ctx, startX + i * starSize * 1.5, y, starSize);
        }
    }
    
    // 绘制单个星星
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const radius = i % 2 === 0 ? size : size / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if(i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }
}

// 全局图像生成器实例
const imageGen = new ImageGenerator();
