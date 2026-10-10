// Mock Data (Cardápio de Comida Nordestina/Caseira com Imagens Locais)
const cardapios = {
    centro: [
        { 
            id: 1, 
            nome: "Cuscuz Recheado", 
            desc: "Cuscuz macio recheado com carne de sol na nata, queijo coalho, frango e calabresa", 
            preco: 22.00,
            imagem: "imagens/cuscuz.recheado.jpg" 
        },
        { 
            id: 2, 
            nome: "Tapioca Rendada de Frango", 
            desc: "Tapioca com casquinha de queijo coalho, frango desfiado e catupiry", 
            preco: 18.00,
            imagem: "imagens/tapioca.jpg" 
        },
        { 
            id: 3, 
            nome: "Prato Executivo: Baião de Dois", 
            desc: "Baião de dois, carne de sol acebolada, mandioca frita e paçoca", 
            preco: 34.00,
            imagem: "imagens/baiao.jpg" 
        },
        { 
            id: 4, 
            nome: "Bolo de Macaxeira (Fatia)", 
            desc: "Bolo caseiro tradicional de macaxeira com coco", 
            preco: 9.00,
            imagem: "imagens/bolo.macaxeira.jpg" 
        },
        { 
            id: 5, 
            nome: "Suco Regional (500ml)", 
            desc: "Suco natural da fruta bem gelado", 
            preco: 8.50,
            imagem: "imagens/suco.jpg",
            sabores: ["Laranja", "Maracujá", "Acerola", "Goiaba", "Caju", "Graviola", "Cajá"]
        }
    ],
    shopping: [
        { 
            id: 1, 
            nome: "Cuscuz Recheado", 
            desc: "Cuscuz macio recheado com carne de sol na nata, queijo coalho, frango e calabresa", 
            preco: 24.00,
            imagem: "imagens/cuscuz.recheado.jpg" 
        },
        { 
            id: 2, 
            nome: "Tapioca Rendada de Frango", 
            desc: "Tapioca com casquinha de queijo coalho, frango desfiado e catupiry", 
            preco: 19.50,
            imagem: "imagens/tapioca.jpg" 
        },
        { 
            id: 3, 
            nome: "Prato Executivo: Baião de Dois", 
            desc: "Baião de dois, carne de sol acebolada, mandioca frita e paçoca", 
            preco: 38.00,
            imagem: "imagens/baiao.jpg" 
        }
    ],
    "zona-sul": [
        { 
            id: 1, 
            nome: "Cuscuz Recheado", 
            desc: "Cuscuz macio recheado com carne de sol na nata, queijo coalho, frango e calabresa", 
            preco: 23.00,
            imagem: "imagens/cuscuz.recheado.jpg" 
        },
        { 
            id: 3, 
            nome: "Prato Executivo: Baião de Dois", 
            desc: "Baião de dois, carne de sol acebolada, mandioca frita e paçoca", 
            preco: 36.00,
            imagem: "imagens/baiao.jpg" 
        }
    ]
};

let carrinho = [];
let pontosFidelidade = 150;
let pinAtual = ""; // Variável global que armazena o PIN de 4 dígitos gerado

document.addEventListener("DOMContentLoaded", () => {
    carregarCardapio();
});

// Abrir e fechar modal de cadastro
function abrirModalCadastro() {
    const modal = document.getElementById('modal-cadastro');
    if (modal) modal.style.display = 'flex';
}

function fecharModalCadastro() {
    const modal = document.getElementById('modal-cadastro');
    if (modal) modal.style.display = 'none';
}

// Salvar cadastro e preencher automaticamente os campos de checkout
function salvarCadastroModal(e) {
    e.preventDefault();
    
    const nome = document.getElementById('modal-nome').value;
    const telefone = document.getElementById('modal-telefone').value;
    const cpf = document.getElementById('modal-cpf').value;

    // Atualiza o header com o nome do cliente
    const headerUser = document.getElementById('header-user-nome');
    if (headerUser) headerUser.innerText = nome.split(' ')[0]; // Exibe o primeiro nome

    // Preenche automaticamente o formulário de pagamento
    if (document.getElementById('cliente-nome')) document.getElementById('cliente-nome').value = nome;
    if (document.getElementById('cliente-telefone')) document.getElementById('cliente-telefone').value = telefone;
    if (document.getElementById('cliente-cpf')) document.getElementById('cliente-cpf').value = cpf;

    fecharModalCadastro();
    alert(`Bem-vindo(a), ${nome}! Seus dados foram salvos para o pedido.`);
}

// Mascara de CPF (limitado a 11 números)
function mascararCPF(input) {
    let valor = input.value.replace(/\D/g, "");
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = valor;
}

// Troca de abas genérica
function trocarAba(abaId, evt) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const secaoAlvo = document.getElementById(`sec-${abaId}`);
    if (secaoAlvo) {
        secaoAlvo.classList.add('active');
    }
    
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }
}

function irParaCardapio() {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const secaoCardapio = document.getElementById('sec-cardapio');
    if (secaoCardapio) {
        secaoCardapio.classList.add('active');
    }
    
    const botoesAba = document.querySelectorAll('.tab-btn');
    if (botoesAba[2]) {
        botoesAba[2].classList.add('active');
    }
}

function carregarCardapio() {
    const unidadeSelect = document.getElementById('select-unidade');
    if (!unidadeSelect) return;
    
    const unidade = unidadeSelect.value;
    const grid = document.getElementById('grid-cardapio');
    if (!grid) return;

    grid.innerHTML = "";

    if (cardapios[unidade]) {
        cardapios[unidade].forEach(item => {
            let seletorSaborHTML = "";
            if (item.sabores && item.sabores.length > 0) {
                let opcoes = item.sabores.map(s => `<option value="${s}">${s}</option>`).join('');
                seletorSaborHTML = `
                    <div style="margin: 8px 0;">
                        <label for="sabor-${item.id}" style="font-size: 0.85rem; font-weight: bold; color: #555;">Sabor:</label>
                        <select id="sabor-${item.id}" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #ccc; margin-top: 3px;">
                            ${opcoes}
                        </select>
                    </div>
                `;
            }

            grid.innerHTML += `
                <div class="card-item">
                    <img src="${item.imagem}" alt="${item.nome}" class="card-img">
                    <div class="card-content">
                        <h3>${item.nome}</h3>
                        <p>${item.desc}</p>
                        ${seletorSaborHTML}
                        <div class="preco">R$ ${item.preco.toFixed(2)}</div>
                        <button onclick="adicionarAoCarrinho(${item.id}, this)">Adicionar ao Pedido</button>
                    </div>
                </div>
            `;
        });
    }
}

function alterarUnidade() {
    carrinho = [];
    atualizarCarrinho();
    carregarCardapio();
    alert("Unidade alterada! O carrinho foi reiniciado com o cardápio e preços da filial selecionada.");
}

function adicionarAoCarrinho(itemId, btnElement) {
    const unidade = document.getElementById('select-unidade').value;
    const produtoOriginal = cardapios[unidade].find(p => p.id === itemId);
    
    if (produtoOriginal) {
        const produto = { ...produtoOriginal };

        const selectSabor = document.getElementById(`sabor-${itemId}`);
        if (selectSabor) {
            const saborEscolhido = selectSabor.value;
            produto.nome = `${produto.nome} (${saborEscolhido})`;
        }

        carrinho.push(produto);
        atualizarCarrinho();

        if (btnElement) {
            const textoOriginal = btnElement.innerText;
            btnElement.classList.add('btn-adicionado');
            btnElement.innerText = "Adicionado! ✓";
            
            setTimeout(() => {
                btnElement.classList.remove('btn-adicionado');
                btnElement.innerText = textoOriginal;
            }, 800);
        }
    }
}

function atualizarCarrinho() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = carrinho.length;

    const container = document.getElementById('itens-carrinho');
    if (!container) return;

    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #777; padding: 20px 0;">Seu carrinho está vazio.</p>`;
        calcularTotal();
        return;
    }

    carrinho.forEach((item, index) => {
        container.innerHTML += `
            <div style="background:white; padding:10px; margin-bottom:8px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; border:1px solid #ddd;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.imagem}" style="width:45px; height:45px; border-radius:4px; object-fit:cover;">
                    <div>
                        <strong style="display:block;">${item.nome}</strong>
                        <span style="color:#28a745; font-weight:bold;">R$ ${item.preco.toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="background:#dc3545; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-weight:bold;" title="Remover item">
                    🗑️ Excluir
                </button>
            </div>
        `;
    });

    calcularTotal();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function calcularTotal() {
    const subtotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
    let desconto = 0;

    const checkboxPontos = document.getElementById('usar-pontos');
    if (checkboxPontos && checkboxPontos.checked && pontosFidelidade >= 100) {
        desconto = 10.00;
    }

    const total = Math.max(0, subtotal - desconto);

    const subtotalEl = document.getElementById('subtotal-val');
    const descontoEl = document.getElementById('desconto-val');
    const totalEl = document.getElementById('total-val');

    if (subtotalEl) subtotalEl.innerText = subtotal.toFixed(2);
    if (descontoEl) descontoEl.innerText = desconto.toFixed(2);
    if (totalEl) totalEl.innerText = total.toFixed(2);
}

function aceitarLGPD() {
    const banner = document.getElementById('lgpd-banner');
    if (banner) banner.style.display = 'none';
}

function alternarCamposPagamento() {
    const metodoSelect = document.getElementById('metodo-pagamento');
    if (!metodoSelect) return;

    const metodo = metodoSelect.value;
    const pixContainer = document.getElementById('pix-container');
    const cartaoContainer = document.getElementById('cartao-container');

    if (metodo === 'pix') {
        if (pixContainer) pixContainer.style.display = 'block';
        if (cartaoContainer) cartaoContainer.style.display = 'none';
    } else {
        if (pixContainer) pixContainer.style.display = 'none';
        if (cartaoContainer) cartaoContainer.style.display = 'block';
    }
}

function copiarPix() {
    const pixInput = document.getElementById('pix-key');
    if (pixInput) {
        pixInput.select();
        navigator.clipboard.writeText(pixInput.value);
        alert("Chave PIX copiada para a área de transferência!");
    }
}

// Processamento simulado de pagamento
function processarPagamento(e) {
    e.preventDefault();

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const nomeEl = document.getElementById('cliente-nome');
    const nome = nomeEl ? nomeEl.value : "Cliente";
    const telefoneEl = document.getElementById('cliente-telefone');
    const telefone = telefoneEl ? telefoneEl.value : "";
    const unidadeSelect = document.getElementById('select-unidade');
    const unidadeNome = unidadeSelect ? unidadeSelect.options[unidadeSelect.selectedIndex].text : "Unidade";
    const metodo = document.getElementById('metodo-pagamento').value;
    const btnPagar = document.getElementById('btn-confirmar-pag');

    if (metodo === 'cartao') {
        const num = document.getElementById('card-num').value;
        const val = document.getElementById('card-val').value;
        const cvv = document.getElementById('card-cvv').value;

        if (!num || !val || !cvv) {
            alert("Por favor, preencha todos os dados do cartão de crédito.");
            return;
        }
    }

    if (btnPagar) {
        btnPagar.disabled = true;
        btnPagar.innerText = "Processando pagamento no gateway...";
    }

    setTimeout(() => {
        alert("Pagamento Aprovado com sucesso!");

        if (btnPagar) {
            btnPagar.disabled = false;
            btnPagar.innerText = "Pagar e Confirmar Pedido";
        }

        pontosFidelidade += 10;
        const pontosEl = document.getElementById('fidelidade-pontos');
        if (pontosEl) pontosEl.innerText = pontosFidelidade;

        // Gera o ID do Pedido e o PIN de 4 dígitos
        const numPedido = "#" + Math.floor(1000 + Math.random() * 9000);
        pinAtual = Math.floor(1000 + Math.random() * 9000).toString();

        document.getElementById('pedido-id').innerText = numPedido;
        document.getElementById('pedido-cliente').innerText = nome;
        document.getElementById('pedido-unidade').innerText = unidadeNome;
        
        const pinExibicaoEl = document.getElementById('pin-exibicao');
        if (pinExibicaoEl) pinExibicaoEl.innerText = pinAtual;

        // Limpa erros anteriores do PIN se houver
        const erroMsg = document.getElementById('erro-pin-msg');
        const inputPin = document.getElementById('input-pin-cliente');
        if (erroMsg) erroMsg.style.display = 'none';
        if (inputPin) {
            inputPin.value = '';
            inputPin.style.borderColor = '#ccc';
        }

        // Reseta o estado dos containers
        const trackerContainer = document.getElementById('tracker-container');
        const sucessoContainer = document.getElementById('status-sucesso-container');
        if (trackerContainer) trackerContainer.style.display = 'block';
        if (sucessoContainer) sucessoContainer.style.display = 'none';

        // Configura o botão do WhatsApp
        const btnZap = document.getElementById('btn-whatsapp-notif');
        if (btnZap && telefone) {
            const phoneClean = telefone.replace(/\D/g, '');
            const mensagem = encodeURIComponent(`Olá ${nome}! Seu pedido ${numPedido} foi recebido pela ${unidadeNome}! 🌵\n\n🔑 Seu PIN de confirmação/retirada é: *${pinAtual}*\n\nApresente este código para confirmar o recebimento.`);
            btnZap.href = `https://wa.me/55${phoneClean}?text=${mensagem}`;
            btnZap.style.display = "inline-block";
        }

        // Redireciona para a aba de acompanhamento
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        const secStatus = document.getElementById('sec-status');
        if (secStatus) secStatus.classList.add('active');

        carrinho = [];
        atualizarCarrinho();

        simularStatusCozinha();
    }, 2500);
}

// Atualiza as cores do status tracker
function atualizarStatusPedido(passo) {
    const st1 = document.getElementById('st-1');
    const st2 = document.getElementById('st-2');
    const st3 = document.getElementById('st-3');

    if (!st1 || !st2 || !st3) return;

    st1.classList.remove('step-completed');
    st2.classList.remove('step-completed');
    st3.classList.remove('step-completed');

    if (passo >= 1) st1.classList.add('step-completed');
    if (passo >= 2) st2.classList.add('step-completed');
    if (passo >= 3) st3.classList.add('step-completed');
}

function simularStatusCozinha() {
    atualizarStatusPedido(1);

    setTimeout(() => {
        atualizarStatusPedido(2);
    }, 5000);

    setTimeout(() => {
        atualizarStatusPedido(3);
    }, 15000);
}

// Validação estrita do PIN inserido pelo cliente
function validarPINDigitado() {
    const inputPin = document.getElementById('input-pin-cliente');
    const erroMsg = document.getElementById('erro-pin-msg');
    const trackerContainer = document.getElementById('tracker-container');
    const sucessoContainer = document.getElementById('status-sucesso-container');

    if (!inputPin) return;

    const pinDigitado = inputPin.value.trim();

    if (pinDigitado === pinAtual && pinAtual !== "") {
        if (erroMsg) erroMsg.style.display = 'none';
        if (trackerContainer) trackerContainer.style.display = 'none';
        if (sucessoContainer) sucessoContainer.style.display = 'block';
    } else {
        if (erroMsg) erroMsg.style.display = 'block';
        inputPin.style.borderColor = 'var(--cor-principal)';
        inputPin.focus();
    }
}