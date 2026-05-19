import { useState, useEffect, useRef } from 'react';
import { getTopPosts } from '../../services/postService';

function TopPostCard({ post, index }) {
    const formattedDate = new Date(post.createdAt || new Date()).toLocaleDateString('vi-VN');
    
    return (
        <div
            className="flex-shrink-0 snap-start bg-white border border-slate-200 p-4 flex flex-col justify-between"
            style={{ height: '220px', flex: '0 0 calc(25% - 12px)', maxWidth: 'calc(25% - 12px)' }}
        >
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="bg-sky-100 text-sky-700 font-bold text-xs px-2 py-1 rounded">#{index + 1}</span>
                    <span className="text-xs text-slate-500 font-medium">{formattedDate}</span>
                </div>
                <a href={`/posts/${post._id}`} className="text-base text-sky-700 hover:text-sky-900 font-bold line-clamp-2 leading-tight mb-3">
                    {post.title}
                </a>
                <div className="flex flex-wrap gap-1 mb-4">
                    {(post.tags || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            
            <div>
                <div className="flex justify-between items-center text-xs text-slate-600 mb-3">
                    <span>Hôm nay <span className="font-bold">{post.upvoteCount ?? 0}</span> upvotes</span>
                    <span>Tổng <span className="font-bold">{post.viewCount ?? 0}</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <img 
                        src={post.author?.avatar || "https://i.pravatar.cc/150"} 
                        alt="avatar" 
                        className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate">{post.author?.fullName || "Ẩn danh"}</span>
                </div>
            </div>
        </div>
    );
}

function TopPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const scrollContainer = useRef(null);

    useEffect(() => {
        const fetchTopPosts = async () => {
            try {
                const response = await getTopPosts();
                setPosts(response.data.data.slice(0, 10)); // Chỉ lấy top 10
            } catch {
                setError('Không thể tải bài viết hàng đầu');
            } finally {
                setLoading(false);
            }
        };
        fetchTopPosts();
    }, []);

    const cardsPerPage = 4;
    const totalPages = Math.ceil(posts.length / cardsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            scrollToPage(currentPage + 1);
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            scrollToPage(currentPage - 1);
            setCurrentPage(prev => prev - 1);
        }
    };

    const scrollToPage = (pageNumber) => {
        if (scrollContainer.current) {
            const pageWidth = scrollContainer.current.clientWidth;
            const scrollAmount = pageWidth * (pageNumber - 1);
            scrollContainer.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (loading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-3"></div>
                <div className="flex gap-4">
                    <div className="w-72 h-20 bg-slate-100 rounded-lg animate-pulse"></div>
                    <div className="w-72 h-20 bg-slate-100 rounded-lg animate-pulse"></div>
                    <div className="w-72 h-20 bg-slate-100 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error || !posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="bg-transparent mb-8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Top 10 Upvote Trong Ngày</h2>
                    <p className="text-sm text-slate-500 mt-1">Top 10 bài viết có lượt upvote cao nhất hôm nay</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center border ${currentPage === 1 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-600 hover:bg-slate-50'} transition-colors`}
                        aria-label="Previous Page"
                    >
                        &lt;
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center border ${currentPage === totalPages ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-600 hover:bg-slate-50'} transition-colors`}
                        aria-label="Next Page"
                    >
                        &gt;
                    </button>
                </div>
            </div>
            
            <div 
                ref={scrollContainer} 
                className="flex gap-4 overflow-x-hidden snap-x snap-mandatory scrollbar-hide py-1"
                style={{ scrollBehavior: 'smooth' }}
            >
                {posts.map((post, index) => (
                    <TopPostCard key={post._id} post={post} index={index} />
                ))}
            </div>
        </div>
    );
}

export default TopPosts;