import api from "./api.js";
import ui from "./ui.js";

const pensamentosSet = new Set();

async function adicionarChaveAoPensamento() {
  try {
    const pensamentos = await api.buscarPensamentos();
    pensamentos.forEach((pensamento) => {
      const chavePensamento = `${pensamento.conteudo
        .trim()
        .toLowerCase()}-${pensamento.autoria.trim().toLowerCase()}`;
      pensamentosSet.add(chavePensamento);
    });
  } catch (error) {
    alert("Erro ao adicionar chave ao pensamento.");
    console.log(error);
  }
}

function removerEspacos(string) {
  return string.replaceAll(/\s+/g, "");
}

const regexConteudo = /^[A-Za-z\s]{10,}$/;
function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo);
}

const regexAutoria = /^[A-Za-z\s]{3,15}$/;
function validarAutoria(autoria) {
  return regexAutoria.test(autoria);
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();
  adicionarChaveAoPensamento();

  const formularioPensamento = document.getElementById("pensamento-form");
  const cancelarBtn = document.getElementById("botao-cancelar");
  const inputBusca = document.getElementById("campo-busca");

  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  cancelarBtn.addEventListener("click", () => formularioPensamento.reset());
  inputBusca.addEventListener("input", manipularBusca);
});

async function manipularSubmissaoFormulario(e) {
  e.preventDefault();
  const id = document.getElementById("pensamento-id").value;
  const conteudo = document.getElementById("pensamento-conteudo").value;
  const autoria = document.getElementById("pensamento-autoria").value;
  const data = document.getElementById("pensamento-data").value;

  const conteudoSemEspacos = removerEspacos(conteudo);
  const autoriaSemEspacos = removerEspacos(autoria);

  if (!validarConteudo(conteudoSemEspacos)) {
    alert(
      "É permitida a inclusão apenas de letras e espaços, com no mínimo de 10 caracteres."
    );
    return;
  }

  if (!validarAutoria(autoriaSemEspacos)) {
    alert("Só é permitida a inclusão de letras e entre 3 e 15 caracteres.");
    return;
  }

  if (!validarData(data)) {
    alert("Não é permitido o cadastro de datas futuras. Selecione outra data.");
    return;
  }

  const chaveNovoPensamento = `${conteudo.trim().toLowerCase()}-${autoria
    .trim()
    .toLowerCase()}`;

  if (pensamentosSet.has(chaveNovoPensamento)) {
    alert("Esse pensamento já existe.");
    return;
  }

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria, data });
    } else {
      await api.salvarPensamento({ conteudo, autoria, data });
    }
    ui.renderizarPensamentos();
  } catch {
    alert("Erro ao salvar pensamentos");
  }
}

async function manipularBusca() {
  const termoBusca = document.getElementById("campo-busca").value;
  try {
    const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBusca);
    ui.renderizarPensamentos(pensamentosFiltrados);
  } catch (error) {
    alert("Erro ao realizar busca.");
  }
}

function validarData(data) {
  const dataAtual = new Date();
  const dataInserida = new Date(data);
  return dataInserida <= dataAtual;
}
