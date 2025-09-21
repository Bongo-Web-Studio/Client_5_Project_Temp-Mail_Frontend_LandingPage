"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  FileText,
  Inbox,
  Info,
  MoreHorizontal,
  PenLine,
  Send,
  ShieldAlert,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Screen } from "@/components/screen";
import { Header, Footer, BorderDecoration } from "@/components/layout";
import { fetchMessage } from "@/lib/api";

export default function MessagePage() {
  const params = useParams();
  const router = useRouter();
  const messageId = params.messageId as string;
  const username = params.username as string;

  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessage = async () => {
      setLoading(true);
      try {
        const messageData = await fetchMessage(messageId);
        setMessage(messageData);
      } catch (error) {
        console.error("Failed to load message from API:", error);

        toast.error("Failed to load email message. Please try again later.", {
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [messageId, params.username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0D0E0E] relative overflow-y-auto">
        {/* Mobile loading */}
        <div className="md:hidden">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A1A1A] dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
                Loading message...
              </p>
            </div>
          </div>
        </div>

        {/* Desktop loading */}
        <div className="hidden md:block">
          <Screen>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A1A1A] dark:border-white mx-auto"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
                  Loading message...
                </p>
              </div>
            </div>
          </Screen>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0D0E0E] relative overflow-y-auto">
        <div className="md:hidden">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Message not found
              </p>
              <Link href="/">
                <Button className="mt-6">Go Home</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <Screen>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Message not found
                </p>
                <Link href="/">
                  <Button className="mt-6">Go Home</Button>
                </Link>
              </div>
            </div>
          </Screen>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen  bg-gray-100 dark:bg-[#0D0E0E] relative overflow-hidden ">
      <div className="md:hidden flex flex-col">
        <Header />

        <main className="flex-1 bg-white dark:bg-[#0D0E0E]">
          <div className="max-w-4xl mx-auto px-3 py-6 sm:px-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/mailbox/${username}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Mailbox
                </Button>
              </Link>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="p-6 border-b border-dashed border-gray-300 dark:border-gray-600">
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {message.subject}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                      })
                    : message.time}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span className="font-medium">From:</span> {message.from}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">To:</span>{" "}
                    {`<${username}@temp.abhi.at>`}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 overflow-auto max-h-[60vh]">
                  <div
                    className="text-sm text-gray-600 dark:text-gray-400 prose max-w-none dark:prose-invert"
                    style={{ maxWidth: "100%", wordBreak: "break-word" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        message.parsedData?.html ||
                        `<p>${
                          message.parsedData?.text ||
                          message.preview ||
                          "No content available"
                        }</p>`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <div className="hidden md:block">
        <Header />

        <div className="flex ">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-[#272727] border-r p-4 hidden md:block h-screen">
            <div className="bg-[#FF6900] rounded-xl h-[1.3cm] w-[4cm] mb-6 flex justify-center items-center shadow-xl border border-orange-600">
              <h1 className="text-white font-semibold text-lg flex items-center gap-2">
                <PenLine className="w-5 h-5" /> Compose
              </h1>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center px-3 py-2 rounded-md bg-[#F4F3EC] dark:bg-[#1A1A1A] font-medium">
                <span className="flex items-center gap-2">
                  <Inbox className="w-4 h-4" /> Inbox
                </span>
              </li>
              <li className="px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A] rounded-md flex items-center gap-2">
                <Star className="w-4 h-4" /> Starred
              </li>
              <li className="px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A]    rounded-md flex items-center gap-2">
                <Clock className="w-4 h-4" /> Snoozed
              </li>
              <li className="px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A] rounded-md flex items-center gap-2">
                <Send className="w-4 h-4" /> Sent
              </li>
              <li className="flex justify-between px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A]  rounded-md">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Drafts
                </span>
              </li>
              <li className="px-3 py-2 hover:bg-[#F4F3EC] dark:hover:bg-[#1A1A1A] rounded-md flex items-center gap-2">
                <MoreHorizontal className="w-4 h-4" /> More
              </li>
            </ul>

            <div className="bg-[#F4F3EC] dark:bg-[#1A1A1A] rounded-4xl p-5 mt-5">
              <div className="flex flex-col gap-2">
                <h1 className="text-[14px] font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Temp Mail Service
                </h1>
                <p className="text-[13px] text-gray-700 dark:text-gray-500">
                  Your mails are public. Don&apos;t use it for important mails.
                  Use it to subscribe to all unwanted services. Your mails will
                  be cleared from the database after 24 hours. Save any data you
                  need later!
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Made by @Abhinavstwt
                </p>
              </div>
            </div>
          </aside>
          <main className="">
            <div className="max-w-4xl mx-auto px-3 py-6 sm:px-6">
              <div className="flex items-center gap-4 mb-6">
                <Link href={`/mailbox/${username}`}>
                  <button className=" bg-white hover:bg-[#F4F3EC]  dark:bg-[#272727] dark:hover:bg-[#1A1A1A] transition-all duration-300 flex  p-3  justify-center items-center gap-1 rounded-lg shadow-lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Mailbox
                  </button>
                </Link>
              </div>

              <div className=" rounded-lg overflow-hidden bg-white dark:bg-[#272727]  w-[32.5cm] shadow-sm ">
                <div className="p-6 ">
                  <h1
                    style={{ fontFamily: "InstrumentSerif" }}
                    className="text-2xl font-bold mb-2 text-gray-900 dark:text-white  uppercase"
                  >
                    {message.subject}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : message.time}
                  </p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span className="font-medium">From:</span> {message.from}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">To:</span>{" "}
                      {`<${username}@temp.abhi.at>`}
                    </p>
                  </div>

                  <div className="mt-6 p-4 bg-[#F4F3EC] dark:bg-[#1A1A1A] rounded-md border border-gray-300 dark:border-gray-600 overflow-x-auto">
                    <div
                      className="text-sm text-gray-600 dark:text-gray-400 prose max-w-none dark:prose-invert"
                      style={{ maxWidth: "100%", wordBreak: "break-word" }}
                      dangerouslySetInnerHTML={{
                        __html:
                          message.parsedData?.html ||
                          `<p>${
                            message.parsedData?.text ||
                            message.preview ||
                            "No content available"
                          }</p>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
