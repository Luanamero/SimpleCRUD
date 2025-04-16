-- Adicionar coluna de senha (permitir nulo para clientes existentes, será atualizada depois)
ALTER TABLE cliente ADD senha varchar NULL;

-- Adição da coluna de desconto (não nulo, padrão falso)
ALTER TABLE cliente ADD direito_desconto bool DEFAULT false NOT NULL;

-- Function to update inventory when an order item is created
CREATE OR REPLACE FUNCTION update_book_inventory()
RETURNS TRIGGER AS $$
BEGIN
    -- Subtract the ordered quantity from the book's inventory
    UPDATE livro 
    SET estoque = estoque - NEW.quantidade
    WHERE id = NEW.livro_id AND estoque >= NEW.quantidade;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function when a new order item is inserted
DROP TRIGGER IF EXISTS update_inventory_after_order ON itempedido;
CREATE TRIGGER update_inventory_after_order
AFTER INSERT ON itempedido
FOR EACH ROW
EXECUTE FUNCTION update_book_inventory();

-- Function to get sales report by author (podium)
CREATE OR REPLACE FUNCTION get_author_sales_podium()
RETURNS TABLE(
    autor_id INTEGER,
    autor_nome VARCHAR,
    total_vendas BIGINT,
    valor_total NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id as autor_id,
        a.nome as autor_nome,
        SUM(ip.quantidade) as total_vendas,
        SUM(ip.quantidade * ip.preco_unitario) as valor_total
    FROM 
        autor a
    JOIN 
        livro l ON a.id = l.autor_id
    JOIN 
        itempedido ip ON l.id = ip.livro_id
    GROUP BY 
        a.id, a.nome
    ORDER BY 
        total_vendas DESC, valor_total DESC;
END;
$$ LANGUAGE plpgsql;

