import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { getCategoryById, updateCategory } from "../../../api/CategoryApi";
import {
  CategoryStatus,
  UpdateCategoryRequest,
  updateCategorySchema,
} from "../../../models/Category";
import { Category } from "../../../models/Product";
import useCustomToast from "../../../util/UseCustomToast";

type EditCategoryModalProps = {
  isShow: boolean;
  onHide: () => void;
  categoryId: number;
  onCategoryUpdate: () => void;
};

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isShow,
  onHide,
  onCategoryUpdate,
  categoryId,
}) => {
  const showToast = useCustomToast();
  const [editCategory, setEditCategory] = React.useState<Category | null>(null);
  const showToastMessage = useCustomToast();
  const [categoryStatus, setCategoryStatus] = useState<CategoryStatus[]>([
    CategoryStatus.ACTIVE,
    CategoryStatus.INACTIVE,
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateCategoryRequest>({
    mode: "onBlur",
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: categoryId,
      name: "",
      description: "",
      status: CategoryStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (isShow && categoryId) {
      fetchCategoryData(categoryId);
    } else {
      resetFormState();
    }
  }, [isShow, categoryId]);

  const fetchCategoryData = async (id: number) => {
    try {
      const response = await getCategoryById(id);
      setEditCategory(response.result);
      setCategoryToEdit(response.result);
    } catch (error) {
      showToastMessage("Failed to fetch category", "error");
      console.error("Error fetching product:", error);
    }
  };

  const resetFormState = () => {
    reset();
  };

  const setCategoryToEdit = (category: Category) => {
    setValue("id", category.id);
    setValue("name", category.name);
    setValue("description", category.description);
    setValue("status", category.status);
  };

  const onSubmit = async (data: UpdateCategoryRequest) => {
    try {
      const response = await updateCategory(data);
      if (response) {
        showToast("Update category successfully", "success");
        onHide();
        onCategoryUpdate();
        reset();
      }
    } catch (error) {
      showToast("Update category failed", "error");
      console.error("Error Update category:", error);
    }
  };

  return (
    <Modal show={isShow} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              className="form-control"
              id="categoryName"
              {...register("name")}
              required
            />
            {errors.name && (
              <div className="text-danger small">{errors.name.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="categoryDescription" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="categoryDescription"
              {...register("description")}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="categoryStatus" className="form-label">
              Status
            </label>
            <select className="form-select" id="status" {...register("status")}>
              {categoryStatus.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <div className="text-danger small">{errors.status.message}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditCategoryModal;
