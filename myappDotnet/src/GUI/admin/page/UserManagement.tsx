import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { getAllAdmin } from '../../../api/UserApi';
import { User, UserStatus } from "../../../models/User";
import useCustomToast from '../../../util/UseCustomToast';
import UserDetailModal from './CustomerDetail';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserMangement() {
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 200];
    const [rowData, setRowData] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number>(0);
    const showToastMessage = useCustomToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllAdmin()
            setRowData(response.result);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }

    const handleOrderUpdate = () => {
        fetchUsers()
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
        const userId = event.data.id;
        navigate("/admin/users/" + userId)

    }, []);

    return (

        <div
            className="ag-theme-quartz"
            style={{ height: 700 }}
        >

            <div className="d-flex justify-content-between align-items-center">
                <h1 style={{ color: "#012970" }}>Users Management</h1>

                <div>
                    {/* <Button variant="danger" style={{ marginRight: "10px", fontWeight: 400 }}>
                        Delete Selected
                    </Button> */}
                    <Button onClick={() => navigate("/admin/users/create")} variant="primary" style={{ marginLeft: "5px", fontWeight: 400 }}>
                        Create New System Account
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
            // onRowSelected={onSelectionChanged}

            />


        </div>
    )
}

export default UserMangement