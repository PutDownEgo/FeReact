import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { getOrderByUser } from '../../../api/OrderApi';
import useCurrencyFormatter from '../../../hooks/useCurrencyFormatter';
import { Order, OrderStatus } from '../../../models/Order';
import useCustomToast from '../../../util/UseCustomToast';
import OrderDetailModal from '../components/OrderDetailModal';

function OrderHistory() {
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 200];
    const formatCurrency = useCurrencyFormatter();
    const [rowData, setRowData] = useState<Order[]>([]);
    const productTypeArray: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPING, OrderStatus.DELIVERED, OrderStatus.CANCELED];
    const [modalShow, setModalShow] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
    const showToastMessage = useCustomToast();

    useEffect(() => {
        fetchOrders()

    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrderByUser();
            if (response.code !== 1000) throw new Error("Error");
            console.log(response.result);
            setRowData(response.result);
            return response.result;

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }

    const handleOrderUpdate = () => {
        fetchOrders();
    }

    const StatusCellRenderer = (params: any) => {
        const status = params.value;
        let colorStyle;
        switch (status) {
            case OrderStatus.PENDING:
                colorStyle = "#afaf02"
                break;
            case OrderStatus.CANCELED:
                colorStyle = "red"
                break;
            case OrderStatus.DELIVERED:
                colorStyle = "blue"
                break;
            case OrderStatus.CONFIRMED:
                colorStyle = "green"
                break;
            default:
                colorStyle = "black"
        }

        const style = {
            color: colorStyle
        };

        return (
            <span style={style}>
                {status}
            </span>
        );
    };

    const colDefs: ColDef[] = [

        { headerName: "ID", field: "id", width: 70 },
        { headerName: "Customer Name", field: "customerName", width: 150 },
        { headerName: "Email", field: "email", width: 250 },
        { headerName: "Phone Number", field: "phoneNumber", width: 150 },
        { headerName: "Address", field: "address", width: 300 },
        { headerName: "Note", field: "note", width: 150 },
        { headerName: "Total Pay", field: "totalPay", width: 100, valueFormatter: params => formatCurrency(params.value) },
        { headerName: "Status", field: "orderStatus", width: 120, cellRenderer: StatusCellRenderer },

    ];
    const [columnDefs, setColumnDefs] = useState<ColDef[]>(colDefs);




    const onRowClicked = useCallback((event: any) => {
        setSelectedOrderId(event.data.id);
        setModalShow(true);

    }, []);
    return (
        <div className="container mt-5">

            <div
                className="ag-theme-quartz mb-3"
                style={{ height: "850px", paddingBottom: "100px" }}
            >

                <div className="d-flex justify-content-between align-items-center">
                    <h1 style={{ color: "#81c408 !important" }}>Order History</h1>

                    <div>
                        {/* <Button variant="danger" style={{ marginRight: "10px", fontWeight: 400 }}>
                    Delete Selected
                </Button> */}
                        {/* <Button
                            variant="info"
                            // onClick={onBtnExport}
                            style={{ marginRight: "5px", fontWeight: 400 }}
                        >
                            Export to Excel
                        </Button> */}


                    </div>

                </div>
                <br />


                <AgGridReact
                    // ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    // components={{ imageRenderer: ImageRenderer }}
                    getRowHeight={() => 65}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    multiSortKey={"ctrl"}
                    rowSelection="multiple"
                    onRowClicked={onRowClicked}
                // onRowSelected={onSelectionChanged}

                />

                <OrderDetailModal
                    isShow={modalShow}
                    onHide={() => setModalShow(false)}
                    orderId={selectedOrderId}
                    onOrderUpdate={handleOrderUpdate}

                />
            </div>

        </div>

    )
}

export default OrderHistory