import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authApi, profilesApi } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Predefined avatars (using DiceBear API seeds). You can replace these URLs with local images
// or any other CDN-hosted avatars.
const PREDEFINED_AVATARS = [
  'https://api.dicebear.com/6.x/adventurer/svg?seed=Rocket',
  'https://api.dicebear.com/6.x/adventurer/svg?seed=Nova',
  'https://api.dicebear.com/6.x/adventurer/svg?seed=Comet',
  'https://api.dicebear.com/6.x/adventurer/svg?seed=Zenith',
  'https://api.dicebear.com/6.x/adventurer/svg?seed=Orion',
  'https://api.dicebear.com/6.x/adventurer/svg?seed=Aurora',
];

const EditProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    location: '',
    website: '',
  });
  const currentUser = authApi.getCurrentUser();

  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => (userId ? profilesApi.getById(userId) : Promise.reject(new Error('No id'))),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: import('@/types/blog').UpdateProfileData) => (userId ? profilesApi.update(userId, data) : Promise.reject(new Error('No id'))),
    onSuccess: (_updated: unknown) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      // update local storage if current user
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : String(err)),
  });

  // Populate initial form values from fetched user data (only set when available and fields are empty)
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      name: prev.name || user.name || '',
      bio: prev.bio || user.bio || '',
      avatar_url: prev.avatar_url || user.avatar_url || PREDEFINED_AVATARS[0],
      location: prev.location || user.location || '',
      website: prev.website || user.website || '',
    }));
  }, [user]);

  if (!authApi.isAuthenticated()) {
    toast.error('Please login to edit your profile');
    return <Navigate to="/auth" />;
  }

  if (currentUser?.id !== userId) {
    toast.error('You can only edit your own profile');
    return <Navigate to="/" />;
  }

  if (!user && userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    toast.error(error instanceof Error ? error.message : String(error));
    navigate('/');
    return null;
  }

  // If user data exists but formData is empty, populate via defaults in inputs (use defaultValue below)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = (formData.name && formData.name.trim()) || user?.name || '';

    if (!name) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);

    if (!userId) return;

    const payload = {
      name,
      bio: formData.bio || user?.bio || '',
      avatar_url: formData.avatar_url || user?.avatar_url || '',
      location: formData.location || user?.location || '',
      website: formData.website || user?.website || '',
    };

    try {
      await updateMutation.mutateAsync(payload);
      toast.success('Profile updated successfully!');
      navigate(`/profile/${userId}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = (formData.name || user?.name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(`/profile/${userId}`)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex items-start gap-4 pb-6 border-b">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Label>Choose an avatar</Label>
                  <div className="mt-2 gap-3">
                    {PREDEFINED_AVATARS.map((url) => {
                      const selected = (formData.avatar_url || user?.avatar_url) === url;
                      return (
                        <button
                          key={url}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar_url: url })}
                          aria-pressed={selected}
                          className={`rounded-md p-1 border ${selected ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'} hover:shadow-sm`}
                        >
                          <div className="size-20 rounded-md overflow-hidden bg-white flex items-center justify-center">
                            <img src={url} alt="avatar" className="w-full h-full object-cover" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pick one of the predefined avatars. The selected avatar will be saved to your profile.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  defaultValue={user?.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  defaultValue={user?.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Brief description for your profile. Maximum 200 characters.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="San Francisco, CA"
                  defaultValue={user?.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  defaultValue={user?.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/profile/${userId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
