
import { supabase } from '@/integrations/supabase/client';

export interface ServiceUsage {
  id: string;
  user_id: string;
  service_type: string;
  resource_id?: string;
  usage_type: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  billing_period: string;
  recorded_at: string;
  metadata?: any;
}

export interface BillingSummary {
  id: string;
  user_id: string;
  billing_period: string;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
  invoice_data: any;
  generated_at: string;
  updated_at: string;
}

export const billingService = {
  // Track service usage
  async trackUsage(usageData: {
    service_type: string;
    resource_id?: string;
    usage_type: string;
    quantity: number;
    unit_cost: number;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.rpc('track_service_usage', {
      p_user_id: user.id,
      p_service_type: usageData.service_type,
      p_resource_id: usageData.resource_id || null,
      p_usage_type: usageData.usage_type,
      p_quantity: usageData.quantity,
      p_unit_cost: usageData.unit_cost
    });

    if (error) throw error;
  },

  // Get current month usage
  async getCurrentMonthUsage(): Promise<ServiceUsage[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const currentPeriod = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01

    const { data, error } = await supabase
      .from('service_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('billing_period', currentPeriod)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get billing summary for a period
  async getBillingSummary(period?: string): Promise<BillingSummary | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const billingPeriod = period || new Date().toISOString().slice(0, 7) + '-01';

    const { data, error } = await supabase
      .from('billing_summary')
      .select('*')
      .eq('user_id', user.id)
      .eq('billing_period', billingPeriod)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Get all billing periods for user
  async getAllBillingPeriods(): Promise<BillingSummary[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('billing_summary')
      .select('*')
      .eq('user_id', user.id)
      .order('billing_period', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Calculate and generate current month billing
  async generateCurrentMonthBilling(): Promise<void> {
    const { error } = await supabase.rpc('calculate_monthly_billing');
    if (error) throw error;
  },

  // Simulate instance usage (for demo)
  async simulateInstanceUsage(instanceId: string, instanceType: string): Promise<void> {
    const costs = {
      't2.micro': 0.0116,
      't2.small': 0.023,
      't2.medium': 0.0464,
      't3.micro': 0.0104,
      't3.small': 0.0208,
      't3.medium': 0.0416,
      'm5.large': 0.096,
      'm5.xlarge': 0.192
    };

    const hourlyCost = costs[instanceType as keyof typeof costs] || 0.05;

    await this.trackUsage({
      service_type: 'EC2',
      resource_id: instanceId,
      usage_type: 'compute_hours',
      quantity: 1, // 1 hour
      unit_cost: hourlyCost
    });
  },

  // Simulate S3 usage
  async simulateS3Usage(bucketName: string, storageGB: number, transferGB: number = 0): Promise<void> {
    // Storage cost
    await this.trackUsage({
      service_type: 'S3',
      resource_id: bucketName,
      usage_type: 'storage_gb_hours',
      quantity: storageGB,
      unit_cost: 0.023 / 24 // $0.023 per GB per day, converted to hourly
    });

    // Data transfer cost (if any)
    if (transferGB > 0) {
      await this.trackUsage({
        service_type: 'S3',
        resource_id: bucketName,
        usage_type: 'data_transfer_gb',
        quantity: transferGB,
        unit_cost: 0.09 // $0.09 per GB
      });
    }
  }
};
