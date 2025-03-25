from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Autor, Cliente, Editora, ItemPedido, Livro, Pedido
from schemas import AutorCreate, AutorResponse, ClienteCreate, ClienteResponse, EditoraCreate, EditoraResponse, ItemPedidoCreate, ItemPedidoResponse, LivroCreate, LivroResponse, PedidoCreate, PedidoResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Ou ["*"] para permitir qualquer origem (não recomendado em produção)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

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

from sqlalchemy.exc import SQLAlchemyError

@app.delete("/livros/{livro_id}", response_model=LivroResponse, tags=["Livros"])
def delete_livro(livro_id: int, db: Session = Depends(get_db)):
    db_livro = db.query(Livro).filter(Livro.id == livro_id).first()
    if db_livro is None:
        raise HTTPException(status_code=404, detail="Livro not found")
    
    try:
        db.delete(db_livro)
        db.commit()
        return db_livro
    except SQLAlchemyError as e:
        db.rollback()  # Reverte alterações em caso de erro
        raise HTTPException(status_code=500, detail=f"Erro no banco de dados: {str(e)}")
    
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


# Endpoint para criar um item de pedido
@app.post("/itens_pedido/", response_model=ItemPedidoResponse, tags=["Itens de Pedido"])
def create_item_pedido(item_pedido: ItemPedidoCreate, db: Session = Depends(get_db)):
    db_item_pedido = ItemPedido(**item_pedido.dict())
    db.add(db_item_pedido)
    db.commit()
    db.refresh(db_item_pedido)
    return db_item_pedido

# Endpoint para listar todos os itens de pedido
@app.get("/itens_pedido/", response_model=List[ItemPedidoResponse], tags=["Itens de Pedido"])
def read_itens_pedido(db: Session = Depends(get_db)):
    itens_pedido = db.query(ItemPedido).all()
    return itens_pedido

# Endpoint para buscar um item de pedido por ID
@app.get("/itens_pedido/{item_pedido_id}", response_model=ItemPedidoResponse, tags=["Itens de Pedido"])
def read_item_pedido(item_pedido_id: int, db: Session = Depends(get_db)):
    item_pedido = db.query(ItemPedido).filter(ItemPedido.id == item_pedido_id).first()
    if item_pedido is None:
        raise HTTPException(status_code=404, detail="Item de pedido não encontrado")
    return item_pedido

# Endpoint para atualizar um item de pedido
@app.put("/itens_pedido/{item_pedido_id}", response_model=ItemPedidoResponse, tags=["Itens de Pedido"])
def update_item_pedido(item_pedido_id: int, item_pedido: ItemPedidoCreate, db: Session = Depends(get_db)):
    db_item_pedido = db.query(ItemPedido).filter(ItemPedido.id == item_pedido_id).first()
    if db_item_pedido is None:
        raise HTTPException(status_code=404, detail="Item de pedido não encontrado")
    for key, value in item_pedido.dict().items():
        setattr(db_item_pedido, key, value)
    db.commit()
    db.refresh(db_item_pedido)
    return db_item_pedido

# Endpoint para excluir um item de pedido
@app.delete("/itens_pedido/{item_pedido_id}", response_model=ItemPedidoResponse, tags=["Itens de Pedido"])
def delete_item_pedido(item_pedido_id: int, db: Session = Depends(get_db)):
    db_item_pedido = db.query(ItemPedido).filter(ItemPedido.id == item_pedido_id).first()
    if db_item_pedido is None:
        raise HTTPException(status_code=404, detail="Item de pedido não encontrado")
    db.delete(db_item_pedido)
    db.commit()
    return db_item_pedido

# Endpoint para criar um pedido
@app.post("/pedidos/", response_model=PedidoResponse, tags=["Pedidos"])
def create_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    db_pedido = Pedido(**pedido.dict())
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

# Endpoint para listar todos os pedidos
@app.get("/pedidos/", response_model=List[PedidoResponse], tags=["Pedidos"])
def read_pedidos(db: Session = Depends(get_db)):
    pedidos = db.query(Pedido).all()
    return pedidos

# Endpoint para buscar um pedido por ID
@app.get("/pedidos/{pedido_id}", response_model=PedidoResponse, tags=["Pedidos"])
def read_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido

# Endpoint para atualizar um pedido
@app.put("/pedidos/{pedido_id}", response_model=PedidoResponse, tags=["Pedidos"])
def update_pedido(pedido_id: int, pedido: PedidoCreate, db: Session = Depends(get_db)):
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if db_pedido is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    for key, value in pedido.dict().items():
        setattr(db_pedido, key, value)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

# Endpoint para excluir um pedido
@app.delete("/pedidos/{pedido_id}", response_model=PedidoResponse, tags=["Pedidos"])
def delete_pedido(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if db_pedido is None:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    db.delete(db_pedido)
    db.commit()
    return db_pedido

# Endpoint para criar um cliente
@app.post("/clientes/", response_model=ClienteResponse, tags=["Clientes"])
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# Endpoint para listar todos os clientes
@app.get("/clientes/", response_model=List[ClienteResponse], tags=["Clientes"])
def read_clientes(db: Session = Depends(get_db)):
    clientes = db.query(Cliente).all()
    return clientes

# Endpoint para buscar um cliente por ID
@app.get("/clientes/{cliente_id}", response_model=ClienteResponse, tags=["Clientes"])
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return cliente

# Endpoint para atualizar um cliente
@app.put("/clientes/{cliente_id}", response_model=ClienteResponse, tags=["Clientes"])
def update_cliente(cliente_id: int, cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    for key, value in cliente.dict().items():
        setattr(db_cliente, key, value)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# Endpoint para excluir um cliente
@app.delete("/clientes/{cliente_id}", response_model=ClienteResponse, tags=["Clientes"])
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    db.delete(db_cliente)
    db.commit()
    return db_cliente
