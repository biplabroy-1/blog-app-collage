import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Globe, Calendar, Mail, Settings, ArrowLeft } from 'lucide-react';
import { authApi, profilesApi } from '@/services/api';
import type { User, Post } from '@/types/blog';
import { PostCard } from '@/components/PostCard';
import { useQuery } from '@tanstack/react-query';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser();
  const isOwnProfile = currentUser && currentUser.id === userId;

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => (userId ? profilesApi.getById(userId) : Promise.reject(new Error('No id'))),
    enabled: !!userId,
  });

  const { data: posts = [] as Post[], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['userPosts', userId],
    queryFn: () => (userId ? profilesApi.getPostsByUser(userId) : Promise.reject(new Error('No id'))),
    enabled: !!userId,
  });

  const loading = userLoading || postsLoading;

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
        <Card className="mb-8 overflow-hidden shadow-sm border">
          <div className="relative">
            {/* Background Gradient */}
            <div className="h-36 bg-gradient-to-r from-primary/90 via-accent/80 to-primary rounded-t-lg" />

            {/* Avatar & Info */}
            <CardContent className="relative">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  <Avatar className="h-32 w-32 border-4 bg-white border-background shadow-lg rounded-full">
                    <AvatarImage
                      src={
                        user?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
                      }
                      alt={user?.name}
                    />
                    <AvatarFallback className="text-3xl font-bold bg-primary text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold leading-tight">{user.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
                  <Button asChild size="sm" className="md:mb-2">
                    <Link to={`/profile/${userId}/edit`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mt-6 border-t pt-4">
                  <p className="text-base text-muted-foreground leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 border-t pt-4">
                <div className="text-center">
                  <div className="text-3xl font-semibold text-primary">{posts.length}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>

                {user.isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    Admin
                  </div>
                )}
              </div>
            </CardContent>
          </div>
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
