const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const colors = ['#FF007F', '#00FF00', '#00E5FF', '#FFD700', '#FF4500'];
const drops = [];
const splashes = [];

// Configuração do chão
const groundY = canvas.height * 0.85;

class Drop {
    constructor() {
        this.init();
    }

    init() {
        // Nasce dentro da largura da nuvem (centro da tela)
        this.x = (canvas.width / 2 - 100) + Math.random() * 200;
        this.y = canvas.height * 0.15;
        this.char = characters.charAt(Math.floor(Math.random() * characters.length));
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = 2 + Math.random() * 5;
        this.fontSize = 12 + Math.random() * 15;
        this.opacity = 1;
    }

    draw() {
        ctx.save();
        // Efeito 3D: Sombra projetada para profundidade
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.font = `bold ${this.fontSize}px Arial`;
        ctx.fillText(this.char, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.y += this.speed;

        // Se tocar o chão invisível
        if (this.y >= groundY) {
            createSplash(this.x, groundY, this.color);
            this.init();
        }
    }
}

function createSplash(x, y, color) {
    splashes.push({
        x, y, color,
        radius: 2,
        opacity: 1
    });
}

function drawSplashes() {
    for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = s.opacity;
        ctx.stroke();
        
        s.radius += 2;
        s.opacity -= 0.05;

        if (s.opacity <= 0) {
            splashes.splice(i, 1);
        }
    }
    ctx.globalAlpha = 1;
}

// Inicializa gotas
for (let i = 0; i < 40; i++) {
    drops.push(new Drop());
}

function animate() {
    // Limpa o canvas com um rastro leve para fluidez
    ctx.fillStyle = 'rgba(5, 5, 16, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drops.forEach(drop => {
        drop.update();
        drop.draw();
    });

    drawSplashes();
    requestAnimationFrame(animate);
}

animate();

// Ajustar canvas ao redimensionar tela
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});