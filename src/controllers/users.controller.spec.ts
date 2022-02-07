import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

const usersList: User[] = [
  new User("Jose", "1111111111", "22222222222","33333333", "Riacho fundo", "Brasilia", "DF"),
  new User("Maria", "1111111111", "33333333333","33333333", "Riacho fundo", "Brasilia", "DF"),
  new User("Joao", "1111111111", "44444444444","33333333", "Riacho fundo", "Brasilia", "DF")
];
const novoUser = new User("Jose2", "1111111111", "55555555555","33333333", "Riacho fundo", "Brasilia", "DF");
const atualizaUser = new User("Jose3", "1111111111", "66666666666","33333333", "Riacho fundo", "Brasilia", "DF");
describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[ {
        provide: UsersService,
        useValue: {
          findAll: jest.fn().mockResolvedValue(usersList),
          create: jest.fn().mockResolvedValue(novoUser),
          findOneOrFail: jest.fn().mockResolvedValue(usersList[0]),
          update: jest.fn().mockResolvedValue(atualizaUser),
          deleteById: jest.fn().mockResolvedValue(undefined),
        },
      },],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });
});

describe('create', () => {
  it('Criação de usuario = sucesso', async () => {
    // Arrange
    const body: CreateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "55555555555",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose2",
      telefone: "1111111111"
    };
    let usersController: UsersController;
    let usersService: UsersService;
    // Act
    const result = await usersController.create(body);

    // Assert
    // expect(result).toEqual(novoUser);
    expect(usersService.create).toHaveBeenCalledTimes(1);
    expect(usersService.create).toHaveBeenCalledWith(body);
  });

  it('should throw an exception', () => {
    // Arrange
    const body: CreateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "55555555555",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose2",
      telefone: "1111111111"
    };
    let usersController: UsersController;
    let usersService: UsersService;
    jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error());

    // Assert
    expect(usersController.create(body)).rejects.toThrowError();
  });
});

describe('findOne', () => {
  it('should get a todo item successfully', async () => {
    let usersController: UsersController;
    let usersService: UsersService;
    // Act
    const result = await usersController.findOne('1');

    // Assert
    expect(result).toEqual(usersList[0]);
    expect(usersService.findOne).toHaveBeenCalledTimes(1);
    expect(usersService.findOne).toHaveBeenCalledWith('1');
  });

  it('should throw an exception', () => {
    let usersController: UsersController;
    let usersService: UsersService;
    // Arrange
    jest
      .spyOn(usersService, 'findOne')
      .mockRejectedValueOnce(new Error());

    // Assert
    expect(usersController.findOne('1')).rejects.toThrowError();
  });
});

describe('update', () => {
  it('should update a todo item successfully', async () => {
    // Arrange
    const body: UpdateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "66666666666",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose3",
      telefone: "1111111111"
    };
    let usersController: UsersController;
    let usersService: UsersService;
    // Act
    const result = await usersController.update('1', body);

    // Assert
    expect(result).toEqual(atualizaUser);
    expect(usersService.update).toHaveBeenCalledTimes(1);
    expect(usersService.update).toHaveBeenCalledWith('1', body);
  });

  it('should throw an exception', () => {
    // Arrange
    const body: UpdateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "66666666666",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose3",
      telefone: "1111111111"
    };
    let usersController: UsersController;
    let usersService: UsersService;
    jest.spyOn(usersService, 'update').mockRejectedValueOnce(new Error());

    // Assert
    expect(usersController.update('1', body)).rejects.toThrowError();
  });
});

describe('remove', () => {
  it('should remove a todo item successfully', async () => {
    let usersController: UsersController;
    let usersService: UsersService;
    // Act
    const result = await usersController.remove('1');

    // Assert
    expect(result).toBeUndefined();
  });

  it('should throw an exception', () => {
    let usersController: UsersController;
    let usersService: UsersService;
    // Arrange
    jest.spyOn(usersService, 'remove').mockRejectedValueOnce(new Error());

    // Assert
    expect(usersController.remove('1')).rejects.toThrowError();
  });
});
