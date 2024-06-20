import { ColDef, RowSelectedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { useCallback, useEffect, useRef, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { deleteProducts, getProducts } from "../../../api/ProductApi";
import UseFetch from "../../../api/UseFetch";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";
import { Product, ProductTable, ProductType } from "../../../models/Product";
import EditProductModal from "../components/EditProductModal";

import { Button } from "react-bootstrap";
import useCustomToast from "../../../util/UseCustomToast";
import ConfirmMessage from "../components/ConfirmMessage";
import CreateProductModal from "../components/CreateProductModal";

function ProductManagement() {
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 50, 200];

  const gridRef = useRef<AgGridReact<ProductTable>>(null);
  const formatCurrency = useCurrencyFormatter();
  const { data, loading, error } = UseFetch(getProducts);
  const [rowData, setRowData] = useState<Product[]>([]);
  const productTypeArray: ProductType[] = [
    ProductType.Vegetables,
    ProductType.Fruits,
    ProductType.Bread,
    ProductType.Meat,
  ];
  const [modalShow, setModalShow] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [selectedListProductId, setSelectedListProductId] = useState<number[]>(
    []
  );
  const [modalCreateShow, setModalCreateShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const showToastMessage = useCustomToast();

  useEffect(() => {
    if (data) {
      setRowData(data);
    }
  }, [data]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (response.code !== 1000) throw new Error("Error");
      setRowData(response.result);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductUpdateOrCreate = () => {
    fetchProducts();
  };

  const StatusCellRenderer = (params: any) => {
    const status = params.value;
    const style = {
      color: status === "ACTIVE" ? "green" : "red",
    };

    return <span style={style}>{status}</span>;
  };

  const onSelectionChanged = useCallback((event: RowSelectedEvent) => {
    const rows = event.api.getSelectedNodes();
    const productIds = rows.map((node) => node.data.id);
    setSelectedListProductId(productIds);
  }, []);

  const onRowClicked = useCallback((event: any) => {
    setSelectedProductId(event.data.id);
    setModalShow(true);
  }, []);

  const ImageRenderer = (params: any) => {
    const imageUrl = params.value || "default_image_url";
    return <img src={imageUrl} className="img-fluid" />;
  };

  const RatingRender = (params: any) => {
    const rating = params.value;
    return <Rating allowFraction size={16} readonly initialValue={rating} />;
  };

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      pinned: "left",
      lockPosition: true,
    },
    // { headerName: "ID", field: "id", width: 70 },
    { headerName: "Product Name", field: "name", filter: "agTextColumnFilter" },
    {
      headerName: "Image",
      field: "image",
      cellRenderer: ImageRenderer,
      width: 100,
    },
    {
      headerName: "Category",
      field: "category.name",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: productTypeArray,
      },
      valueGetter: (params) => params.data.category.name,
      width: 140,
    },
    {
      headerName: "Price",
      field: "price",
      width: 100,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      headerName: "Sale Price",
      field: "salePrice",
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    { headerName: "Quantity", field: "quantity", width: 100 },
    {
      headerName: "Rating",
      field: "ratings",
      width: 120,
      cellRenderer: RatingRender,
    },
    {
      headerName: "Status",
      field: "productStatus",
      width: 100,
      cellRenderer: StatusCellRenderer,
    },
  ];
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(colDefs);

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv({});
  }, []);

  const handleDeleteSelectedProducts = async () => {
    if (selectedListProductId.length === 0) {
      console.log("No products selected");
      return;
    }

    try {
      const response = await deleteProducts(selectedListProductId);
      if (response.code !== 1000)
        throw new Error("Error deleting the products");

      fetchProducts();
      showToastMessage("Products deleted successfully", "success");
      setSelectedListProductId([]);
      setConfirm(false);
      console.log("Products deleted successfully");
    } catch (error) {
      console.error("Failed to delete selected products:", error);
    }
  };

  const handleOpenCreateProductModal = () => {
    setModalCreateShow(true);
  };

  const handleConfirm = () => {
    if (selectedListProductId.length === 0) {
      showToastMessage("No products selected", "warning");
      return;
    }
    setConfirm(true);
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h1 style={{ color: "#012970" }}>Product Management</h1>

        <div>
          <Button
            variant="danger"
            onClick={handleConfirm}
            style={{ marginRight: "10px", fontWeight: 400 }}
          >
            Delete Selected
          </Button>
          <Button
            variant="info"
            onClick={onBtnExport}
            style={{ marginRight: "5px", fontWeight: 400 }}
          >
            Export to Excel
          </Button>
          <Button
            onClick={handleOpenCreateProductModal}
            variant="primary"
            style={{ marginLeft: "5px", fontWeight: 400 }}
          >
            Create New Product
          </Button>
        </div>
      </div>

      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        components={{ imageRenderer: ImageRenderer }}
        getRowHeight={() => 65}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
        multiSortKey={"ctrl"}
        rowSelection="multiple"
        onRowClicked={onRowClicked}
        onRowSelected={onSelectionChanged}
      />

      <EditProductModal
        isShow={modalShow}
        onHide={() => setModalShow(false)}
        productId={selectedProductId}
        onProductUpdate={handleProductUpdateOrCreate}
      />

      <CreateProductModal
        isShow={modalCreateShow}
        onHide={() => setModalCreateShow(false)}
        onProductCreate={handleProductUpdateOrCreate}
      />

      <ConfirmMessage
        isShow={confirm}
        onHide={() => setConfirm(false)}
        message="Are you sure you want to delete selected products ?"
        onConfirm={handleDeleteSelectedProducts}
      />
    </div>
  );
}

export default ProductManagement;
