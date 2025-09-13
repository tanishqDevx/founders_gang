"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BlogCard from "./BlogCard";
import { Loader2 } from "lucide-react";
import localfont from "next/font/local";

const getdreamavenue = localfont({
  src: "../fonts/Dream_Avenue.ttf",
});
const times = localfont({
  src: "../fonts/times.ttf",
});

interface BlogPost {
  id: string;
  title: string;
  mini_description: string;
  thumbnail_url: string | null;
  created_at: string;
  tags: string[];
  author_id: string;
  slug: string | null;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const BlogGrid = () => {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          id,
          title,
          mini_description,
          thumbnail_url,
          created_at,
          tags,
          author_id,
          slug,
          profiles (
            username,
            full_name,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
      } else {
        setPosts(data as BlogPost[]);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getReadTime = (description: string) => {
    const wordCount = description.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2
          className={`${getdreamavenue.className} text-2xl font-semibold text-gray-900`}
        >
          Latest blog posts
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <div key={post.id} className={times.className}>
            <BlogCard
              id={post.slug ?? post.id}
              title={post.title}
              excerpt={post.mini_description}
              author={
                post.profiles?.full_name ||
                post.profiles?.username ||
                "Anonymous"
              }
              authorAvatar={post.profiles?.avatar_url || undefined}
              date={formatDate(post.created_at)}
              readTime={getReadTime(post.mini_description)}
              category={post.tags?.[0] || "Uncategorized"}
              image={post.thumbnail_url || undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogGrid;
