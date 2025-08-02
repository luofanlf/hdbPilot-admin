import Sidebar from "@/components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Fixed sidebar on the left with full height and fixed width */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-50">
        <Sidebar />
      </div>

      {/* Main content area with left margin to avoid overlap */}
      <main className="ml-64 p-6 bg-gray-50 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
