
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =========================================================
    // IMAGE STATE
    // =========================================================

    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageAltText, setImageAltText] = useState("");
    const [isPrimaryImage, setIsPrimaryImage] = useState(false);
    const [sortOrder, setSortOrder] = useState(0);

    const [replacingImageId, setReplacingImageId] = useState(null);
    const [replacementFiles, setReplacementFiles] = useState({});

    // Delete state
    const [deletingImageId, setDeletingImageId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // PRODUCT FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category_id: "",
        brand_id: "",
        short_description: "",
        description: "",
        highlights: "",
        price: "",
        sale_price: "",
        stock_quantity: "",
        low_stock_threshold: "",
        condition: "new",
        warranty: "",
        weight: "",
        package_length: "",
        package_width: "",
        package_height: "",
        status: "active",
        is_featured: false,
        meta_title: "",
        meta_description: "",
    });

    // =========================================================
    // FETCH DATA
    // =========================================================

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                productResponse,
                categoriesResponse,
                brandsResponse,
            ] = await Promise.all([
                api.get(`admin/products/${id}/`),
                api.get("categories/"),
                api.get("brands/"),
            ]);

            const productData = productResponse.data;

            setProduct(productData);

            setCategories(
                categoriesResponse.data.results ||
                categoriesResponse.data
            );

            setBrands(
                brandsResponse.data.results ||
                brandsResponse.data
            );

            setFormData({
                name: productData.name || "",
                sku: productData.sku || "",

                category_id:
                    productData.category?.id ||
                    productData.category_id ||
                    "",

                brand_id:
                    productData.brand?.id ||
                    productData.brand_id ||
                    "",

                short_description:
                    productData.short_description || "",

                description:
                    productData.description || "",

                highlights:
                    Array.isArray(productData.highlights)
                        ? productData.highlights.join("\n")
                        : "",

                price:
                    productData.price || "",

                sale_price:
                    productData.sale_price || "",

                stock_quantity:
                    productData.stock_quantity ?? "",

                low_stock_threshold:
                    productData.low_stock_threshold ?? "",

                condition:
                    productData.condition || "new",

                warranty:
                    productData.warranty || "",

                weight:
                    productData.weight || "",

                package_length:
                    productData.package_length || "",

                package_width:
                    productData.package_width || "",

                package_height:
                    productData.package_height || "",

                status:
                    productData.status || "active",

                is_featured:
                    productData.is_featured || false,

                meta_title:
                    productData.meta_title || "",

                meta_description:
                    productData.meta_description || "",
            });

        } catch (err) {
            console.error(err);

            setError(
                "Failed to load product information."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // HANDLE FORM CHANGE
    // =========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =========================================================
    // SELECT NEW IMAGE
    // =========================================================

    const handleImageSelect = (e) => {
        const file =
            e.target.files?.[0] || null;

        setSelectedImage(file);

        setError("");
        setSuccess("");
    };

    // =========================================================
    // UPLOAD NEW IMAGE
    // =========================================================

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setError(
                "Please select an image first."
            );

            return;
        }

        if (
            selectedImage.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Image size cannot exceed 5MB."
            );

            return;
        }

        try {
            setUploadingImage(true);
            setError("");
            setSuccess("");

            const data = new FormData();

            data.append(
                "image",
                selectedImage
            );

            data.append(
                "alt_text",
                imageAltText ||
                product?.name ||
                ""
            );

            data.append(
                "is_primary",
                isPrimaryImage
                    ? "true"
                    : "false"
            );

            data.append(
                "sort_order",
                String(sortOrder)
            );

            const response = await api.post(
                `admin/products/${id}/images/upload/`,
                data
            );

            const uploadedImage =
                response.data.image;

            setProduct((prev) => {
                if (!prev) {
                    return prev;
                }

                let updatedImages =
                    prev.images || [];

                if (
                    uploadedImage.is_primary
                ) {
                    updatedImages =
                        updatedImages.map(
                            (image) => ({
                                ...image,
                                is_primary: false,
                            })
                        );
                }

                return {
                    ...prev,

                    images: [
                        ...updatedImages,
                        uploadedImage,
                    ],
                };
            });

            // Reset upload fields
            setSelectedImage(null);
            setImageAltText("");
            setIsPrimaryImage(false);
            setSortOrder(0);

            const fileInput =
                document.getElementById(
                    "product-image-input"
                );

            if (fileInput) {
                fileInput.value = "";
            }

            setSuccess(
                "Product image uploaded successfully."
            );

        } catch (err) {
            console.error(
                "IMAGE UPLOAD ERROR:",
                err
            );

            console.error(
                "SERVER RESPONSE:",
                err.response?.data
            );

            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                JSON.stringify(
                    err.response?.data
                ) ||
                "Failed to upload product image."
            );

        } finally {
            setUploadingImage(false);
        }
    };

    // =========================================================
    // REPLACE EXISTING IMAGE
    // =========================================================

    const handleReplaceImage = async (
        imageId,
        file = null
    ) => {
        const replacementFile =
            file ||
            replacementFiles[imageId];

        if (!replacementFile) {
            setError(
                "Please select a replacement image."
            );

            return;
        }

        if (
            replacementFile.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Image size cannot exceed 5MB."
            );

            return;
        }

        try {
            setReplacingImageId(imageId);

            setError("");
            setSuccess("");

            const data = new FormData();

            data.append(
                "image",
                replacementFile
            );

            const response = await api.patch(
                `admin/products/${id}/images/${imageId}/replace/`,
                data
            );

            const replacedImage =
                response.data.image;

            setProduct((prev) => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,

                    images:
                        (prev.images || []).map(
                            (image) =>
                                image.id === imageId
                                    ? replacedImage
                                    : image
                        ),
                };
            });

            setReplacementFiles((prev) => {
                const updated = {
                    ...prev,
                };

                delete updated[imageId];

                return updated;
            });

            const fileInput =
                document.getElementById(
                    `replace-image-${imageId}`
                );

            if (fileInput) {
                fileInput.value = "";
            }

            setSuccess(
                "Product image replaced successfully."
            );

        } catch (err) {
            console.error(
                "REPLACE IMAGE ERROR:",
                err
            );

            console.error(
                "SERVER RESPONSE:",
                err.response?.data
            );

            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                JSON.stringify(
                    err.response?.data
                ) ||
                "Failed to replace product image."
            );

        } finally {
            setReplacingImageId(null);
        }
    };

    // =========================================================
    // DELETE EXISTING IMAGE
    // =========================================================

    const handleDeleteImage = async (
        imageId
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this image?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingImageId(imageId);

            setError("");
            setSuccess("");

            await api.delete(
                `admin/products/${id}/images/${imageId}/`
            );

            setProduct((prev) => {
                if (!prev) {
                    return prev;
                }

                return {
                    ...prev,

                    images:
                        (prev.images || []).filter(
                            (image) =>
                                image.id !== imageId
                        ),
                };
            });

            setSuccess(
                "Product image deleted successfully."
            );

        } catch (err) {
            console.error(
                "DELETE IMAGE ERROR:",
                err
            );

            console.error(
                "SERVER RESPONSE:",
                err.response?.data
            );

            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                JSON.stringify(
                    err.response?.data
                ) ||
                "Failed to delete product image."
            );

        } finally {
            setDeletingImageId(null);
        }
    };

    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            setError("");
            setSuccess("");

            const payload = {
                name: formData.name,

                sku: formData.sku,

                category_id:
                    formData.category_id
                        ? Number(
                            formData.category_id
                        )
                        : null,

                brand_id:
                    formData.brand_id
                        ? Number(
                            formData.brand_id
                        )
                        : null,

                short_description:
                    formData.short_description,

                description:
                    formData.description,

                highlights:
                    formData.highlights
                        .split("\n")
                        .map(
                            (item) =>
                                item.trim()
                        )
                        .filter(Boolean),

                price:
                    formData.price
                        ? Number(
                            formData.price
                        )
                        : null,

                sale_price:
                    formData.sale_price
                        ? Number(
                            formData.sale_price
                        )
                        : null,

                stock_quantity:
                    formData.stock_quantity !== ""
                        ? Number(
                            formData.stock_quantity
                        )
                        : 0,

                low_stock_threshold:
                    formData.low_stock_threshold !== ""
                        ? Number(
                            formData.low_stock_threshold
                        )
                        : 0,

                condition:
                    formData.condition,

                warranty:
                    formData.warranty,

                weight:
                    formData.weight !== ""
                        ? Number(
                            formData.weight
                        )
                        : null,

                package_length:
                    formData.package_length !== ""
                        ? Number(
                            formData.package_length
                        )
                        : null,

                package_width:
                    formData.package_width !== ""
                        ? Number(
                            formData.package_width
                        )
                        : null,

                package_height:
                    formData.package_height !== ""
                        ? Number(
                            formData.package_height
                        )
                        : null,

                status:
                    formData.status,

                is_featured:
                    formData.is_featured,

                meta_title:
                    formData.meta_title,

                meta_description:
                    formData.meta_description,
            };

            await api.patch(
                `admin/products/${id}/`,
                payload
            );

            setSuccess(
                "Product updated successfully. Redirecting..."
            );

            setTimeout(() => {
                navigate(
                    `/admin/products/${id}`
                );
            }, 2000);

        } catch (err) {
            console.error(err);

            if (err.response?.data) {
                const data =
                    err.response.data;

                if (
                    typeof data === "object" &&
                    data !== null
                ) {
                    const messages =
                        Object.entries(data)
                            .map(
                                ([
                                    field,
                                    message,
                                ]) => {
                                    const text =
                                        Array.isArray(
                                            message
                                        )
                                            ? message.join(
                                                ", "
                                            )
                                            : message;

                                    return `${field}: ${text}`;
                                }
                            )
                            .join(" ");

                    setError(messages);

                } else {
                    setError(
                        "Failed to update product."
                    );
                }

            } else {
                setError(
                    "Failed to update product."
                );
            }

        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        );
    }

    // =========================================================
    // ERROR WITHOUT PRODUCT
    // =========================================================

    if (error && !product) {
        return (
            <div className="p-6">
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </div>

                <Link
                    to="/admin/products"
                    className="mt-4 inline-block text-sm font-medium text-gray-700 hover:underline"
                >
                    ← Back to Products
                </Link>
            </div>
        );
    }

    // =========================================================
    // MAIN UI
    // =========================================================

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* =================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <Link
                        to={`/admin/products/${id}`}
                        className="text-sm text-gray-500 transition hover:text-gray-900"
                    >
                        ← Back to Product
                    </Link>

                    <h1 className="mt-2 text-2xl font-bold text-gray-900">
                        Edit Product
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Update {product?.name}
                    </p>
                </div>

                <Link
                    to={`/admin/products/${id}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    View Product
                </Link>

            </div>

            {/* =================================================
                ALERTS
            ================================================== */}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    ✓ {success}
                </div>
            )}

            {error && product && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* =================================================
                MAIN PRODUCT FORM
            ================================================== */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Product Name */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* SKU */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                SKU
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={
                                    formData.sku
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Condition */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Condition
                            </label>

                            <select
                                name="condition"
                                value={
                                    formData.condition
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            >
                                <option value="new">
                                    New
                                </option>

                                <option value="used">
                                    Used
                                </option>

                                <option value="refurbished">
                                    Refurbished
                                </option>
                            </select>

                        </div>

                        {/* Category */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Category
                            </label>

                            <select
                                name="category_id"
                                value={
                                    formData.category_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            >

                                <option value="">
                                    Select Category
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* Brand */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Brand
                            </label>

                            <select
                                name="brand_id"
                                value={
                                    formData.brand_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            >

                                <option value="">
                                    Select Brand
                                </option>

                                {brands.map(
                                    (brand) => (
                                        <option
                                            key={
                                                brand.id
                                            }
                                            value={
                                                brand.id
                                            }
                                        >
                                            {
                                                brand.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        {/* Short Description */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Short Description
                            </label>

                            <textarea
                                name="short_description"
                                value={
                                    formData.short_description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="3"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Description */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="7"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                    </div>
                </div>

                {/* =================================================
                    PRODUCT IMAGES
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-5">

                        <h2 className="text-lg font-semibold text-gray-900">
                            Product Images
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Upload and manage images for this product.
                            Maximum file size is 5MB.
                        </p>

                    </div>

                    {/* =================================================
                        EXISTING IMAGES
                    ================================================== */}

                    {product?.images?.length > 0 ? (

                        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                            {product.images.map(
                                (image) => (

                                    <div
                                        key={image.id}
                                        className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                    >

                                        {/* Image */}

                                        <div className="relative">

                                            <img
                                                src={
                                                    image.image_url
                                                }
                                                alt={
                                                    image.alt_text ||
                                                    product.name
                                                }
                                                className="h-40 w-full bg-white object-contain"
                                            />

                                            {image.is_primary && (
                                                <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold text-white">
                                                    Primary
                                                </span>
                                            )}

                                        </div>

                                        {/* Image Details */}

                                        <div className="p-3">

                                            <p className="truncate text-xs text-gray-500">
                                                {image.alt_text ||
                                                    "Product image"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                Order:{" "}
                                                {
                                                    image.sort_order
                                                }
                                            </p>

                                            {/* =================================================
                                                IMAGE CONTROLS
                                            ================================================== */}

                                            <div className="mt-3 space-y-2">

                                                {/* Replace File */}

                                                <input
                                                    id={`replace-image-${image.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={
                                                        replacingImageId ===
                                                        image.id ||
                                                        deletingImageId ===
                                                        image.id
                                                    }
                                                    onChange={(e) => {

                                                        const file =
                                                            e.target.files?.[0] ||
                                                            null;

                                                        if (!file) {
                                                            return;
                                                        }

                                                        setReplacementFiles(
                                                            (prev) => ({
                                                                ...prev,
                                                                [image.id]:
                                                                    file,
                                                            })
                                                        );

                                                        setError("");
                                                        setSuccess("");

                                                        // Immediately replace
                                                        // selected image.
                                                        handleReplaceImage(
                                                            image.id,
                                                            file
                                                        );

                                                    }}
                                                    className="block w-full text-xs text-gray-600"
                                                />

                                                {/* Replace Button */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleReplaceImage(
                                                            image.id
                                                        )
                                                    }
                                                    disabled={
                                                        replacingImageId ===
                                                        image.id ||
                                                        deletingImageId ===
                                                        image.id
                                                    }
                                                    className="w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {replacingImageId ===
                                                    image.id
                                                        ? "Replacing..."
                                                        : "Replace Image"}
                                                </button>

                                                {/* Delete Button */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteImage(
                                                            image.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingImageId ===
                                                        image.id ||
                                                        replacingImageId ===
                                                        image.id
                                                    }
                                                    className="w-full rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {deletingImageId ===
                                                    image.id
                                                        ? "Deleting..."
                                                        : "Delete Image"}
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="mb-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">

                            <p className="text-sm text-gray-500">
                                No product images yet.
                            </p>

                        </div>

                    )}

                    {/* =================================================
                        UPLOAD NEW IMAGE
                    ================================================== */}

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

                        <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            Upload New Image
                        </h3>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Image */}

                            <div className="md:col-span-2">

                                <label
                                    htmlFor="product-image-input"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Image
                                </label>

                                <input
                                    id="product-image-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageSelect
                                    }
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
                                />

                                <p className="mt-1 text-xs text-gray-500">
                                    JPG, PNG, WEBP or other supported image.
                                    Maximum 5MB.
                                </p>

                            </div>

                            {/* Selected File */}

                            {selectedImage && (

                                <div className="rounded-lg border border-gray-200 bg-white p-3 md:col-span-2">

                                    <p className="text-sm font-medium text-gray-700">
                                        Selected file:
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {
                                            selectedImage.name
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        {(
                                            selectedImage.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>

                                </div>

                            )}

                            {/* Alt Text */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Alt Text
                                </label>

                                <input
                                    type="text"
                                    value={
                                        imageAltText
                                    }
                                    onChange={(e) =>
                                        setImageAltText(
                                            e.target.value
                                        )
                                    }
                                    placeholder={
                                        product?.name ||
                                        "Product image"
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                                />

                            </div>

                            {/* Sort Order */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Sort Order
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        sortOrder
                                    }
                                    onChange={(e) =>
                                        setSortOrder(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                                />

                            </div>

                            {/* Primary Image */}

                            <div className="md:col-span-2">

                                <label className="flex cursor-pointer items-center gap-3">

                                    <input
                                        type="checkbox"
                                        checked={
                                            isPrimaryImage
                                        }
                                        onChange={(e) =>
                                            setIsPrimaryImage(
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 rounded border-gray-300"
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                        Set as primary image
                                    </span>

                                </label>

                            </div>

                        </div>

                        {/* Upload Status */}

                        {uploadingImage && (

                            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                Uploading image to Cloudinary...
                            </div>

                        )}

                        {/* Upload Error */}

                        {error && (

                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>

                        )}

                        {/* Upload Success */}

                        {success && (

                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                ✓ {success}
                            </div>

                        )}

                        {/* Upload Button */}

                        <div className="mt-5 flex justify-end">

                            <button
                                type="button"
                                onClick={
                                    handleImageUpload
                                }
                                disabled={
                                    uploadingImage ||
                                    !selectedImage
                                }
                                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploadingImage
                                    ? "Uploading..."
                                    : "Upload Image"}
                            </button>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PRICING & INVENTORY
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Pricing & Inventory
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Price */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Price (KSh)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Sale Price */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Sale Price (KSh)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="sale_price"
                                value={
                                    formData.sale_price
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Stock */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Stock Quantity
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="stock_quantity"
                                value={
                                    formData.stock_quantity
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Low Stock */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Low Stock Threshold
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="low_stock_threshold"
                                value={
                                    formData.low_stock_threshold
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PACKAGE INFORMATION
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Package Information
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Weight */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Weight (kg)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="weight"
                                value={
                                    formData.weight
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Length */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Length
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="package_length"
                                value={
                                    formData.package_length
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Width */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Width
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="package_width"
                                value={
                                    formData.package_width
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Height */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Height
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="package_height"
                                value={
                                    formData.package_height
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                    </div>

                </div>

                {/* =================================================
                    WARRANTY
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Warranty
                    </h2>

                    <textarea
                        name="warranty"
                        value={
                            formData.warranty
                        }
                        onChange={
                            handleChange
                        }
                        rows="4"
                        placeholder="Enter warranty information..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                    />

                </div>

                {/* =================================================
                    HIGHLIGHTS
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-2 text-lg font-semibold text-gray-900">
                        Highlights
                    </h2>

                    <p className="mb-4 text-sm text-gray-500">
                        Enter one highlight per line.
                    </p>

                    <textarea
                        name="highlights"
                        value={
                            formData.highlights
                        }
                        onChange={
                            handleChange
                        }
                        rows="6"
                        placeholder={`Intel Core i5 processor
8GB RAM
256GB SSD
Full HD display`}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                    />

                </div>

                {/* =================================================
                    STATUS
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Product Status
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Status */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            >

                                <option value="active">
                                    Active
                                </option>

                                <option value="draft">
                                    Draft
                                </option>

                                <option value="out_of_stock">
                                    Out of Stock
                                </option>

                                <option value="archived">
                                    Archived
                                </option>

                            </select>

                        </div>

                        {/* Featured */}

                        <div className="flex items-center">

                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={
                                        formData.is_featured
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Featured Product
                                </span>

                            </label>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    SEO
                ================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        SEO Information
                    </h2>

                    <div className="space-y-5">

                        {/* Meta Title */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Meta Title
                            </label>

                            <input
                                type="text"
                                name="meta_title"
                                value={
                                    formData.meta_title
                                }
                                onChange={
                                    handleChange
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                        {/* Meta Description */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Meta Description
                            </label>

                            <textarea
                                name="meta_description"
                                value={
                                    formData.meta_description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-gray-500"
                            />

                        </div>

                    </div>

                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        to={`/admin/products/${id}`}
                        className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditProduct;
