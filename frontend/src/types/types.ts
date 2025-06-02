export interface Target {
    id: number;
    url: string;
    name: string;
    active: boolean;
  }
  
  export interface MonitoringResult {
    id: number;
    target_id: number;
    status_code: number | null;
    response_time: number | null;
    checked_at: string;
    success: boolean;
    error?: string | null;
  }
  