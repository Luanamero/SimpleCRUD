import { useState, useEffect } from 'react';
import './CustomerProfile.css';
import { useParams } from 'react-router-dom';
import { Cliente, ClienteService } from '../../services/clientes';
import { Pedido, PedidoService } from '../../services/pedidos';
import { Livro, LivroService } from '../../services/livros';
import FiltroLivros from '../../components/FiltroLivros/FiltroLivros';
import LivroItem from '../../components/LivroItem/LivroItem';

const CustomerProfile = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState<Cliente | null>(null);
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'livros'>('profile');

    const [livros, setLivros] = useState<Livro[]>([]);
    const [filtro, setFiltro] = useState({
        nome: '',
        genero: '',
        precoMin: 0,
        precoMax: 999999,
        estoqueBaixo: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCustomers = await ClienteService.listar();
                const foundCustomer = resCustomers.find(
                    (customer) => id && customer.id === Number(id)
                );

                if (!foundCustomer) {
                    setCustomer(null);
                    setOrders([]);
                    return;
                }

                const resOrders = await PedidoService.listar();
                setOrders(resOrders.filter(order => order.cliente_id === foundCustomer.id));
                setCustomer(foundCustomer);

                const resLivros = await LivroService.listar();
                setLivros(resLivros);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const livrosFiltrados = livros.filter((livro) => {
        const nomeMatch = livro.titulo.toLowerCase().includes(filtro.nome.toLowerCase());
        const generoMatch = livro.genero.toLowerCase().includes(filtro.genero.toLowerCase());
        const precoMatch = livro.preco >= filtro.precoMin && livro.preco <= filtro.precoMax;
       
        return nomeMatch && generoMatch && precoMatch;
    });

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
                <button
                    className={activeTab === 'livros' ? 'active' : ''}
                    onClick={() => setActiveTab('livros')}
                >
                    Livros Disponíveis
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
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
                )}

                {activeTab === 'orders' && (
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

                {activeTab === 'livros' && (
                    <div className="available-books">
                        <h2>Livros Disponíveis</h2>

                        <FiltroLivros
                            nome={filtro.nome}
                            genero={filtro.genero}
                            precoMin={filtro.precoMin}
                            precoMax={filtro.precoMax}
                            onChange={(novoFiltro) =>
                                setFiltro({
                                ...novoFiltro,
                                estoqueBaixo: novoFiltro.estoqueBaixo ?? false, // 👈 fallback
                                })
                            }
                            />


                        <div className="books-grid">
                            {livrosFiltrados.map(livro => (
                                <LivroItem key={livro.id} livro={livro} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerProfile;
