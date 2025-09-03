import Chatbot from "@/components/Chatbot";
import Cards from "@/components/dashboard/Cards";
export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Cards />
      </div>
      <div className="md:col-span-1">
        <Chatbot />
      </div>
    </div>
  );
}
