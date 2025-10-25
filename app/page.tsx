"use client";
import { Screen } from "@/components/screen";
import { Header, Footer, BorderDecoration } from "@/components/layout";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  Mail,
  Inbox,
  Star,
  Clock,
  Send,
  FileText,
  MoreHorizontal,
  PenLine,
  ShieldAlert,
  Info,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const inputboxref = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // ✅ validation: only a–z, 0–9, max 85 chars
  const validateUsername = (input: string): string => {
    const beforeAtSign = input.split("@")[0];
    return beforeAtSign
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 85);
  };

  const createMailbox = () => {
    if (username.trim()) {
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001"
        }/api/mailboxes/custom`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim() }),
        }
      ).finally(() => {
        window.location.href = `/mailbox/${encodeURIComponent(
          username.trim()
        )}`;
      });
    }
  };

  const EmailBox = (
    <div className="w-full max-w-xl rounded-3xl shadow-xl">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            id="mail"
            type="text"
            value={username}
            ref={inputboxref}
            placeholder="Enter your username"
            maxLength={85} // ✅ UI-level safeguard
            onChange={(e) => setUsername(validateUsername(e.target.value))}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createMailbox();
              }
            }}
            className="w-full px-6 py-4 pr-20 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none text-lg font-medium shadow-sm"
          />
          <button
            type="button"
            onClick={createMailbox}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );

  const AbstractBlocks = (
    <div className="absolute top-[29px] lg:top-[60px] left-[18px] lg:left-[212px] lg:w-[9.2cm] w-[7.7cm] rounded-t-4xl overflow-hidden shadow-xl">
      {/* Black Header */}
      <div className="bg-black text-white p-5 h-[2cm] flex flex-col justify-between">
        <h1
          style={{ fontFamily: "PencilantScript" }}
          className="text-4xl font-light flex items-center gap-2"
        >
          Data
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2">
        <div className="bg-[#FE5709] p-4 h-[4.5cm] text-black flex flex-col justify-between">
          <p className="text-sm flex items-center gap-1">
            <Inbox className="w-4 h-4" /> Active Users
          </p>
          <p
            style={{ fontFamily: "InstrumentSerif" }}
            className="text-6xl font-bold "
          >
            50.2K
          </p>
        </div>

        <div className="bg-[#FFA6EB] p-4 h-[4.5cm] text-black flex flex-col justify-between">
          <p
            style={{ fontFamily: "InstrumentSerif" }}
            className="text-6xl font-bold"
          >
            1.82M
          </p>
          <p className="text-sm flex items-center gap-1">
            <Star className="w-4 h-4" /> Overall Teapmails
          </p>
        </div>

        <div className="bg-[#C0C954] col-span-2 lg:p-4  p-2 h-[2.5cm] text-black flex lg:flex-col lg:justify-center justify-between lg:items-start items-center">
          <p
            style={{ fontFamily: "InstrumentSerif" }}
            className="lg:text-6xl text-6xl font-bold"
          >
            83—
          </p>
          <p className="lg:text-sm text-[10px]  flex items-center gap-1">
            <Send className="w-4 h-4" /> Ads — New Features Coming Soon
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" bg-[#F4F3EC] dark:bg-[#1A1A1A] flex flex-col lg:h-screen h-[90vh] w-full  overflow-hidden">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#272727] border-r p-4 hidden md:block">
          <div
            onClick={() => {
              inputboxref?.current?.focus();
            }}
            className="bg-[#FF6900] rounded-xl h-[1.3cm] w-[4cm] mb-6 flex justify-center items-center shadow-xl border border-orange-600"
          >
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
                Use it to subscribe to all unwanted services. Your mails will be
                cleared from the database after 24 hours. Save any data you need
                later!
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" /> Made by @Abhinavstwt
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex justify-center items-center flex-col p-8 overflow-y-auto">
          <h2 className=" lg:text-5xl text-4xl   max-w-4xl text-center mb-8 font-serif ">
            Make Your First Temporary Email Address
          </h2>

          <div className="flex justify-center items-center">{EmailBox}</div>
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400 flex justify-center items-center gap-2 line-clamp-1 max-w-4xl">
            <Mail className="w-4 h-4" />
            Your email will be:{" "}
            <span className="font-semibold">{username || "username"}</span>
            @temp.abhi.at
          </p>
          <p className="text-center mt-2 text-xs text-gray-500 dark:text-gray-500">
            Only lowercase letters and numbers are allowed (max 85 characters)
          </p>
          {/* ✅ Laptop view — only on large screens (always shown) */}
          <div className=" relative  lg:pt-5 ">
            <div className="flex justify-center items-center ">
              <Image
                src="./iphone.png"
                width={10}
                height={10}
                alt="App preview"
                className="lg:w-[50vw] w-[8.9cm] h-[8.9cm]  lg:h-[55vh]   object-cover "
              />

              {AbstractBlocks}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
