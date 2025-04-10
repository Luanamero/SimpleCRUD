import { createGlobalStyle } from "styled-components";

export const OrdersGlobalStyles = createGlobalStyle`
/* ===== ORDER MANAGEMENT THEME ===== */
/* ===== ORDER MANAGEMENT THEME (BROWN & WHITE) ===== */
:root {
  --primary: #8B4513;          /* SaddleBrown */
  --primary-light: #A0522D;    /* Sienna */
  --background: #fdfaf6;       /* Off-white */
  --card-bg: #ffffff;          /* Pure white */
  --text: #3e2f1c;             /* Dark brown */
  --text-light: #8b7355;       /* Medium-light brown */
  --border: #e6ddd1;           /* Light beige border */
  --success: #6b8e23;          /* OliveDrab */
  --danger: #b22222;           /* Firebrick */
  --warning: #d2691e;          /* Chocolate */
  --info: #a0522d;             /* Sienna (reused for info) */
}

  
  /* ===== BASE LAYOUT ===== */
  .container-gestao {
    max-width: 1600px;          /* Slightly wider for order details */
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--background);
    min-height: 100vh;
  }
  
  .titulo-pagina {
    color: var(--primary);
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
    border-bottom: 2px solid var(--primary-light);
    padding-bottom: 0.5rem;
  }
  
  /* ===== ACTION BAR ===== */
  .acoes-gestao {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .campo-busca {
    padding: 0.875rem 1rem;  /* Increased padding */
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    min-width: 250px;
    font-size: 1rem;        /* Increased font size */
    transition: all 0.2s;
    height: auto;           /* Ensure height adapts to content */
    line-height: 1.5;       /* Better line spacing */
  }
  
  .campo-busca:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    outline: none;
  }
  
  /* ===== FORM STYLES ===== */
  .formulario-gestao {
    background: var(--card-bg);
    border-radius: 0.75rem;
    padding: 1.75rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    margin-bottom: 2.5rem;
    border: 1px solid var(--border);
  }
  
  .titulo-formulario {
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 500;
  }
  
  .grid-formulario {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .grupo-formulario {
    margin-bottom: 1.5rem;  /* Increased spacing */
  }
  
  .grupo-formulario label {
    display: block;
    margin-bottom: 0.75rem;  /* Increased spacing */
    color: var(--text-light);
    font-size: 0.875rem;     /* Restored to normal size */
    font-weight: 500;
  }
  
  .controle-formulario {
    width: 100%;
    padding: 1rem;          /* Increased padding */
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    font-size: 1rem;        /* Increased font size */
    transition: all 0.2s;
    line-height: 1.5;       /* Better line spacing */
    height: auto;           /* Ensure height adapts to content */
  }
  
  .controle-formulario:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    outline: none;
  }
  
  /* ===== BUTTONS ===== */
  .botao {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
  }
  
  .botao-primario {
    background: var(--primary);
    color: white;
  }
  
  .botao-primario:hover {
    background: var(--primary-light);
  }
  
  .botao-perigo {
    background: var(--danger);
    color: white;
  }
  
  .botao-perigo:hover {
    background: #dc2626;
  }
  
  .botao-aviso {
    background: var(--warning);
    color: white;
  }
  
  .botao-aviso:hover {
    background: #d97706;
  }
  
  /* ===== TABLE STYLES ===== */
  .tabela-responsiva {
    overflow-x: auto;
    border-radius: 0.75rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    background: var(--card-bg);
    border: 1px solid var(--border);
  }
  
  .tabela-estilizada {
    width: 100%;
    border-collapse: collapse;
    min-width: 1000px;
  }
  
  .tabela-estilizada th {
    background: var(--primary);
    color: white;
    padding: 1.25rem 1rem;
    text-align: left;
    font-weight: 500;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .tabela-estilizada td {
    padding: 1.25rem 1rem;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    font-size: 0.875rem;
  }
  
  .tabela-estilizada tr:last-child td {
    border-bottom: none;
  }
  
  .tabela-estilizada tr:hover {
    background-color: rgba(124, 58, 237, 0.03);
  }
  
  /* Status Selector */
  .seletor-status {
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid var(--border);
    font-size: 0.8125rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .seletor-status:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    outline: none;
  }
  
  /* Actions Cell */
  .celula-acoes {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  /* ===== LOADING & EMPTY STATES ===== */
  .mensagem-carregando {
    text-align: center;
    padding: 3rem;
    color: var(--text-light);
    font-size: 1rem;
    background: var(--card-bg);
    border-radius: 0.75rem;
    border: 1px dashed var(--border);
  }
  
  /* ===== STATUS BADGES (for future enhancement) ===== */
  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-processando {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .status-enviado {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .status-concluido {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .status-cancelado {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  /* ===== RESPONSIVE ADJUSTMENTS ===== */
  @media (max-width: 768px) {
    .grid-formulario {
      grid-template-columns: 1fr;
    }
    
    .acoes-gestao {
      flex-direction: column;
      align-items: stretch;
    }
    
    .celula-acoes {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .botao {
      width: 100%;
      justify-content: center;
    }
  }

  /* Add to your existing CSS */
.subtitulo-formulario {
    color: var(--text-light);
    margin: 1.5rem 0 1rem;
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  .item-pedido-form {
    background: rgba(248, 250, 252, 0.5);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border);
  }
  
  .lista-itens {
    margin: 0.5rem 0 0;
    padding-left: 1rem;
    font-size: 0.8rem;
    color: var(--text-light);
  }
  
  .lista-itens li {
    margin-bottom: 0.25rem;
  }
`;
