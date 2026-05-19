import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import TopPosts from '../../components/common/TopPosts';

function TagBadge({ tag }) {
  return (
    <span className="inline-block bg-sky-50 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-md border border-sky-200">
      {tag}
    </span>
  );
}

function PostCard({ post }) {
  const voteCount = post.votes ?? post.upvoteCount ?? post.upvotes ?? 0;
  const answerCount = post.answerCount ?? post.answers?.length ?? 0;
  const viewCount = post.views ?? post.viewCount ?? 0;
  const summaryText = post.summary ?? post.content ?? '';

  return (
    <article className="flex flex-col md:flex-row items-start gap-4 py-4 px-4 border-b border-slate-200">
      {/* Left stats */}
      <div className="flex md:flex-col gap-2 md:gap-1 md:w-24 text-sm text-slate-600">
        <div className="font-semibold text-slate-700">{voteCount} votes</div>
        <div className="text-slate-500">{answerCount} answers</div>
        <div className="text-slate-500">{viewCount} views</div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-sky-700 hover:text-sky-900 mb-1">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-1 mb-2">
          {summaryText}
        </p>
        <div className="flex flex-wrap gap-2">
          {(post.tags ?? []).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 text-xs text-slate-500 md:ml-auto md:justify-end">
        <img
          src={post.author?.avatar || 'https://i.pravatar.cc/150'}
          alt="avatar"
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-sky-700 font-semibold">
          {post.author?.fullName ?? 'Ẩn danh'}
        </span>
        <span>asked {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </article>
  );
}

function PostListSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="py-4 px-3 border-b border-slate-100 animate-pulse">
          <div className="flex gap-4">
            <div className="w-20 flex flex-col items-end gap-2">
              <div className="h-4 w-12 bg-slate-200 rounded" />
              <div className="h-5 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-10 bg-slate-200 rounded" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-2/3 bg-slate-100 rounded" />
              <div className="flex gap-1 mt-1">
                <div className="h-5 w-14 bg-slate-200 rounded" />
                <div className="h-5 w-14 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HomePage() {
  const { list: posts, loading, error, pagination, activeFilters } = useSelector(
    (state) => state.posts
  );
  const {
    refetch,
    filters,
    handleFilterChange,
    handleApplyFilters,
  } = useOutletContext();

  const sortOptions = [
    { label: 'Mới nhất', value: 'Newest' },
    { label: 'Nhiều lượt xem', value: 'MostViewed' },
    { label: 'Nhiều upvote', value: 'MostUpvoted' },
  ];

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-6">
      {/* Top Posts Horizontal Bar */}
      <TopPosts />

      <div>
        {/* Tiêu đề + bộ đếm */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Câu hỏi mới nhất</h2>
            <p className="text-sm text-slate-500">{pagination.total.toLocaleString('vi-VN')} câu hỏi</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Hiển thị active filters nếu có */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1">
                <span>Đang lọc</span>
              </div>
            )}

            {/* Sort buttons */}
            <div className="flex border border-slate-200 rounded-md overflow-hidden bg-white">
              {sortOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleFilterChange?.('sortBy', option.value);
                    handleApplyFilters?.({ sortBy: option.value });
                  }}
                  className={`px-3 py-1.5 text-xs md:text-sm transition-colors border-slate-200 ${
                    index < sortOptions.length - 1 ? 'border-r' : ''
                  } ${
                    filters?.sortBy === option.value
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Loading Skeleton */}
          {loading && <PostListSkeleton />}

          {/* Lỗi */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <span className="text-4xl mb-3">⚠️</span>
              <p className="text-slate-600 font-medium">{error}</p>
              <button
                onClick={refetch}
                className="mt-4 text-sky-600 hover:text-sky-800 text-sm underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Không có kết quả */}
          {!loading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <p className="text-slate-600 font-medium">Không tìm thấy bài đăng nào</p>
              <p className="text-slate-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
            </div>
          )}

          {/* Danh sách bài đăng */}
          {!loading && !error && posts.length > 0 && (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
              {/* Phân trang đơn giản */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default HomePage;