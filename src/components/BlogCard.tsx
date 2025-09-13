import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import localfont from "next/font/local";

const getdreamavenue = localfont({
  src: "../fonts/Dream_Avenue.ttf",
});
const times = localfont({
  src: "../fonts/times.ttf",
});

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image?: string;
  authorAvatar?: string | null;
}

const BlogCard = ({
  id,
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  image,
  authorAvatar,
}: BlogCardProps) => {
  return (
    <Link href={`/blog/${id}`} className="block h-full">
      <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col">
        <div className="aspect-video bg-gray-200 overflow-hidden flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {category}
            </span>
            <span className="text-xs text-gray-500">{readTime}</span>
          </div>

          {/* Title */}
          <h3
            className={`${getdreamavenue.className} text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors`}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-[calc(6 - var(--title-lines))]">
            {excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={authorAvatar || undefined} alt={author} />
                <AvatarFallback className="bg-gray-300 text-gray-700">
                  {author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{author}</p>
                <p className="text-xs text-gray-500">{date}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
