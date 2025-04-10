-- Adicionar coluna de senha (permitir nulo para clientes existentes, será atualizada depois)
ALTER TABLE cliente ADD senha varchar NULL;

-- Adição da coluna de desconto (não nulo, padrão falso)
ALTER TABLE cliente ADD direito_desconto bool DEFAULT false NOT NULL;

