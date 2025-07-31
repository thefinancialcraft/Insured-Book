import { useAuth } from "@/contexts/AuthContext";

export const useProfileCompletion = () => {
  const { user } = useAuth();

  const needsProfileCompletion = () => {
    if (!user) return false;
    
    // Check if this is a Google OAuth user
    if (user.app_metadata?.provider === 'google') {
      // Check if user has complete profile data
      const hasCompleteProfile = user.user_metadata?.first_name && 
                               user.user_metadata?.last_name &&
                               user.user_metadata?.phone_number && 
                               user.user_metadata?.address && 
                               user.user_metadata?.city && 
                               user.user_metadata?.state && 
                               user.user_metadata?.pincode && 
                               user.user_metadata?.dob;
      
      return !hasCompleteProfile;
    }
    
    return false;
  };

  const getProfileCompletionPercentage = () => {
    if (!user) return 0;
    
    const requiredFields = [
      user.user_metadata?.first_name,
      user.user_metadata?.last_name,
      user.user_metadata?.phone_number,
      user.user_metadata?.address,
      user.user_metadata?.city,
      user.user_metadata?.state,
      user.user_metadata?.pincode,
      user.user_metadata?.dob
    ];
    
    const filledFields = requiredFields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  return {
    needsProfileCompletion: needsProfileCompletion(),
    getProfileCompletionPercentage
  };
}; 