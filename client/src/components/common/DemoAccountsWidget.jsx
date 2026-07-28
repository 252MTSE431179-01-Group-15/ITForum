import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoginField, loginThunk } from '../../store/slices/loginSlice';
import { useToast } from '../../context/ToastContext';

const DEMO_ACCOUNTS = [
  {
    roleTitle: 'Quản trị viên (Admin)',
    roleBadge: 'Admin',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: 'shield_person',
    email: 'admin@itforum.com',
    password: 'Admin123!',
    description: 'Quyền quản trị toàn bộ hệ thống: Xử lý cờ báo cáo, quản lý người dùng, danh mục & thống kê.',
  },
  {
    roleTitle: 'Sinh viên mẫu (Student)',
    roleBadge: 'Tác giả bài viết',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: 'school',
    email: 'hoangducem@gmail.com',
    password: 'User123!',
    description: 'Tài khoản người dùng thực tế: Đăng bài hỏi đáp, chọn câu trả lời hay nhất, lưu bài viết.',
  },
  {
    roleTitle: 'Thành viên tích cực (User)',
    roleBadge: 'Thành viên',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: 'forum',
    email: 'dominhhai@gmail.com',
    password: 'User123!',
    description: 'Tham gia thảo luận: Trả lời bài viết, upvote/downvote, bình luận và tích lũy điểm uy tín.',
  },
];

export default function DemoAccountsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [loggingRole, setLoggingRole] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.login);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleAutoLogin = async (account) => {
    setLoggingRole(account.email);
    try {
      dispatch(setLoginField({ field: 'email', value: account.email }));
      dispatch(setLoginField({ field: 'password', value: account.password }));

      const resultAction = await dispatch(loginThunk());
      if (loginThunk.fulfilled.match(resultAction)) {
        toast.success(`Đã đăng nhập tài khoản demo: ${account.roleTitle}`);
        setIsOpen(false);
        const redirectUrl = resultAction.payload.redirectUrl || (account.roleBadge === 'Admin' ? '/admin/dashboard' : '/home');
        navigate(redirectUrl);
      } else {
        toast.error('Không thể tự động đăng nhập. Vui lòng kiểm tra kết nối.');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi tự động đăng nhập.');
    } finally {
      setLoggingRole('');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
          title="Tài khoản mẫu để trải nghiệm"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <span className="material-symbols-outlined text-xl">key</span>
          <span className="text-xs font-bold tracking-wide">Tài khoản trải nghiệm</span>
        </button>
      )}

      {/* Popup Dialog */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 animate-fadeIn dark:border-slate-800 dark:bg-slate-900/95">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                <span className="material-symbols-outlined text-lg">supervised_user_circle</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tài khoản demo trải nghiệm</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Đăng nhập nhanh không cần nhập mật khẩu</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* User Logged In Status Banner */}
          {isAuthenticated && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50">
              <span className="text-xs text-blue-800 dark:text-blue-300 truncate">
                Đang đăng nhập: <strong className="font-bold">{user?.fullName || user?.email}</strong>
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-200/60 px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {user?.role === 'admin' ? 'Admin' : 'Member'}
              </span>
            </div>
          )}

          {/* Account List */}
          <div className="mt-3 max-h-[380px] space-y-3 overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc, index) => {
              const isCurrent = isAuthenticated && user?.email === acc.email;
              const isLoading = loggingRole === acc.email;

              return (
                <div
                  key={index}
                  className={`rounded-xl border p-3 transition-all ${
                    isCurrent
                      ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30'
                      : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-lg">{acc.icon}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{acc.roleTitle}</span>
                    </div>
                    <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded-full ${acc.badgeColor}`}>
                      {acc.roleBadge}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{acc.description}</p>

                  <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800">
                    <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {acc.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.email, `Email (${acc.roleBadge})`)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Sao chép Email"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {copiedField === `Email (${acc.roleBadge})` ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading || isCurrent}
                    onClick={() => handleAutoLogin(acc)}
                    className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all shadow-sm ${
                      isCurrent
                        ? 'bg-emerald-100 text-emerald-800 cursor-default dark:bg-emerald-900/50 dark:text-emerald-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Đang đăng nhập...</span>
                      </>
                    ) : isCurrent ? (
                      <>
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <span>Đang sử dụng tài khoản này</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        <span>Đăng nhập ngay</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-400 dark:border-slate-800">
            Dùng để kiểm thử giao diện & tính năng ITForum
          </div>
        </div>
      )}
    </div>
  );
}
