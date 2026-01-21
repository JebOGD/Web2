export default function TeamSlot() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800">Team Panel</h3>
        <p className="text-sm text-blue-600">This is the @team slot</p>
      </div>
      <div className="space-y-2">
        <div className="p-2 bg-muted rounded">
          <p className="text-sm font-medium">Team Member 1</p>
          <p className="text-xs text-muted-foreground">Developer</p>
        </div>
        <div className="p-2 bg-muted rounded">
          <p className="text-sm font-medium">Team Member 2</p>
          <p className="text-xs text-muted-foreground">Designer</p>
        </div>
      </div>
    </div>
  );
}
