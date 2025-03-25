CREATE TABLE Autor ( id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
nacionalidade VARCHAR(100)
);

CREATE TABLE Editora ( id SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
endereco VARCHAR(255)
);

CREATE TABLE Livro ( id SERIAL PRIMARY KEY, -- ID único do livro
titulo VARCHAR(255) NOT NULL, -- Título do livro
autor_id INT NOT NULL, -- Chave estrangeira para a tabela Autor
preco NUMERIC(10, 2) NOT NULL, -- Preço do livro (com 2 casas decimais)
estoque INT NOT NULL, -- Quantidade em estoque
editora_id INT NOT NULL, -- Chave estrangeira para a tabela Editora
ano_publicacao INT NOT NULL, -- Ano de publicação
genero VARCHAR(100), -- Gênero do livro -- Definindo as chaves estrangeiras
CONSTRAINT fk_autor
FOREIGN KEY (autor_id) REFERENCES
Autor(id) ON DELETE CASCADE, -- Remove o livro se o autor for removido
CONSTRAINT fk_editora
FOREIGN KEY (editora_id) REFERENCES
Editora(id) ON DELETE CASCADE -- Remove o livro se a editora for removida );
);

CREATE TABLE Cliente (
id SERIAL PRIMARY KEY, -- ID único do cliente
nome VARCHAR(255) NOT NULL, -- Nome do cliente
email VARCHAR(255) NOT NULL, -- Email do cliente
telefone VARCHAR(20) -- Telefone do cliente (pode ser nulo)
);

CREATE TABLE Pedido (
id SERIAL PRIMARY KEY, -- ID único do pedido
cliente_id INT NOT NULL, -- Chave estrangeira para a tabela Cliente
data DATE NOT NULL, -- Data do pedido
total NUMERIC(10, 2) NOT NULL, -- Total do pedido (com 2 casas decimais)
-- Definindo a chave estrangeira para Cliente
CONSTRAINT fk_cliente
FOREIGN KEY (cliente_id)
REFERENCES Cliente(id)
ON DELETE CASCADE -- Remove o pedido se o cliente for removido
);

CREATE TABLE ItemPedido (
id SERIAL PRIMARY KEY, -- ID único do item do pedido
pedido_id INT NOT NULL, -- Chave estrangeira para a tabela Pedido
livro_id INT NOT NULL, -- Chave estrangeira para a tabela Livro
quantidade INT NOT NULL, -- Quantidade de livros no item
preco_unitario NUMERIC(10, 2) NOT NULL, -- Preço unitário do livro no item
-- Definindo as chaves estrangeiras
CONSTRAINT fk_pedido
FOREIGN KEY (pedido_id)
REFERENCES Pedido(id)
ON DELETE CASCADE, -- Remove o item se o pedido for removido
CONSTRAINT fk_livro
FOREIGN KEY (livro_id)
REFERENCES Livro(id)
ON DELETE CASCADE -- Remove o item se o livro for removido
);