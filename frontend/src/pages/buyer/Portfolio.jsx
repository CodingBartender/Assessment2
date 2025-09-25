import React, { useState } from 'react';
import BuyerWallet from '../../components/wallet/BuyerWallet';
import ViewStocks from './ViewStocks';
import MyStocks from './MyStocks';
import { FaWallet, FaSearchDollar, FaChartBar } from 'react-icons/fa';

const TABS = [
	{ label: 'My Wallet', key: 'wallet', icon: <FaWallet style={{marginRight: 6, verticalAlign: 'middle'}} size={16} color="#2563eb" /> },
	{ label: 'View Stocks', key: 'view', icon: <FaSearchDollar style={{marginRight: 6, verticalAlign: 'middle'}} size={16} color="#2563eb" /> },
	{ label: 'My Stocks', key: 'my', icon: <FaChartBar style={{marginRight: 6, verticalAlign: 'middle'}} size={16} color="#2563eb" /> },
];

const Portfolio = () => {
	const [activeTab, setActiveTab] = useState('wallet');

	return (
		<div style={{ padding: '2rem' }}>
			<div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '2rem' }}>
				{TABS.map(tab => (
					<div
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
									style={{
										cursor: 'pointer',
										padding: '0.7em 2.2em 0.3em 2.2em',
										fontWeight: activeTab === tab.key ? 700 : 500,
										color: activeTab === tab.key ? '#2563eb' : '#374151',
										borderBottom: activeTab === tab.key ? '3px solid #93c5fd' : '3px solid transparent',
										transition: 'color 0.2s, border-bottom 0.2s',
										fontSize: '1.08em',
										marginRight: '1.2em',
										borderRadius: '8px 8px 0 0',
										background: activeTab === tab.key ? '#f0f6ff' : 'transparent',
										display: 'flex',
										alignItems: 'center',
										gap: '0.5em',
										minWidth: '120px',
										justifyContent: 'center',
									}}
								>
									<span style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
										{tab.icon}
										{tab.label}
									</span>
					</div>
				))}
			</div>
			<div>
				{activeTab === 'wallet' && <BuyerWallet />}
				{activeTab === 'view' && <ViewStocks />}
				{activeTab === 'my' && <MyStocks />}
			</div>
		</div>
	);
};

export default Portfolio;
