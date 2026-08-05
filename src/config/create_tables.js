import conexao from "./database.js";

async function criarTabela(){
    try{
        const query = `
            CREATE TABLE IF NOT EXISTS equipamento (
                num_pat VARCHAR(20) PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                setor VARCHAR(80) NOT NULL,
                estado VARCHAR(30) NOT NULL
            );
        `;
        await conexao.query(query);
        console.log("Tabelas Criadas com sucesso!")
    }catch(erro){
        console.error('Erro ao criar tabela:', erro.message);
    }
}
export default criarTabela;