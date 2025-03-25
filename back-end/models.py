from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, Date, Numeric
from sqlalchemy.orm import relationship
from database import Base 

class Autor(Base):
    __tablename__ = "autor"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    nacionalidade = Column(String(100))
    
    # Relacionamento com Livro
    livros = relationship("Livro", back_populates="autor", cascade="all, delete")

class Editora(Base):
    __tablename__ = "editora"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    endereco = Column(String(255))
    
    # Relacionamento com Livro
    livros = relationship("Livro", back_populates="editora", cascade="all, delete")

class Livro(Base):
    __tablename__ = "livro"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(255), nullable=False)
    autor_id = Column(Integer, ForeignKey("autor.id", ondelete="CASCADE"), nullable=False)
    preco = Column(Numeric(10, 2), nullable=False)
    estoque = Column(Integer, nullable=False)
    editora_id = Column(Integer, ForeignKey("editora.id", ondelete="CASCADE"), nullable=False)
    ano_publicacao = Column(Integer, nullable=False)
    genero = Column(String(100))
    
    # Relacionamentos modificados
    autor = relationship("Autor", back_populates="livros")
    editora = relationship("Editora", back_populates="livros")
    itens_pedido = relationship("ItemPedido", 
                              back_populates="livro", 
                              cascade="all, delete",
                              passive_deletes=True)  # ← SOLUÇÃO CHAVE AQUI

class Cliente(Base):
    __tablename__ = "cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    telefone = Column(String(20))
    
    # Relacionamento com Pedido
    pedidos = relationship("Pedido", back_populates="cliente", cascade="all, delete")

class Pedido(Base):
    __tablename__ = "pedido"
    
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("cliente.id", ondelete="CASCADE"), nullable=False)
    data = Column(Date, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    
    # Relacionamentos
    cliente = relationship("Cliente", back_populates="pedidos")
    itens = relationship("ItemPedido", back_populates="pedido", cascade="all, delete")

class ItemPedido(Base):
    __tablename__ = "item_pedido"
    
    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedido.id", ondelete="CASCADE"), nullable=False)
    livro_id = Column(Integer, ForeignKey("livro.id", ondelete="CASCADE"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    preco_unitario = Column(Numeric(10, 2), nullable=False)
    
    # Relacionamentos
    pedido = relationship("Pedido", back_populates="itens")
    livro = relationship("Livro", back_populates="itens_pedido")