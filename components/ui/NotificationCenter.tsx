import React, { useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationCenter = () => {
  const { notifications, markNotificationRead, clearNotifications } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[#313244] text-[#a6adc8] hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#f38ba8] rounded-full border-2 border-[#1e1e2e]" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-80 bg-[#1e1e2e] border border-[#313244] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border-b border-[#313244] flex justify-between items-center bg-[#252535]">
              <span className="font-bold text-white text-sm">Notifications</span>
              <button onClick={clearNotifications} className="text-xs text-[#f38ba8] hover:underline flex items-center gap-1">
                <Trash2 size={12} /> Clear
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#585b70] text-sm italic">All systems nominal.</div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-3 border-b border-[#313244] hover:bg-[#252535] transition-colors group cursor-pointer
                      ${notif.read ? 'opacity-50' : 'opacity-100'}
                    `}
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-bold ${notif.type === 'success' ? 'text-[#a6e3a1]' : notif.type === 'error' ? 'text-[#f38ba8]' : 'text-[#89b4fa]'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-[#89b4fa]" />}
                    </div>
                    <p className="text-xs text-[#cdd6f4] mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-[#585b70] mt-2 block">{new Date(notif.created_at).toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};