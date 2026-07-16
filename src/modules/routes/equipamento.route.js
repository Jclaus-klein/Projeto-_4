// Importa o express para usar o recurso de Router.
import express from "express";

// Importa o controller de equipamentos.
// Cada rota abaixo vai chamar um metodo desse controller.
import EquipamentoController from "../controllers/equipamento.controller.js";

// Cria um roteador.
// O Router permite separar as rotas em arquivos menores e mais organizados.
const router = express.Router();

// Rota para listar todos os equipamentos.
// Metodo GET e usado para buscar dados.
router.get("/listar", EquipamentoController.listarTodos);

// Rota para listar um equipamento especifico pelo numero de patrimonio.
// O trecho :num_pat e um parametro de rota.
// Exemplo: /listar/12345
router.get("/listar/:num_pat", EquipamentoController.listarPorNumPat);

// Rota para cadastrar um novo equipamento.
// Metodo POST e usado para criar um novo recurso.
router.post("/cadastrar", EquipamentoController.cadastrar);
// Rota para editar completamente um equipamento.
// Metodo PUT e usado quando queremos enviar todos os dados editaveis.
router.put("/editar/total/:num_pat", EquipamentoController.editarTotal);

// Rota para editar parcialmente um equipamento.
// Metodo PATCH e usado quando queremos enviar apenas alguns campos.
router.patch("/editar/parcial/:num_pat", EquipamentoController.editarParcial);

// Esta rota precisa vir antes de /excluir/:num_pat.
// Se viesse depois, a palavra "todos" poderia ser interpretada como um numero de patrimonio.
router.delete("/excluir/todos", EquipamentoController.excluirTodos);

// Rota para excluir apenas um equipamento pelo numero de patrimonio.
router.delete("/excluir/:num_pat", EquipamentoController.excluirPorNumPat);
export default router;
