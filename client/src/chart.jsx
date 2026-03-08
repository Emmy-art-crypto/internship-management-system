import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js';

const ChartComponent = ({ type, data, options, plugins, datasetIdKey }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        if (canvasRef.current) {
            // Defensive: ensure data and datasets are always arrays
            const safeData = {
                ...data,
                labels: (data && data.labels) || [],
                datasets: (data && Array.isArray(data.datasets)) ? data.datasets : [],
            };
            chartRef.current = new ChartJS(canvasRef.current, {
                type: type,
                data: safeData,
                options: options && { ...options },
                plugins,
            });
        }
    };

    const destroyChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }
    };

    useEffect(() => {
        renderChart();
        return () => destroyChart();
        // eslint-disable-next-line
    }, [type, data, options, plugins]);

    return <canvas ref={canvasRef} />;
};

export default ChartComponent;
