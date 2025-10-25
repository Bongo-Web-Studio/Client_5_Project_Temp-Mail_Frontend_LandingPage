"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Inbox,
  Star,
  RefreshCw as Refresh,
  MoreHorizontal,
  ShieldAlert,
  Info,
  UserCircle,
  X,
  Menu,
} from "lucide-react";

/**
 * Pixel‑perfect responsive Mailbox Sidebar
 * - Keeps original paddings, margins, colors and measurements (cm values preserved)
 * - Desktop: fixed left sidebar (md and up)
 * - Mobile: floating action button opens a full-height slide-in panel with same UI
 */
export default function MailboxSidebarComponent({
  username = "user123",
  manualRefresh = () => {},
  EmailAddressDisplay = () => <span>user123@temp.abhi.at</span>,
}: {
  username?: string;
  manualRefresh?: () => void;
  EmailAddressDisplay?: React.FC;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCopyEmail = () => {
    const email = `${username}@temp.abhi.at`;
    try {
      navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard!");
    } catch (e) {
      toast.error("Unable to copy");
    }
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="bg-[#FF6900] rounded-xl h-[1.3cm] w-[5.5cm] mb-6 flex justify-center items-center shadow-xl border border-orange-600">
          <h1 className="text-white font-semibold text-lg flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            <EmailAddressDisplay />
          </h1>
        </div>

        <ul className="space-y-2 text-sm">
          <li
            onClick={handleCopyEmail}
            className="flex justify-between items-center px-3 py-2 rounded-md bg-[#F4F3EC] dark:bg-[#1A1A1A] dark:hover:bg-[#C0C954] hover:bg-[#C0C954] hover:text-black font-medium cursor-pointer transition-colors duration-200"
          >
            <span className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              <span>Copy</span>
            </span>
          </li>

          <Link
            href="/"
            className="px-3 py-2 hover:bg-[#FFA6EB] dark:hover:bg-[#FFA6EB] hover:text-black rounded-md flex items-center gap-2 transition-colors duration-200"
          >
            <Star className="w-4 h-4" />
            <span>Change</span>
          </Link>

          <li
            onClick={manualRefresh}
            className="px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A] rounded-md flex items-center gap-2 cursor-pointer transition-colors duration-200"
          >
            <Refresh className="w-4 h-4" />
            <span>Manual Refresh</span>
          </li>

          <li className="px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A] rounded-md flex items-center gap-2 cursor-pointer transition-colors duration-200">
            <MoreHorizontal className="w-4 h-4" />
            <span>More</span>
          </li>
        </ul>
      </div>

      <div className="bg-[#F4F3EC] dark:bg-[#1A1A1A] rounded-2xl p-5 mt-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-[14px] font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#FF6900]" /> Temp Mail Service
          </h1>
          <p className="text-[13px] text-gray-700 dark:text-gray-400 leading-snug">
            Your mails are public. Don’t use it for important mails. Use it to
            subscribe to all unwanted services. Mails auto-delete after 24
            hours, so save anything important!
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Info className="w-3 h-3" /> Made by @Abhinavstwt
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet - left sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 xl:w-80 bg-white dark:bg-[#272727] border-r p-4 h-screen flex-col justify-between transition-all duration-300">
        {SidebarContent}
      </aside>

      {/* Mobile: floating FAB to open the panel */}
      <div className="md:hidden">
        <button
          aria-label="Open mailbox sidebar"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#FF6900] text-white rounded-full p-3 shadow-lg border border-orange-600 flex items-center gap-2"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Overlay panel */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            {/* sliding panel from left - occupies 80% width on small screens */}
            <div className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#272727] border-r p-4 h-full shadow-xl transform transition-transform duration-300">
              <button
                aria-label="Close sidebar"
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 rounded-md p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-full">{SidebarContent}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
