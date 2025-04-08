import { useState, useEffect } from 'react';
import './CustomerProfile.css';
import { useParams } from 'react-router-dom';
import { Cliente, ClienteService } from '../../services/clientes';
import { Pedido, PedidoService } from '../../services/pedidos';

const CustomerProfile = () => {
    const { id } = useParams();
console.log('ID recebido:', id); 
    const [customer, setCustomer] = useState<Cliente | null>(null);
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
   
   console.log(id)
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("oi1")
                // 1. Busca todos os clientes
                const resCustomers = await ClienteService.listar();
                console.log(resCustomers)
                const allCustomers = resCustomers;
    
                // 2. Busca o cliente pelo email
                const foundCustomer = allCustomers.find(
                    (customer) => id && customer.id === Number(id)
                );

                console.log(foundCustomer)
    
                if (!foundCustomer) {
                    console.warn("Cliente com esse email não foi encontrado.");
                    setCustomer(null);
                    setOrders([]);
                    return;
                }
    
                // 3. Com o ID do cliente, busca os pedidos
                const resOrders = await PedidoService.listar();
                const allOrders = resOrders;
    
                setOrders(allOrders.filter(order => order.cliente_id === foundCustomer.id));
                setCustomer(foundCustomer);
            } catch (err) {
                console.error('Erro ao carregar dados do cliente:', err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [id]);


    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    if (!customer) {
        return <div className="error">Erro ao carregar perfil do cliente.</div>;
    }

    return (
        <div className="customer-profile-container">
            <header className="profile-header">
                <h1>Meu Perfil</h1>
                <p>Bem-vindo de volta, {customer.nome}!</p>
            </header>

            <div className="profile-tabs">
                <button
                    className={activeTab === 'profile' ? 'active' : ''}
                    onClick={() => setActiveTab('profile')}
                >
                    Informações Pessoais
                </button>
                <button
                    className={activeTab === 'orders' ? 'active' : ''}
                    onClick={() => setActiveTab('orders')}
                >
                    Meus Pedidos ({orders.length})
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' ? (
                    <div className="personal-info">
                        <div className="info-card">
                            <h2>Dados Pessoais</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Nome:</span>
                                    <span className="info-value">{customer.nome}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{customer.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Telefone:</span>
                                    <span className="info-value">{customer.telefone}</span>
                                </div>
                               
                            </div>
                        </div>

                        <div className="info-card">
                            <h2>Endereço</h2>
                            <p>{customer.endereco}</p>
                            <button className="edit-button">Editar Endereço</button>
                        </div>

                        <div className="actions">
                            <button className="change-password">Alterar Senha</button>
                            <button className="logout">Sair</button>
                        </div>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <p>Você ainda não fez nenhum pedido.</p>
                                <button className="browse-books">Explorar Livros</button>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div>
                                            <span className="order-id">Pedido #{order.id}</span>
                                            <span className="order-date">{order.data}</span>
                                        </div>
                                        <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                   

                                    
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerProfile;