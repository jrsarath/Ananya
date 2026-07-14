export interface Location {
  id: string;
  code: string;
  name: string;
  kind: string;
  parentId: string | null;
  isActive: boolean;
  metadata: Record<string, unknown>;
}

export interface CreateLocationInput {
  code: string;
  name: string;
  kind: string;
  parentId?: string | null;
  metadata?: Record<string, unknown>;
}
