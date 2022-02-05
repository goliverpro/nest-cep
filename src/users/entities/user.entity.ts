import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number

    @Column({length:50})
    nome: string
    
    @Column({length:12})
    telefone: string

    @Column({length:8})
    cep: string

    @Column({length:50})
    logradouro: string

    @Column({length:25})
    cidade: string

    @Column({length:25})
    estado: string
}
