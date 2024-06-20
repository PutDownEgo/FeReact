import React from "react";
import { Modal, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { CategoryRequest, categorySchema } from "../../../models/Category";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewCategory } from "../../../api/CategoryApi";
import useCustomToast from "../../../util/UseCustomToast";
import { Category } from "../../../models/Product";

type CategoryFormProps = {
  show: boolean;
  onHide: () => void;
  onCategoryCreated: (category: Category) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  show,
  onHide,
  onCategoryCreated,
}) => {
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryRequest>({
    mode: "onBlur",
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CategoryRequest) => {
    try {
      const response = await createNewCategory(data);
      if (response) {
        showToast("Create category successfully", "success");
        onHide();
        onCategoryCreated(response.result);
        reset();
      }
    } catch (error) {
      showToast("Create category failed", "error");
      console.error("Error creating category:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
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
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryForm;
