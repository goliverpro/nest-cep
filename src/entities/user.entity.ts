import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    constructor(nome: string, telefone: string, cpf: string, cep: string,
        logradouro: string, cidade: string, estado: string) {
            this.nome = nome,
            this.telefone = telefone,
            this.cpf = cpf,
            this.cep = cep,
            this.logradouro = logradouro,
            this.cidade = cidade,
            this.estado = estado
    }

    @PrimaryGeneratedColumn()
    id?: number

    @Column({ length: 50 })
    nome: string

    @Column({ length: 12 })
    telefone: string

    @Column({ length: 11 })
    cpf?: string

    @Column({ length: 8 })
    cep: string

    @Column({ length: 50 })
    logradouro: string

    @Column({ length: 25 })
    cidade: string

    @Column({ length: 25 })
    estado: string
}
