# Sistema de Gerenciamento de Livraria

Neste projeto, utilizamos o **Docker** para garantir um ambiente de desenvolvimento consistente e isolado, facilitando a configuração e a portabilidade do sistema. Dentro do Docker, criamos um contêiner com um banco de dados **PostgreSQL**, onde foram modeladas as tabelas `Livro`, `Editora`, `Autor`, `Pedido`, `ItemPedido` e `Cliente`. Essas tabelas formam a base do sistema de gerenciamento de livraria.

O acesso ao banco de dados é realizado por meio de uma **API RESTful** desenvolvida com **FastAPI**, um framework moderno e de alto desempenho para construção de APIs em Python. O FastAPI permite uma integração eficiente com o banco de dados, oferecendo endpoints para operações de CRUD (Create, Read, Update, Delete) e garantindo uma experiência de desenvolvimento ágil e produtiva.

---

## Estrutura do Banco de Dados

As tabelas foram projetadas para atender às necessidades de um sistema de gerenciamento de livraria, com relacionamentos bem definidos entre `Livro`, `Editora`, `Autor`, `Pedido`, `ItemPedido` e `Cliente`. Isso permite uma gestão eficiente de estoque, pedidos e informações de clientes.

---

## Como Executar o Projeto

Para rodar o projeto localmente, siga as instruções abaixo:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Luanamero/SimpleCRUD.git
   cd SimpleCRUD

2. **Suba os contêineres com Docker Compose**:
   ```bash
   docker-compose up -d

3. **Acesse a API**:
    Acesse a documentação interativa do FastAPI em http://localhost:8000/docs.

4. **Recrie o ambiente virtual e instale as dependências**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows: venv\Scripts\activate
    pip install -r requirements.txt

## Tecnologias Utilizadas

- **Docker**: Para conteinerização do banco de dados e da aplicação.
- **PostgreSQL**: Banco de dados relacional para armazenamento das informações.
- **FastAPI**: Framework para construção da API back-end.
- **SQLAlchemy**: ORM para interação com o banco de dados.
