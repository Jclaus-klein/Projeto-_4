import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import AdministradorModel from "../models/admin.model.js";

class AdministradorController {
  static async cadastrar(requisicao, resposta) {
    try {
      const {nome, email, senha } = requisicao.body;
      if (!nome || !email || !senha) {
        return resposta
          .status(400)
          .json({ mensagem: "Todos os campos são obrigatórios" });
      }
      const totalAdmin = await AdministradorModel.verificaAdminsAtivos();
      if (totalAdmin > 0) {
        return resposta
          .status(409)
          .json({ mensagem: "Existe um Administrador cadastrado e ativo no sistema!" });
      }
      if (senha.length < 8) {
        return resposta
          .status(403)
          .json({ mensagem: "A senha deve ter no mínimo 8 caracteres!" });
      }
      const regex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/;
      if (!regex.test(senha)) {
        return resposta.status(403).json({
          mensagem:
            "Senha invalida! Sua senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial (ex: @, #, $, %)",
        });
      }
      const regexEmail =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
      if (!regexEmail.test(email)) {
        return resposta.status(403).josn({
          mensagem: "E-mail invalido. Por favor, forneça um e-mail válido!",
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashSenha = bcrypt.hashSync(senha, salt);
      await AdministradorModel.cadastrar(nome, email, hashSenha);
      return resposta
        .status(201)
        .json({ mensagem: "Usuário Administrador criado com sucesso!" });
    } catch (error) {
      resposta
        .status(500)
        .json({ mensagem: "Erro ao Cadastrar o Administrador",erro:error.message });
    }
  }
  static async login(requisicao, resposta) {
    try {
      const { email, senha } = requisicao.body;
      if (!email || !senha) {
        return resposta
          .status(403)
          .json({ mensagem: "Todos os campos são obrigatórios" });
      }
      const administrador = await AdministradorModel.buscarPorEmail(email);
      if (!administrador) {
        return resposta
          .status(400)
          .json({ mensagem: "Usuário não encontrado!" });
      }
      if (administrador.ativo === false) {
        return resposta
          .status(403)
          .json({ mensagem: "Administrador Inativo!" });
      }
      const verificarSenha = bcrypt.compareSync(senha, administrador.senha);
      if (!verificarSenha) {
        return resposta
          .status(403)
          .json({ mensagem: "E-mail ou senha incorreta" });
      }
      const token = jwt.sign(
        {
          id: administrador.id,
          nome: administrador.nome,
          email: administrador.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TEMPO_EXPIRACAO,
        },
      );
      return resposta.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
      });
    } catch (error) {
      return resposta.status(500).json({
        mensagem: "Erro ao tentar efetuar login!",erro:error.message,
      });
    }
  }
  static async perfil(requisicao, resposta){
    try{
      const idDoToken = requisicao.usuario.id
      const administrador = await AdministradorModel.buscarPorId(idDoToken)
      if(!administrador){
        return resposta.status(404).json({mensagem:"Usuário não encontrado!"})
      }
     return resposta.status(200).json(administrador)
    }catch(error){
      resposta.status(500).json({mensagem: "Erro ao buscar perfil do usuário!", erro: error.message})
    }
  }
}
export default AdministradorController
