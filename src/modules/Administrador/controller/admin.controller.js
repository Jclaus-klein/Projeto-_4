import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import AdministradorModel from "../models/admin.model.js";

class AdministradorController {
  static async cadastrar(requisicao, resposta) {
    try {
      const { id, nome, email, senha } = requisicao.body;
      if (!id || !nome || !email || senha) {
        return resposta
          .status(400)
          .json({ mensagem: "Todos os campos são obrigatórios" });
      }
      const totalAdmin = await AdministradorModel.contarAdmins();
      if (totalAdmin > 0) {
        return resposta
          .status(409)
          .json({ mensagem: "Administrador já existe" });
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
      await AdministradorModel.cadastrar(id, nome, email, (senha = hashSenha));
      return resposta
        .status(201)
        .json({ mensagem: "Usuário Administrador criado com sucesso!" });
    } catch (error) {
      resposta
        .status(500)
        .json({ mensagem: "Erro ao Cadastrar o Administrador" });
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
      if (administrador.length === 0) {
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
        mensagem: "Erro ao tentar efetuar login!",
      });
    }
  }
  static async perfil(requisicao, resposta){
    try{
      const administrador = await AdministradorModel.buscarPorEmail(requisicao.administrador.email)
      if(administrador === 0){
        return resposta.status(409).json({mensagem:"Usuário precisa estar logado para acessar o perfil!"})
      }
      resposta.status(200).json(administrador)
    }catch(error){
      resposta.status(500).json({mensagem: "Erro ao buscar perfil do usuário!", erro: error.message})
    }
  }
}
