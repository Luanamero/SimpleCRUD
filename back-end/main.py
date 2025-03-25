import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

class LivroCRUD:
    @staticmethod
    def create_connection():
        """Cria e retorna uma conexão com o banco de dados"""
        return psycopg2.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            cursor_factory=RealDictCursor
        )

    @staticmethod
    def create_livro(titulo, estoque, ano_publicacao, preco, editora_id, autor_id):
        """Cria um novo livro no banco de dados"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                """
                INSERT INTO livros (titulo, estoque, ano_publicacao, preco, editora_id, autor_id)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *;
                """,
                (titulo, estoque, ano_publicacao, preco, editora_id, autor_id)
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
            cur.execute("SELECT * FROM livros;")
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
            cur.execute("SELECT * FROM livros WHERE id = %s;", (livro_id,))
            livro = cur.fetchone()
            if livro is None:
                raise Exception("Livro não encontrado")
            return livro
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update_livro(livro_id, titulo=None, isbn=None, ano_publicacao=None, preco=None, editora_id=None, autor_id=None):
        """Atualiza um livro existente"""
        conn = LivroCRUD.create_connection()
        cur = conn.cursor()
        try:
            # Primeiro, obtemos os valores atuais
            cur.execute("SELECT * FROM livros WHERE id = %s;", (livro_id,))
            livro = cur.fetchone()
            if livro is None:
                raise Exception("Livro não encontrado")

            # Atualiza apenas os campos fornecidos
            update_fields = []
            update_values = []
            
            if titulo is not None:
                update_fields.append("titulo = %s")
                update_values.append(titulo)
            if isbn is not None:
                update_fields.append("isbn = %s")
                update_values.append(isbn)
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
                UPDATE livros
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
            cur.execute("SELECT * FROM livros WHERE id = %s;", (livro_id,))
            livro = cur.fetchone()
            if livro is None:
                raise Exception("Livro não encontrado")

            cur.execute("DELETE FROM livros WHERE id = %s RETURNING *;", (livro_id,))
            deleted_livro = cur.fetchone()
            conn.commit()
            return deleted_livro
        except Exception as e:
            conn.rollback()
            raise Exception(f"Erro ao deletar livro: {str(e)}")
        finally:
            cur.close()
            conn.close()

    
    @staticmethod
    def create_editora(nome, endereco):
            """Cria uma nova editora no banco de dados"""
            conn = LivroCRUD.create_connection()
            cur = conn.cursor()
            try:
                cur.execute(
                    """
                    INSERT INTO editoras (nome, endereco)
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
                cur.execute("SELECT * FROM editoras;")
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




# Exemplo de uso:
if __name__ == "__main__":
    try:
        # Criar um novo livro
        nova_editora = LivroCRUD.create_editora(
            nome = "Penguin",
            endereco= "Londres"
        )
        print("Editora criada:", nova_editora)

        # Buscar todos os livros
        #editoras = LivroCRUD.get_all_editoras()
        #print("Todos as editoras:", editoras)

        # Buscar um livro específico
        #editora = LivroCRUD.get_editora_by_id(nova_editora['id'])
        #print("Editora encontrado:", editora)

        # Atualizar um livro
        #editora_atualizado = LivroCRUD.update_editora(
            #editora_id= nova_editora['id'],
            #endereco = "Londres, Inglaterra"
       # )
        #print("Livro atualizado:", editora_atualizado)

        # Deletar um livro
        #editora_deletado = LivroCRUD.delete_editora(nova_editora['id'])
        #print("Livro deletado:", editora_deletado)

    except Exception as e:
        print("Ocorreu um erro:", str(e))