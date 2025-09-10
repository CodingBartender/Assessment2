import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import TaskList from '../components/TaskList'; 

const ViewStock = () => {

    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get('/api/tasks', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTasks(response.data);
        };
        fetchData();
    }, [user]);

    const container = useRef();

    useEffect(
        () => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
            {
            "symbol": "NASDAQ:AAPL",
            "chartOnly": false,
            "dateRange": "12M",
            "noTimeScale": false,
            "colorTheme": "dark",
            "isTransparent": false,
            "locale": "en",
            "width": "100%",
            "autosize": true,
            "height": "100%"
            }`;
        container.current.appendChild(script);
        },
        []
    );

    return (
        
        <div className = "container mx-auto p-6">

            <h1 className = "text-2xl font-bold"> Market Overview </h1>
            <div className="tradingview-widget-container" ref={container}>
                <div className="tradingview-widget-container__widget"></div>
                <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/?exchange=NASDAQ" rel="noopener nofollow" target="_blank"><span className="blue-text">AAPL chart by TradingView</span></a></div>
            </div>

            <h1 className = "text-2xl font-bold"> Owned Stock Overview </h1>
            {console.log(tasks)}
            <TaskList 
            tasks = {tasks} 
            setTasks = {setTasks} 
            />
        </div>

    );
};

export default ViewStock;