import { createGlobalStyle } from "styled-components";

export const ClientsGlobalStyles = createGlobalStyle`
/* ===== CLIENT MANAGEMENT THEME ===== */
:root {
  --primary: #8B5E3C;         /* Rich brown */
  --primary-light: #A9746E;   /* Soft warm brown */
  --background: #fffaf5;      /* Creamy white */
  --card-bg: #ffffff;         /* Pure white */
  --text: #4B3621;            /* Deep brown */
  --text-light: #8B735B;      /* Light brown/gray */
  --border: #e2d5ca;          /* Light beige border */
  --success: #6AA84F;         /* Earthy green */
  --danger: #C94C4C;          /* Muted red */
  --warning: #D9982C;         /* Muted amber */
}


/* ===== BASE LAYOUT ===== */
.clients-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fffaf5;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ===== TITLES ===== */
.page-title {
  color: #8B5E3C;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

/* ===== FORM STYLES ===== */
.client-form {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.form-title {
  color: #8B5E3C;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #8B735B;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e2d5ca;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  color: #4B3621;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #8B5E3C;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  outline: none;
}

/* ===== BUTTONS ===== */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #8B5E3C;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #A9746E;
}

.btn-danger {
  background: var(--danger);
  color: white;
  border: none;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-warning {
  background: var(--warning);
  color: white;
  border: none;
}

.btn-warning:hover {
  background: #d97706;
}

/* ===== TABLE STYLES ===== */
.client-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-radius: 0.5rem;
  overflow: hidden;
}

.client-table th {
  background: #8B5E3C;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.client-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2d5ca;
  color: #4B3621;
  font-size: 0.95rem;
}

.client-table tr:last-child td {
  border-bottom: none;
}

.client-table tr:hover {
  background-color: rgba(79, 70, 229, 0.05);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

/* ===== LOADING STATE ===== */
.loading-message {
  text-align: center;
  padding: 2rem;
  color: #8B735B;
  font-style: italic;
}

/* ===== REPORT STYLES (NEW) ===== */
.info-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.info-card h2 {
  color: #8B5E3C;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.info-card h3 {
  color: #8B5E3C;
  margin: 1.5rem 0 1rem;
  font-size: 1.25rem;
  font-weight: 500;
}

.edit-button {
  background: #8B5E3C;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
}

.edit-button:hover {
  background: #A9746E;
}

.edit-button:disabled {
  background: #e2d5ca;
  cursor: not-allowed;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  background: #f8f4f0;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.info-label {
  display: block;
  color: #8B735B;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.info-value {
  display: block;
  color: #4B3621;
  font-size: 1.25rem;
  font-weight: 600;
}

.orders-list {
  display: grid;
  gap: 1rem;
}

.order-card {
  background: #f8f4f0;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: transform 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4B3621;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  color: #8B735B;
  font-size: 0.875rem;
}

.status-pendente {
  color: #D9982C;
}

.status-entregue {
  color: #6AA84F;
}

.status-cancelado {
  color: #C94C4C;
}

/* ===== TABS STYLES ===== */
.profile-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2d5ca;
  padding-bottom: 0.5rem;
}

.profile-tabs button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  color: #8B735B;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-tabs button:hover {
  color: #8B5E3C;
  background: rgba(139, 94, 60, 0.1);
}

.profile-tabs button.active {
  color: #8B5E3C;
  background: rgba(139, 94, 60, 0.1);
  border-bottom: 2px solid #8B5E3C;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .client-table {
    display: block;
    overflow-x: auto;
  }

  .actions-cell {
    flex-direction: column;
  }
}
`;
