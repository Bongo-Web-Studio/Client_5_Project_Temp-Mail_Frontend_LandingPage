"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  RefreshCw as Refresh,
  Lock,
  PenLine,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  MoreHorizontal,
  ShieldAlert,
  Info,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Screen } from "@/components/screen";
import { Header, Footer, BorderDecoration } from "@/components/layout";
import { fetchMessages } from "@/lib/api";
import MailboxSidebarComponent from "@/components/MailBoxComponent/MilboxSidebarCompoenent";

export default function MailboxPage() {
  const params = useParams();
  const username = params.username as string;

  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [apiErrorState, setApiErrorState] = useState(false);
  const [hasStableEmails, setHasStableEmails] = useState(false);
  const [stableEmailCount, setStableEmailCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastEmailCountRef = useRef<number>(0);

  const loadEmails = async (forceRefresh = false) => {
    if (apiErrorState && failedAttempts >= 5) {
      return;
    }

    setLoading(true);

    try {
      const result = await fetchMessages(
        `${username}@temp.abhi.at`,
        forceRefresh
      );

      const newEmails = result.messages || [];
      setEmails(newEmails);

      const currentCount = newEmails.length;
      if (currentCount > 0 && currentCount === lastEmailCountRef.current) {
        setStableEmailCount((prev) => prev + 1);
      } else {
        setStableEmailCount(0);
        setHasStableEmails(false);
      }
      lastEmailCountRef.current = currentCount;

      if (failedAttempts > 0) {
        setFailedAttempts(0);
        setApiErrorState(false);
      }
    } catch (error) {
      console.error("Failed to load emails:", error);

      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      setApiErrorState(true);

      toast.error(
        `Cannot reach server right now. Retry ${newFailedAttempts}/5`,
        {
          style: {
            background: "white",
            color: "black",
            border: "1px solid #ef4444",
          },
        }
      );

      if (newFailedAttempts >= 5) {
        toast.error(
          "Maximum retry attempts reached. Please refresh the page to try again.",
          {
            style: {
              background: "white",
              color: "black",
              border: "1px solid #ef4444",
            },
            duration: 10000,
          }
        );
        setIsListening(false);
      }
    } finally {
      setLoading(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    if (stableEmailCount >= 3 && lastEmailCountRef.current > 0) {
      setHasStableEmails(true);
    }
  }, [stableEmailCount]);

  useEffect(() => {
    loadEmails(true);
  }, []);

  useEffect(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (apiErrorState && failedAttempts >= 5) {
      return;
    }

    const getBackoffTime = () => {
      if (hasStableEmails && emails.length > 0) {
        return 120000;
      }

      if (failedAttempts === 0) return 45000;

      return Math.min(Math.pow(2, failedAttempts) * 5000, 300000);
    };

    const interval = setInterval(() => {
      if (isListening && !loading) {
        loadEmails();
      }
    }, getBackoffTime());

    return () => clearInterval(interval);
  }, [
    isListening,
    failedAttempts,
    apiErrorState,
    hasStableEmails,
    emails.length,
    loading,
  ]);

  const manualRefresh = async () => {
    setApiErrorState(false);
    setFailedAttempts(0);
    setHasStableEmails(false);
    setStableEmailCount(0);
    setIsListening(true);

    toast("Refreshing mailbox...", {
      style: {
        background: "white",
        color: "black",
        border: "1px solid #e5e7eb",
      },
    });

    setRefreshing(true);

    try {
      const result = await fetchMessages(`${username}@temp.abhi.at`, true);
      setEmails(result.messages || []);

      toast.success("Mailbox refreshed!", {
        style: {
          background: "white",
          color: "black",
          border: "1px solid #e5e7eb",
        },
      });
    } catch (error) {
      toast.error("Failed to refresh mailbox. Please try again later.", {
        style: {
          background: "white",
          color: "black",
          border: "1px solid #ef4444",
        },
      });
    } finally {
      setRefreshing(false);
      setLastChecked(new Date());
    }
  };

  const EmailAddressDisplay = () => (
    <div
      className=""
      onClick={() => {
        const email = `${username}@temp.abhi.at`;
        navigator.clipboard.writeText(email);
        toast.success("Email copied to clipboard!");
      }}
    >
      {username}@temp.abhi.at
    </div>
  );

  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 px-2 sm:px-0">
      <Button
        className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base w-full sm:w-auto sm:min-w-[120px]"
        onClick={() => {
          const email = `${username}@temp.abhi.at`;
          navigator.clipboard.writeText(email);
          toast.success("Email copied to clipboard!");
        }}
      >
        Copy
      </Button>
    </div>
  );

  const MailboxHeader = () => (
    <div className="text-center mb-4 sm:mb-6">
      <ActionButtons />
    </div>
  );

  const EmailsList = () => {
    if (refreshing) {
      return (
        <div className="flex flex-col items-center justify-center w-screen h-screen text-center py-12  rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A1A1A] dark:border-white"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
            Refreshing...
          </p>
        </div>
      );
    }

    if (apiErrorState && failedAttempts >= 5) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center py-12 border-2 border-dashed border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-red-500 dark:text-red-400 font-medium text-lg">
            Server connection error
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Could not connect to the server after multiple attempts.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={manualRefresh}
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (emails.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 rounded-lg  w-[34cm]  h-[18cm]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A1A1A] dark:border-white"></div>
          <p className="mt-4 text-gray-500 dark:text-[#272727] text-lg">
            No emails yet. Check back later!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {emails.map((email) => (
          <Link
            key={email.id}
            href={`/mailbox/${username}/message/${email.id}`}
          >
            <div className=" flex  border border-gray-300 dark:border-gray-600 p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-[#F4F3EC] dark:bg-[#272727] w-[34cm] mx-auto  mb-1 ">
              <h3
                style={{ fontFamily: "InstrumentSerif" }}
                className="text-4xl  w-[31cm] uppercase font-semibold mb-1 text-gray-900 dark:text-white break-words"
              >
                {email.subject}
              </h3>
              <div className="flex justify-between items-center w-[3cm]">
                <p className="text-2xl font-light  text-gray-500 dark:text-white mb-2">
                  {email.createdAt
                    ? new Date(email.createdAt).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      })
                    : email.time}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                  {email.preview}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="max-h-screen bg-gray-100 dark:bg-[#0D0E0E] relative overflow-hidden">
      {/* Mobile View */}
      <div className="md:hidden flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-white dark:bg-[#0D0E0E] overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 sm:py-8">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6 sm:mb-8">
              <MailboxHeader />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <EmailsList />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block ">
        <Header />
        {/* Sidebar */}
        <div className="flex">
   <MailboxSidebarComponent/>

          <EmailsList />
        </div>
      </div>
    </div>
  );
}
