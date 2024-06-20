import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColDef, GridApi, RowSelectedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Controller, useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { createNewCoupon } from '../../../api/CouponApi';
import { getAllCustomer } from '../../../api/UserApi';
import { CouponRequest, CouponSchema } from '../../../models/Coupon';
import { User } from '../../../models/User';
import useCustomToast from '../../../util/UseCustomToast';

import { useNavigate } from 'react-router-dom';

type CreateCouponModalProps = {
    isShow: boolean;
    onHide: () => void;
};

function CreateCouponModal({ isShow, onHide }: CreateCouponModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [rowData, setRowData] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectAllUsers, setSelectAllUsers] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const showToastMessage = useCustomToast();
    const navigate = useNavigate();

    const { control, register, handleSubmit, reset, formState: { errors }, setValue, trigger } = useForm<CouponRequest>({
        mode: 'all',
        resolver: zodResolver(CouponSchema),
        defaultValues: {
            discount: 0,
            expiryDate: new Date(),
            description: '',
            quantity: 0,
            userIds: [],
        }
    });

    useEffect(() => {
        fetchAllCustomer();
    }, []);

    const fetchAllCustomer = async () => {
        try {
            const response = await getAllCustomer();
            setUsers(response.result);
            setRowData(response.result);
        } catch (error) {
            console.error("Failed to fetch customer:", error);
        }
    }

    const resetFormState = () => {
        reset();
        setRowData([]);
        setSelectAllUsers(false);
    };

    const handleClose = () => {
        resetFormState();
        onHide();
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
    ];

    const onGridReady = (params: any) => {
        setGridApi(params.api);
    };

    const onFilterTextBoxChanged = (event: any) => {
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    };

    const onSelectionChanged = useCallback((event: RowSelectedEvent) => {
        const rows = event.api.getSelectedNodes();
        const userIds = rows.map(node => node.data.id);
        setSelectedUsers(userIds)
        setValue('userIds', userIds);
    }, []);
    // console.log(errors)
    const onSubmit = async (data: CouponRequest) => {

        setIsLoading(true);
        try {
            await createNewCoupon(data);
            showToastMessage('Coupon created successfully.', 'success');
            window.location.reload();
            resetFormState();
            onHide();
        } catch (error) {
            toast.error('Error creating Coupon.');
            console.error('Error creating Coupon:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal size="lg" show={isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create the coupon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="mb-3 col-md-6">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    {...register("quantity", {
                                        setValueAs: value => parseInt(value) || 0
                                    })}
                                    required
                                />
                                {errors.quantity && <div className="text-danger small">{errors.quantity.message}</div>}
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="discount" className="form-label">Discount (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="discount"
                                    {...register("discount", {
                                        setValueAs: value => parseInt(value) / 100 || 0
                                    })}
                                    required
                                />
                                {errors.discount && <div className="text-danger small">{errors.discount.message}</div>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="mb-3 col-md-12">
                                <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="expiryDate"
                                    {...register("expiryDate", {
                                        required: "Expiry Date is required",
                                        setValueAs: value => new Date(value)
                                    })}
                                    required
                                />
                                {errors.expiryDate && <div className="text-danger small">{errors.expiryDate.message}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={field.value}
                                            onChange={(_, editor) => {
                                                const data = editor.getData();
                                                field.onChange(data);
                                            }}
                                            onBlur={(_, editor) => {
                                                const data = editor.getData();
                                                field.onChange(data);
                                            }}
                                        />
                                    )}
                                />
                                {errors.description && <div className="text-danger small">{errors.description.message}</div>}
                            </div>
                        </div>

                        {!selectAllUsers && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="userSearch" className="form-label">Search Users</label>
                                    <input
                                        type="text"
                                        id="userSearch"
                                        className="form-control"
                                        placeholder="Search..."
                                        onChange={onFilterTextBoxChanged}
                                    />
                                </div>
                                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                                    <AgGridReact
                                        rowSelection="multiple"
                                        onGridReady={onGridReady}
                                        rowData={rowData}
                                        columnDefs={colDefs}
                                        onRowSelected={onSelectionChanged}
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn btn-primary mt-3">Submit</button>
                        {isLoading && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 10
                            }}>
                                <ReactLoading type="spin" color="#ffebcd" height={'10%'} width={'10%'} />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CreateCouponModal;
