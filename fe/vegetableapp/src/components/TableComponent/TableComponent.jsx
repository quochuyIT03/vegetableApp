import { Table } from 'antd';
import React, { useMemo, useState } from 'react'
import Loading from '../LoadingCoponent/LoadingCoponent';
import { Excel } from 'antd-table-saveas-excel';

const TableComponent = (props) => {
  // const {selectionType = 'checkbox', products =[], isLoading = false} = props
  const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnsExport = useMemo(() => { // Sửa: Sử dụng `useMemo`
    return columns?.filter((col) => col.dataIndex !== 'action');
  }, [columns]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  }
  console.log('datasource', dataSource, columns)
  //////////////////////////////////////Hàm xuất file excel/////////////////////////////////////////////
  const exportExcel = () => {
    try {
      const excel = new Excel();
      // Kiểm tra mảng newColumnsExport trước khi sử dụng reduce()
      if (!newColumnsExport || newColumnsExport.length === 0) {
        console.error('Mảng newColumnsExport không tồn tại hoặc rỗng.');
        return;
      }
      excel
        .addSheet("data")
        // Sử dụng reduce() ở đây
        .addColumns(newColumnsExport.reduce((acc, col) => {
          // Thực hiện bất kỳ xử lý nào bạn cần với mỗi cột
          // Ở đây, tôi giả sử chỉ cần lấy ra một số thuộc tính của cột
          acc.push({ title: col.title, dataIndex: col.dataIndex });
          return acc;
        }, []))
        .addDataSource(dataSource, {
          str2Percent: true
        })
        .saveAs("data.xlsx");
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
    }
  }

  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div style={{
          background: 'rgb(5 89 11)',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px',
          cursor: 'pointer'
        }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}

      <button onClick={exportExcel}> Xuất file data </button>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Loading>

  )
}

export default TableComponent
