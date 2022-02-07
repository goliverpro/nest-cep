import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { delRedis, getRedis, setRedis } from '../redisConfig';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity'

@Injectable()
export class UsersService {
  constructor(private httpService: HttpService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    const cpfRecupera = await this.usersRepository.findOne({ cpf: createUserDto.cpf });
    if (typeof cpfRecupera !== 'undefined') {
      throw new Error('Usuário já existe');
    }
    await this.httpService.get(`https://viacep.com.br/ws/${createUserDto.cep}/json`)
      .toPromise().then(res => {
        createUserDto.cidade = res.data.localidade;
        createUserDto.estado = res.data.uf;
        createUserDto.logradouro = res.data.logradouro;

        const user = new User(createUserDto.nome, createUserDto.telefone,
          createUserDto.cpf, createUserDto.cep, createUserDto.logradouro,
          createUserDto.cidade, createUserDto.estado);

        this.usersRepository.save(user);
        setRedis(`user-${user.cpf}`, JSON.stringify(user));
        return res.status;
      }
      )
      .catch(err => err)
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const userRedis = await getRedis(`user-${id}`);
    const user = JSON.parse(userRedis);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userRedis = await getRedis(`user-${id}`);
    const user = JSON.parse(userRedis);
    await this.httpService.get(`https://viacep.com.br/ws/${user.cep}/json`)
      .toPromise().then(async res => {
        updateUserDto.cidade = res.data.localidade;
        updateUserDto.estado = res.data.uf;
        updateUserDto.logradouro = res.data.logradouro;
        const x = await this.usersRepository.update({ cpf: id }, updateUserDto);

        const cpfRecupera = await this.usersRepository.findOne({ cpf: id });
        const user = new User(cpfRecupera.nome, cpfRecupera.telefone,
          cpfRecupera.cpf, cpfRecupera.cep, cpfRecupera.logradouro,
          cpfRecupera.cidade, cpfRecupera.estado);

        setRedis(`user-${id}`, JSON.stringify(user));

        return `Dados do cpf #${id} atualizados!`;
      })
  }

  async remove(id: string) {
    await this.usersRepository.delete({ cpf: id })
    delRedis(`user-${id}`)
    return `Usuario do cpf #${id} deletado!`;
  }


}
