import { useState, useEffect } from 'react';
import { supabase } from '/lib/supabaseClient';

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sales')) || [];
    setSales(saved);
  }, []);

  // Save to localStorage whenever sales change
  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const totalSales = sales.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const todaySales = sales.filter(s => s.date === new Date().toISOString().split('T')[0])
                         .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const filteredSales = sales.filter(sale => 
    sale.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const salesByCategory = sales.reduce((acc, sale) => {
    acc[sale.category] = (acc[sale.category] || 0) + parseFloat(sale.amount);
    return acc;
  }, {});

  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!item || !amount || !date) return;
    
    setLoading(true);
    const newSale = { 
      id: Date.now(), 
      item, 
      amount: parseFloat(amount).toFixed(2), 
      date,
      category,
      timestamp: new Date().toISOString()
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSales([newSale, ...sales]);
    setItem('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('general');
    setLoading(false);
  };

  const handleDelete = (id) => {
    setSales(sales.filter(s => s.id !== id));
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/login';
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(sales, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const categories = [
    { value: 'general', label: 'General', color: '#4dabf5' },
    { value: 'food', label: 'Food & Beverage', color: '#51cf66' },
    { value: 'retail', label: 'Retail', color: '#ff6b6b' },
    { value: 'services', label: 'Services', color: '#cc5de8' },
    { value: 'digital', label: 'Digital', color: '#ffa94d' }
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>💰 BizTrack</div>
          <div style={styles.businessName}>Local Business Pro</div>
        </div>
        
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'dashboard' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            style={activeTab === 'sales' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('sales')}
          >
            💳 Sales
          </button>
          <button 
            style={activeTab === 'analytics' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            style={activeTab === 'add' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add Sale
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.exportButton} onClick={exportData}>
            📥 Export Data
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.userInfo}>
            <span>Welcome back! 👋</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={styles.dashboardGrid}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>💰</div>
                <div style={styles.statContent}>
                  <h3>Total Sales</h3>
                  <p style={styles.statAmount}>${totalSales.toFixed(2)}</p>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📅</div>
                <div style={styles.statContent}>
                  <h3>Today's Sales</h3>
                  <p style={styles.statAmount}>${todaySales.toFixed(2)}</p>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📦</div>
                <div style={styles.statContent}>
                  <h3>Total Transactions</h3>
                  <p style={styles.statAmount}>{sales.length}</p>
                </div>
              </div>
              
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🏷️</div>
                <div style={styles.statContent}>
                  <h3>Categories</h3>
                  <p style={styles.statAmount}>{Object.keys(salesByCategory).length}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Recent Activity</h2>
              <div style={styles.activityList}>
                {sales.slice(0, 5).map(sale => (
                  <div key={sale.id} style={styles.activityItem}>
                    <div style={styles.activityIcon}>💸</div>
                    <div style={styles.activityContent}>
                      <strong>{sale.item}</strong>
                      <span>${parseFloat(sale.amount).toFixed(2)}</span>
                    </div>
                    <div style={styles.activityMeta}>
                      <span style={styles.categoryTag(sale.category)}>{sale.category}</span>
                      <span>{sale.date}</span>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && (
                  <p style={styles.emptyState}>No transactions yet. Add your first sale!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>All Transactions</h2>
            <div style={styles.transactionList}>
              {filteredSales.map(sale => (
                <div key={sale.id} style={styles.transactionItem}>
                  <div style={styles.transactionInfo}>
                    <div style={styles.transactionIcon}>📦</div>
                    <div>
                      <strong>{sale.item}</strong>
                      <div style={styles.transactionMeta}>
                        <span style={styles.categoryTag(sale.category)}>{sale.category}</span>
                        <span>{sale.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.transactionActions}>
                    <span style={styles.transactionAmount}>${parseFloat(sale.amount).toFixed(2)}</span>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(sale.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {filteredSales.length === 0 && (
                <p style={styles.emptyState}>No transactions found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={styles.analyticsGrid}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Sales by Category</h2>
              <div style={styles.categoryList}>
                {Object.entries(salesByCategory).map(([category, amount]) => (
                  <div key={category} style={styles.categoryItem}>
                    <div style={styles.categoryHeader}>
                      <span style={styles.categoryName}>{category}</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill,
                          width: `${(amount / totalSales) * 100}%`,
                          backgroundColor: categories.find(c => c.value === category)?.color || '#4dabf5'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Quick Stats</h2>
              <div style={styles.statsList}>
                <div style={styles.statItem}>
                  <span>Average Sale</span>
                  <span>${sales.length > 0 ? (totalSales / sales.length).toFixed(2) : '0.00'}</span>
                </div>
                <div style={styles.statItem}>
                  <span>Transactions Today</span>
                  <span>{sales.filter(s => s.date === new Date().toISOString().split('T')[0]).length}</span>
                </div>
                <div style={styles.statItem}>
                  <span>Most Sold Category</span>
                  <span>
                    {Object.keys(salesByCategory).length > 0 
                      ? Object.entries(salesByCategory).sort((a, b) => b[1] - a[1])[0][0]
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Add New Sale</h2>
            <form onSubmit={handleAddSale} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Item Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter item name"
                    value={item}
                    onChange={e => setItem(e.target.value)}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Amount</label>
                  <input
                    style={styles.input}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.select}
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                type="submit" 
                style={loading ? styles.addButtonLoading : styles.addButton}
                disabled={loading}
              >
                {loading ? 'Adding Sale...' : '💾 Add Sale'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#1e293b',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #334155',
  },
  sidebarHeader: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4dabf5',
    marginBottom: '8px',
  },
  businessName: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navButton: {
    padding: '12px 16px',
    backgroundColor: 'transparent',
    color: '#cbd5e1',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  navButtonActive: {
    padding: '12px 16px',
    backgroundColor: '#4dabf5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  sidebarFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  exportButton: {
    padding: '10px 16px',
    backgroundColor: '#334155',
    color: '#cbd5e1',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '8px',
  },
  logoutButton: {
    padding: '10px 16px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  main: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#0f172a',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid #334155',
  },
  searchContainer: {
    flex: 1,
    maxWidth: '400px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  userInfo: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  dashboardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    fontSize: '24px',
    width: '48px',
    height: '48px',
    backgroundColor: '#4dabf5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4dabf5',
    margin: '4px 0 0 0',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #334155',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#f8fafc',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#334155',
    borderRadius: '8px',
  },
  activityIcon: {
    fontSize: '16px',
  },
  activityContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  activityMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  categoryTag: (category) => ({
    padding: '2px 8px',
    backgroundColor: '#334155',
    borderRadius: '4px',
    fontSize: '11px',
    textTransform: 'capitalize',
  }),
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#334155',
    borderRadius: '8px',
    border: '1px solid #475569',
  },
  transactionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  transactionIcon: {
    fontSize: '16px',
  },
  transactionMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  transactionActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  transactionAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#4dabf5',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  categoryName: {
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: '#334155',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#334155',
    borderRadius: '8px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  input: {
    padding: '12px',
    backgroundColor: '#334155',
    border: '1px solid #475569',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '12px',
    backgroundColor: '#334155',
    border: '1px solid #475569',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  addButton: {
    padding: '14px 20px',
    backgroundColor: '#4dabf5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    alignSelf: 'flex-start',
  },
  addButtonLoading: {
    padding: '14px 20px',
    backgroundColor: '#94a3b8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
    alignSelf: 'flex-start',
    opacity: 0.7,
  },
  emptyState: {
    textAlign: 'center',
    color: '#94a3b8',
    fontStyle: 'italic',
    padding: '40px 20px',
  },
};