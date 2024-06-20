import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCategories, addProduct } from "../../../api/ProductApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { Category, ProductRequest, ProductRequestSchema } from "../../../models/Product";
import DragFileAndPreview from "../components/DragFileAndPreview";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddNewProduct = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductRequest>({
        mode: 'all',
        resolver: zodResolver(ProductRequestSchema),
        defaultValues: {
            name: '',
            price: 0,
            description: '',
            categoryId: 0,
            quantity: 0
        }
    });

    console.log(errors);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getCategories();
            setCategories(response.result);
        }
        fetchCategories();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files ? event.target.files[0] : null);
    };

    const onSubmit = async (data: ProductRequest) => {
        console.log(data);
        if (!selectedFile) {
            toast.error('No file selected!');
            return;
        }

        const formData = new FormData();
        formData.append('product', JSON.stringify(data));
        formData.append('file', selectedFile);

        setIsLoading(true);
        try {
            await addProduct(formData);
            toast.success('Product added successfully!');
            reset();
            setSelectedFile(null);
        } catch (error) {
            toast.error('Error adding product.');
            console.error('Error adding product:', error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <ToastContainer />
            <div className="container mt-5">
                <h2>Add Product</h2>
                <form style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="productName" className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                {...register("name")}
                                required
                            />
                            {errors.name && <div className="text-danger small">{errors.name.message}</div>}
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="productCategory" className="form-label">Category</label>
                            <select
                                className="form-select"
                                id="productCategory"
                                {...register("categoryId", {
                                    setValueAs: value => parseInt(value) || 0
                                })}
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <div className="text-danger small">{errors.categoryId.message}</div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label htmlFor="productPrice" className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="productPrice"
                                {...register("price", {
                                    setValueAs: value => parseInt(value) || 0
                                })

                                }
                                required
                            />
                            {errors.price && <div className="text-danger small">{errors.price.message}</div>}
                        </div>

                        <div className="mb-3 col-md-6">
                            <label htmlFor="productPrice" className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="productPrice"
                                {...register("price", {
                                    setValueAs: value => parseInt(value) || 0
                                })

                                }
                                required
                            />
                            {errors.price && <div className="text-danger small">{errors.price.message}</div>}
                        </div>

                    </div>




                    <div className="mb-3">
                        <label htmlFor="productQuantity" className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="productQuantity"
                            {...register("quantity", {
                                setValueAs: value => parseInt(value) || 0
                            })

                            }
                            required
                        />
                        {errors.quantity && <div className="text-danger small">{errors.quantity.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="productDescription" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="productDescription"
                            rows={3}
                            {...register("description")}
                        ></textarea>
                        {errors.description && <div className="text-danger small">{errors.description.message}</div>}
                    </div>
                    <CKEditor
                        editor={ClassicEditor}
                        data="<p>Hello from CKEditor&nbsp;5!</p>"
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event) => {
                            console.log(event);
                        }}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                            console.log('Focus.', editor);
                        }}
                    />

                    <div className="mb-3">
                        {/* <label htmlFor="formFile" className="form-label">Default file input example</label>
                        <input className="form-control" type="file" id="formFile" onChange={handleFileChange} /> */}
                        <DragFileAndPreview
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
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
                </form>
            </div>
        </>
    );
}

export default AddNewProduct;
