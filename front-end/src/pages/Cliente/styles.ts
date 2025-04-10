import { createGlobalStyle } from "styled-components";

export const CustomerProfileGlobalStyle = createGlobalStyle`
.customer-profile-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f9f5f0; /* Bege claro como fundo */
    min-height: 100vh;
}

.profile-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background-color: #5d4037; /* Marrom escuro */
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(93, 64, 55, 0.2);
}

.profile-header h1 {
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.profile-header p {
    font-size: 1.1rem;
    color: #d7ccc8; /* Marrom claro para texto */
}

.profile-tabs {
    display: flex;
    border-bottom: 1px solid #d7ccc8; /* Marrom claro */
    margin-bottom: 2rem;
}

.profile-tabs button {
    padding: 0.8rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    font-size: 1rem;
    font-weight: 600;
    color: #8d6e63; /* Marrom médio */
    cursor: pointer;
    transition: all 0.3s ease;
}

.profile-tabs button.active {
    color: #5d4037; /* Marrom escuro */
    border-bottom-color: #5d4037;
}

.profile-tabs button:hover {
    color: #3e2723; /* Marrom mais escuro */
}

.personal-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.info-card {
    background: #fff;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(93, 64, 55, 0.1);
    border: 1px solid #d7ccc8; /* Borda marrom claro */
}

.info-card h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #5d4037; /* Marrom escuro */
    font-size: 1.3rem;
    border-bottom: 1px solid #d7ccc8;
    padding-bottom: 0.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.info-item {
    margin-bottom: 1rem;
}

.info-label {
    display: block;
    font-weight: 600;
    color: #8d6e63; /* Marrom médio */
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
}

.info-value {
    display: block;
    color: #5d4037; /* Marrom escuro */
    font-size: 1rem;
    padding: 0.3rem 0;
    border-bottom: 1px dashed #d7ccc8;
}

.edit-button {
    margin-top: 1rem;
    padding: 0.6rem 1.2rem;
    background-color: #8d6e63; /* Marrom médio */
    border: 1px solid #6d4c41;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.edit-button:hover {
    background-color: #6d4c41; /* Marrom mais escuro */
}

.actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
}

.change-password {
    padding: 0.8rem 1.5rem;
    background-color: #a1887f; /* Marrom claro */
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

.change-password:hover {
    background-color: #8d6e63; /* Marrom médio */
}

.logout {
    padding: 0.8rem 1.5rem;
    background-color: #fff;
    border: 1px solid #8d6e63;
    border-radius: 5px;
    color: #5d4037;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout:hover {
    background-color: #f5ebe0;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.no-orders {
    text-align: center;
    padding: 3rem;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #d7ccc8;
}

.no-orders p {
    font-size: 1.1rem;
    color: #8d6e63;
    margin-bottom: 1.5rem;
}

.browse-books {
    padding: 0.8rem 1.5rem;
    background-color: #8d6e63;
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

.browse-books:hover {
    background-color: #6d4c41;
}

.order-card {
    background: #fff;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(93, 64, 55, 0.1);
    border: 1px solid #d7ccc8;
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #d7ccc8;
}

.order-id {
    font-weight: 600;
    color: #5d4037;
    margin-right: 1rem;
}

.order-date {
    color: #8d6e63;
    font-size: 0.9rem;
}

.order-status {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.order-status.entregue {
    background-color: #e8f5e9;
    color: #2e7d32;
}

.order-status.em-transporte {
    background-color: #e3f2fd;
    color: #1565c0;
}

.order-status.processando {
    background-color: #fff8e1;
    color: #ff8f00;
}

.order-items h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #5d4037;
    border-bottom: 1px solid #d7ccc8;
    padding-bottom: 0.5rem;
}

.order-items ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.order-items li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f5f5f5;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #d7ccc8;
}

.order-details {
    padding: 0.6rem 1.2rem;
    background-color: #fff;
    border: 1px solid #8d6e63;
    border-radius: 5px;
    color: #5d4037;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.order-details:hover {
    background-color: #f5ebe0;
}

.order-total {
    font-weight: 600;
    color: #5d4037;
}

.order-total span:last-child {
    margin-left: 1rem;
    font-size: 1.1rem;
    color: #5d4037;
}

.loading, .error {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: #5d4037;
}

@media (max-width: 768px) {
    .personal-info {
        grid-template-columns: 1fr;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .profile-header h1 {
        font-size: 2rem;
    }
}
`;
