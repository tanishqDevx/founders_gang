import { supabase } from "@/integrations/supabase/client";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Calendar, Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import localfont from "next/font/local";
import Image from "next/image";
import { Components } from "react-markdown";

const getdreamavenue = localfont({
  src: "../../../fonts/Dream_Avenue.ttf",
  variable: "--font-dreamavenue",
});
const times = localfont({
  src: "../../../fonts/times.ttf",
  variable: "--font-times",
});

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
  // Wait for slug param
  const { slug } = await params;

  // Fetch blog post data from Supabase
  const { data, error } = await supabase
    .from("blog_posts")
    .select("title, mini_description, thumbnail_url, slug, updated_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return {
      title: "Post not found",
      description: "This post does not exist.",
      openGraph: {
        title: "Post not found",
        description: "This post does not exist.",
        url: "https://founders-gang.vercel.app",
        siteName: "Founders Gang",
        images: [
          {
            url: "https://founders-gang.vercel.app/default-og.jpg",
            width: 1200,
            height: 630,
            alt: "Founders Gang",
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Post not found",
        description: "This post does not exist.",
        images: ["https://founders-gang.vercel.app/default-og.jpg"],
      },
    };
  }

  // Construct post URL
  const url = `https://founders-gang.vercel.app/blog/${data.slug}`;

  // Cache-busting for WhatsApp / social previews
  const ogImage = data.thumbnail_url
    ? `${data.thumbnail_url}?v=${new Date(data.updated_at).getTime()}`
    : "https://founders-gang.vercel.app/default-og.jpg";

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
          url: ogImage,
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
      images: [ogImage],
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

  const getReadTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };

  // ✅ Markdown custom components with correct types
  const markdownComponents: Components = {
    code: (props: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      const { inline, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow as { [key: string]: React.CSSProperties }}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`${times.className} bg-gray-100 px-1 py-0.5 rounded text-sm font-mono`}
          {...rest}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1
        className={`${getdreamavenue.className} text-3xl font-bold mt-8 mb-4 text-gray-900`}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`${getdreamavenue.className} text-2xl font-bold mt-6 mb-3 text-gray-900`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={`${getdreamavenue.className} text-xl font-bold mt-5 mb-2 text-gray-900`}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={`${getdreamavenue.className} text-lg font-semibold mt-4 mb-2 text-gray-900`}
      >
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className={`${times.className} mb-4 text-gray-700 leading-relaxed`}>
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul
        className={`${times.className} list-disc list-inside mb-4 space-y-1 text-gray-700`}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={`${times.className} list-decimal list-inside mb-4 space-y-1 text-gray-700`}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className={`${times.className} mb-1`}>{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`${times.className} border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50`}
      >
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className={`${times.className} text-blue-600 hover:text-blue-800 underline`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <Image
        src={(src as string) || "/placeholder.svg"}
        alt={alt || ""}
        width={800}
        height={400}
        className="max-w-full h-auto rounded-lg my-4"
      />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table
          className={`${times.className} min-w-full border border-gray-300`}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-gray-200">{children}</tr>
    ),
    th: ({ children }) => (
      <th
        className={`${times.className} px-4 py-2 text-left font-semibold text-gray-900 border-r border-gray-300 last:border-r-0`}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td
        className={`${times.className} px-4 py-2 text-gray-700 border-r border-gray-300 last:border-r-0`}
      >
        {children}
      </td>
    ),
    hr: () => <hr className="my-6 border-gray-300" />,
    strong: ({ children }) => (
      <strong className={`${times.className} font-bold text-gray-900`}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className={`${times.className} italic`}>{children}</em>
    ),
  };

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/"
          className={`${times.className} inline-flex items-center text-blue-600 hover:text-blue-800 mb-6`}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to all posts
        </Link>

        {/* Title + description */}
        <h1
          className={`${getdreamavenue.className} text-4xl font-bold text-gray-900 mb-4`}
        >
          {post.title}
        </h1>
        <p className={`${times.className} text-xl text-gray-600 mb-6`}>
          {post.mini_description}
        </p>

        {/* Author + metadata */}
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
            <p className={`${times.className} font-medium`}>
              {post.profiles?.full_name ||
                post.profiles?.username ||
                "Anonymous"}
            </p>
            <p
              className={`${times.className} text-sm text-gray-500 flex gap-3`}
            >
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {getReadTime(post.content)}
              </span>
            </p>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            width={800}
            height={384}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        {/* Markdown content */}
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Like & Comment buttons */}
        <div className="flex items-center justify-center gap-6 border-t border-gray-200 mt-10 pt-6">
          <Button
            variant="outline"
            className={`${times.className} flex items-center gap-2`}
          >
            <Heart size={18} /> Like
          </Button>
          <Button
            variant="outline"
            className={`${times.className} flex items-center gap-2`}
          >
            <MessageCircle size={18} /> Comment
          </Button>
        </div>
      </article>
    </div>
  );
}
