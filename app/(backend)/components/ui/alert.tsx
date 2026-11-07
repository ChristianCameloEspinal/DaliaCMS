export function ErrorAlert({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </div>
  );
}

export function SuccessAlert({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
      {message}
    </div>
  );
}
