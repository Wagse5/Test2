import React from 'react';

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            padding: '1rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === tab ? '2px solid #4CAF50' : 'none',
            color: activeTab === tab ? '#4CAF50' : '#4a4a4a',
            fontWeight: activeTab === tab ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
