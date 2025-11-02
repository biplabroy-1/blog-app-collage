import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import type { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
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
    <Link to={`/post/${post.id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-card to-card border-border/50">
        <CardHeader>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          <div className="flex items-center gap-4 text-sm">
            <Link
              to={`/profile/${post.author_id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author_name}`}
                  alt={post.author_name}
                />
                <AvatarFallback className="text-xs bg-primary text-white">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author_name}</span>
            </Link>
            
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt || post.body.substring(0, 150) + '...'}
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
            Read more 
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
