
import Sidebar from "@/components/ui/dashboard/sidebar";
import Topbar from "@/components/ui/dashboard/topbar";

export const metadata = {
  title: "Dashboard | EZlife HRMS",
  description: "HRMS dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <Sidebar />
      <Topbar />

      <main className="min-h-screen pt-14 lg:pl-[220px]">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}