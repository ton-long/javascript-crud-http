import api from "./api.js";
import ui from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos();

  const formularioPensamento = document.getElementById("pensamento-form");
  const cancelarBtn = document.getElementById("botao-cancelar");
  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);
  cancelarBtn.addEventListener("click", () => formularioPensamento.reset());
});

async function manipularSubmissaoFormulario(e) {
  e.preventDefault();
  const id = document.getElementById("pensamento-id").value;
  const conteudo = document.getElementById("pensamento-conteudo").value;
  const autoria = document.getElementById("pensamento-autoria").value;

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria });
    } else {
      await api.salvarPensamento({ conteudo, autoria });
    }
    ui.renderizarPensamentos();
  } catch {
    alert("Erro ao salvar pensamentos");
  }
}
