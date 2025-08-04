import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  contact_no: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dob: string;
  role: 'admin' | 'manager' | 'employee' | 'supervisor';

  // Approval System (Separate from status)
  approval_status: 'pending' | 'approved' | 'rejected';

  // Status Management System (Separate from approval)
  status: 'active' | 'hold' | 'suspend';

  // Status Reason for rejection, hold, or suspend
  status_reason?: string;

  employee_id?: string;
  joining_date?: string;
  hold_days?: number;
  hold_start_date?: string;
  created_at: string;
  updated_at: string;
}

export const useProfileCompletion = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProfileCompletion();
  }, [user]);

  const checkProfileCompletion = async () => {
    console.log("=== PROFILE COMPLETION CHECK ===");
    console.log("User:", user?.id);
    console.log("Current profile:", profile);

    if (!user) {
      console.log("No user, setting profile to null");
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching profile for user:", user.id);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log("Profile fetch result:", { data, error });

      if (data && !error) {
        console.log("Profile found:", data);
        setProfile(data);
      } else {
        console.log("No profile found or error:", error);
        setProfile(null);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setProfile(null);
    }

    setLoading(false);
  };

  const needsProfileCompletion = () => {
    if (!user) return false;
    return profile === null;
  };

  const needsApproval = () => {
    return profile?.approval_status === 'pending';
  };

  const isApproved = () => {
    return profile?.approval_status === 'approved';
  };

  const isRejected = () => {
    return profile?.approval_status === 'rejected';
  };

  const isActive = () => {
    return profile?.status === 'active';
  };

  const isOnHold = () => {
    return profile?.status === 'hold';
  };

  const isSuspended = () => {
    return profile?.status === 'suspend';
  };

  const getProfileCompletionPercentage = () => {
    if (!profile) return 0;

    // First check approval status
    if (profile.approval_status === 'rejected') return 25;
    if (profile.approval_status === 'pending') return 50;
    if (profile.approval_status === 'approved') {
      // If approved, check status
      switch (profile.status) {
        case 'active':
          return 100;
        case 'hold':
          return 75;
        case 'suspend':
          return 75;
        default:
          return 75;
      }
    }

    return 0;
  };

  return {
    profile,
    needsProfileCompletion: needsProfileCompletion(),
    needsApproval: needsApproval(),
    isApproved: isApproved(),
    isRejected: isRejected(),
    getProfileCompletionPercentage,
    loading,
    refresh: checkProfileCompletion
  };
}; 