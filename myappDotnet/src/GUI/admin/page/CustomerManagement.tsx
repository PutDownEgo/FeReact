import { ColDef, RowSelectedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { deleteCustomersByIds, getAllCustomer } from '../../../api/UserApi';
import { User, UserStatus } from "../../../models/User";
import useCustomToast from '../../../util/UseCustomToast';
import ConfirmMessage from '../components/ConfirmMessage';

function CustomerMangement() {
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 200];
    const [rowData, setRowData] = useState<User[]>([]);
    const [selectedListUserId, setSelectedListUserId] = useState<number[]>([]);
    const navigate = useNavigate();
    const showToastMessage = useCustomToast();
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllCustomer();
            if (response.code !== 1000) throw new Error("Error");
            setRowData(response.result);
            console.log("user ne ", response.result)
            return response.result;

        } catch (error) {
            console.error("Failed to fetch usersp:", error);
        }
    }

    const StatusCellRenderer = (params: any) => {
        const status = params.value;
        let colorStyle;
        switch (status) {
            case UserStatus.ACTIVE:
                colorStyle = "green"
                break;
            case UserStatus.INACTIVE:
                colorStyle = "red"
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
    const ImageRenderer = (params: any) => {
        const imageUrl = params.value || 'default_image_url';
        return <img src={imageUrl} className='img-fluid rounded' />;
    };

    const colDefs: ColDef[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            pinned: 'left',
            lockPosition: true,
        },
        { headerName: "ID", field: "id", width: 70 },
        { headerName: "Avatar", field: "avatar", cellRenderer: ImageRenderer, width: 90 },
        {
            headerName: "Customer Name",
            field: "customerName",
            width: 130,
            valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
        },
        { headerName: "Email", field: "email", width: 170 },
        { headerName: "Phone Number", field: "phoneNumber", width: 130 },
        { headerName: "Address", field: "address", width: 200 },
        { headerName: "Gender", field: "gender", width: 100 },
        { headerName: "Status", field: "status", width: 100, cellRenderer: StatusCellRenderer },

    ];
    const [columnDefs, setColumnDefs] = useState<ColDef[]>(colDefs);

    const onRowClicked = useCallback((event: any) => {
        const userId = event.data.id
        navigate("/admin/customers/" + userId)
    }, []);

    const onSelectionChanged = useCallback((event: RowSelectedEvent) => {
        const rows = event.api.getSelectedNodes();
        const usersIds = rows.map(node => node.data.id);
        setSelectedListUserId(usersIds);
    }, []);

    const handleConfirm = () => {
        if (selectedListUserId.length === 0) {
            showToastMessage("No users selected", 'warning');
            return;
        }
        setConfirm(true);
    };

    const handleDeleteSelectedProducts = async () => {
        if (selectedListUserId.length === 0) {
            console.log('No customers selected');
            return;
        }
        try {
            const response = await deleteCustomersByIds(selectedListUserId);
            if (response.code !== 1000)
                throw new Error("Error deleting the users");
            fetchUsers();
            showToastMessage("Users deleted successfully", 'success');
            setSelectedListUserId([]);
            setConfirm(false);
            console.log('Users deleted successfully');
        } catch (error) {
            console.error("Failed to delete selected users:", error);
        }
    };


    return (
        <div
            className="ag-theme-quartz"
            style={{ height: 700 }}
        >
            <div className="d-flex justify-content-between align-items-center">
                <h1 style={{ color: "#012970" }}>Customers Management</h1>

                <div>
                    <Button variant="danger" onClick={handleConfirm} style={{ marginRight: "10px", fontWeight: 400 }}>
                        Delete Selected
                    </Button>
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
                onRowSelected={onSelectionChanged}

            />

            <ConfirmMessage
                isShow={confirm}
                onHide={() => setConfirm(false)}
                message="Are you sure you want to delete selected customers ?"
                onConfirm={handleDeleteSelectedProducts} />


        </div>
    )
}

export default CustomerMangement