import { supabase } from "@/integrations/supabase/client";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Calendar, Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  mini_description: string;
  thumbnail_url: string | null;
  created_at: string;
  tags: string[];
  author_id: string;
  slug: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// ✅ Generate SEO metadata for each blog
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await supabase
    .from("blog_posts")
    .select("title, mini_description, thumbnail_url, slug")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Post not found" };

  const url = `https://yourdomain.com/blog/${data.slug}`;

  return {
    title: data.title,
    description: data.mini_description,
    openGraph: {
      title: data.title,
      description: data.mini_description,
      url,
      siteName: "Founders Gang",
      images: [
        {
          url: data.thumbnail_url || "https://yourdomain.com/default-og.jpg",
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.mini_description,
      images: [data.thumbnail_url || "https://yourdomain.com/default-og.jpg"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      `id, title, content, mini_description, thumbnail_url, created_at, tags, author_id, slug,
       profiles ( username, full_name, avatar_url )`
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as BlogPost;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to all posts
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{post.mini_description}</p>

        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              {(post.profiles?.full_name || post.profiles?.username || "A")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {post.profiles?.full_name ||
                post.profiles?.username ||
                "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 flex gap-3">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> ~
                {Math.ceil(post.content.split(" ").length / 200)} min read
              </span>
            </p>
          </div>
        </div>

        {post.thumbnail_url && (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="flex items-center justify-center gap-6 border-t border-gray-200 mt-10 pt-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Heart size={18} /> Like
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageCircle size={18} /> Comment
          </Button>
        </div>
      </article>
    </div>
  );
}
