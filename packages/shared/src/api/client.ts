import {
  User,
  CollectorProfile,
  RecyclerFacility,
  PriceRecord,
  ScrapLot,
  HandoverTransaction,
  AnomalyReport,
  DailyLedgerSummary
} from '../types/index';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  profile?: CollectorProfile | RecyclerFacility;
}

export interface RecyclerMatchResult {
  facility: RecyclerFacility;
  distance_km: number;
  rate_per_kg: number;
  estimated_gross_payout: number;
  transport_subsidy: number;
  net_payout: number;
  pickup_available: boolean;
  match_rank: number;
}

export interface AnomalyEvaluationResult {
  is_flagged: boolean;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  violations: string[];
  explanation: string;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem('kabadiwala_token', token);
      } else {
        localStorage.removeItem('kabadiwala_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('kabadiwala_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText };
        }
        throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // Health
  async checkHealth(): Promise<{ status: string; database: string; version: string }> {
    return this.request('/health');
  }

  // Auth
  async collectorLogin(phone: string, pin?: string, name?: string, language: string = 'hi'): Promise<AuthResponse> {
    return this.request('/api/v1/auth/collector/login', {
      method: 'POST',
      body: JSON.stringify({ phone, pin, name, language })
    });
  }

  async recyclerLogin(email: string, password: string): Promise<AuthResponse> {
    return this.request('/api/v1/auth/recycler/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMe(): Promise<{ user: User; profile: any }> {
    return this.request('/api/v1/auth/me');
  }

  // Prices
  async getPriceBoard(): Promise<PriceRecord[]> {
    return this.request('/api/v1/prices');
  }

  async getCategoryPrice(category: string): Promise<PriceRecord> {
    return this.request(`/api/v1/prices/${category}`);
  }

  // Lots
  async createScrapLot(lot: Partial<ScrapLot>): Promise<ScrapLot> {
    return this.request('/api/v1/lots', {
      method: 'POST',
      body: JSON.stringify(lot)
    });
  }

  async getMyLots(limit: number = 20, offset: number = 0): Promise<ScrapLot[]> {
    return this.request(`/api/v1/lots?limit=${limit}&offset=${offset}`);
  }

  async getLotById(id: string): Promise<ScrapLot> {
    return this.request(`/api/v1/lots/${id}`);
  }

  // Match & Recyclers
  async matchRecyclers(params: {
    category: string;
    weight_kg: number;
    latitude?: number;
    longitude?: number;
    max_distance_km?: number;
  }): Promise<RecyclerMatchResult[]> {
    return this.request('/api/v1/recyclers/match', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async listRecyclers(): Promise<RecyclerFacility[]> {
    return this.request('/api/v1/recyclers');
  }

  // Handovers & QR Verification
  async initiateHandover(lotId: string, recyclerId: string): Promise<HandoverTransaction> {
    return this.request('/api/v1/handovers/initiate', {
      method: 'POST',
      body: JSON.stringify({ lot_id: lotId, recycler_id: recyclerId })
    });
  }

  async verifyHandover(data: {
    qr_token: string;
    fallback_code?: string;
    actual_weight_kg?: number;
    actual_condition?: string;
    notes?: string;
  }): Promise<HandoverTransaction> {
    return this.request('/api/v1/handovers/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCollectorLedger(): Promise<{
    today: DailyLedgerSummary;
    history: DailyLedgerSummary[];
    recent_transactions: HandoverTransaction[];
  }> {
    return this.request('/api/v1/ledger/collector');
  }

  async getRecyclerDashboardStats(): Promise<any> {
    return this.request('/api/v1/recycler/dashboard/stats');
  }

  // AI & Anomaly
  async evaluateAnomaly(lotData: any): Promise<AnomalyEvaluationResult> {
    return this.request('/api/v1/ml/evaluate-anomaly', {
      method: 'POST',
      body: JSON.stringify(lotData)
    });
  }

  // SSE Realtime Subscription
  subscribeToHandoverStream(lotId: string, onEvent: (data: any) => void): () => void {
    const token = this.getToken();
    const url = `${this.baseUrl}/api/v1/handovers/stream/${lotId}${token ? `?token=${token}` : ''}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        onEvent(parsed);
      } catch (err) {
        console.error('[SSE] Failed to parse event', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }
}

export const api = new ApiClient();
