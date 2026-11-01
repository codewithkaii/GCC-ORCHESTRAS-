/**
 * @file client.ts
 * @description Centralized typed HTTP API client connecting React frontend to FastAPI (ADR-005).
 * Ref: ORC-DTS-001
 */

import {
  ApiResponse,
  ApiErrorResponse,
  CreateRequestInput,
  RequestDto,
  ApprovalRequestDto,
  ApproveActionInput,
  RejectActionInput,
  RequestChangesActionInput,
  OrganizationDto,
} from '../types/api';

class ApiClient {
  private baseUrl: string;
  private defaultAuthHeader: string;

  constructor() {
    this.baseUrl = '/api/v1';
    // Development/Pilot default authenticated principal: operations lead with full authority
    this.defaultAuthHeader = 'Bearer usr_mohammed:org_gcc_logistics:operations_lead:*';
  }

  private generateCorrelationId(): string {
    return `corr_fe_${Math.random().toString(36).substring(2, 10)}`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Correlation-ID': this.generateCorrelationId(),
      'X-Request-ID': `req_fe_${Date.now()}`,
      'Authorization': this.defaultAuthHeader,
      ...(options.headers as Record<string, string> || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const responseBody = await response.json();

      if (!response.ok) {
        const errorData = responseBody as ApiErrorResponse;
        const errorMessage = errorData.error?.message || `HTTP ${response.status}: Failed to execute request`;
        throw new Error(errorMessage);
      }

      return responseBody as ApiResponse<T>;
    } catch (err: any) {
      // Graceful offline/fallback handling for development environment
      console.warn(`[ORCHESTRA API Client] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // --- Health Probes ---
  async checkHealth(): Promise<{ status: string; service: string }> {
    const res = await fetch('/health');
    return res.json();
  }

  async checkReady(): Promise<{ status: string; database: string }> {
    const res = await fetch('/ready');
    return res.json();
  }

  // --- Requests ---
  async createRequest(input: CreateRequestInput): Promise<ApiResponse<RequestDto>> {
    return this.request<RequestDto>('/requests', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getRequest(id: string): Promise<ApiResponse<RequestDto>> {
    return this.request<RequestDto>(`/requests/${id}`);
  }

  async getRequestEvents(id: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/requests/${id}/events`);
  }

  // --- Approvals ---
  async listApprovals(): Promise<ApiResponse<ApprovalRequestDto[]>> {
    return this.request<ApprovalRequestDto[]>('/approvals');
  }

  async getApproval(id: string): Promise<ApiResponse<ApprovalRequestDto>> {
    return this.request<ApprovalRequestDto>(`/approvals/${id}`);
  }

  async approveAction(id: string, input: ApproveActionInput = {}): Promise<ApiResponse<ApprovalRequestDto>> {
    return this.request<ApprovalRequestDto>(`/approvals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async rejectAction(id: string, input: RejectActionInput): Promise<ApiResponse<ApprovalRequestDto>> {
    return this.request<ApprovalRequestDto>(`/approvals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async requestChangesAction(id: string, input: RequestChangesActionInput): Promise<ApiResponse<ApprovalRequestDto>> {
    return this.request<ApprovalRequestDto>(`/approvals/${id}/request-changes`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // --- End-to-End Vertical Slice Workflow ---
  async investigateSupplierDelay(requestId: string, poNumber: string = 'PO-2026-8821'): Promise<ApiResponse<any>> {
    return this.request<any>('/workflows/supplier-delay/investigate', {
      method: 'POST',
      body: JSON.stringify({ request_id: requestId, po_number: poNumber }),
    });
  }

  async executeSupplierDelayMitigation(approvalId: string): Promise<ApiResponse<any>> {
    return this.request<any>('/workflows/supplier-delay/execute', {
      method: 'POST',
      body: JSON.stringify({ approval_id: approvalId }),
    });
  }
}

export const apiClient = new ApiClient();
