import Chatbot from "@/components/Chatbot";
import Cards from "@/components/dashboard/Cards";
import { currentUser } from "@clerk/nextjs/server";
import { Star } from "lucide-react";

export default async function Home() {

  const user = await currentUser();
  const username = user?.firstName || "Guest";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 p-4 flex flex-col gap-6">
        <div className="bg-white rounded shadow p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-yellow-500" />
            <h3 className="text-lg font-semibold">Welcome, <span className="text-blue-500">{username}</span></h3>
          </div>
        </div>
        <Cards />
      </div>
      <div className="md:col-span-1">
        <Chatbot />
      </div>
    </div>
  );
}
