import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { ArrowLeft, MapPin, Calendar, Loader2, Newspaper } from "lucide-react";

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/news/slug/${slug}`)
      .then((r) => setArticle(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (article) document.title = `${article.title} | KKN-PLP Group 66`;
  }, [article]);

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
      </div>
    );

  if (notFound || !article)
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 text-center px-6">
        <div>
          <Newspaper className="h-12 w-12 text-emerald-300 mx-auto" />
          <h1 className="mt-4 text-2xl font-display font-bold text-slate-900">Article not found</h1>
          <p className="mt-2 text-slate-500">This story may have been moved or is not available yet.</p>
          <Link to="/#news" className="mt-6 inline-flex items-center gap-2 text-emerald-800 font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
        </div>
      </div>
    );

  return (
    <article className="bg-white min-h-screen" data-testid="news-detail">
      <div className="relative h-[42vh] min-h-[320px] bg-emerald-950 overflow-hidden">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 grid-canvas opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-emerald-950/30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-10">
          <Link to="/#news" className="inline-flex items-center gap-2 text-amber-300 text-sm font-semibold mb-4 w-fit" data-testid="news-back">
            <ArrowLeft className="h-4 w-4" /> Back to News
          </Link>
          <span className="inline-block w-fit text-xs font-semibold uppercase tracking-wider bg-amber-500 text-white px-3 py-1 rounded-full mb-3">{article.category}</span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">{article.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-50/80">
            {article.author && <span>By {article.author}</span>}
            {article.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{article.location}</span>}
            {article.publishedAt && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{article.publishedAt}</span>}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {article.excerpt && <p className="text-lg text-slate-700 leading-relaxed font-medium border-l-4 border-amber-500 pl-5 mb-8">{article.excerpt}</p>}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">{article.content}</div>
      </div>
    </article>
  );
}
