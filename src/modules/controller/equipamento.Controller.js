// Importa o model, que e a camada responsavel por manipular os dados.
import EquipamentoModel from "../model/equipamento.Model.js";

// O Controller e a camada responsavel por receber a requisicao,
// chamar o model e devolver uma resposta HTTP.
//
// Em outras palavras:
// - a rota define o caminho da API
// - o controller decide o que fazer quando esse caminho e acessado
// - o model mexe nos dados

class EquipamentoController {
  // Controller da rota POST /cadastrar.
  static async cadastrar(requisicao, resposta) {
    try {
      // Pega os dados enviados no corpo da requisicao.
      // Exemplo de body:
      // { "num_pat": "P001", "nome": "Maria", "setor": "TI", "estado": "Em uso" }
      const { num_pat, nome, setor,estado } = requisicao.body;

      // Valida se todos os campos obrigatorios foram enviados.
      if (!num_pat || !nome || !setor || !estado) {
        return resposta
          .status(400)
          .json({ mensagem: "Todos os campos sao obrigatorios!" });
      }

      // Verifica se ja existe um equipamento com o mesmo numero de patrimonio.
      // Isso evita cadastrar duas vezes o mesmo numero de patrimonio.
      const equipamentoJaExiste = EquipamentoModel.listarPorNumPat(num_pat);

      if (equipamentoJaExiste) {
        return resposta
          .status(400)
          .json({ mensagem: "Ja existe um equipamento com esse numero de patrimonio!" });
      }

      // Chama o model para salvar o equipamento.
      const equipamento = EquipamentoModel.cadastrar(num_pat, nome, setor, estado);
      // Status 201 significa que um recurso foi criado com sucesso.
      return resposta.status(201).json({
        mensagem: "Cadastro realizado com sucesso!",
        equipamento
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao cadastrar equipamento!", erro: error.message });
    }
  }

  // Controller da rota GET /listar.
  static async listarTodos(requisicao, resposta) {
    try {
      const equipamento = await EquipamentoModel.listarTodos();

      // Se o array estiver vazio, avisamos que nao ha equipamentos cadastrados.
      if (equipamento.length === 0) {
        return resposta
          .status(200)
          .json({ mensagem: "Nenhum equipamento cadastrado!" });
      }

      return resposta.status(200).json(equipamento);
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao listar os equipamentos!", erro: error.message });
    }
  }

  // Controller da rota GET /listar/:matricula.
  static async listarPorNum_Pat(requisicao, resposta) {
    try {
      // req.params contem os parametros que vem na URL.
      // Exemplo: em /listar/a92222, matricula recebe "a92222".
      const { num_pat } = requisicao.params;

      const equipamento = EquipamentoModel.listarPorNumPat(num_pat);

      if (!equipamento) {
        return resposta
          .status(404)
          .json({ mensagem: "Equipamento nao encontrado!" });
      }

      return resposta.status(200).json(equipamento);
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao listar o equipamento!", erro: error.message });
    }
  }

  // Controller da rota PUT /editar/total/:matricula.
  // PUT normalmente e usado para atualizar o recurso de forma completa.
  static async editarTotal(requisicao, resposta) {
    try {
      const  num_pat  = requisicao.params.num_pat;
      const { nome, setor, estado } = requisicao.body;

      // Como e edicao total, exigimos nome e email.
      if (!nome || !setor || !estado) {
        return resposta
          .status(400)
          .json({ mensagem: "Nome, setor e estado sao obrigatorios para edicao total!" });
      }

      const equipamento = EquipamentoModel.editarTotal(num_pat, nome, setor, estado);

      if (!equipamento) {
        return resposta
          .status(404)
          .json({ mensagem: "Equipamento nao encontrado!" });
      }

      return resposta.status(200).json({
        mensagem: "Equipamento atualizado com sucesso!",
        equipamento
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao atualizar o equipamento!", erro: error.message });
    }
  }

  // Controller da rota PATCH /editar/parcial/:num_pat.
  // PATCH normalmente e usado para atualizar apenas parte do recurso.
  static async editarParcial(requisicao, resposta) {
    try {
      const { num_pat } = requisicao.params;
      const { nome, setor, estado } = requisicao.body;

      // Na edicao parcial, pelo menos um campo precisa ser enviado.
      if (!nome && !setor && !estado) {
        return resposta
          .status(400)
          .json({ mensagem: "Informe nome, setor ou estado para atualizar!" });
      }

      const equipamento = EquipamentoModel.editarParcial(num_pat, nome, setor, estado);

      if (!equipamento) {
        return resposta
          .status(404)
          .json({ mensagem: "Equipamento nao encontrado!" });
      }

      return resposta.status(200).json({
        mensagem: "Equipamento atualizado com sucesso!",
        equipamento
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao atualizar o equipamento!", erro: error.message });
    }
  }

  // Controller da rota DELETE /excluir/todos.
  static async excluirTodos(requisicao, resposta) {
    try {
      EquipamentoModel.excluirTodos();

      return resposta
        .status(200)
        .json({ mensagem: "Todos os equipamentos foram excluidos!" });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao excluir todos os equipamentos!", erro: error.message });
    }
  }

  // Controller da rota DELETE /excluir/:matricula.
  static async excluirPorMatricula(requisicao, resposta) {
    try {
      const num_pat = requisicao.params.num_pat;

      const equipamento = await EquipamentoModel.excluirPorNumPat(num_pat);
      if (!equipamento) {
        return resposta.status(404).json({ mensagem: "Equipamento nao encontrado!" });
      }

      return resposta.status(200).json({
        mensagem: "Equipamento excluido com sucesso!",
        equipamento
      });
    } catch (error) {
      return resposta.status(500).json({ mensagem: "Erro ao excluir o equipamento!", erro: error.message });
    }
  }
}

export default EquipamentoController;
