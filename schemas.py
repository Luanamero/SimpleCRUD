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