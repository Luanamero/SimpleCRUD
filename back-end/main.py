from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Autor, Editora, Livro
from schemas import AutorCreate, AutorResponse, EditoraCreate, EditoraResponse, LivroCreate, LivroResponse

app = FastAPI()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new Livro
@app.post("/livros/", response_model=LivroResponse, tags=["Livros"])
def create_livro(livro: LivroCreate, db: Session = Depends(get_db)):
    db_livro = Livro(**livro.dict())
    db.add(db_livro)
    db.commit()
    db.refresh(db_livro)
    return db_livro

# Get all Livros
@app.get("/livros/", response_model=List[LivroResponse], tags=["Livros"])
def read_livros(db: Session = Depends(get_db)):
    livros = db.query(Livro).all()
    return livros

# Get a single Livro by ID
@app.get("/livros/{livro_id}", response_model=LivroResponse, tags=["Livros"])
def read_livro(livro_id: int, db: Session = Depends(get_db)):
    livro = db.query(Livro).filter(Livro.id == livro_id).first()
    if livro is None:
        raise HTTPException(status_code=404, detail="Livro not found")
    return livro

# Update a Livro
@app.put("/livros/{livro_id}", response_model=LivroResponse, tags=["Livros"])
def update_livro(livro_id: int, livro: LivroCreate, db: Session = Depends(get_db)):
    db_livro = db.query(Livro).filter(Livro.id == livro_id).first()
    if db_livro is None:
        raise HTTPException(status_code=404, detail="Livro not found")
    for key, value in livro.dict().items():
        setattr(db_livro, key, value)
    db.commit()
    db.refresh(db_livro)
    return db_livro

# Delete a Livro
@app.delete("/livros/{livro_id}", response_model=LivroResponse, tags=["Livros"])
def delete_livro(livro_id: int, db: Session = Depends(get_db)):
    db_livro = db.query(Livro).filter(Livro.id == livro_id).first()
    if db_livro is None:
        raise HTTPException(status_code=404, detail="Livro not found")
    db.delete(db_livro)
    db.commit()
    return db_livro

# Endpoint para criar uma editora
@app.post("/editoras/", response_model=EditoraResponse, tags=["Editoras"])
def create_editora(editora: EditoraCreate, db: Session = Depends(get_db)):
    db_editora = Editora(**editora.dict())  # Converte o schema Pydantic em um objeto SQLAlchemy
    db.add(db_editora)  # Adiciona a editora ao banco de dados
    db.commit()  # Confirma a transação
    db.refresh(db_editora)  # Atualiza o objeto com os dados do banco de dados
    return db_editora  # Retorna a editora criada

# Endpoint para listar todas as editoras
@app.get("/editoras/", response_model=List[EditoraResponse], tags=["Editoras"])
def read_editoras(db: Session = Depends(get_db)):
    editoras = db.query(Editora).all()  # Busca todas as editoras no banco de dados
    return editoras  # Retorna a lista de editoras

# Endpoint para buscar uma editora por ID
@app.get("/editoras/{editora_id}", response_model=EditoraResponse, tags=["Editoras"])
def read_editora(editora_id: int, db: Session = Depends(get_db)):
    editora = db.query(Editora).filter(Editora.id == editora_id).first()  # Busca a editora pelo ID
    if editora is None:
        raise HTTPException(status_code=404, detail="Editora não encontrada")  # Retorna erro 404 se a editora não existir
    return editora  # Retorna a editora encontrada

# Endpoint para atualizar uma editora
@app.put("/editoras/{editora_id}", response_model=EditoraResponse, tags=["Editoras"])
def update_editora(editora_id: int, editora: EditoraCreate, db: Session = Depends(get_db)):
    db_editora = db.query(Editora).filter(Editora.id == editora_id).first()  # Busca a editora pelo ID
    if db_editora is None:
        raise HTTPException(status_code=404, detail="Editora não encontrada")  # Retorna erro 404 se a editora não existir
    for key, value in editora.dict().items():
        setattr(db_editora, key, value)  # Atualiza os campos da editora
    db.commit()  # Confirma a transação
    db.refresh(db_editora)  # Atualiza o objeto com os dados do banco de dados
    return db_editora  # Retorna a editora atualizada

# Endpoint para excluir uma editora
@app.delete("/editoras/{editora_id}", response_model=EditoraResponse, tags=["Editoras"])
def delete_editora(editora_id: int, db: Session = Depends(get_db)):
    db_editora = db.query(Editora).filter(Editora.id == editora_id).first()  # Busca a editora pelo ID
    if db_editora is None:
        raise HTTPException(status_code=404, detail="Editora não encontrada")  # Retorna erro 404 se a editora não existir
    db.delete(db_editora)  # Exclui a editora
    db.commit()  # Confirma a transação
    return db_editora  # Retorna a editora excluída

# Endpoint para criar um autor
@app.post("/autores/", response_model=AutorResponse, tags=["Autores"])
def create_autor(autor: AutorCreate, db: Session = Depends(get_db)):
    db_autor = Autor(**autor.dict())  # Converte o schema Pydantic em um objeto SQLAlchemy
    db.add(db_autor)  # Adiciona o autor ao banco de dados
    db.commit()  # Confirma a transação
    db.refresh(db_autor)  # Atualiza o objeto com os dados do banco de dados
    return db_autor  # Retorna o autor criado

# Endpoint para listar todos os autores
@app.get("/autores/", response_model=List[AutorResponse], tags=["Autores"])
def read_autores(db: Session = Depends(get_db)):
    autores = db.query(Autor).all()  # Busca todos os autores no banco de dados
    return autores  # Retorna a lista de autores

# Endpoint para buscar um autor por ID
@app.get("/autores/{autor_id}", response_model=AutorResponse, tags=["Autores"])
def read_autor(autor_id: int, db: Session = Depends(get_db)):
    autor = db.query(Autor).filter(Autor.id == autor_id).first()  # Busca o autor pelo ID
    if autor is None:
        raise HTTPException(status_code=404, detail="Autor não encontrado")  # Retorna erro 404 se o autor não existir
    return autor  # Retorna o autor encontrado

# Endpoint para atualizar um autor
@app.put("/autores/{autor_id}", response_model=AutorResponse, tags=["Autores"])
def update_autor(autor_id: int, autor: AutorCreate, db: Session = Depends(get_db)):
    db_autor = db.query(Autor).filter(Autor.id == autor_id).first()  # Busca o autor pelo ID
    if db_autor is None:
        raise HTTPException(status_code=404, detail="Autor não encontrado")  # Retorna erro 404 se o autor não existir
    for key, value in autor.dict().items():
        setattr(db_autor, key, value)  # Atualiza os campos do autor
    db.commit()  # Confirma a transação
    db.refresh(db_autor)  # Atualiza o objeto com os dados do banco de dados
    return db_autor  # Retorna o autor atualizado

# Endpoint para excluir um autor
@app.delete("/autores/{autor_id}", response_model=AutorResponse, tags=["Autores"])
def delete_autor(autor_id: int, db: Session = Depends(get_db)):
    db_autor = db.query(Autor).filter(Autor.id == autor_id).first()  # Busca o autor pelo ID
    if db_autor is None:
        raise HTTPException(status_code=404, detail="Autor não encontrado")  # Retorna erro 404 se o autor não existir
    db.delete(db_autor)  # Exclui o autor
    db.commit()  # Confirma a transação
    return db_autor  # Retorna o autor excluído


