import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';

const usersList: User[] = [
  new User("Jose", "1111111111", "22222222222", "33333333", "Riacho fundo", "Brasilia", "DF"),
  new User("Maria", "1111111111", "33333333333", "33333333", "Riacho fundo", "Brasilia", "DF"),
  new User("Joao", "1111111111", "44444444444", "33333333", "Riacho fundo", "Brasilia", "DF")
];
const novoUser = new User("Jose2", "1111111111", "55555555555", "33333333", "Riacho fundo", "Brasilia", "DF");
const atualizaUser = new User("Jose3", "1111111111", "66666666666", "33333333", "Riacho fundo", "Brasilia", "DF");

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(usersList),
            findOneOrFail: jest.fn().mockResolvedValue(usersList[0]),
            create: jest.fn().mockReturnValue(usersList[0]),
            merge: jest.fn().mockReturnValue(atualizaUser),
            save: jest.fn().mockResolvedValue(usersList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        }],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});

it('should be defined', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  expect(usersService).toBeDefined();
  expect(usersRepository).toBeDefined();
});

describe('findAll', () => {
  it('should return a todo entity list successfully', async () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Act
    const result = await usersService.findAll();
    console.log(result)

    // Assert
    expect(result).toEqual(usersList);
    expect(usersRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Arrange
    jest.spyOn(usersRepository, 'find').mockRejectedValueOnce(new Error());

    // Assert
    expect(usersService.findAll()).rejects.toThrowError();
  });
});

describe('findOne', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  it('should return a todo entity item successfully', async () => {
    // Act
    const result = await usersService.findOne('1');

    // Assert
    expect(result).toEqual(usersList[0]);
    expect(usersRepository.findOneOrFail).toHaveBeenCalledTimes(1);
  });

  it('should throw a not found exception', () => {
    
    // Arrange
    jest
      .spyOn(usersRepository, 'findOne')
      .mockRejectedValueOnce(new Error());

    // Assert
    expect(usersService.findOne('1')).rejects.toThrowError(
      NotFoundException,
    );
  });
});

describe('create', () => {
  it('should create a new todo entity item successfully', async () => {
    // Arrange
    const data: CreateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "55555555555",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose2",
      telefone: "1111111111"
    };
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Act
    const result = await usersService.create(data);

    // Assert
    expect(usersRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception', () => {
    // Arrange
    const data: CreateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "6666666666633",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose2",
      telefone: "1111111111"
    };
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    jest.spyOn(usersRepository, 'save').mockRejectedValueOnce(new Error());

    // Assert
    expect(usersService.create(data)).rejects.toThrowError();
  });
});

describe('update', () => {
  it('should update a todo entity item successfully', async () => {
    // Arrange
    const data: UpdateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "66666666666",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose3",
      telefone: "1111111111"
    };
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    jest
      .spyOn(usersRepository, 'save')
      .mockResolvedValueOnce(atualizaUser);

    // Act
    const result = await usersService.update('1', data);

    // Assert
    expect(result).toEqual(atualizaUser);
  });

  it('should throw a not found exception', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Arrange
    jest
      .spyOn(usersRepository, 'findOneOrFail')
      .mockRejectedValueOnce(new Error());

    const data: UpdateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "6666666666633",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose2",
      telefone: "1111111111"
    };

    // Assert
    expect(usersService.update('1', data)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should throw an exception', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Arrange
    jest.spyOn(usersRepository, 'save').mockRejectedValueOnce(new Error());

    const data: UpdateUserDto = {
      cep: "33333333",
      cidade: "Brasilia",
      cpf: "6666666666633",
      estado: "DF",
      logradouro: "Riacho fundo",
      nome: "Jose2",
      telefone: "1111111111"
    };

    // Assert
    expect(usersService.update('1', data)).rejects.toThrowError();
  });
});

describe('deleteById', () => {
  it('should delete a todo entity item successfully', async () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Act
    const result = await usersService.remove('1');

    // Assert
    expect(result).toBeUndefined();
    expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(usersRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw a not found exception', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Arrange
    jest
      .spyOn(usersRepository, 'findOneOrFail')
      .mockRejectedValueOnce(new Error());

    // Assert
    expect(usersService.remove('1')).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should throw an exception', () => {
    let usersService: UsersService;
    let usersRepository: Repository<User>;
    // Arrange
    jest
      .spyOn(usersRepository, 'softDelete')
      .mockRejectedValueOnce(new Error());

    // Assert
    expect(usersService.remove('1')).rejects.toThrowError();
  });
});
