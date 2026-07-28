import express from 'express'
import AdministradorController from '../controller/admin.controller.js'
import AutenticacaoMiddleware from '../../../middleware/autenticacao.middeware.js'
const routerAdmin =  express.Router()
//rotas Privadas
routerAdmin.post("/cadastrar", AdministradorController.cadastrar)
routerAdmin.post("/login", AdministradorController.login)

routerAdmin.get("/perfil/:email",AutenticacaoMiddleware.autenticar ,AdministradorController.perfil)

export default routerAdmin
