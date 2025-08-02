export function SearchBox() {
  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Search users..."
        className="border rounded px-4 py-2 w-80"
      />
      <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">Search</button>
    </div>
  );
}
