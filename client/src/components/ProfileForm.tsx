import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Import types with correct relative path from client/src/components/
import type { CreateUserProfileInput } from '../../../server/src/schema';

interface ProfileFormProps {
  onSubmit: (data: CreateUserProfileInput) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileForm({ onSubmit, isLoading = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<CreateUserProfileInput>({
    email: '',
    first_name: '',
    last_name: '',
    age: 18,
    bio: null,
    location: '',
    budget_min: 500,
    budget_max: 1500,
    preferred_gender: null,
    lifestyle_preferences: null,
    profile_image_url: null
  });

  const [lifestylePrefs, setLifestylePrefs] = useState({
    smoking: false,
    pets: false,
    cleanliness: 'medium',
    quietness: 'medium',
    socialLevel: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit = {
      ...formData,
      lifestyle_preferences: JSON.stringify(lifestylePrefs)
    };

    await onSubmit(dataToSubmit);
  };

  const handleInputChange = (field: keyof CreateUserProfileInput, value: any) => {
    setFormData((prev: CreateUserProfileInput) => ({
      ...prev,
      [field]: value || null
    }));
  };

  const handleLifestylePrefChange = (pref: string, value: any) => {
    setLifestylePrefs(prev => ({
      ...prev,
      [pref]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('first_name', e.target.value)
                }
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('last_name', e.target.value)
                }
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('email', e.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('age', parseInt(e.target.value) || 18)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('location', e.target.value)
                }
                placeholder="e.g., New York, NY"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_image_url">Profile Image URL (optional)</Label>
            <Input
              id="profile_image_url"
              type="url"
              value={formData.profile_image_url || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('profile_image_url', e.target.value)
              }
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange('bio', e.target.value)
              }
              placeholder="Tell potential roommates about yourself..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget & Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget & Roommate Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_min">Minimum Budget ($)</Label>
              <Input
                id="budget_min"
                type="number"
                min="0"
                step="50"
                value={formData.budget_min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('budget_min', parseFloat(e.target.value) || 500)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_max">Maximum Budget ($)</Label>
              <Input
                id="budget_max"
                type="number"
                min="0"
                step="50"
                value={formData.budget_max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange('budget_max', parseFloat(e.target.value) || 1500)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Roommate Gender</Label>
            <Select
              value={formData.preferred_gender || 'any'}
              onValueChange={(value) =>
                handleInputChange('preferred_gender', value === 'any' ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">No preference</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lifestyle Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smoking"
              checked={lifestylePrefs.smoking}
              onCheckedChange={(checked: boolean) =>
                handleLifestylePrefChange('smoking', checked)
              }
            />
            <Label htmlFor="smoking">I'm okay with smoking</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="pets"
              checked={lifestylePrefs.pets}
              onCheckedChange={(checked: boolean) =>
                handleLifestylePrefChange('pets', checked)
              }
            />
            <Label htmlFor="pets">I'm okay with pets</Label>
          </div>

          <div className="space-y-2">
            <Label>Cleanliness Level</Label>
            <Select
              value={lifestylePrefs.cleanliness}
              onValueChange={(value) =>
                handleLifestylePrefChange('cleanliness', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Relaxed</SelectItem>
                <SelectItem value="medium">Moderate</SelectItem>
                <SelectItem value="high">Very clean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Noise Level Preference</Label>
            <Select
              value={lifestylePrefs.quietness}
              onValueChange={(value) =>
                handleLifestylePrefChange('quietness', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">I like it lively</SelectItem>
                <SelectItem value="medium">Moderate noise is fine</SelectItem>
                <SelectItem value="high">I prefer quiet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Social Level</Label>
            <Select
              value={lifestylePrefs.socialLevel}
              onValueChange={(value) =>
                handleLifestylePrefChange('socialLevel', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">I keep to myself</SelectItem>
                <SelectItem value="medium">Friendly but respectful</SelectItem>
                <SelectItem value="high">I love socializing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        size="lg"
      >
        {isLoading ? 'Creating Profile...' : 'Create Profile'}
      </Button>
    </form>
  );
}