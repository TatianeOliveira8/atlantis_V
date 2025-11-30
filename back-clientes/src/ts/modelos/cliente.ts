import Documento from "./documento"
import Endereco from "./endereco"
import Telefone from "./telefone"

export default class Cliente {
    private nome: string
    private nomeSocial: string
    private dataNascimento: Date
    private dataCadastro: Date
    private telefones: Telefone[] = []
    private endereco!: Endereco
    private documentos: Documento[] = []
    private dependentes: Cliente[] = []
    private titular!: Cliente

    constructor(nome: string, nomeSocial: string, dataNascimento: Date) {
        this.nome = nome
        this.nomeSocial = nomeSocial
        this.dataNascimento = dataNascimento
        this.dataCadastro = new Date()
    }

    public get Nome() { return this.nome }
    public set Nome(novoNome: string) { this.nome = novoNome }
    public get NomeSocial() { return this.nomeSocial }
    public set NomeSocial(novoNomeSocial: string) { this.nomeSocial = novoNomeSocial }
    public get DataNascimento() { return this.dataNascimento }
    public set DataNascimento(novaDataNascimento: Date) { this.dataNascimento = novaDataNascimento }
    public get DataCadastro() { return this.dataCadastro }
    public get Telefones() { return this.telefones }
    public get Endereco() { return this.endereco }
    public get Documentos() { return this.documentos }
    public get Dependentes() { return this.dependentes }
    public get Titular() { return this.titular }

    public set Titular(titular: Cliente) { this.titular = titular }
    public set Endereco(endereco: Endereco) { this.endereco = endereco }


    public adicionarTelefone(telefone: Telefone) {
        this.telefones.push(telefone);
    }

    public adicionarDependente(dependente: Cliente) {
    dependente.titular = this;

    if (this.endereco) {
        dependente.endereco = this.endereco.clonar() as Endereco;
    }
    this.dependentes.push(dependente);
}
    public removerDependente(dependente: Cliente) {
        this.dependentes = this.dependentes.filter(d => d !== dependente);
    }
}