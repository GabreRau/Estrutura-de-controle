// ======= VALIDAÇÃO DE IDADE =======
const idadeInput = document.getElementById('idadeInput');
const verifyButton = document.getElementById('verifyButton');
const result = document.getElementById('resultado');

function verificarIdade() {
    result.classList.remove('visivel');
    const idade = parseInt(idadeInput.value);
    let menssagem = '';

    if (isNaN(idade) || idade < 0) {
        menssagem = 'Por favor, insira uma idade válida';
    } else if (idade < 18) {
        menssagem = 'Você é menor de idade';
    } else if (idade < 60) {
        menssagem = 'Você é adulto.';
    } else {
        menssagem = 'Você é idoso';
    }

    setTimeout(() => {
        result.innerText = menssagem;
        result.classList.add('visivel');
    }, 100);
}

verifyButton.addEventListener('click', verificarIdade);
idadeInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') verificarIdade();
});

// ======= CANVAS DE PARTICULAS =======
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

let mouse = { x: null, y: null, radius: 150 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// ======= PARTICULAS =======
class Particula {
    constructor(x, y, dx, dy, tamanho, cor) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.tamanho = tamanho;
        this.cor = cor;
    }

    desenhar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = this.cor;
        ctx.fill();
    }

    atualizar() {
        if (this.x + this.tamanho > canvas.width || this.x - this.tamanho < 0) this.dx = -this.dx;
        if (this.y + this.tamanho > canvas.height || this.y - this.tamanho < 0) this.dy = -this.dy;

        this.x += this.dx;
        this.y += this.dy;

        this.desenhar();
    }
}

// ======= ARRAY DE PARTICULAS =======
let particulasArray = [];
const numeroDeParticulas = 100;

function initParticulas() {
    particulasArray = [];
    for (let i = 0; i < numeroDeParticulas; i++) {
        let tamanho = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - tamanho * 2) + tamanho;
        let y = Math.random() * (canvas.height - tamanho * 2) + tamanho;
        let dx = (Math.random() - 0.5) * 1;
        let dy = (Math.random() - 0.5) * 1;
        let cor = '#007bff';
        particulasArray.push(new Particula(x, y, dx, dy, tamanho, cor));
    }
}

// ======= CONEXÃO =======
function conectar() {
    for (let a = 0; a < particulasArray.length; a++) {
        for (let b = a + 1; b < particulasArray.length; b++) {
            let dx = particulasArray[a].x - particulasArray[b].x;
            let dy = particulasArray[a].y - particulasArray[b].y;
            let distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < 100) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,123,255,0.2)';
                ctx.lineWidth = 1;
                ctx.moveTo(particulasArray[a].x, particulasArray[a].y);
                ctx.lineTo(particulasArray[b].x, particulasArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// ======= ANIMAÇÃO =======
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulasArray.forEach(p => p.atualizar());
    conectar();
    requestAnimationFrame(animar);
}

// ======= INICIALIZAÇÃO =======
initParticulas();
animar();

// Função para centralizar o controle na tela
function centralizarControle() {
    const controle = document.getElementById('controle');
    const largura = controle.offsetWidth;
    const altura = controle.offsetHeight;

    controle.style.position = 'absolute';
    controle.style.left = `50%`;
    controle.style.top = `50%`;
    controle.style.transform = 'translate(-50%, -50%)';
}

// Chama a função na inicialização
centralizarControle();

// Também atualiza ao redimensionar a janela
window.addEventListener('resize', centralizarControle);
