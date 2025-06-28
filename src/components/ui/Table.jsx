import React from "react";
import PropTypes from "prop-types";
import "./Table.css";

const Table = ({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Нет данных",
  onRowClick,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`twa-table-container ${className}`}>
        <div className="twa-table-loading">Загрузка...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`twa-table-container ${className}`}>
        <div className="twa-table-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`twa-table-container ${className}`}>
      <div className="twa-table-wrapper">
        <table className="twa-table">
          <thead className="twa-table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="twa-table-header-cell"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="twa-table-body">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`twa-table-row ${
                  onRowClick ? "twa-table-row-clickable" : ""
                }`}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="twa-table-cell"
                    style={{
                      textAlign: column.align || "left",
                      width: column.width,
                    }}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
      align: PropTypes.oneOf(["left", "center", "right"]),
      render: PropTypes.func,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
};

export default Table;
