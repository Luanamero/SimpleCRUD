import { createGlobalStyle } from "styled-components";

export const AdminGlobalStyle = createGlobalStyle`
body {
  margin: 0;
}

/* Estilo geral */
.admin-container {
  background-color: #3B2F2F; /* marrom escuro de fundo */
  min-height: 100vh;
  padding: 2rem;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #F5E9DC; /* bege claro */
  font-weight: 700;
  text-shadow: 0 0 10px rgba(245, 233, 220, 0.2);
}

.admin-subtitle {
  font-size: 1.1rem;
  color: #E0D6C3; /* tom claro de marrom/bege */
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;
}

/* Grid de cartões */
.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

/* Estilo dos cartões */
.admin-card {
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: #5C4438; /* marrom médio */
  color: #FDFBF8; /* quase branco */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
}

.admin-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
  z-index: 1;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #F5E9DC; /* ícone claro */
  z-index: 2;
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: #FFF8F0;
  z-index: 2;
}

.card-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  z-index: 2;
}

.card-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  color: #EAD8C0; /* seta em tom bege */
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;
}

.admin-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(5px);
}

/* Responsividade */
@media (max-width: 768px) {
  .admin-container {
    padding: 1.5rem;
  }

  .admin-title {
    font-size: 2rem;
  }

  .admin-subtitle {
    font-size: 1rem;
  }

  .admin-grid {
    grid-template-columns: 1fr;
  }

  .admin-card {
    height: 180px;
    padding: 1.5rem;
  }
}
`;
