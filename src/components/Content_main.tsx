"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "../integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import localfont from "next/font/local";

const getdreamavenue = localfont({
  src: "../fonts/Dream_Avenue.ttf",
});
const times = localfont({
  src: "../fonts/times.ttf",
});

interface FeaturedPost {
  id: string;
  title: string;
  mini_description: string;
  thumbnail_url: string | null;
  created_at: string;
  tags: string[];
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// Fallback featured posts
const fallbackFeaturedPosts: FeaturedPost[] = [
  {
    id: "1",
    title: "Sophia Mesabhi on Profitable and Sustainable Growth",
    mini_description:
      "Learn about sustainable growth strategies from industry expert Sophia Mesabhi.",
    thumbnail_url: "/lovable-uploads/304ec497-c656-467e-b11b-03183117c221.png",
    created_at: "2025-04-10T12:00:00Z",
    tags: ["Design", "Interview", "Growth"],
    profiles: {
      username: "fsullivan",
      full_name: "Frankie Sullivan",
      avatar_url: null,
    },
  },
  {
    id: "2",
    title: "Interview with Photographer & UX Designer, Viola LeBlanc",
    mini_description:
      "Insights from multi-talented designer Viola LeBlanc on balancing photography and UX design.",
    thumbnail_url: "/lovable-uploads/dc5b1ccd-acb3-44cc-8905-19b1bea5b1a8.png",
    created_at: "2025-01-05T12:00:00Z",
    tags: ["Interview", "UX Design", "Photography"],
    profiles: {
      username: "dwilliams",
      full_name: "Drew Williams",
      avatar_url: null,
    },
  },
];

const HeroSection = () => {
  const [posts, setPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  // Fetch featured posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
            profiles(username, full_name, avatar_url)
          `
          )
          .eq("featured", true)
          .limit(5);

        if (error) {
          console.error("Error fetching featured posts:", error);
          setPosts(fallbackFeaturedPosts);
        } else {
          setPosts(data && data.length > 0 ? data : fallbackFeaturedPosts);
        }
      } catch (err) {
        console.error(err);
        setPosts(fallbackFeaturedPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!posts.length || !api) return;
    const interval = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [posts, api]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading)
    return (
      <section className="w-full h-[600px] flex items-center justify-center bg-gray-100">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </section>
    );

  return (
    <section className={`relative w-full ${times.className}`}>
      <Carousel
        className="w-full"
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
      >
        <CarouselContent className="m-0 p-0">
          {posts.map((post) => (
            <CarouselItem key={post.id} className="p-0 m-0 basis-full">
              <div className="relative h-[600px] w-full">
                <Image
                  src={post.thumbnail_url || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-7xl mx-auto">
                  <nav className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
                    <Link
                      href="/"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Resources
                    </Link>
                    <span>→</span>
                    <span>{post.tags?.[0] || "Blog"}</span>
                  </nav>
                  {/* Big title uses Dream Avenue */}
                  <h1
                    className={`text-3xl md:text-5xl font-bold mb-4 ${getdreamavenue.className}`}
                  >
                    {post.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="relative w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                        {post.profiles?.avatar_url && (
                          <Image
                            src={post.profiles.avatar_url}
                            alt={post.profiles.username || "Author"}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-sm">
                        {post.profiles?.full_name ||
                          post.profiles?.username ||
                          "Anonymous"}
                      </span>
                    </div>
                    <span className="text-sm opacity-75">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Read article
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {posts.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === 0 ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => api?.scrollTo(idx)}
            />
          ))}
        </div>

        <CarouselPrevious className="left-4 bg-black/30 text-white hover:bg-black/50" />
        <CarouselNext className="right-4 bg-black/30 text-white hover:bg-black/50" />
      </Carousel>
    </section>
  );
};

export default HeroSection;
