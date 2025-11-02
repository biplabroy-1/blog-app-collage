import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { authApi, postsApi } from '@/services/api';
import type { Post } from '@/types/blog';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [post, setPost] = useState<Post | null>(null);
  const currentUser = authApi.getCurrentUser();

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      toast.error('Please login to edit posts');
      navigate('/auth');
      return;
    }

    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const foundPost = await postsApi.getById(id);
        
        // Check permissions
        if (currentUser.id !== foundPost.author_id && !currentUser.isAdmin) {
          toast.error('You do not have permission to edit this post');
          navigate('/');
          return;
        }

        setPost(foundPost);
        setFormData({ title: foundPost.title, body: foundPost.body });
      } catch (error: any) {
        toast.error(error.message || 'Failed to load post');
        navigate('/');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    if (!id) return;

    try {
      await postsApi.update(id, formData);
      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(`/post/${id}`)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl">Edit Post</CardTitle>
            <CardDescription>Update your post content</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter an engaging title..."
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <Textarea
                  id="body"
                  placeholder="Write your post content here..."
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={20}
                  className="resize-y font-mono"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Post
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/post/${id}`)}>
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

export default EditPost;
