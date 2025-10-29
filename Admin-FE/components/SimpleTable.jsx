'use client';

export default function SimpleTable({columns, data, emptyMessage = '데이터가 없습니다.'}) {
  if (!data || data.length === 0) {
    return <p className="simple-table__empty text-sm text-slate-500">{emptyMessage}</p>;
  }

  return (
    <div className="simple-table overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="simple-table__header text-xs uppercase tracking-wide text-slate-500">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-slate-100">
              {columns.map((column) => (
                <td key={column.key} className="simple-table__cell">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
