import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, MapPin, DollarSign, Eye, Users, Sparkles } from 'lucide-react';
// Import types with correct relative path from client/src/components/
import type { Match, UserProfile } from '../../../server/src/schema';
import { ProfileCard } from './ProfileCard';

interface MatchesListProps {
  matches: (Match & { matched_user?: UserProfile })[];
  currentUserId: number;
}

export function MatchesList({ matches, currentUserId }: MatchesListProps) {
  const parseLifestylePreferences = (prefsString: string | null) => {
    if (!prefsString) return null;
    try {
      return JSON.parse(prefsString);
    } catch {
      return null;
    }
  };

  const MatchCard = ({ match }: { match: Match & { matched_user?: UserProfile } }) => {
    const user = match.matched_user;
    if (!user) return null;

    const lifestylePrefs = parseLifestylePreferences(user.lifestyle_preferences);

    return (
      <Card className="hover:shadow-lg transition-all duration-200 border-2 border-gradient-to-r from-purple-200 to-pink-200">
        <CardContent className="p-6">
          {/* Match Header */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mx-3 text-center">
              <p className="text-sm font-medium text-purple-600">Perfect Match!</p>
              <p className="text-xs text-gray-500">
                Matched on {match.created_at.toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3">
              <Heart className="h-6 w-6 text-pink-600 fill-current" />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-gradient-to-r from-purple-200 to-pink-200">
              <AvatarImage 
                src={user.profile_image_url || undefined} 
                alt={`${user.first_name} ${user.last_name}`} 
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                {user.first_name[0]}{user.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{user.age} years old</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {user.location}
                  </div>
                </div>
              </div>

              {/* Budget Compatibility */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-800 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-sm">Budget Range</span>
                </div>
                <p className="text-green-700 font-semibold">
                  ${user.budget_min.toLocaleString()} - ${user.budget_max.toLocaleString()}/month
                </p>
              </div>

              {/* Bio Preview */}
              {user.bio && (
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Quick Lifestyle Tags */}
              {lifestylePrefs && (
                <div className="flex flex-wrap gap-2">
                  {!lifestylePrefs.smoking && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Non-smoker
                    </Badge>
                  )}
                  {lifestylePrefs.pets && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Pet-friendly
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                    {lifestylePrefs.cleanliness === 'high' ? 'Very clean' : 
                     lifestylePrefs.cleanliness === 'medium' ? 'Moderately clean' : 'Relaxed'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-800">
                    {lifestylePrefs.quietness === 'high' ? 'Prefers quiet' : 
                     lifestylePrefs.quietness === 'medium' ? 'Moderate noise OK' : 'Likes it lively'}
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {user.first_name} {user.last_name}'s Profile
                      </DialogTitle>
                    </DialogHeader>
                    <ProfileCard profile={user} isOwnProfile={false} showActions={false} />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Chatting
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = () => (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="py-16 text-center">
        <div className="text-gray-400 mb-6">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20"></div>
            <Users className="absolute inset-0 m-auto h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No matches yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Keep browsing profiles and expressing interest! When someone you're interested in 
            accepts your interest (or vice versa), you'll see your matches here.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 max-w-lg mx-auto">
          <h4 className="font-medium text-gray-900 mb-2">💡 How matching works:</h4>
          <div className="text-sm text-gray-600 space-y-1 text-left">
            <p>1. Express interest in profiles you like</p>
            <p>2. When they accept your interest, you match!</p>
            <p>3. Start chatting and plan your perfect living situation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Your Roommate Matches
        </h2>
        <p className="text-gray-600">
          {matches.length === 0 
            ? "Start expressing interest to find your perfect roommate match!"
            : `You have ${matches.length} perfect ${matches.length === 1 ? 'match' : 'matches'}! 🎉`
          }
        </p>
      </div>

      {matches.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {matches.map((match: Match & { matched_user?: UserProfile }) => (
            <MatchCard key={match.id} match={match} />
          ))}
          
          {/* Success message for matches */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="py-8 text-center">
              <div className="flex items-center justify-center gap-2 text-purple-700 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Congratulations!</span>
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-purple-600 text-sm">
                You've found compatible roommate{matches.length > 1 ? 's' : ''}! 
                Start chatting to discuss living arrangements, move-in dates, and house rules.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}