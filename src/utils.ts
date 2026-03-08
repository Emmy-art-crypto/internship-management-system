// Chart utility functions for safe dataset handling
import { ChartDataset } from 'chart.js';

export function setDatasets<TType, TData>(
    currentData: { datasets: ChartDataset<TType, TData>[] },
    nextDatasets: ChartDataset<TType, TData>[] | undefined,
    datasetIdKey?: string
) {
    const addedDatasets: ChartDataset<TType, TData>[] = [];
    // Defensive: ensure nextDatasets is always an array
    currentData.datasets = (nextDatasets || []).map(
        (nextDataset: Record<string, unknown>) => {
            // given the new set, find its current match
            const currentDataset = currentData.datasets.find(
                (d: any) =>
                    datasetIdKey && d[datasetIdKey] && nextDataset[datasetIdKey]
                        ? d[datasetIdKey] === nextDataset[datasetIdKey]
                        : false
            );
            return currentDataset ? { ...currentDataset, ...nextDataset } : nextDataset;
        }
    );
    return currentData.datasets;
}

export function cloneData<TType, TData>(
    data: { labels?: any; datasets?: ChartDataset<TType, TData>[] },
    datasetIdKey?: string
) {
    const nextData: any = {};
    // Defensive: ensure data.datasets is always an array
    setLabels(nextData, data.labels);
    setDatasets(nextData, data.datasets, datasetIdKey);
    return nextData;
}

export function setLabels(nextData: any, labels: any) {
    nextData.labels = labels || [];
}
