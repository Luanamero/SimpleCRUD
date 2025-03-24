from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from database import Base 

# Define the Livro model
class Livro(Base):
    __tablename__ = "livro"
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    autor_id = Column(Integer, ForeignKey("autor.id"), nullable=False)
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, nullable=False)
    editora_id = Column(Integer, ForeignKey("editora.id"), nullable=False)
    ano_publicacao = Column(Integer, nullable=False)
    genero = Column(String)

class Editora(Base):
    __tablename__ = "editora"  # Nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True)  # Chave primária
    nome = Column(String, nullable=False)  # Nome da editora (não pode ser nulo)
    endereco = Column(String)  # Endereço da editora (pode ser nulo)

class Autor(Base):
    __tablename__ = "autor"  # Nome da tabela no banco de dados

    id = Column(Integer, primary_key=True, index=True)  # Chave primária
    nome = Column(String, nullable=False)  # Nome do autor (não pode ser nulo)
    nacionalidade = Column(String)  # Nacionalidade do autor (pode ser nulo)