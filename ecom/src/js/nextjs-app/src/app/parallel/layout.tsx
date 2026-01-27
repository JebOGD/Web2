export default function ParallelLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Main Content</h2>
        {children}
      </div>
      <div className="w-80 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Analytics Slot</h2>
        {analytics}
      </div>
      <div className="w-80 p-4">
        <h2 className="text-lg font-bold mb-4">Team Slot</h2>
        {team}
      </div>
    </div>
  );
}
