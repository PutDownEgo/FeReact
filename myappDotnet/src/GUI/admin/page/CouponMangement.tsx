import { ColDef, RowSelectedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { deleteCoupons, getAllCoupons } from '../../../api/CouponApi';
import useCurrencyFormatter from '../../../hooks/useCurrencyFormatter';
import { Coupon } from '../../../models/Coupon';
import useCustomToast from '../../../util/UseCustomToast';
import CreateCouponModal from '../components/CreateCouponModal';
import ConfirmMessage from '../components/ConfirmMessage';

function CouponMangement() {
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 200];
    const [rowData, setRowData] = useState<Coupon[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const showToastMessage = useCustomToast();
    const [confirm, setConfirm] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState<number[]>([]);

    useEffect(() => {
        fetchCoupons();

    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await getAllCoupons();

            setRowData(response.result);
            console.log(response.result)
            return response.result;

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }


    const colDefs: ColDef[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            pinned: 'left',
            lockPosition: true,
        },
        { headerName: "STT", valueGetter: (params: any) => params.node.rowIndex + 1, width: 60 },
        { headerName: "Code", field: "code", width: 340 },
        {
            headerName: "Discount",
            field: "discount",
            width: 100,
            valueFormatter: (params) => {
                const discount = params.value;
                return `${discount * 100}%`;
            }
        },
        {
            headerName: "Expiry Date",
            field: "expiryDate",
            width: 200,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString();
            }
        },
        {
            headerName: "Description",
            field: "description",
            width: 220,
            cellRenderer: (params: any) => {
                return <div dangerouslySetInnerHTML={{ __html: params.value }} />;
            }
        },
        { headerName: "Quantity", field: "quantity", width: 100 },

    ];
    const [columnDefs, setColumnDefs] = useState<ColDef[]>(colDefs);



    const handleOpenCreateCoupontModal = () => {
        setModalShow(true);
    }


    const handleDeleteSelectedCoupons = async () => {

        if (selectedCouponId.length === 0) {
            console.log('No coupons selected');
            return;
        }
        console.log("coupon ne ba", selectedCouponId)

        try {
            const response = await deleteCoupons(selectedCouponId);

            if (response.code !== 1000)
                throw new Error("Error deleting the coupons");
            fetchCoupons();
            showToastMessage("Coupons deleted successfully", 'success');
            setSelectedCouponId([]);
            setConfirm(false);
        } catch (error) {
            console.error("Failed to delete selected coupons:", error);
        }
    };

    const handleConfirm = () => {
        if (selectedCouponId.length === 0) {
            showToastMessage("No Coupons selected", 'warning');
            return;
        }
        setConfirm(true);
    };

    const onSelectionChanged = useCallback((event: RowSelectedEvent) => {
        const rows = event.api.getSelectedNodes();
        const couponIds = rows.map(node => node.data.id);

        setSelectedCouponId(couponIds);
    }, []);


    return (

        <div
            className="ag-theme-quartz"
            style={{ height: 700 }}
        >

            <div className="d-flex justify-content-between align-items-center">
                <h1 style={{ color: "#012970" }}>Order Management</h1>

                <div>
                    <Button variant="danger" onClick={handleConfirm} style={{ marginRight: "10px", fontWeight: 400 }}>
                        Delete Selected
                    </Button>

                    <Button onClick={handleOpenCreateCoupontModal} variant="primary" style={{ marginLeft: "5px", fontWeight: 400 }}>
                        Create New Coupon
                    </Button>

                </div>

            </div>
            <br />


            <AgGridReact
                // ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                getRowHeight={() => 65}
                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
                multiSortKey={"ctrl"}
                rowSelection="multiple"
                // onRowClicked={onRowClicked}
                onRowSelected={onSelectionChanged}

            />
            <CreateCouponModal
                isShow={modalShow}
                onHide={() => setModalShow(false)}
            />

            <ConfirmMessage
                isShow={confirm}
                onHide={() => setConfirm(false)}
                message="Are you sure you want to delete selected coupons ?"
                onConfirm={handleDeleteSelectedCoupons} />


        </div>
    )
}

export default CouponMangement