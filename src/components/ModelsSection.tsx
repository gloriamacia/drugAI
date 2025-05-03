import { FC, useState, useMemo, useEffect } from "react";
import { models, Model } from "../data/modelsData";

export const ModelsSection: FC = () => {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("Newest publication");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Adjust pageSize: 3 cards on mobile
  useEffect(() => {
    const updateSize = () => setPageSize(window.innerWidth < 768 ? 3 : 6);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Build unique tags
  const allTags = useMemo(
    () => Array.from(new Set(models.flatMap((m) => m.tags))),
    []
  );
  const tagList = ["All", ...allTags];

  // Reset to first page on filter/search/sort/pageSize change
  useEffect(
    () => setCurrentPage(1),
    [activeTag, sortOption, searchTerm, pageSize]
  );

  // Filter logic
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

  // Sort logic
  const parseCount = (s: string) => {
    let n = parseFloat(s.replace(/[^0-9.]/g, ""));
    if (s.toLowerCase().includes("k")) n *= 1000;
    return n;
  };
  const parseDate = (d: string) => new Date(d).getTime();

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortOption) {
      case "Most likes":
        arr.sort((a, b) => parseCount(b.likes) - parseCount(a.likes));
        break;
      case "Most citations":
        arr.sort((a, b) => (b as any).citations - (a as any).citations);
        break;
      case "Newest publication":
      default:
        arr.sort(
          (a, b) =>
            parseDate((b as any).publicationDate) -
            parseDate((a as any).publicationDate)
        );
        break;
    }
    return arr;
  }, [filtered, sortOption]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
        Models
      </h2>

      {/* Mobile Search */}
      <div className="sm:hidden mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search models..."
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Mobile Filters & Sort */}
      <div className="mb-6 sm:hidden flex gap-2 justify-start">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs font-medium"
        >
          <i className="fa-solid fa-filter mr-1 text-gray-500"></i>
          Filters
        </button>
        <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
          <i className="fa-solid fa-sort mr-1 text-gray-500"></i>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs"
          >
            <option>Most likes</option>
            <option>Most citations</option>
            <option>Newest publication</option>
          </select>
        </div>
      </div>

      {/* Tags Filter */}
      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } sm:flex flex-wrap gap-2 mb-2`}
      >
        {tagList.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`${
              tag === activeTag
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } px-3 py-1 rounded-full text-xs font-medium transition-colors`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Desktop Search & Sort */}
      <div className="hidden sm:flex justify-end gap-4 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search models..."
          className="w-40 md:w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-40 md:w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Most likes</option>
          <option>Most citations</option>
          <option>Newest publication</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageData.map((m: Model) => (
          <div
            key={m.title}
            className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
          >
            <img
              className="w-full h-48 sm:h-56 object-cover"
              src={(m as any).thumbnailUrl}
              alt={`${m.title} thumbnail`}
            />
            <div className="p-4 flex flex-col flex-grow">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {m.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{m.description}</p>
              </div>
              <div className="mt-auto">
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
                    <i className="fa-solid fa-book mr-1 text-gray-500"></i>
                    {(m as any).citations}
                  </span>
                  <span>
                    <i className="fa-solid fa-heart mr-1 text-gray-500"></i>
                    {m.likes}
                  </span>
                  <span>
                    <i className="fa-solid fa-calendar-alt mr-1 text-gray-500"></i>
                    {new Date((m as any).publicationDate).toLocaleDateString(
                      undefined,
                      { month: "short", year: "2-digit" }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <nav className="inline-flex items-center rounded-md shadow">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-20 text-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="hidden sm:flex">
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
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-20 text-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  );
};
