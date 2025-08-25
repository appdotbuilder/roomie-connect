import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Calendar, Mail, Edit, User, Heart, MessageCircle } from 'lucide-react';
// Import types with correct relative path from client/src/components/
import type { UserProfile } from '../../../server/src/schema';

interface ProfileCardProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onExpressInterest?: () => void;
  showActions?: boolean;
}

export function ProfileCard({ 
  profile, 
  isOwnProfile = false, 
  onEdit, 
  onExpressInterest,
  showActions = true 
}: ProfileCardProps) {
  const parseLifestylePreferences = (prefsString: string | null) => {
    if (!prefsString) return null;
    try {
      return JSON.parse(prefsString);
    } catch {
      return null;
    }
  };

  const lifestylePrefs = parseLifestylePreferences(profile.lifestyle_preferences);

  const formatPreference = (key: string, value: any): string => {
    switch (key) {
      case 'cleanliness':
        return value === 'high' ? 'Very clean' : value === 'medium' ? 'Moderately clean' : 'Relaxed about cleanliness';
      case 'quietness':
        return value === 'high' ? 'Prefers quiet' : value === 'medium' ? 'Moderate noise OK' : 'Likes it lively';
      case 'socialLevel':
        return value === 'high' ? 'Very social' : value === 'medium' ? 'Moderately social' : 'More private';
      case 'smoking':
        return value ? 'Smoking OK' : 'Non-smoker';
      case 'pets':
        return value ? 'Pet-friendly' : 'No pets';
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.first_name[0]}{profile.last_name[0]}
                  </div>
                )}
                {profile.is_active && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-2">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{profile.age} years old</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">Budget Range</span>
                </div>
                <p className="text-green-700 text-lg font-bold mt-1">
                  ${profile.budget_min.toLocaleString()} - ${profile.budget_max.toLocaleString()}/month
                </p>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button onClick={onEdit} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={onExpressInterest}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        Express Interest
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Send Message
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Preferences */}
      {lifestylePrefs && (
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Living Habits</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Smoking</span>
                      <Badge variant={lifestylePrefs.smoking ? "destructive" : "secondary"}>
                        {lifestylePrefs.smoking ? 'Smoking OK' : 'Non-smoker'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pets</span>
                      <Badge variant={lifestylePrefs.pets ? "default" : "secondary"}>
                        {lifestylePrefs.pets ? 'Pet-friendly' : 'No pets'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Cleanliness Level</h4>
                  <Badge
                    variant={
                      lifestylePrefs.cleanliness === 'high' ? 'default' :
                      lifestylePrefs.cleanliness === 'medium' ? 'secondary' : 'outline'
                    }
                  >
                    {formatPreference('cleanliness', lifestylePrefs.cleanliness)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Noise Preference</h4>
                  <Badge
                    variant={
                      lifestylePrefs.quietness === 'high' ? 'default' :
                      lifestylePrefs.quietness === 'medium' ? 'secondary' : 'outline'
                    }
                  >
                    {formatPreference('quietness', lifestylePrefs.quietness)}
                  </Badge>
                </div>

                {lifestylePrefs.socialLevel && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Social Level</h4>
                    <Badge
                      variant={
                        lifestylePrefs.socialLevel === 'high' ? 'default' :
                        lifestylePrefs.socialLevel === 'medium' ? 'secondary' : 'outline'
                      }
                    >
                      {formatPreference('socialLevel', lifestylePrefs.socialLevel)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roommate Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Roommate Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Preferred Gender</h4>
              <Badge variant="secondary">
                {profile.preferred_gender === 'male' ? 'Male' : 
                 profile.preferred_gender === 'female' ? 'Female' : 'No preference'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Member since:</span>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{profile.created_at.toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">{profile.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}