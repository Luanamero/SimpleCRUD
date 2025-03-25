import psycopg2
from psycopg2.extras import RealDictCursor
import os

class LivroCRUD:
    @staticmethod
    def create_connection():
        """Cria e retorna uma conexão com o banco de dados"""
        return psycopg2.connect(
           "postgresql://postgres:OPMuEZPtCOBSIxbSGdbYDYgjcGlwQebr@caboose.proxy.rlwy.net:56510/railway"
        )

# ===== CRUD Livro =======

    @staticmethod
    def create_livro(titulo, estoque, ano_publicacao, preco, editora_id, autor_id, genero=None):
        """Cria um novo livro no banco de dados, com gênero opcional"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                """
                INSERT INTO livro (titulo, estoque, ano_publicacao, preco, editora_id, autor_id, genero)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
                """,
                (titulo, estoque, ano_publicacao, preco, editora_id, autor_id, genero)
            )
            new_livro = cur.fetchone()
            conn.commit()
            return new_livro
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao criar livro: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def get_all_livros():
        """Retorna todos os livros do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT * FROM livro;")
            return cur.fetchall()
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def get_livro_by_id(livro_id):
        """Retorna um livro específico pelo ID"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT * FROM livro WHERE id = %s;", (livro_id,))
            livro = cur.fetchone()
            if livro is None:
                raise Exception("Livro não encontrado")
            return livro
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_livro(livro_id, titulo=None, ano_publicacao=None, preco=None, editora_id=None, autor_id=None, genero = None):
        """Atualiza um livro existente"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Primeiro, obtemos os valores atuais
            cur.execute("SELECT * FROM livro WHERE id = %s;", (livro_id,))
            livro = cur.fetchone()
            if livro is None:
                raise Exception("Livro não encontrado")

            # Atualiza apenas os campos fornecidos
            update_fields = []
            update_values = []
            
            if titulo is not None:
                update_fields.append("titulo = %s")
                update_values.append(titulo)
            if genero is not None:
                update_fields.append("genero = %s")
                update_values.append(genero)
            if ano_publicacao is not None:
                update_fields.append("ano_publicacao = %s")
                update_values.append(ano_publicacao)
            if preco is not None:
                update_fields.append("preco = %s")
                update_values.append(preco)
            if editora_id is not None:
                update_fields.append("editora_id = %s")
                update_values.append(editora_id)
            if autor_id is not None:
                update_fields.append("autor_id = %s")
                update_values.append(autor_id)

            if not update_fields:
                raise Exception("Nenhum campo para atualizar")

            update_values.append(livro_id)
            update_query = f"""
                UPDATE livro
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING *;
            """

            cur.execute(update_query, update_values)
            updated_livro = cur.fetchone()
            conn.commit()
            return updated_livro
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao atualizar livro: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def delete_livro(livro_id):
        """Remove um livro do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o livro existe
            cur.execute("SELECT * FROM livro WHERE id = %s;", (livro_id,))
            livro = cur.fetchone()
            if livro is None:
                raise Exception("Livro não encontrado")

            cur.execute("DELETE FROM livro WHERE id = %s RETURNING *;", (livro_id,))
            deleted_livro = cur.fetchone()
            conn.commit()
            return deleted_livro
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar livro: {str(e)}")
        finally:
            cur.close()
            conn.close()

# ===== CRUD Editora =======

    @staticmethod
    def create_editora(nome, endereco):
            """Cria uma nova editora no banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute(
                    """
                    INSERT INTO editora (nome, endereco)
                    VALUES (%s, %s)
                    RETURNING *;
                    """,
                    (nome, endereco)
                )
                new_editora = cur.fetchone()
                conn.commit()
                return new_editora
            except Exception as e:
                conn.rollback()
                raise Exception(f"Erro ao criar editora: {str(e)}")
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_all_editoras():
            """Retorna todos os livros do banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM editora;")
                return cur.fetchall()
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_editora_by_id(editora_id):
            """Retorna uma editora específica pelo ID"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM editoras WHERE id = %s;", (editora_id,))
                editora = cur.fetchone()
                if editora is None:
                    raise Exception("Editora não encontrado")
                return editora
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def delete_editora(editora_id):
        """Remove um livro do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o livro existe
            cur.execute("SELECT * FROM editoras WHERE id = %s;", (editora_id,))
            editora = cur.fetchone()
            if editora is None:
                raise Exception("Editora não encontrado")

            cur.execute("DELETE FROM editoras WHERE id = %s RETURNING *;", (editora_id,))
            deleted_editora = cur.fetchone()
            conn.commit()
            return deleted_editora
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar editoras: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_editora(editora_id, novo_nome=None, novo_endereco=None):
        """Atualiza os dados de um editora no banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o editora existe
            cur.execute("SELECT * FROM editora WHERE id = %s;", (editora_id,))
            editora = cur.fetchone()
            if editora is None:
                raise Exception("editora não encontrado")

            # Monta a query dinamicamente (para atualizar apenas os campos fornecidos)
            query = "UPDATE editora SET "
            params = []
            
            if novo_nome is not None:
                query += "nome = %s, "
                params.append(novo_nome)
            
            if novo_endereco is not None:
                query += "biografia = %s, "
                params.append(novo_endereco)
            
            # Remove a vírgula extra no final e adiciona a condição WHERE
            query = query.rstrip(", ") + " WHERE id = %s RETURNING *;"
            params.append(editora_id)

            # Executa o UPDATE
            cur.execute(query, tuple(params))
            updated_editora = cur.fetchone()
            conn.commit()
            return updated_editora
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao atualizar editora: {str(e)}")
        finally:
            cur.close()
            conn.close()

# ===== CRUD Autor =======
    @staticmethod
    def create_autor(nome, nacionalidade):
            """Cria uma nova autor no banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute(
                    """
                    INSERT INTO autor (nome, nacionalidade)
                    VALUES (%s, %s)
                    RETURNING *;
                    """,
                    (nome, nacionalidade)
                )
                new_autor = cur.fetchone()
                conn.commit()
                return new_autor
            except Exception as e:
                conn.rollback()
                raise Exception(f"Erro ao criar autor: {str(e)}")
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_all_autor():
            """Retorna todos os autores do banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM autor;")
                return cur.fetchall()
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_autor_by_id(autor_id):
            """Retorna uma autor específica pelo ID"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM autor WHERE id = %s;", (autor_id,))
                autor = cur.fetchone()
                if autor is None:
                    raise Exception("autor não encontrado")
                return autor
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def delete_autor(autor_id):
        """Remove um livro do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o livro existe
            cur.execute("SELECT * FROM autor WHERE id = %s;", (autor_id,))
            autor = cur.fetchone()
            if autor is None:
                raise Exception("autor não encontrado")

            cur.execute("DELETE FROM autor WHERE id = %s RETURNING *;", (autor_id,))
            deleted_autor = cur.fetchone()
            conn.commit()
            return deleted_autor
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar autor: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_autor(autor_id, novo_nome=None, nova_biografia=None):
        """Atualiza os dados de um autor no banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o autor existe
            cur.execute("SELECT * FROM autor WHERE id = %s;", (autor_id,))
            autor = cur.fetchone()
            if autor is None:
                raise Exception("Autor não encontrado")

            # Monta a query dinamicamente (para atualizar apenas os campos fornecidos)
            query = "UPDATE autor SET "
            params = []
            
            if novo_nome is not None:
                query += "nome = %s, "
                params.append(novo_nome)
            
            if nova_biografia is not None:
                query += "biografia = %s, "
                params.append(nova_biografia)
            
            # Remove a vírgula extra no final e adiciona a condição WHERE
            query = query.rstrip(", ") + " WHERE id = %s RETURNING *;"
            params.append(autor_id)

            # Executa o UPDATE
            cur.execute(query, tuple(params))
            updated_autor = cur.fetchone()
            conn.commit()
            return updated_autor
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao atualizar autor: {str(e)}")
        finally:
            cur.close()
            conn.close()

# ====== CRUD Cliente ======

    @staticmethod
    def create_cliente(nome, email, endereco, telefone = None):
            """Cria uma nova cliente no banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute(
                    """
                    INSERT INTO cliente (nome, email, endereco, telefone)
                    VALUES (%s, %s, %s, %s)
                    RETURNING *;
                    """,
                    (nome, email, endereco, telefone)
                )
                new_cliente = cur.fetchone()
                conn.commit()
                return new_cliente
            except Exception as e:
                conn.rollback()
                raise Exception(f"Erro ao criar cliente: {str(e)}")
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_all_cliente():
            """Retorna todos os clientes do banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM cliente;")
                return cur.fetchall()
            finally:
                cur.close()
                conn.close()
    
    @staticmethod
    def get_cliente_by_id(cliente_id):
            """Retorna uma cliente específica pelo ID"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM cliente WHERE id = %s;", (cliente_id,))
                cliente = cur.fetchone()
                if cliente is None:
                    raise Exception("cliente não encontrado")
                return cliente
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def delete_cliente(cliente_id):
        """Remove um livro do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o livro existe
            cur.execute("SELECT * FROM cliente WHERE id = %s;", (cliente_id,))
            cliente = cur.fetchone()
            if cliente is None:
                raise Exception("cliente não encontrado")

            cur.execute("DELETE FROM cliente WHERE id = %s RETURNING *;", (cliente_id,))
            deleted_cliente = cur.fetchone()
            conn.commit()
            return deleted_cliente
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar cliente: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_cliente(cliente_id, novo_nome=None, novo_endereco=None, novo_telefone=None, novo_email=None):
        """Atualiza os dados de um cliente no banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o cliente existe
            cur.execute("SELECT * FROM cliente WHERE id = %s;", (cliente_id,))
            cliente = cur.fetchone()
            if cliente is None:
                raise Exception("cliente não encontrado")

            # Monta a query dinamicamente (para atualizar apenas os campos fornecidos)
            query = "UPDATE cliente SET "
            params = []
            
            if novo_nome is not None:
                query += "nome = %s, "
                params.append(novo_nome)
            
            if novo_endereco is not None:
                query += "endereco = %s, "
                params.append(novo_endereco)

            if novo_telefone is not None:
                query += "telefone = %s, "
                params.append(novo_telefone)
            
            if novo_email is not None:
                query += "email = %s, "
                params.append(novo_email)

            # Remove a vírgula extra no final e adiciona a condição WHERE
            query = query.rstrip(", ") + " WHERE id = %s RETURNING *;"
            params.append(cliente_id)

            # Executa o UPDATE
            cur.execute(query, tuple(params))
            updated_cliente = cur.fetchone()
            conn.commit()
            return updated_cliente
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao atualizar cliente: {str(e)}")
        finally:
            cur.close()
            conn.close()

# ===== CRUD itemPedido =======

    @staticmethod
    def create_itemPedido(livro_id, quantidade, preco_unitario):
            """Cria uma nova itemPedido no banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute(
                    """
                    INSERT INTO itemPedido (livro_id, quantidade, preco_unitario)
                    VALUES (%s, %s, %s)
                    RETURNING *;
                    """,
                    (livro_id, quantidade, preco_unitario)
                )
                new_itemPedido = cur.fetchone()
                conn.commit()
                return new_itemPedido
            except Exception as e:
                conn.rollback()
                raise Exception(f"Erro ao criar itemPedido: {str(e)}")
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_all_itemPedido():
            """Retorna todos os itemPedidos do banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM itemPedido;")
                return cur.fetchall()
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_itemPedido_by_id(itemPedido_id):
            """Retorna uma itemPedido específica pelo ID"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM itemPedido WHERE id = %s;", (itemPedido_id,))
                itemPedido = cur.fetchone()
                if itemPedido is None:
                    raise Exception("itemPedido não encontrado")
                return itemPedido
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def delete_itemPedido(itemPedido_id):
        """Remove um livro do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o livro existe
            cur.execute("SELECT * FROM itemPedido WHERE id = %s;", (itemPedido_id,))
            itemPedido = cur.fetchone()
            if itemPedido is None:
                raise Exception("itemPedido não encontrado")

            cur.execute("DELETE FROM itemPedido WHERE id = %s RETURNING *;", (itemPedido_id,))
            deleted_itemPedido = cur.fetchone()
            conn.commit()
            return deleted_itemPedido
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar itemPedido: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_itemPedido(itemPedido_id, nova_quantidade, novo_preco_unitario):
        """Atualiza os dados de um itemPedido no banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o itemPedido existe
            cur.execute("SELECT * FROM itemPedido WHERE id = %s;", (itemPedido_id,))
            itemPedido = cur.fetchone()
            if itemPedido is None:
                raise Exception("itemPedido não encontrado")

            # Monta a query dinamicamente (para atualizar apenas os campos fornecidos)
            query = "UPDATE itemPedido SET "
            params = []
            
            if nova_quantidade is not None:
                query += "quantidade = %s, "
                params.append(nova_quantidade)
            
            if novo_preco_unitario is not None:
                query += "preco_unitario = %s, "
                params.append(novo_preco_unitario)

            # Remove a vírgula extra no final e adiciona a condição WHERE
            query = query.rstrip(", ") + " WHERE id = %s RETURNING *;"
            params.append(itemPedido_id)

            # Executa o UPDATE
            cur.execute(query, tuple(params))
            updated_itemPedido = cur.fetchone()
            conn.commit()
            return updated_itemPedido
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao atualizar itemPedido: {str(e)}")
        finally:
            cur.close()
            conn.close()

# ===== CRUD Pedido =======
    @staticmethod
    def create_pedido(cliente_id, data, total):
            """Cria uma nova pedido no banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute(
                    """
                    INSERT INTO pedido (cliente_id, data, total)
                    VALUES (%s, %s, %s)
                    RETURNING *;
                    """,
                    (cliente_id, data, total)
                )
                new_pedido = cur.fetchone()
                conn.commit()
                return new_pedido
            except Exception as e:
                conn.rollback()
                raise Exception(f"Erro ao criar pedido: {str(e)}")
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_all_pedido():
            """Retorna todos os pedidos do banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM pedido;")
                return cur.fetchall()
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def get_pedido_by_id(pedido_id):
            """Retorna uma pedido específica pelo ID"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute("SELECT * FROM pedido WHERE id = %s;", (pedido_id,))
                pedido = cur.fetchone()
                if pedido is None:
                    raise Exception("pedido não encontrado")
                return pedido
            finally:
                cur.close()
                conn.close()

    @staticmethod
    def delete_pedido(pedido_id):
        """Remove um livro do banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o livro existe
            cur.execute("SELECT * FROM pedido WHERE id = %s;", (pedido_id,))
            pedido = cur.fetchone()
            if pedido is None:
                raise Exception("pedido não encontrado")

            cur.execute("DELETE FROM pedido WHERE id = %s RETURNING *;", (pedido_id,))
            deleted_pedido = cur.fetchone()
            conn.commit()
            return deleted_pedido
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar pedido: {str(e)}")
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_pedido(pedido_id, nova_data, novo_total):
        """Atualiza os dados de um pedido no banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Verifica se o pedido existe
            cur.execute("SELECT * FROM pedido WHERE id = %s;", (pedido_id,))
            pedido = cur.fetchone()
            if pedido is None:
                raise Exception("pedido não encontrado")

            # Monta a query dinamicamente (para atualizar apenas os campos fornecidos)
            query = "UPDATE pedido SET "
            params = []
            
            if nova_data is not None:
                query += "data = %s, "
                params.append(nova_data)
            
            if novo_total is not None:
                query += "preco_unitario = %s, "
                params.append(novo_total)

            # Remove a vírgula extra no final e adiciona a condição WHERE
            query = query.rstrip(", ") + " WHERE id = %s RETURNING *;"
            params.append(pedido_id)

            # Executa o UPDATE
            cur.execute(query, tuple(params))
            updated_pedido = cur.fetchone()
            conn.commit()
            return updated_pedido
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao atualizar pedido: {str(e)}")
        finally:
            cur.close()
            conn.close()



