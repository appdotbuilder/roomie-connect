import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Check, X, Clock, Send, Eye } from 'lucide-react';
// Import types with correct relative path from client/src/components/
import type { Interest, UserProfile } from '../../../server/src/schema';
import { ProfileCard } from './ProfileCard';

interface InterestsListProps {
  interests: (Interest & { requester?: UserProfile; target?: UserProfile })[];
  currentUserId: number;
  onRespondToInterest: (interestId: number, status: 'accepted' | 'rejected') => Promise<void>;
  isLoading?: boolean;
}

export function InterestsList({ interests, currentUserId, onRespondToInterest, isLoading = false }: InterestsListProps) {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  // Separate interests into sent and received
  const sentInterests = interests.filter((interest: Interest & { requester?: UserProfile; target?: UserProfile }) => 
    interest.requester_id === currentUserId
  );
  
  const receivedInterests = interests.filter((interest: Interest & { requester?: UserProfile; target?: UserProfile }) => 
    interest.target_id === currentUserId
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'accepted':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const InterestCard = ({ 
    interest, 
    user, 
    isSent 
  }: { 
    interest: Interest & { requester?: UserProfile; target?: UserProfile }; 
    user?: UserProfile;
    isSent: boolean;
  }) => {
    if (!user) return null;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={user.profile_image_url || undefined} 
                alt={`${user.first_name} ${user.last_name}`} 
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                {user.first_name[0]}{user.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user.age} years old • {user.location}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(interest.status)}
                  <Badge className={getStatusColor(interest.status)}>
                    {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {interest.message && (
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-sm text-gray-700">"{interest.message}"</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{interest.created_at.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                <span>${user.budget_min} - ${user.budget_max}/month</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedProfile(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Profile Details</DialogTitle>
                    </DialogHeader>
                    <ProfileCard profile={user} isOwnProfile={false} showActions={false} />
                  </DialogContent>
                </Dialog>

                {!isSent && interest.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onRespondToInterest(interest.id, 'accepted')}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRespondToInterest(interest.id, 'rejected')}
                      disabled={isLoading}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}

                {interest.status === 'accepted' && (
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Chat Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ 
    title, 
    description, 
    icon: Icon 
  }: { 
    title: string; 
    description: string; 
    icon: any;
  }) => (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="text-gray-500">
          <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interests & Connections
        </h2>
        <p className="text-gray-600">
          Manage your roommate interests and responses
        </p>
      </div>

      <Tabs defaultValue="received" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="gap-2">
            <Heart className="h-4 w-4" />
            Received ({receivedInterests.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            Sent ({sentInterests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedInterests.length === 0 ? (
            <EmptyState
              title="No interests received yet"
              description="When someone expresses interest in being your roommate, you'll see them here."
              icon={Heart}
            />
          ) : (
            <>
              {/* Pending interests first */}
              {receivedInterests
                .filter((interest: Interest) => interest.status === 'pending')
                .map((interest: Interest & { requester?: UserProfile; target?: UserProfile }) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    user={interest.requester}
                    isSent={false}
                  />
                ))}
              
              {/* Then responded interests */}
              {receivedInterests
                .filter((interest: Interest) => interest.status !== 'pending')
                .map((interest: Interest & { requester?: UserProfile; target?: UserProfile }) => (
                  <InterestCard
                    key={interest.id}
                    interest={interest}
                    user={interest.requester}
                    isSent={false}
                  />
                ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentInterests.length === 0 ? (
            <EmptyState
              title="No interests sent yet"
              description="Browse profiles and express interest in potential roommates to get started."
              icon={Send}
            />
          ) : (
            sentInterests.map((interest: Interest & { requester?: UserProfile; target?: UserProfile }) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                user={interest.target}
                isSent={true}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}