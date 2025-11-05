import { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { authApi, postsApi } from '@/services/api';
import type { Post } from '@/types/blog';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser();

  const queryClient = useQueryClient();

  const { data: post, isLoading, isError, error } = useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => (id ? postsApi.getById(id) : Promise.reject(new Error('No id'))),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => (id ? postsApi.delete(id) : Promise.reject(new Error('No id'))),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : String(err)),
  });

  const permissionToasted = useRef(false);

  if (!isLoading && isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && post && currentUser && currentUser.id !== post.author_id && !currentUser.isAdmin) {
    if (!permissionToasted.current) {
      toast.error('You do not have permission to view this post');
      permissionToasted.current = true;
    }
    return <Navigate to="/" />;
  }

  const canEdit = currentUser && (currentUser.id === post?.author_id || currentUser.isAdmin);

  const handleDelete = () => {
    if (!id) return;
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
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

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const authorInitials = post.author_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to posts
          </Link>
        </Button>

        <div className="bg-card rounded-2xl shadow-lg border p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                to={`/profile/${post.author_id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={post?.author_avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post?.author_name}`}
                    alt={post?.author_name}
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold hover:text-primary transition-colors">
                    {post.author_name}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </Link>
            </div>

            {canEdit && (
              <div className="flex gap-2 pt-4 border-t">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/edit/${post.id}`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="leading-relaxed text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
