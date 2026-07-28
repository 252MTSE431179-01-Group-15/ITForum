import { useState } from 'react';

const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    name: 'Admin Administrator',
    email: 'admin@itforum.local',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    role: 'User',
    name: 'Nguyễn Văn An',
    email: 'user1@itforum.local',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  {
    role: 'User',
    name: 'Trần Thị Bình',
    email: 'user2@itforum.local',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  {
    role: 'User',
    name: 'Lê Hoàng Cường',
    email: 'user3@itforum.local',
    badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
  },
];

const COMMON_PASSWORD = '123456';

export default function DemoAccountsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans text-xs">
      {/* Nút bấm trải nghiệm nhỏ gọn */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 font-medium text-slate-700 shadow-md backdrop-blur-sm transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-700"
          title="Xem danh sách tài khoản mẫu"
        >
          <span className="material-symbols-outlined text-sm text-indigo-500">key</span>
          <span>Tài khoản mẫu</span>
        </button>
      )}

      {/* Popup danh sách tài khoản nhỏ gọn */}
      {isOpen && (
        <div className="w-72 overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-indigo-500">account_circle</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">Tài khoản thử nghiệm</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>

          {/* Mật khẩu chung */}
          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-amber-50/80 px-2.5 py-1.5 border border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-900/50">
            <span className="text-[11px] text-amber-800 dark:text-amber-300">
              Mật khẩu chung: <code className="font-mono font-bold">{COMMON_PASSWORD}</code>
            </span>
            <button
              type="button"
              onClick={() => handleCopy(COMMON_PASSWORD, 'Mật khẩu')}
              className="flex items-center gap-1 text-[10px] font-bold text-amber-700 hover:underline dark:text-amber-400"
            >
              <span className="material-symbols-outlined text-xs">
                {copiedKey === 'Mật khẩu' ? 'check' : 'content_copy'}
              </span>
              <span>{copiedKey === 'Mật khẩu' ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>

          {/* Danh sách các tài khoản trong Seed DB */}
          <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto pr-0.5">
            {DEMO_ACCOUNTS.map((acc, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-100 bg-slate-50/60 p-2 text-[11px] dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span className="truncate max-w-[170px]">{acc.name}</span>
                  <span className={`text-[9px] font-bold border px-1.5 py-0.2 rounded-full ${acc.badgeColor}`}>
                    {acc.role}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[10px]">
                  <span className="truncate max-w-[185px]">{acc.email}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(acc.email, acc.email)}
                    className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Sao chép Email"
                  >
                    <span className="material-symbols-outlined text-xs text-slate-500">
                      {copiedKey === acc.email ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 border-t border-slate-100 pt-1.5 text-center text-[10px] text-slate-400 dark:border-slate-800">
            Sao chép Email & Mật khẩu để đăng nhập thủ công
          </div>
        </div>
      )}
    </div>
  );
}
