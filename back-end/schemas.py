from datetime import date
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
    nome: str  
    endereco: Optional[str] = None  

# Schema para retorno de uma editora
class EditoraResponse(BaseModel):
    id: int 
    nome: str 
    endereco: Optional[str] = None  

    class Config:
        from_attributes = True 

# Schema para criação de um autor
class AutorCreate(BaseModel):
    nome: str  
    nacionalidade: Optional[str] = None  

# Schema para retorno de um autor
class AutorResponse(BaseModel):
    id: int  
    nome: str 
    nacionalidade: Optional[str] = None  

    class Config:
        from_attributes = True  

# Schema para criação de um cliente
class ClienteCreate(BaseModel):
    nome: str  
    email: str  
    telefone: Optional[str] = None 
    endereco: str

# Schema para retorno de um cliente
class ClienteResponse(BaseModel):
    id: int  
    nome: str  
    email: str  
    telefone: Optional[str] = None 
    endereco: str

    class Config:
        from_attributes = True  

# Schema para criação de um pedido
class PedidoCreate(BaseModel):
    cliente_id: int  
    data: date  
    total: float  
    status: str

# Schema para retorno de um pedido
class PedidoResponse(BaseModel):
    id: int 
    cliente_id: int  
    data: date  
    total: float  
    status: str

    class Config:
        from_attributes = True  

# Schema para criação de um item do pedido
class ItemPedidoCreate(BaseModel):
    pedido_id: int  
    livro_id: int  
    quantidade: int  
    preco_unitario: float  

# Schema para retorno de um item do pedido
class ItemPedidoResponse(BaseModel):
    id: int  
    pedido_id: int  
    livro_id: int  
    quantidade: int  
    preco_unitario: float  

    class Config:
        from_attributes = True  
