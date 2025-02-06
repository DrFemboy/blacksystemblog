import { useQuery, useMutation } from '@tanstack/react-query';
import { Post, insertPostSchema } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { MatrixRain } from '@/components/matrix-rain';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm({
    resolver: zodResolver(insertPostSchema),
  });

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Post) => {
      const res = await apiRequest('POST', '/api/posts', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      form.reset();
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    },
  });

  if (!user?.isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-black text-green-500">
      <MatrixRain />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-mono font-bold mb-8">Admin Panel</h1>
        
        <Card className="bg-black/50 border-green-500/30 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-green-500 font-mono">Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold">Manage Posts</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <Card key={post.id} className="bg-black/50 border-green-500/30 backdrop-blur">
                  <CardContent className="flex justify-between items-center py-4">
                    <div className="font-mono">{post.title}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
