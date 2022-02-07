Tecnologias utilizadas
Node, nestjs, axios, ioredis, postgress, docker 

Criar arquivo .env copiando as informações do arquivo .env-example, não esquecer de setar um password qualquer na variável
DB_PASSWORD

- Subir aplicação com docker 
- docker-compose up
- Rodar testes 
- npm run test:watch -t src/controllers/users.controller.spec 