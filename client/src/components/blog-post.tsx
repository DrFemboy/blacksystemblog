import { Post } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export function BlogPost({ post }: { post: Post }) {
  return (
    <Card className="bg-black/50 border-green-500/30 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-green-500 font-mono">{post.title}</CardTitle>
        <div className="text-sm text-green-500/70">
          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert prose-green max-w-none">
          {post.content}
        </div>
      </CardContent>
    </Card>
  );
}
