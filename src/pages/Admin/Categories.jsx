import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api";

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function Categories() {
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        is_active: true,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fileInputRef = useRef(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "admin/categories/"
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setCategories(data);
        } catch (err) {
            console.error("Categories error:", err);

            setError(
                err.response?.data?.detail ||
                    err.response?.data?.message ||
                    "Unable to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return categories;
        }

        return categories.filter((category) =>
            `${category.name} ${category.description || ""}`
                .toLowerCase()
                .includes(query)
        );
    }, [categories, search]);

    const stats = useMemo(() => {
        const total = categories.length;

        const active = categories.filter(
            (category) => category.is_active
        ).length;

        const inactive = total - active;

        const products = categories.reduce(
            (sum, category) =>
                sum + Number(category.product_count || 0),
            0
        );

        return {
            total,
            active,
            inactive,
            products,
        };
    }, [categories]);

    const resetForm = () => {
        setForm({
            name: "",
            description: "",
            is_active: true,
        });

        setImageFile(null);
        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);

        setForm({
            name: category.name || "",
            description: category.description || "",
            is_active: category.is_active,
        });

        setImageFile(null);
        setImagePreview(category.image || "");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingCategory(null);
        resetForm();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("Image must be less than 5MB.");
            return;
        }

        setImageFile(file);

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    const uploadCategoryImage = async (categoryId, file) => {
        const formData = new FormData();

        formData.append("category_id", categoryId);
        formData.append("image", file);

        const response = await api.post(
            "admin/categories/image-upload/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Category name is required.");
            return;
        }

        try {
            setSaving(true);

            let category;

            if (editingCategory) {
                /*
                 * Update category information first.
                 */
                const response = await api.patch(
                    `admin/categories/${editingCategory.id}/`,
                    {
                        name: form.name.trim(),
                        description: form.description,
                        is_active: form.is_active,
                    }
                );

                category = response.data;

                /*
                 * Upload a new image only if the
                 * administrator selected one.
                 */
                if (imageFile) {
                    const uploadResponse =
                        await uploadCategoryImage(
                            category.id,
                            imageFile
                        );

                    category = {
                        ...category,
                        image:
                            uploadResponse.category
                                ?.image ||
                            category.image,
                    };
                }

                setCategories((current) =>
                    current.map((item) =>
                        item.id === category.id
                            ? category
                            : item
                    )
                );
            } else {
                /*
                 * Create category first because
                 * image upload requires category_id.
                 */
                const response = await api.post(
                    "admin/categories/",
                    {
                        name: form.name.trim(),
                        description: form.description,
                        is_active: form.is_active,
                    }
                );

                category = response.data;

                /*
                 * Upload image after category creation.
                 */
                if (imageFile) {
                    const uploadResponse =
                        await uploadCategoryImage(
                            category.id,
                            imageFile
                        );

                    category = {
                        ...category,
                        image:
                            uploadResponse.category
                                ?.image ||
                            category.image,
                    };
                }

                setCategories((current) => [
                    category,
                    ...current,
                ]);
            }

            closeModal();
        } catch (err) {
            console.error(
                "Save category error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );

            const data = err.response?.data;

            if (data && typeof data === "object") {
                const firstError = Object.values(data)
                    .flat()
                    .find(Boolean);

                alert(
                    firstError ||
                        "Unable to save category."
                );
            } else {
                alert(
                    "Unable to save category."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (category) => {
        const productCount = Number(
            category.product_count || 0
        );

        if (productCount > 0) {
            alert(
                `Cannot delete "${category.name}" because it has ${productCount} product${
                    productCount === 1
                        ? ""
                        : "s"
                } assigned to it.`
            );

            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(category.id);

            await api.delete(
                `admin/categories/${category.id}/`
            );

            setCategories((current) =>
                current.filter(
                    (item) =>
                        item.id !== category.id
                )
            );
        } catch (err) {
            console.error(
                "Delete category error:",
                err
            );

            alert(
                err.response?.data?.detail ||
                    "Unable to delete category."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const toggleActive = async (category) => {
        try {
            const response = await api.patch(
                `admin/categories/${category.id}/`,
                {
                    is_active:
                        !category.is_active,
                }
            );

            setCategories((current) =>
                current.map((item) =>
                    item.id === category.id
                        ? response.data
                        : item
                )
            );
        } catch (err) {
            console.error(
                "Category status update error:",
                err
            );

            alert(
                "Unable to update category status."
            );
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Loading categories...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-700">
                        Unable to load categories
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={fetchCategories}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Categories
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage product categories for
                        Anova Technologies.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchCategories}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        ↻ Refresh
                    </button>

                    <button
                        onClick={openCreateModal}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        + Add Category
                    </button>
                </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Categories
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {stats.total}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Active
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {stats.active}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Inactive
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-500">
                        {stats.inactive}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Products Assigned
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {stats.products}
                    </p>
                </div>

            </div>

            {/* Search */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search categories..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
            </div>

            {/* Category Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 px-5 py-4">
                    <h2 className="font-semibold text-gray-900">
                        Category List
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Showing{" "}
                        {filteredCategories.length}{" "}
                        of {categories.length}{" "}
                        categories
                    </p>
                </div>

                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">

                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Category
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Description
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                    Products
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Created
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {filteredCategories.map(
                                (category) => (
                                    <tr
                                        key={
                                            category.id
                                        }
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">

                                                {category.image ? (
                                                    <img
                                                        src={
                                                            category.image
                                                        }
                                                        alt={
                                                            category.name
                                                        }
                                                        className="h-11 w-11 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-lg">
                                                        📂
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {
                                                            category.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        /
                                                        {
                                                            category.slug
                                                        }
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        <td className="max-w-xs px-5 py-4">
                                            <p className="truncate text-sm text-gray-600">
                                                {category.description ||
                                                    "No description"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                                {
                                                    category.product_count
                                                }
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    toggleActive(
                                                        category
                                                    )
                                                }
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    category.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {category.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </button>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {formatDate(
                                                category.created_at
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            category
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            category
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        category.id
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingId ===
                                                    category.id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>

                {/* Mobile */}
                <div className="divide-y divide-gray-100 md:hidden">

                    {filteredCategories.map(
                        (category) => (
                            <div
                                key={
                                    category.id
                                }
                                className="space-y-4 p-5"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        {category.image ? (
                                            <img
                                                src={
                                                    category.image
                                                }
                                                alt={
                                                    category.name
                                                }
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                                📂
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {
                                                    category.name
                                                }
                                            </h3>

                                            <p className="text-xs text-gray-500">
                                                /
                                                {
                                                    category.slug
                                                }
                                            </p>
                                        </div>

                                    </div>

                                    <button
                                        onClick={() =>
                                            toggleActive(
                                                category
                                            )
                                        }
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            category.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {category.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </button>

                                </div>

                                <p className="text-sm text-gray-600">
                                    {category.description ||
                                        "No description"}
                                </p>

                                <div className="grid grid-cols-2 gap-4 text-sm">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Products
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {
                                                category.product_count
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Created
                                        </p>

                                        <p className="mt-1 text-gray-900">
                                            {formatDate(
                                                category.created_at
                                            )}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            openEditModal(
                                                category
                                            )
                                        }
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                category
                                            )
                                        }
                                        disabled={
                                            deletingId ===
                                            category.id
                                        }
                                        className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
                                    >
                                        {deletingId ===
                                        category.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>

                                </div>

                            </div>
                        )
                    )}

                </div>

                {filteredCategories.length === 0 && (
                    <div className="px-5 py-16 text-center">
                        <div className="text-4xl">
                            📂
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-900">
                            No categories found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Try another search or create
                            a new category.
                        </p>
                    </div>
                )}

            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

                    <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingCategory
                                        ? "Update category information."
                                        : "Create a new product category."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Laptops"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe this category..."
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Image
                                </label>

                                <div className="rounded-xl border-2 border-dashed border-gray-300 p-4">

                                    {imagePreview ? (
                                        <div className="relative overflow-hidden rounded-lg">
                                            <img
                                                src={
                                                    imagePreview
                                                }
                                                alt="Category preview"
                                                className="h-48 w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(
                                                        null
                                                    );
                                                    setImagePreview(
                                                        ""
                                                    );

                                                    if (
                                                        fileInputRef.current
                                                    ) {
                                                        fileInputRef.current.value =
                                                            "";
                                                    }
                                                }}
                                                className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-sm text-white hover:bg-black"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">

                                            <div className="text-4xl">
                                                🖼️
                                            </div>

                                            <p className="mt-3 text-sm font-medium text-gray-700">
                                                Upload category image
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                PNG, JPG, WEBP up to 5MB
                                            </p>

                                        </div>
                                    )}

                                    <input
                                        ref={
                                            fileInputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
                                    />

                                </div>
                            </div>

                            {/* Active */}
                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        form.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-4 w-4 rounded border-gray-300"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Category is active
                                </span>

                            </label>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                        ? "Update Category"
                                        : "Create Category"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}