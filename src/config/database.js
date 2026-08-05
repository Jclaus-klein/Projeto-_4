// Em um projeto real, aqui normalmente fariamos a conexao com um banco
// como MySQL, PostgreSQL, MongoDB, SQLite, entre outros.
import pg from 'pg'
import dotenv from "dotenv"
dotenv.config()

const { Pool } = pg

const conexao = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
})
try {
  await conexao.query('SELECT NOW()')
  console.log("Banco Conectado com Sucesso")
} catch (error) {
  console.error("Erro ao se conectar com o Banco",error.message)
}

export default conexao;

