// import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
// import { Product, Category, ResponseData } from '../../../BLL/Product';
// import { addProduct, getCategories } from "../../../DAO/ProductApi";
// import ReactLoading from 'react-loading';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ProductRequest, ProductRequestSchema } from "../../../Validation/productRequestValidation";
// import { debounce } from 'lodash';


// const defaultCategory: Category = { id: 0, name: '', description: '' };

// const defaultProduct: ProductRequest = {
//     name: '',
//     price: 0,
//     description: '',
//     categoryId: 0,
//     quantity: 0
// };


// const AddNewProductWithoutHookForm = () => {
//     const [product, setProduct] = useState<ProductRequest>(defaultProduct);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState<Record<string, string | undefined>>({});


//     useEffect(() => {
//         const fetchCategories = async () => {
//             const response = await getCategories();
//             setCategories(response.result);

//         }

//         fetchCategories();
//     }, []);

//     const validateField = useCallback(debounce((field: keyof ProductRequest, value: any) => {
//         const fieldSchema = ProductRequestSchema.pick({ [field]: true } as Partial<Record<keyof ProductRequest, true>>);
//         const result = fieldSchema.safeParse({ [field]: value });

//         setErrors(prevErrors => ({
//             ...prevErrors,
//             [field]: result.success ? undefined : result.error.issues[0].message
//         }));
//     }, 500), []);


//     const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = event.target;
//         const numberFields = ['price', 'categoryId', 'quantity'];
//         const newValue = numberFields.includes(name) ? Number(value) || 0 : value;


//         setProduct(prev => ({
//             ...prev,
//             [name]: newValue
//         }));


//         if (value.trim() === '') {
//             setErrors(prevErrors => ({
//                 ...prevErrors,
//                 [name]: undefined
//             }));
//         } else {
//             validateField(name as keyof ProductRequest, newValue);
//         }
//     };

//     const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
//         const categoryId = Number(event.target.value);
//         validateField('categoryId' as keyof ProductRequest, categoryId);
//         setProduct(prev => ({
//             ...prev,
//             categoryId: categoryId,
//         }));
//     }


//     const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             setSelectedFile(event.target.files[0]);
//         }
//     };
//     const resetFormData = () => {
//         setProduct(defaultProduct);
//         setSelectedFile(null);

//     }

//     const notify = () => toast("Wow so easy!");

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();

//         const result = ProductRequestSchema.safeParse(product);

//         if (!result.success) {
//             const newErrors: Record<string, string> = {};
//             result.error.issues.forEach(issue => {
//                 newErrors[issue.path[0]] = issue.message;
//             });
//             setErrors(newErrors);
//             toast.error("Validation failed! Please check your inputs.");
//             return;
//         } else {
//             setErrors({});
//         }


//         const formData = new FormData();
//         if (!selectedFile) {
//             alert('No file selected!');
//             return;
//         }
//         formData.append('product', JSON.stringify(result.data));
//         formData.append('file', selectedFile);

//         setIsLoading(true);
//         try {
//             const responseData = await addProduct(formData);
//             console.log('Product added:', responseData.result);
//             resetFormData();
//         } catch (error) {
//             console.error('Error adding product:', error);
//         }
//         setIsLoading(false);
//         notify();
//     };
//     return (
//         <>
//             <ToastContainer />
//             <div className="container mt-5">
//                 <h2>Add Product</h2>
//                 <form style={{ position: 'relative' }} onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label htmlFor="productName" className="form-label">Product Name</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="productName"
//                             name="name"
//                             value={product?.name}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.name && <div className="text-danger small">{errors.name}</div>}
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="productName" className="form-label">Category</label>
//                         <select
//                             className="form-select"
//                             name="category"
//                             value={product ? product.categoryId : ''}
//                             onChange={handleSelectChange}

//                         >
//                             <option value="">Select a category</option>
//                             {categories.map(category => (
//                                 <option key={category.id} value={category.id}>
//                                     {category.name}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.categoryId && <div className="text-danger small">{errors.categoryId}</div>}
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="productPrice" className="form-label">Price</label>
//                         <input
//                             type="number"
//                             className="form-control"
//                             id="productPrice"
//                             name="price"
//                             value={product?.price}
//                             onChange={handleChange}
//                             required
//                         />
//                         {errors.price && <div className="text-danger small">{errors.price}</div>}
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="productDescription" className="form-label">Description</label>
//                         <textarea
//                             className="form-control"
//                             id="productDescription"
//                             name="description"
//                             rows={3}
//                             value={product?.description}
//                             onChange={handleChange}
//                         ></textarea>
//                         {errors.description && <div className="text-danger small">{errors.description}</div>}
//                     </div>

//                     <div className="mb-3">
//                         <label htmlFor="formFile" className="form-label">Default file input example</label>
//                         <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
//                     </div>
//                     <button type="submit" className="btn btn-primary">Submit</button>
//                     {isLoading && (
//                         <div style={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             bottom: 0,
//                             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             zIndex: 10
//                         }}>
//                             <ReactLoading type="spin" color="#ffebcd" height={'10%'} width={'10%'} />
//                         </div>
//                     )}
//                 </form >
//             </div >
//         </>
//     );
// }

// export default AddNewProductWithoutHookForm


export const AddNewProductWithoutHookForm = () => {
    return (
        <div>
            AddNewProductWithoutHookForm
        </div>
    )
}
