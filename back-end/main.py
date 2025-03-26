from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
from livroCrud import LivroCRUD
from schemas import LivroCreate, LivroResponse, ClienteCreate, ClienteResponse, AutorCreate, AutorResponse, ItemPedidoCreate, ItemPedidoResponse, PedidoCreate, PedidoResponse, EditoraCreate, EditoraResponse
from models import Livro
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Configuração do CORS
origins = [
    "http://localhost:3001",  
    "http://localhost:3000",  
    "http://127.0.0.1:3001",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Função auxiliar para transformação de dados
def transform_to_dict(data, col_names):
    if not data:
        return data
    if isinstance(data, list) and isinstance(data[0], tuple):
        return [dict(zip(col_names, row)) for row in data]
    if isinstance(data, tuple):
        return dict(zip(col_names, data))
    return data

# ============== Rotas para Livros ==============
@app.post("/livros/", response_model=dict, tags=["Livros"])
def criar_livro(livro: LivroCreate):
    try:
        novo_livro = LivroCRUD.create_livro(
            titulo=livro.titulo,
            estoque=livro.estoque,
            ano_publicacao=livro.ano_publicacao,
            preco=livro.preco,
            editora_id=livro.editora_id,
            autor_id=livro.autor_id,
            genero=livro.genero
        )
        return {"message": "Livro criado com sucesso", "data": novo_livro}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/livros/", response_model=List[dict], tags=["Livros"])
def listar_livros():
    try:
        livros = LivroCRUD.get_all_livros()
        col_names = ["id", "titulo", "autor_id", "preco", "estoque", 
                    "editora_id", "ano_publicacao", "genero"]
        return transform_to_dict(livros, col_names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/livros/{livro_id}", response_model=dict, tags=["Livros"])
def buscar_livro(livro_id: int):
    try:
        livro = LivroCRUD.get_livro_by_id(livro_id)
        col_names = ["id", "titulo", "autor_id", "preco", "estoque", 
                    "editora_id", "ano_publicacao", "genero"]
        return transform_to_dict(livro, col_names)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/livros/{livro_id}", response_model=dict, tags=["Livros"])
def atualizar_livro(livro_id: int, livro: LivroCreate):
    try:
        updated_livro = LivroCRUD.update_livro(
            livro_id=livro_id,
            titulo=livro.titulo,
            estoque=livro.estoque,
            ano_publicacao=livro.ano_publicacao,
            preco=livro.preco,
            editora_id=livro.editora_id,
            autor_id=livro.autor_id,
            genero=livro.genero
        )
        return {"message": "Livro atualizado", "data": updated_livro}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/livros/{livro_id}", response_model=dict, tags=["Livros"])
def deletar_livro(livro_id: int):
    try:
        deleted_livro = LivroCRUD.delete_livro(livro_id)
        return {"message": "Livro deletado", "data": deleted_livro}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ============== Rotas para Editoras ==============
@app.post("/editoras/", response_model=dict, tags=["Editoras"])
def criar_editora(editora: EditoraCreate):
    try:
        nova_editora = LivroCRUD.create_editora(
            nome=editora.nome,
            endereco=editora.endereco
        )
        return {"message": "Editora criada com sucesso", "data": nova_editora}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/editoras/", response_model=List[dict], tags=["Editoras"])
def listar_editoras():
    try:
        editoras = LivroCRUD.get_all_editoras()
        col_names = ["id", "nome", "endereco"]
        return transform_to_dict(editoras, col_names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/editoras/{editora_id}", response_model=dict, tags=["Editoras"])
def buscar_editora(editora_id: int):
    try:
        editora = LivroCRUD.get_editora_by_id(editora_id)
        col_names = ["id", "nome", "endereco"]
        return transform_to_dict(editora, col_names)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/editoras/{editora_id}", response_model=dict, tags=["Editoras"])
def atualizar_editora(editora_id: int, editora: EditoraCreate):
    try:
        updated_editora = LivroCRUD.update_editora(
            editora_id=editora_id,
            novo_nome=editora.nome,
            novo_endereco=editora.endereco
        )
        return {"message": "Editora atualizada", "data": updated_editora}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/editoras/{editora_id}", response_model=dict, tags=["Editoras"])
def deletar_editora(editora_id: int):
    try:
        deleted_editora = LivroCRUD.delete_editora(editora_id)
        return {"message": "Editora deletada", "data": deleted_editora}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ============== Rotas para Autores ==============
@app.post("/autores/", response_model=dict, tags=["Autores"])
def criar_autor(autor: AutorCreate):
    try:
        novo_autor = LivroCRUD.create_autor(
            nome=autor.nome,
            nacionalidade=autor.nacionalidade
        )
        return {"message": "Autor criado com sucesso", "data": novo_autor}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/autores/", response_model=List[dict], tags=["Autores"])
def listar_autores():
    try:
        autores = LivroCRUD.get_all_autor()
        col_names = ["id", "nome", "nacionalidade"]
        return transform_to_dict(autores, col_names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/autores/{autor_id}", response_model=dict, tags=["Autores"])
def buscar_autor(autor_id: int):
    try:
        autor = LivroCRUD.get_autor_by_id(autor_id)
        col_names = ["id", "nome", "nacionalidade"]
        return transform_to_dict(autor, col_names)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/autores/{autor_id}", response_model=dict, tags=["Autores"])
def atualizar_autor(autor_id: int, autor: AutorCreate):
    try:
        updated_autor = LivroCRUD.update_autor(
            autor_id=autor_id,
            novo_nome=autor.nome,
            nova_biografia=autor.nacionalidade
        )
        return {"message": "Autor atualizado", "data": updated_autor}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/autores/{autor_id}", response_model=dict, tags=["Autores"])
def deletar_autor(autor_id: int):
    try:
        deleted_autor = LivroCRUD.delete_autor(autor_id)
        return {"message": "Autor deletado", "data": deleted_autor}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ============== Rotas para Clientes ==============
@app.post("/clientes/", response_model=dict, tags=["Clientes"])
def criar_cliente(cliente: ClienteCreate):
    try:
        novo_cliente = LivroCRUD.create_cliente(
            nome=cliente.nome,
            email=cliente.email,
            endereco=cliente.endereco,
            telefone=cliente.telefone
        )
        return {"message": "Cliente criado com sucesso", "data": novo_cliente}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/clientes/", response_model=List[dict], tags=["Clientes"])
def listar_clientes():
    try:
        clientes = LivroCRUD.get_all_cliente()
        col_names = ["id", "nome", "email", "endereco", "telefone"]
        return transform_to_dict(clientes, col_names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/clientes/{cliente_id}", response_model=dict, tags=["Clientes"])
def buscar_cliente(cliente_id: int):
    try:
        cliente = LivroCRUD.get_cliente_by_id(cliente_id)
        col_names = ["id", "nome", "email", "endereco", "telefone"]
        return transform_to_dict(cliente, col_names)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/clientes/{cliente_id}", response_model=dict, tags=["Clientes"])
def atualizar_cliente(cliente_id: int, cliente: ClienteCreate):
    try:
        updated_cliente = LivroCRUD.update_cliente(
            cliente_id=cliente_id,
            novo_nome=cliente.nome,
            novo_email=cliente.email,
            novo_endereco=cliente.endereco,
            novo_telefone=cliente.telefone
        )
        return {"message": "Cliente atualizado", "data": updated_cliente}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/clientes/{cliente_id}", response_model=dict, tags=["Clientes"])
def deletar_cliente(cliente_id: int):
    try:
        deleted_cliente = LivroCRUD.delete_cliente(cliente_id)
        return {"message": "Cliente deletado", "data": deleted_cliente}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ============== Rotas para Pedidos ==============
@app.post("/pedidos/", response_model=dict, tags=["Pedidos"])
def criar_pedido(pedido: PedidoCreate):
    try:
        novo_pedido = LivroCRUD.create_pedido(
            cliente_id=pedido.cliente_id,
            data=pedido.data,
            total=pedido.total
        )
        return {"message": "Pedido criado com sucesso", "data": novo_pedido}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/pedidos/", response_model=List[dict], tags=["Pedidos"])
def listar_pedidos():
    try:
        pedidos = LivroCRUD.get_all_pedido()
        col_names = ["id", "cliente_id", "data", "total"]
        return transform_to_dict(pedidos, col_names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pedidos/{pedido_id}", response_model=dict, tags=["Pedidos"])
def buscar_pedido(pedido_id: int):
    try:
        pedido = LivroCRUD.get_pedido_by_id(pedido_id)
        col_names = ["id", "cliente_id", "data", "total"]
        return transform_to_dict(pedido, col_names)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/pedidos/{pedido_id}", response_model=dict, tags=["Pedidos"])
def atualizar_pedido(pedido_id: int, pedido: PedidoCreate):
    try:
        updated_pedido = LivroCRUD.update_pedido(
            pedido_id=pedido_id,
            nova_data=pedido.data,
            novo_total=pedido.total
        )
        return {"message": "Pedido atualizado", "data": updated_pedido}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/pedidos/{pedido_id}", response_model=dict, tags=["Pedidos"])
def deletar_pedido(pedido_id: int):
    try:
        deleted_pedido = LivroCRUD.delete_pedido(pedido_id)
        return {"message": "Pedido deletado", "data": deleted_pedido}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ============== Rotas para Itens de Pedido ==============
@app.post("/itens-pedido/", response_model=dict, tags=["ItensPedidos"])
def criar_item_pedido(item: ItemPedidoCreate):
    try:
        novo_item = LivroCRUD.create_itemPedido(
            pedido_id=item.pedido_id,
            livro_id=item.livro_id,
            quantidade=item.quantidade,
            preco_unitario=item.preco_unitario
        )
        return {"message": "Item de pedido criado com sucesso", "data": novo_item}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/itens-pedido/", response_model=List[dict], tags=["ItensPedidos"])
def listar_itens_pedido():
    try:
        itens = LivroCRUD.get_all_itemPedido()
        col_names = ["id", "pedido_id", "livro_id", "quantidade", "preco_unitario"]
        return transform_to_dict(itens, col_names)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/itens-pedido/{item_id}", response_model=dict, tags=["ItensPedidos"])
def buscar_item_pedido(item_id: int):
    try:
        item = LivroCRUD.get_itemPedido_by_id(item_id)
        col_names = ["id", "pedido_id", "livro_id", "quantidade", "preco_unitario"]
        return transform_to_dict(item, col_names)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.put("/itens-pedido/{item_id}", response_model=dict, tags=["ItensPedidos"])
def atualizar_item_pedido(item_id: int, item: ItemPedidoCreate):
    try:
        updated_item = LivroCRUD.update_itemPedido(
            itemPedido_id=item_id,
            nova_quantidade=item.quantidade,
            novo_preco_unitario=item.preco_unitario
        )
        return {"message": "Item de pedido atualizado", "data": updated_item}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/itens-pedido/{item_id}", response_model=dict, tags=["ItensPedidos"])
def deletar_item_pedido(item_id: int):
    try:
        deleted_item = LivroCRUD.delete_itemPedido(item_id)
        return {"message": "Item de pedido deletado", "data": deleted_item}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@app.get("/relatorio", response_model=dict, tags=["Relatorio"])
def gerar_relatorio():
    try:
        livros = LivroCRUD.get_all_livros()
        col_names = ["id", "titulo", "autor_id", "preco", "estoque", 
                    "editora_id", "ano_publicacao", "genero"]
        livros_dict = transform_to_dict(livros, col_names)

        editoras = LivroCRUD.get_all_editoras()
        col_names = ["id", "nome", "endereco"]
        editoras_dict = transform_to_dict(editoras, col_names)
        
        autores = LivroCRUD.get_all_autor()
        col_names = ["id", "nome", "nacionalidade"]
        autores_dict = transform_to_dict(autores, col_names)
        
        clientes = LivroCRUD.get_all_cliente()
        col_names = ["id", "nome", "email", "endereco", "telefone"]
        clientes_dict = transform_to_dict(clientes, col_names)
        
        pedidos = LivroCRUD.get_all_pedido()
        col_names = ["id", "cliente_id", "data", "total"]
        pedidos_dict = transform_to_dict(pedidos, col_names)

        itens = LivroCRUD.get_all_itemPedido()
        col_names = ["id", "pedido_id", "livro_id", "quantidade", "preco_unitario"]
        itens_dict = transform_to_dict(itens, col_names)

        return {"message": "Relatório gerado com sucesso", "data": {
            "livros": livros_dict,
            "editoras": editoras_dict,
            "autores": autores_dict,
            "clientes": clientes_dict,
            "pedidos": pedidos_dict,
            "itens_pedido": itens_dict
        }}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5050)