from pydantic import BaseModel
from typing import Optional

# Pydantic schema for creating a Livro
class LivroCreate(BaseModel):
    titulo: str
    autor_id: int
    preco: float
    estoque: int
    editora_id: int
    ano_publicacao: int
    genero: Optional[str] = None

# Pydantic schema for returning a Livro
class LivroResponse(BaseModel):
    id: int
    titulo: str
    autor_id: int
    preco: float
    estoque: int
    editora_id: int
    ano_publicacao: int
    genero: Optional[str] = None

    class Config:
        from_attributes = True

# Schema para criação de uma editora
class EditoraCreate(BaseModel):
    nome: str  # Nome da editora (obrigatório)
    endereco: Optional[str] = None  # Endereço da editora (opcional)

# Schema para retorno de uma editora
class EditoraResponse(BaseModel):
    id: int  # ID da editora
    nome: str  # Nome da editora
    endereco: Optional[str] = None  # Endereço da editora

    class Config:
        from_attributes = True  # Permite a conversão de objetos SQLAlchemy para Pydantic

# Schema para criação de um autor
class AutorCreate(BaseModel):
    nome: str  # Nome do autor (obrigatório)
    nacionalidade: Optional[str] = None  # Nacionalidade do autor (opcional)

# Schema para retorno de um autor
class AutorResponse(BaseModel):
    id: int  # ID do autor
    nome: str  # Nome do autor
    nacionalidade: Optional[str] = None  # Nacionalidade do autor

    class Config:
        from_attributes = True  # Permite a conversão de objetos SQLAlchemy para Pydantic

# Schema para criação de um cliente
class ClienteCreate(BaseModel):
    nome: str  # Nome do cliente
    email: str  # Email do cliente
    telefone: Optional[str] = None  # Telefone do cliente

# Schema para retorno de um cliente
class ClienteResponse(BaseModel):
    id: int  # ID do cliente
    nome: str  # Nome do cliente
    email: str  # Email do cliente
    telefone: Optional[str] = None  # Telefone do cliente

    class Config:
        from_attributes = True  # Permite a conversão de objetos SQLAlchemy para Pydantic

# Schema para criação de um pedido
class PedidoCreate(BaseModel):
    cliente_id: int  # ID do cliente
    data: str  # Data do pedido (formato string, por exemplo 'YYYY-MM-DD')
    total: float  # Total do pedido

# Schema para retorno de um pedido
class PedidoResponse(BaseModel):
    id: int  # ID do pedido
    cliente_id: int  # ID do cliente
    data: str  # Data do pedido
    total: float  # Total do pedido

    class Config:
        from_attributes = True  # Permite a conversão de objetos SQLAlchemy para Pydantic

# Schema para criação de um item do pedido
class ItemPedidoCreate(BaseModel):
    pedido_id: int  # ID do pedido
    livro_id: int  # ID do livro
    quantidade: int  # Quantidade de livros
    preco_unitario: float  # Preço unitário do livro

# Schema para retorno de um item do pedido
class ItemPedidoResponse(BaseModel):
    id: int  # ID do item do pedido
    pedido_id: int  # ID do pedido
    livro_id: int  # ID do livro
    quantidade: int  # Quantidade de livros
    preco_unitario: float  # Preço unitário do livro

    class Config:
        from_attributes = True  # Permite a conversão de objetos SQLAlchemy para Pydantic
