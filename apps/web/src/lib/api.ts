import type {
  Component,
  Location,
  Manufacturer,
  Unit,
  InventoryTransaction,
  InventoryProjection,
  Reservation,
  Batch,
  Serial,
} from '@ananya/inventory';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {
      // Ignore json parse error for non-json responses
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Components
  getComponents: () => fetchApi<Component[]>('/components'),
  getComponent: (id: string) => fetchApi<Component>(`/components/${id}`),
  createComponent: (data: {
    sku: string;
    name: string;
    description?: string;
    manufacturerId?: string;
    categoryId?: string;
    defaultLocationId?: string;
    unit: string;
  }) =>
    fetchApi<Component>('/components', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Locations
  getLocations: () => fetchApi<Location[]>('/locations'),
  getLocation: (id: string) => fetchApi<Location>(`/locations/${id}`),
  createLocation: (data: {
    code: string;
    name: string;
    kind: string;
    parentId?: string | null;
    metadata?: Record<string, unknown>;
  }) =>
    fetchApi<Location>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Manufacturers
  getManufacturers: () => fetchApi<Manufacturer[]>('/manufacturers'),
  getManufacturer: (id: string) => fetchApi<Manufacturer>(`/manufacturers/${id}`),
  createManufacturer: (data: { code: string; name: string }) =>
    fetchApi<Manufacturer>('/manufacturers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Units
  getUnits: () => fetchApi<Unit[]>('/units'),
  getUnit: (id: string) => fetchApi<Unit>(`/units/${id}`),
  createUnit: (data: {
    name: string;
    category: string;
    isBaseUnit: boolean;
    conversionFactor?: number;
    precision: number;
  }) =>
    fetchApi<Unit>('/units', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Ledger Transactions
  getTransactions: () => fetchApi<InventoryTransaction[]>('/inventory-transactions'),
  getTransaction: (id: string) => fetchApi<InventoryTransaction>(`/inventory-transactions/${id}`),
  createTransaction: (data: {
    componentId: string;
    quantity: number;
    unitOfMeasure: string;
    sourceLocationId?: string;
    destinationLocationId?: string;
    transactionType: string;
    reference?: string;
    reason?: string;
    createdBy: string;
  }) =>
    fetchApi<InventoryTransaction>('/inventory-transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Inventory Projections
  getProjectionsByComponent: (componentId: string) =>
    fetchApi<InventoryProjection[]>(`/inventory-projections/component/${componentId}`),
  getProjectionsByLocation: (locationId: string) =>
    fetchApi<InventoryProjection[]>(`/inventory-projections/location/${locationId}`),
  getProjectionQuery: (componentId: string, locationId: string) =>
    fetchApi<InventoryProjection>(
      `/inventory-projections/query?componentId=${encodeURIComponent(
        componentId
      )}&locationId=${encodeURIComponent(locationId)}`
    ),
  rebuildProjections: () =>
    fetchApi<{ message: string }>('/inventory-projections/rebuild', {
      method: 'POST',
    }),

  // Reservations
  getAvailableQuantity: (componentId: string, locationId: string) =>
    fetchApi<{ componentId: string; locationId: string; availableQuantity: number }>(
      `/reservations/available?componentId=${encodeURIComponent(
        componentId
      )}&locationId=${encodeURIComponent(locationId)}`
    ),
  getReservation: (id: string) => fetchApi<Reservation>(`/reservations/${id}`),
  createReservation: (data: {
    componentId: string;
    locationId: string;
    quantity: number;
    unitOfMeasure: string;
    reference?: string;
    reservedBy: string;
    expiresAt?: string;
  }) =>
    fetchApi<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  fulfillReservation: (id: string) =>
    fetchApi<Reservation>(`/reservations/${id}/fulfill`, { method: 'PATCH' }),
  cancelReservation: (id: string) =>
    fetchApi<Reservation>(`/reservations/${id}/cancel`, { method: 'PATCH' }),

  // Batches
  getBatchesByComponent: (componentId: string) =>
    fetchApi<Batch[]>(`/batches/component/${componentId}`),
  getBatch: (id: string) => fetchApi<Batch>(`/batches/${id}`),
  createBatch: (data: {
    componentId: string;
    batchNumber: string;
    manufacturingDate?: string;
    expiryDate?: string;
    supplierBatchNumber?: string;
  }) =>
    fetchApi<Batch>('/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Serials
  getSerialsByComponent: (componentId: string) =>
    fetchApi<Serial[]>(`/serials/component/${componentId}`),
  getSerial: (id: string) => fetchApi<Serial>(`/serials/${id}`),
  createSerial: (data: {
    componentId: string;
    serialNumber: string;
    locationId?: string;
  }) =>
    fetchApi<Serial>('/serials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
