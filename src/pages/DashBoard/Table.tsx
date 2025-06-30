
interface Category {
  id: string;
  name: string;
}

interface TableProps {
  data: Category[] | null;
  isLoading?: boolean;
  error?: Error | null;
  onAdd?: () => void;
}
const Table: React.FC<TableProps> = ({ data, isLoading, error, onAdd }) => {
  if (isLoading) return <p>Đang tải ...</p>;

  if (error) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Danh sách Categories</h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 justify-end text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Thêm Category
        </button>
      </div>

      {(!data || data.length === 0) && (
        <p>Không có dữ liệu về categories</p>
      )}

      {data && data.length > 0 && (
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Tên</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => (
              <tr key={category.id}>
                <td className="border p-2">{category.id}</td>
                <td className="border p-2">{category.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
