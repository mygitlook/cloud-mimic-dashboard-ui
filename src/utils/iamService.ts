
import { supabase } from '@/integrations/supabase/client';

export interface IAMUser {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  status: 'active' | 'inactive' | 'suspended';
  mfa_enabled: boolean;
  console_access: boolean;
  programmatic_access: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_activity?: string;
  groups?: string[];
}

export interface IAMGroup {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface IAMPolicy {
  id: string;
  name: string;
  description?: string;
  policy_type: 'AWS Managed' | 'Customer Managed';
  policy_document: any;
  version: string;
  created_at: string;
  updated_at: string;
}

export const iamService = {
  // IAM Users
  async getIAMUsers(): Promise<IAMUser[]> {
    const { data, error } = await supabase
      .from('iam_users')
      .select(`
        *,
        iam_user_groups!inner(
          iam_groups(name)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(user => ({
      ...user,
      status: user.status as 'active' | 'inactive' | 'suspended',
      groups: user.iam_user_groups?.map((ug: any) => ug.iam_groups.name) || []
    }));
  },

  async createIAMUser(userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    console_access?: boolean;
    programmatic_access?: boolean;
    groups?: string[];
  }): Promise<IAMUser> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Hash password (in real implementation, this should be done securely)
    const password_hash = btoa(userData.password); // Simple base64 encoding for demo

    const { data: newUser, error } = await supabase
      .from('iam_users')
      .insert([{
        username: userData.username,
        email: userData.email,
        password_hash,
        full_name: userData.full_name,
        console_access: userData.console_access ?? true,
        programmatic_access: userData.programmatic_access ?? false,
        created_by: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;

    // Assign to groups if provided
    if (userData.groups && userData.groups.length > 0) {
      await this.assignUserToGroups(newUser.id, userData.groups);
    }

    return { 
      ...newUser, 
      status: newUser.status as 'active' | 'inactive' | 'suspended',
      groups: userData.groups || [] 
    };
  },

  async updateIAMUser(id: string, updates: Partial<IAMUser>): Promise<IAMUser> {
    const { data, error } = await supabase
      .from('iam_users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.status as 'active' | 'inactive' | 'suspended'
    };
  },

  async deleteIAMUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('iam_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // IAM Groups
  async getIAMGroups(): Promise<IAMGroup[]> {
    const { data, error } = await supabase
      .from('iam_groups')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async createIAMGroup(groupData: {
    name: string;
    description?: string;
  }): Promise<IAMGroup> {
    const { data, error } = await supabase
      .from('iam_groups')
      .insert([groupData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // IAM Policies
  async getIAMPolicies(): Promise<IAMPolicy[]> {
    const { data, error } = await supabase
      .from('iam_policies')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return (data || []).map(policy => ({
      ...policy,
      policy_type: policy.policy_type as 'AWS Managed' | 'Customer Managed'
    }));
  },

  async createIAMPolicy(policyData: {
    name: string;
    description?: string;
    policy_document: any;
    policy_type?: 'AWS Managed' | 'Customer Managed';
  }): Promise<IAMPolicy> {
    const { data, error } = await supabase
      .from('iam_policies')
      .insert([{
        ...policyData,
        policy_type: policyData.policy_type || 'Customer Managed'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      policy_type: data.policy_type as 'AWS Managed' | 'Customer Managed'
    };
  },

  // User-Group assignments
  async assignUserToGroups(userId: string, groupNames: string[]): Promise<void> {
    // First get group IDs
    const { data: groups, error: groupError } = await supabase
      .from('iam_groups')
      .select('id, name')
      .in('name', groupNames);
    
    if (groupError) throw groupError;

    const assignments = groups.map(group => ({
      user_id: userId,
      group_id: group.id
    }));

    const { error } = await supabase
      .from('iam_user_groups')
      .upsert(assignments);
    
    if (error) throw error;
  },

  // Get user groups
  async getUserGroups(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('iam_user_groups')
      .select(`
        iam_groups(name)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return (data || []).map((ug: any) => ug.iam_groups.name);
  }
};
