
import { supabase } from '@/integrations/supabase/client';

export interface Instance {
  id: string;
  name: string;
  type: string;
  state: "running" | "stopped" | "rebooting";
  public_ip: string;
  private_ip: string;
  ami: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  status: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  role: string;
  permissions: any;
  created_at: string;
  updated_at: string;
}

export const supabaseService = {
  // Instance management
  async getInstances(): Promise<Instance[]> {
    const { data, error } = await supabase
      .from('instances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(instance => ({
      ...instance,
      state: instance.state as "running" | "stopped" | "rebooting"
    }));
  },

  async createInstance(instance: Omit<Instance, 'user_id' | 'created_at' | 'updated_at'>): Promise<Instance> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('instances')
      .insert([{ ...instance, user_id: user.id }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      state: data.state as "running" | "stopped" | "rebooting"
    };
  },

  async updateInstance(id: string, updates: Partial<Instance>): Promise<Instance> {
    const { data, error } = await supabase
      .from('instances')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      state: data.state as "running" | "stopped" | "rebooting"
    };
  },

  async deleteInstance(id: string): Promise<void> {
    const { error } = await supabase
      .from('instances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Activity logs
  async addActivityLog(action: string, resource: string, status: string = 'success'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        user_id: user.id,
        action,
        resource,
        status
      }]);
    
    if (error) throw error;
  },

  async getActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Profile management
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) return null;
    return data;
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
