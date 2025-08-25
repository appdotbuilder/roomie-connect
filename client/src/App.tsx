import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Users, MessageCircle, User, Plus } from 'lucide-react';
import { trpc } from '@/utils/trpc';
// Import types with correct relative path from client/src/App.tsx
import type { UserProfile, CreateUserProfileInput, Interest, Match } from '../../server/src/schema';
import { ProfileForm } from '@/components/ProfileForm';
import { BrowseProfiles } from '@/components/BrowseProfiles';
import { InterestsList } from '@/components/InterestsList';
import { MatchesList } from '@/components/MatchesList';
import { ProfileCard } from '@/components/ProfileCard';

// STUB IMPLEMENTATION: Mock current user for demo purposes
// In a real app, this would come from authentication
const MOCK_CURRENT_USER: UserProfile = {
  id: 1,
  email: 'current@example.com',
  first_name: 'Current',
  last_name: 'User',
  age: 25,
  bio: 'Looking for a great roommate!',
  location: 'New York, NY',
  budget_min: 800,
  budget_max: 1200,
  preferred_gender: 'any',
  lifestyle_preferences: JSON.stringify({ smoking: false, pets: true, cleanliness: 'high' }),
  profile_image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
};

function App() {
  const [currentUser] = useState<UserProfile>(MOCK_CURRENT_USER);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [interests, setInterests] = useState<(Interest & { requester?: UserProfile; target?: UserProfile })[]>([]);
  const [matches, setMatches] = useState<(Match & { matched_user?: UserProfile })[]>([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Load initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // STUB: In a real implementation, these would call actual tRPC procedures
      // For now, using mock data since server handlers aren't implemented
      
      // Mock profiles data
      const mockProfiles: UserProfile[] = [
        {
          id: 2,
          email: 'alice@example.com',
          first_name: 'Alice',
          last_name: 'Johnson',
          age: 24,
          bio: 'Graduate student looking for a quiet, clean roommate. I love reading and cooking! 📚🍳',
          location: 'New York, NY',
          budget_min: 800,
          budget_max: 1200,
          preferred_gender: 'female',
          lifestyle_preferences: JSON.stringify({ smoking: false, pets: true, cleanliness: 'high', quietness: 'high' }),
          profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          is_active: true,
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-15')
        },
        {
          id: 3,
          email: 'bob@example.com',
          first_name: 'Bob',
          last_name: 'Smith',
          age: 26,
          bio: 'Software engineer who works from home. Looking for someone responsible and friendly. 💻',
          location: 'New York, NY',
          budget_min: 1000,
          budget_max: 1500,
          preferred_gender: 'any',
          lifestyle_preferences: JSON.stringify({ smoking: false, pets: false, cleanliness: 'medium', quietness: 'medium' }),
          profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          is_active: true,
          created_at: new Date('2024-01-20'),
          updated_at: new Date('2024-01-20')
        },
        {
          id: 4,
          email: 'charlie@example.com',
          first_name: 'Charlie',
          last_name: 'Davis',
          age: 22,
          bio: 'Art student who loves music and painting. Looking for a creative, open-minded roommate. 🎨🎵',
          location: 'Brooklyn, NY',
          budget_min: 700,
          budget_max: 1000,
          preferred_gender: 'any',
          lifestyle_preferences: JSON.stringify({ smoking: false, pets: true, cleanliness: 'medium', quietness: 'low' }),
          profile_image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          is_active: true,
          created_at: new Date('2024-01-25'),
          updated_at: new Date('2024-01-25')
        }
      ];
      setProfiles(mockProfiles);

      // Mock interests data
      const mockInterests = [
        {
          id: 1,
          requester_id: 2,
          target_id: currentUser.id,
          status: 'pending' as const,
          message: "Hi! I think we'd make great roommates. Let's chat!",
          created_at: new Date('2024-01-26'),
          updated_at: new Date('2024-01-26'),
          requester: mockProfiles.find(p => p.id === 2),
          target: currentUser
        }
      ];
      setInterests(mockInterests);

    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateProfile = async (data: CreateUserProfileInput) => {
    setIsLoading(true);
    try {
      // STUB: This would normally call trpc.createUserProfile.mutate(data)
      console.log('Creating profile:', data);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Failed to create profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpressInterest = async (targetUserId: number, message?: string) => {
    setIsLoading(true);
    try {
      // STUB: This would normally call trpc.expressInterest.mutate()
      console.log('Expressing interest in user:', targetUserId, 'with message:', message);
      
      // Mock adding the interest to state
      const targetProfile = profiles.find(p => p.id === targetUserId);
      if (targetProfile) {
        const newInterest = {
          id: Date.now(),
          requester_id: currentUser.id,
          target_id: targetUserId,
          status: 'pending' as const,
          message: message || null,
          created_at: new Date(),
          updated_at: new Date(),
          requester: currentUser,
          target: targetProfile
        };
        setInterests(prev => [...prev, newInterest]);
      }
    } catch (error) {
      console.error('Failed to express interest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToInterest = async (interestId: number, status: 'accepted' | 'rejected') => {
    setIsLoading(true);
    try {
      // STUB: This would normally call trpc.respondToInterest.mutate()
      console.log('Responding to interest:', interestId, 'with status:', status);
      
      // Mock updating interest status
      setInterests(prev => prev.map(interest => 
        interest.id === interestId 
          ? { ...interest, status, updated_at: new Date() }
          : interest
      ));

      // If accepted, mock creating a match
      if (status === 'accepted') {
        const interest = interests.find(i => i.id === interestId);
        if (interest && interest.requester) {
          const newMatch = {
            id: Date.now(),
            user1_id: Math.min(currentUser.id, interest.requester_id),
            user2_id: Math.max(currentUser.id, interest.requester_id),
            created_at: new Date(),
            matched_user: interest.requester
          };
          setMatches(prev => [...prev, newMatch]);
        }
      }
    } catch (error) {
      console.error('Failed to respond to interest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your roommate matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  RoomieMatch
                </h1>
                <p className="text-sm text-gray-600">Find your perfect roommate</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfileForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Profile
              </Button>
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.profile_image_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{currentUser.first_name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="browse" className="gap-2">
              <User className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="interests" className="gap-2">
              <Heart className="h-4 w-4" />
              Interests ({interests.length})
            </TabsTrigger>
            <TabsTrigger value="matches" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Matches ({matches.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              My Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <BrowseProfiles
              profiles={profiles}
              currentUserId={currentUser.id}
              onExpressInterest={handleExpressInterest}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="interests" className="space-y-6">
            <InterestsList
              interests={interests}
              currentUserId={currentUser.id}
              onRespondToInterest={handleRespondToInterest}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <MatchesList
              matches={matches}
              currentUserId={currentUser.id}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileCard profile={currentUser} isOwnProfile={true} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Form Dialog */}
      {showProfileForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Create Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileForm(false)}
                >
                  ×
                </Button>
              </div>
              <ProfileForm
                onSubmit={handleCreateProfile}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;