import { useState, useRef } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { authApi, postsApi } from '@/services/api';
import type { Post } from '@/types/blog';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const currentUser = authApi.getCurrentUser();

  const queryClient = useQueryClient();

  const { data: post, isLoading: initialLoading, isError, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => (id ? postsApi.getById(id) : Promise.reject(new Error('No id'))),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { title: string; body: string }) => (id ? postsApi.update(id, data) : Promise.reject(new Error('No id'))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : String(err)),
  });

  const permissionToasted = useRef(false);

  if (!authApi.isAuthenticated()) {
    toast.error('Please login to edit posts');
    return <Navigate to="/auth" />;
  }

  if (!initialLoading && isError) {
    toast.error(error instanceof Error ? error.message : String(error));
    navigate('/');
    return null;
  }

  if (!initialLoading && post && currentUser && currentUser.id !== post.author_id && !currentUser.isAdmin) {
    if (!permissionToasted.current) {
      toast.error('You do not have permission to edit this post');
      permissionToasted.current = true;
    }
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow submitting unchanged fields by falling back to loaded post values
    const title = (formData.title && formData.title.trim()) || post?.title || '';
    const body = (formData.body && formData.body.trim()) || post?.body || '';

    if (!title || !body) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    if (!id) return;

    const payload = { title, body };

    try {
      await updateMutation.mutateAsync(payload);
      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

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
                  defaultValue={post?.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <MarkdownEditor
                  value={formData.body || post?.body || ''}
                  onChange={(v) => setFormData({ ...formData, body: v })}
                  placeholder="Write your post content here..."
                  minHeight={300}
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
