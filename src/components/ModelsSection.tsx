// src/components/ModelsSection.tsx
import { FC, useState, useMemo, useEffect } from "react";
import { models, Model } from "../data/modelsData";

export const ModelsSection: FC = () => {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Trending");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // build tag list
  const allTags = useMemo(
    () => Array.from(new Set(models.flatMap((m) => m.tags))),
    []
  );
  const tagList = ["All", ...allTags];

  // reset page on filter/sort/search change
  useEffect(() => setCurrentPage(1), [activeTag, sortOption, searchTerm]);

  // filter by tag + search
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return models.filter((m) => {
      const matchesTag = activeTag === "All" || m.tags.includes(activeTag);
      const matchesSearch =
        !term ||
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term);
      return matchesTag && matchesSearch;
    });
  }, [activeTag, searchTerm]);

  // sort helpers
  const parseCount = (s: string) => {
    let n = parseFloat(s.replace(/[^0-9.]/g, ""));
    if (s.toLowerCase().includes("k")) n *= 1000;
    return n;
  };
  const parseDays = (s: string) => {
    const [val, unit] = s.split(" ");
    const v = parseFloat(val);
    if (unit.startsWith("day")) return v;
    if (unit.startsWith("week")) return v * 7;
    if (unit.startsWith("month")) return v * 30;
    return v;
  };

  // sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortOption === "Most likes") {
      arr.sort((a, b) => parseCount(b.likes) - parseCount(a.likes));
    } else if (sortOption === "Recently updated") {
      arr.sort((a, b) => parseDays(a.updated) - parseDays(b.updated));
    } else {
      // trending
      const likesArr = arr.map((m) => parseCount(m.likes));
      const daysArr = arr.map((m) => parseDays(m.updated));
      const maxL = Math.max(...likesArr),
        minL = Math.min(...likesArr);
      const maxD = Math.max(...daysArr),
        minD = Math.min(...daysArr);
      arr.forEach((m) => {
        const L = parseCount(m.likes),
          D = parseDays(m.updated);
        const normL = maxL === minL ? 0 : (L - minL) / (maxL - minL);
        const normR = maxD === minD ? 0 : (maxD - D) / (maxD - minD);
        (m as any).trending = (normL + normR) / 2;
      });
      arr.sort((a, b) => (b as any).trending - (a as any).trending);
    }
    return arr;
  }, [filtered, sortOption]);

  // pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8"
      /* reduced top padding from py-8 to pt-4 */
    >
      {/* Header + Search + Sort */}
      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Models
        </h2>
        <div className="flex items-center gap-4 ml-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search models..."
            className="w-48 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ab3]"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-48 bg-white border border-gray-300 rounded-lg px-4 pr-8 py-2 text-sm appearance-none"
            /* added pr-8 and appearance-none to move native arrow in and away from the border */
          >
            <option>Trending</option>
            <option>Most likes</option>
            <option>Recently updated</option>
          </select>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tagList.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              tag === activeTag
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 3×2 Grid with Hover */}
      <div className="grid grid-cols-3 gap-6">
        {pageData.map((m: Model) => (
          <div
            key={m.title}
            className="model-card bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <img
              className="w-full h-48 object-cover"
              src={m.thumbnailUrl}
              alt={`${m.title} thumbnail`}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {m.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{m.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  <i className="fas fa-eye mr-1"></i>
                  {m.views}
                </span>
                <span>
                  <i className="fas fa-heart mr-1"></i>
                  {m.likes}
                </span>
                <span>
                  <i className="fas fa-calendar-alt mr-1"></i>
                  {m.updated}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                  page === currentPage
                    ? "text-primary"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
};
