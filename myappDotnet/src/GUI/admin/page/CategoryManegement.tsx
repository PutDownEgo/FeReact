import { ColDef, RowSelectedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { UserStatus } from "../../../models/User";
import useCustomToast from '../../../util/UseCustomToast';
import { deleteCategories, getAllCategories } from '../../../api/CategoryApi';
import { Category } from '../../../models/Product';
import ConfirmMessage from '../components/ConfirmMessage';
import EditCategoryModal from '../components/EditCategoryModal';
import CategoryForm from '../components/CreateCategoryModal';

function CategoryMangement() {
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 200];
    const [rowData, setRowData] = useState<Category[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [selectedListCategorytId, setSelectedListCategoryId] = useState<number[]>([]);
    const showToastMessage = useCustomToast();
    const [confirm, setConfirm] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);



    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories()

            setRowData(response.result);
            console.log("user ne ", response.result)
            return response.result;

        } catch (error) {
            console.error("Failed to fetch usersp:", error);
        }
    }

    const handleCategoryUpdate = () => {
        fetchCategories()
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


    const colDefs: ColDef[] = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            pinned: 'left',
            lockPosition: true,
        },
        { headerName: "STT", valueGetter: (params: any) => params.node.rowIndex + 1, width: 60 },
        { headerName: "Category Name", field: "name" },
        { headerName: "Description", field: "description", width: 400 },
        { headerName: "Status", field: "status", cellRenderer: StatusCellRenderer },

    ];
    const [columnDefs, setColumnDefs] = useState<ColDef[]>(colDefs);

    const onSelectionChanged = useCallback((event: RowSelectedEvent) => {
        const rows = event.api.getSelectedNodes();
        const productIds = rows.map(node => node.data.id);
        setSelectedListCategoryId(productIds);
    }, []);

    const onRowClicked = useCallback((event: any) => {
        setSelectedCategoryId(event.data.id);
        setModalShow(true);

    }, []);

    const handleDeleteSelectedCategories = async () => {
        if (selectedListCategorytId.length === 0) {
            console.log('No Categories selected');
            return;
        }

        try {
            const response = await deleteCategories(selectedListCategorytId);
            if (response.code !== 1000)
                throw new Error("Error deleting the products");

            fetchCategories();
            showToastMessage("Categories deleted successfully", 'success');
            setSelectedListCategoryId([]);
            setConfirm(false);
            console.log('Products deleted successfully');
        } catch (error) {
            console.error("Failed to delete selected products:", error);
        }
    };


    const handleConfirm = () => {
        if (selectedListCategorytId.length === 0) {
            showToastMessage("No Categories selected", 'warning');
            return;
        }
        setConfirm(true);

    };

    const handleCategoryCreated = async () => {

        setShowCategoryModal(false);
        fetchCategories();

    };


    const handleOpenCreateCategoryModal = () => {
        setShowCategoryModal(true);
    }
    return (

        <div
            className="ag-theme-quartz"
            style={{ height: 700 }}
        >

            <div className="d-flex justify-content-between align-items-center">
                <h1 style={{ color: "#012970" }}>Category Management</h1>

                <div>
                    <Button variant="danger" onClick={handleConfirm} style={{ marginRight: "10px", fontWeight: 400 }}>
                        Delete categories
                    </Button>
                    <Button onClick={handleOpenCreateCategoryModal} variant="primary" style={{ marginLeft: "5px", fontWeight: 400 }}>
                        Create New Category
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

            <EditCategoryModal
                isShow={modalShow}
                onHide={() => setModalShow(false)}
                categoryId={selectedCategoryId}
                onCategoryUpdate={handleCategoryUpdate}

            />

            <ConfirmMessage
                isShow={confirm}
                onHide={() => setConfirm(false)}
                message="Are you sure you want to delete selected categories ?"
                onConfirm={handleDeleteSelectedCategories} />

            <CategoryForm
                show={showCategoryModal}
                onHide={() => setShowCategoryModal(false)}
                onCategoryCreated={handleCategoryCreated}
            />
        </div>
    )
}

export default CategoryMangement