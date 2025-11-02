import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Globe, Calendar, Mail, Settings, ArrowLeft } from 'lucide-react';
import { authApi, profilesApi } from '@/services/api';
import type { User, Post } from '@/types/blog';
import { PostCard } from '@/components/PostCard';
import { toast } from 'sonner';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authApi.getCurrentUser();
  const isOwnProfile = currentUser && currentUser.id === userId;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        const [userData, postsData] = await Promise.all([
          profilesApi.getById(userId),
          profilesApi.getPostsByUser(userId)
        ]);
        setUser(userData);
        setPosts(postsData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load profile');
        setUser(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const joinedDate = user.joined_at
    ? new Date(user.joined_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : 'Unknown';

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden shadow-lg">
          <div className="h-32 bg-gradient-to-r from-primary via-primary to-accent" />
          
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 md:-mt-20">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-accent text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="pb-2">
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {user.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>{user.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {joinedDate}</span>
                    </div>
                    {!isOwnProfile && user.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isOwnProfile && (
                <Button asChild className="self-start md:self-auto">
                  <Link to={`/profile/${userId}/edit`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              )}
            </div>

            {user.bio && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-lg leading-relaxed">{user.bio}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{posts.length}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              {user.isAdmin && (
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full">
                  <span className="font-semibold">Admin</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User's Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {isOwnProfile ? 'Your Posts' : `Posts by ${user.name}`}
          </h2>

          {posts.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <p className="text-xl mb-4">No posts yet</p>
                {isOwnProfile && (
                  <Button asChild>
                    <Link to="/create">Write your first post</Link>
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
