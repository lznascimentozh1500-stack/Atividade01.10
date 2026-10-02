const estado = {
  resultado: null,
  historico: []
};

function calcularIMC(peso, altura) {
  return peso / (altura * altura);
}

function classificar(imc) {
  if (imc < 18.5) return { texto: "Abaixo do peso", classe: "abaixo" };
  if (imc < 25) return { texto: "Peso normal", classe: "normal" };
  if (imc < 30) return { texto: "Sobrepeso", classe: "sobrepeso" };
  if (imc < 35) return { texto: "Obesidade grau I", classe: "obesidade" };
  if (imc < 40) return { texto: "Obesidade grau II", classe: "obesidade" };
  return { texto: "Obesidade grau III", classe: "obesidade" };
}

function mostrarErro(mensagem) {
  document.getElementById("erro").textContent = mensagem;
}

function renderResultado() {
  const div = document.getElementById("resultado");

  if (estado.resultado === null) {
    div.innerHTML = "";
    return;
  }

  const { imc, classificacao, pesoMinimo, pesoMaximo } = estado.resultado;
  div.innerHTML = `
    <div class="card ${classificacao.classe}">
      <strong>Seu IMC: ${imc.toFixed(2)}</strong><br>
      Classificação: ${classificacao.texto}<br>
      <strong>Faixa de peso saudável para sua altura:</strong>
      ${pesoMinimo.toFixed(1)} kg a ${pesoMaximo.toFixed(1)} kg
      <p class="nota-peso">Estimativa baseada na faixa de IMC de 18,5 a 24,9 para adultos.</p>
    </div>
  `;
}

function renderHistorico() {
  const ul = document.getElementById("historico");
  ul.innerHTML = "";

  estado.historico.forEach((item, indice) => {
    const li = document.createElement("li");
    li.className = "item-historico";

    const texto = document.createElement("span");
    texto.textContent = `IMC ${item.imc.toFixed(2)} — ${item.classificacao.texto}`;

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "botao-remover";
    remover.textContent = "✕";
    remover.setAttribute("aria-label", `Remover cálculo ${indice + 1}`);
    remover.addEventListener("click", () => {
      estado.historico.splice(indice, 1);
      renderHistorico();
    });

    li.append(texto, remover);
    ul.appendChild(li);
  });
}

document.getElementById("form-imc").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const pesoCampo = document.getElementById("peso");
  const alturaCampo = document.getElementById("altura");
  const peso = Number(pesoCampo.value);
  const altura = Number(alturaCampo.value);

  if (pesoCampo.value.trim() === "" || alturaCampo.value.trim() === "") {
    mostrarErro("Preencha o peso e a altura.");
    return;
  }

  if (!Number.isFinite(peso) || peso <= 0) {
    mostrarErro("Informe um peso válido maior que zero.");
    return;
  }

  if (!Number.isFinite(altura) || altura <= 0 || altura > 2.5) {
    mostrarErro("Informe uma altura maior que zero e de, no máximo, 2,5 m.");
    return;
  }

  mostrarErro("");
  const imc = calcularIMC(peso, altura);
  const classificacao = classificar(imc);

  // Faixa de peso correspondente ao IMC de 18,5 até 24,9 para adultos:
  // peso = IMC × altura²
  const pesoMinimo = 18.5 * altura * altura;
  const pesoMaximo = 24.9 * altura * altura;
  const calculo = { imc, classificacao, pesoMinimo, pesoMaximo };

  estado.resultado = calculo;
  estado.historico.unshift(calculo);

  renderResultado();
  renderHistorico();
});

document.getElementById("limpar-historico").addEventListener("click", () => {
  estado.historico = [];
  estado.resultado = null;
  mostrarErro("");
  renderResultado();
  renderHistorico();
});

renderResultado();
renderHistorico();
