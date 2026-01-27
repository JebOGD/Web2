export default function AnalyticsSlot() {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-800">Analytics Panel</h3>
        <p className="text-sm text-green-600">This is the @analytics slot</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Page Views:</span>
          <span className="font-mono text-sm">1,234</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Users:</span>
          <span className="font-mono text-sm">456</span>
        </div>
      </div>
    </div>
  );
}
