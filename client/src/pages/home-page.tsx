import { useQuery } from '@tanstack/react-query';
import { Post } from '@shared/schema';
import { MatrixRain } from '@/components/matrix-rain';
import { BlogPost } from '@/components/blog-post';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  return (
    <div className="min-h-screen bg-black text-green-500">
      <MatrixRain />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-mono font-bold">BlackSystem's Blog</h1>
          {user?.isAdmin ? (
            <Link href="/admin">
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/20">
                Admin Panel
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/20">
                Login
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {posts?.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
