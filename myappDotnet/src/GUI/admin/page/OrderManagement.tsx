import { Stomp } from '@stomp/stompjs';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import SockJS from 'sockjs-client';
import { getAllOrders } from '../../../api/OrderApi';
import useCurrencyFormatter from '../../../hooks/useCurrencyFormatter';
import { Order, OrderStatus, OrderTableExcel } from '../../../models/Order';
import useCustomToast from '../../../util/UseCustomToast';
import OrderDetailModal from '../components/OrderDetailModal';

function OrderManagement() {
    const pagination = true;
    const paginationPageSize = 10;
    const gridRef = useRef<AgGridReact<OrderTableExcel>>(null);
    const paginationPageSizeSelector = [10, 50, 200];
    const formatCurrency = useCurrencyFormatter();
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [rowData, setRowData] = useState<Order[]>([]);
    const productTypeArray: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPING, OrderStatus.DELIVERED, OrderStatus.CANCELED, OrderStatus.RETURNED, OrderStatus.PAID];
    const [modalShow, setModalShow] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number>(0);
    const showToastMessage = useCustomToast();

    useEffect(() => {
        fetchOrders();
        setupWebSocket();
        const interval = setInterval(() => {
            fetchOrders();
        }, 300000);

        return () => clearInterval(interval);

    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setRowData(response.result);
            return response.result;

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }

    const handleOrderUpdate = () => {
        fetchOrders();
    }

    const setupWebSocket = () => {
        const socket = new SockJS(process.env.REACT_APP_API_ENDPOINT + "ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame: any) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/order', function (order) {
                const newOrder = JSON.parse(order.body);
                console.log("new orde ne bro", newOrder);
                setRowData(prevOrders => [newOrder, ...prevOrders]);
            });
        });

        return () => {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");
        };
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
    const onBtnExport = useCallback(() => {
        gridRef.current!.api.exportDataAsCsv({});
    }, []);

    const colDefs: ColDef[] = [
        // {
        //     headerCheckboxSelection: true,
        //     checkboxSelection: true,
        //     width: 50,
        //     pinned: 'left',
        //     lockPosition: true,
        // },
        { headerName: "STT", valueGetter: (params: any) => params.node.rowIndex + 1, width: 60 },
        { headerName: "ID", field: "id", width: 70 },
        { headerName: "Customer Name", field: "customerName", width: 130, filter: 'agTextColumnFilter', },
        { headerName: "Email", field: "email", width: 150, filter: 'agTextColumnFilter', },
        { headerName: "Phone Number", field: "phoneNumber", width: 130, filter: 'agTextColumnFilter', },
        { headerName: "Address", field: "address", width: 200, filter: 'agTextColumnFilter', },
        { headerName: "Note", field: "note", width: 100 },
        { headerName: "Total Pay", field: "totalPay", width: 100, valueFormatter: params => formatCurrency(params.value) },
        { headerName: "Status", field: "orderStatus", width: 120, cellRenderer: StatusCellRenderer },

    ];
    const [columnDefs, setColumnDefs] = useState<ColDef[]>(colDefs);


    const onRowClicked = useCallback((event: any) => {
        setSelectedOrderId(event.data.id);
        setModalShow(true);

    }, []);

    const onGridReady = (params: any) => {
        setGridApi(params.api);
    };
    const onFilterTextBoxChanged = (event: any) => {
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    };

    return (

        <div
            className="ag-theme-quartz"
            style={{ height: 700 }}
        >

            <div className="d-flex justify-content-between align-items-center">
                <h1 style={{ color: "#012970" }}>Order Management</h1>


                <div style={{ width: "350px", marginLeft: "140px" }}>
                    {/* <label htmlFor="userSearch" className="form-label">Search for order</label> */}
                    <input
                        type="text"
                        id="userSearch"
                        className="form-control"
                        placeholder="Search..."
                        onChange={onFilterTextBoxChanged}
                    />
                </div>
                <div>
                    {/* <Button variant="danger" style={{ marginRight: "10px", fontWeight: 400 }}>
                        Delete Selected
                    </Button> */}

                    <Button
                        variant="info"
                        onClick={onBtnExport}
                        style={{ marginRight: "5px", fontWeight: 400 }}
                    >
                        Export to Excel
                    </Button>


                </div>


            </div>
            <br />


            <AgGridReact
                onGridReady={onGridReady}
                ref={gridRef}
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
        </div >
    )
}

export default OrderManagement