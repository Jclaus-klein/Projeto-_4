// Importa a conexão do banco pg
import conexao from "../../config/database.js";

// O Model e a camada responsavel por lidar diretamente com os dados.
//
// Neste projeto, o model mexe no array equipamentos, mas em um projeto real ele poderia mexer com um banco de dados.:
// - adiciona equipamento
// - lista equipamento
// - edita equipamento
// - exclui equipamento
//
// Os metodos sao static porque nao precisamos criar objetos com new EquipamentoModel().
// Chamamos direto assim: EquipamentoModel.cadastrar(...).
class EquipamentoModel {
  // Cadastra um novo Equipamento no array.
  static async cadastrar(num_pat, nome, setor, estado) {
    const dados = [num_pat, nome, setor, estado];
    const query = `insert into equipamento(num_pat, nome, setor, estado) values ($1, $2, $3, $4) RETURNING *`;
    const resultado = await conexao.query(query, dados);
    return resultado.rows[0];
  }

  // Retorna todos os equipamentos cadastrados.
  static async listarTodos() {
    const query = `select * from equipamento`;
    const resultado = await conexao.query(query);
    return resultado;
  }

  // Busca um equipamento pelo numero de patrimonio.
  static async listarPorNumPat(num_pat) {
    const dados = [num_pat];
    const query = `select * from equipamento where num_pat = $1`;
    const resultado = await conexao.query(query, dados);
    return resultado;
  }

  // Edita todos os dados editaveis de um equipamento.
  // Nesta API, usamos PUT quando nome e email precisam ser enviados.
  static async editarTotal(num_pat, nome, setor, estado) {
    // Primeiro procuramos o equipamento pelo numero de patrimonio.
    const equipamento = await EquipamentoModel.listarPorNumPat(num_pat);
    // Se o equipamento nao existir, retornamos null para o controller tratar.
    if (equipamento.length === 0) {
      return null;
    }

    const dados = [num_pat, nome, setor, estado];
    const query = `update equipamento 
        set nome = $2, setor = $3, estado = $4
        where num_pat = $1 returning *;`;
    const resultado = await conexao.query(query, dados);
    return resultado.rows[0];
  }

  // Edita apenas os campos enviados.
  // Nesta API, usamos PATCH quando o usuario pode enviar somente nome ou somente email.
  static async editarParcial(num_pat, nome, setor, estado) {
    const equipamento = await EquipamentoModel.listarPorNumPat(num_pat);
    if (equipamento.length === 0) {
      return null;
    }
    const dados = [num_pat, nome, setor, estado];
    const query = `update equipamento 
        set nome = coalesce($2, nome), setor = coalesce($3, setor), estado = coalesce($4, estado)
        where num_pat = $1 returning *;`;
    const resultado = await conexao.query(query, dados);
    return resultado.rows[0];
  }

  // Exclui um equipamento pelo numero de patrimonio.
  static async excluirPorNum_Pat(num_pat) {
    const equipamento = await EquipamentoModel.listarPorNumPat(num_pat);
    if (equipamento.length === 0) {
      return null;
    }
    const dados = [num_pat];
    const query = `delete from equipamento where num_pat = $1 returning *`;
    const resultado = await conexao.query(query, dados);
    return resultado.rows[0];
  }

  // Exclui todos os equipamentos do array.
  static async excluirTodos() {
    const query = `delete from equipamento returning *`;
  }
}

export default EquipamentoModel;
