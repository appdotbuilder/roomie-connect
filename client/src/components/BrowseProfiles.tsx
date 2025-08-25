import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Heart, MessageCircle, Filter, X } from 'lucide-react';
// Import types with correct relative path from client/src/components/
import type { UserProfile } from '../../../server/src/schema';
import { ProfileCard } from './ProfileCard';

interface BrowseProfilesProps {
  profiles: UserProfile[];
  currentUserId: number;
  onExpressInterest: (targetUserId: number, message?: string) => Promise<void>;
  isLoading?: boolean;
}

interface Filters {
  location: string;
  min_age: number | null;
  max_age: number | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_gender: string;
}

export function BrowseProfiles({ profiles, currentUserId, onExpressInterest, isLoading = false }: BrowseProfilesProps) {
  const [filters, setFilters] = useState<Filters>({
    location: '',
    min_age: null,
    max_age: null,
    budget_min: null,
    budget_max: null,
    preferred_gender: 'any'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [interestMessage, setInterestMessage] = useState('');
  const [showInterestDialog, setShowInterestDialog] = useState(false);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? null : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      min_age: null,
      max_age: null,
      budget_min: null,
      budget_max: null,
      preferred_gender: 'any'
    });
  };

  const filteredProfiles = profiles.filter((profile: UserProfile) => {
    if (profile.id === currentUserId) return false;

    // Apply filters
    if (filters.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.min_age && profile.age < filters.min_age) {
      return false;
    }
    if (filters.max_age && profile.age > filters.max_age) {
      return false;
    }
    if (filters.budget_min && profile.budget_max < filters.budget_min) {
      return false;
    }
    if (filters.budget_max && profile.budget_min > filters.budget_max) {
      return false;
    }
    if (filters.preferred_gender !== 'any' && profile.preferred_gender && 
        profile.preferred_gender !== 'any' && profile.preferred_gender !== filters.preferred_gender) {
      return false;
    }

    return true;
  });

  const handleExpressInterest = async (profile: UserProfile) => {
    setSelectedProfile(profile);
    setShowInterestDialog(true);
  };

  const submitInterest = async () => {
    if (!selectedProfile) return;

    await onExpressInterest(selectedProfile.id, interestMessage || undefined);
    setShowInterestDialog(false);
    setInterestMessage('');
    setSelectedProfile(null);
  };

  const parseLifestylePreferences = (prefsString: string | null) => {
    if (!prefsString) return null;
    try {
      return JSON.parse(prefsString);
    } catch {
      return null;
    }
  };

  const activeFiltersCount = Object.values(filters).filter(
    value => value !== null && value !== '' && value !== 'any'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Browse Roommates
          </h2>
          <p className="text-gray-600">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'} found
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g., New York"
                  value={filters.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('location', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Age</label>
                <Input
                  type="number"
                  min="18"
                  max="100"
                  placeholder="18"
                  value={filters.min_age || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('min_age', e.target.value ? parseInt(e.target.value) : null)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Age</label>
                <Input
                  type="number"
                  min="18"
                  max="100"
                  placeholder="100"
                  value={filters.max_age || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('max_age', e.target.value ? parseInt(e.target.value) : null)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Min Budget</label>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="500"
                  value={filters.budget_min || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('budget_min', e.target.value ? parseFloat(e.target.value) : null)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Budget</label>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="2000"
                  value={filters.budget_max || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange('budget_max', e.target.value ? parseFloat(e.target.value) : null)
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender Preference</label>
                <Select
                  value={filters.preferred_gender}
                  onValueChange={(value) => handleFilterChange('preferred_gender', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                onClick={clearFilters}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-500 mb-4">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No profiles found</h3>
              <p>Try adjusting your filters to see more potential roommates</p>
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile: UserProfile) => {
            const lifestylePrefs = parseLifestylePreferences(profile.lifestyle_preferences);
            
            return (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <CardContent className="p-0">
                  {/* Profile Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
                    {profile.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                        {profile.first_name[0]}{profile.last_name[0]}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-xl font-semibold">
                        {profile.first_name} {profile.last_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{profile.age} years old</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {profile.location}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {profile.bio}
                      </p>
                    )}

                    {/* Budget */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        ${profile.budget_min} - ${profile.budget_max}/month
                      </span>
                    </div>

                    {/* Lifestyle Preferences */}
                    {lifestylePrefs && (
                      <div className="flex flex-wrap gap-1">
                        {!lifestylePrefs.smoking && (
                          <Badge variant="secondary" className="text-xs">Non-smoker</Badge>
                        )}
                        {lifestylePrefs.pets && (
                          <Badge variant="secondary" className="text-xs">Pet-friendly</Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {lifestylePrefs.cleanliness === 'high' ? 'Very clean' : 
                           lifestylePrefs.cleanliness === 'medium' ? 'Moderately clean' : 'Relaxed'}
                        </Badge>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Profile Details</DialogTitle>
                          </DialogHeader>
                          <ProfileCard profile={profile} isOwnProfile={false} />
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => handleExpressInterest(profile)}
                        disabled={isLoading}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Interested
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Express Interest Dialog */}
      <Dialog open={showInterestDialog} onOpenChange={setShowInterestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Send a message to {selectedProfile?.first_name} to express your interest in being roommates.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message (optional)</label>
              <Textarea
                value={interestMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setInterestMessage(e.target.value)
                }
                placeholder="Hi! I think we'd make great roommates. Let's chat!"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowInterestDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitInterest}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Interest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}