import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);

    const [form, setForm] = useState({
        name: "",
        is_active: true,
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const fileInputRef = useRef(null);

    // --------------------------------------------------
    // FETCH BRANDS
    // --------------------------------------------------

    const fetchBrands = async () => {
        try {
            setLoading(true);

            const response = await api.get("brands/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setBrands(data);
        } catch (error) {
            console.error("Failed to fetch brands:", error);

            alert(
                error.response?.data?.detail ||
                    "Failed to load brands."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // --------------------------------------------------
    // STATISTICS
    // --------------------------------------------------

    const stats = useMemo(() => {
        const total = brands.length;

        const active = brands.filter(
            (brand) => brand.is_active
        ).length;

        const inactive = brands.filter(
            (brand) => !brand.is_active
        ).length;

        const products = brands.reduce(
            (sum, brand) =>
                sum + Number(brand.product_count || 0),
            0
        );

        return {
            total,
            active,
            inactive,
            products,
        };
    }, [brands]);

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredBrands = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return brands;
        }

        return brands.filter((brand) =>
            brand.name.toLowerCase().includes(query)
        );
    }, [brands, search]);

    // --------------------------------------------------
    // CREATE BRAND
    // --------------------------------------------------

    const openCreateModal = () => {
        setEditingBrand(null);

        setForm({
            name: "",
            is_active: true,
        });

        setLogoFile(null);
        setLogoPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setShowModal(true);
    };

    // --------------------------------------------------
    // EDIT BRAND
    // --------------------------------------------------

    const openEditModal = (brand) => {
        setEditingBrand(brand);

        setForm({
            name: brand.name || "",
            is_active: brand.is_active,
        });

        setLogoFile(null);
        setLogoPreview(brand.logo || null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setShowModal(true);
    };

    // --------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------

    const closeModal = () => {
        if (saving || uploadingLogo) {
            return;
        }

        setShowModal(false);
        setEditingBrand(null);
        setLogoFile(null);
        setLogoPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --------------------------------------------------
    // FORM CHANGE
    // --------------------------------------------------

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // --------------------------------------------------
    // LOGO CHANGE
    // --------------------------------------------------

    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");

            event.target.value = "";

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Logo must be less than 5MB.");

            event.target.value = "";

            return;
        }

        setLogoFile(file);

        const previewUrl = URL.createObjectURL(file);

        setLogoPreview(previewUrl);
    };

    // --------------------------------------------------
    // REMOVE LOGO
    // --------------------------------------------------

    const removeLogoSelection = () => {
        setLogoFile(null);

        if (editingBrand?.logo) {
            setLogoPreview(editingBrand.logo);
        } else {
            setLogoPreview(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --------------------------------------------------
    // SAVE BRAND
    // --------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            alert("Brand name is required.");
            return;
        }

        try {
            setSaving(true);

            let brand;

            // CREATE
            if (!editingBrand) {
                const response = await api.post(
                    "brands/",
                    {
                        name: form.name.trim(),
                        is_active: form.is_active,
                    }
                );

                brand = response.data;
            }

            // UPDATE
            else {
                const response = await api.patch(
                    `brands/${editingBrand.id}/`,
                    {
                        name: form.name.trim(),
                        is_active: form.is_active,
                    }
                );

                brand = response.data;
            }

            // UPLOAD LOGO
            if (logoFile) {
                setUploadingLogo(true);

                const formData = new FormData();

                formData.append(
                    "brand_id",
                    brand.id
                );

                formData.append(
                    "logo",
                    logoFile
                );

                await api.post(
                    "brands/logo-upload/",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                setUploadingLogo(false);
            }

            await fetchBrands();

            closeModal();
        } catch (error) {
            console.error(
                "Failed to save brand:",
                error
            );

            const message =
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Failed to save brand.";

            alert(message);
        } finally {
            setSaving(false);
            setUploadingLogo(false);
        }
    };

    // --------------------------------------------------
    // TOGGLE STATUS
    // --------------------------------------------------

    const toggleStatus = async (brand) => {
        try {
            const response = await api.patch(
                `brands/${brand.id}/`,
                {
                    is_active: !brand.is_active,
                }
            );

            setBrands((previous) =>
                previous.map((item) =>
                    item.id === brand.id
                        ? response.data
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Failed to update brand status:",
                error
            );

            alert(
                error.response?.data?.detail ||
                    "Failed to update brand status."
            );
        }
    };

    // --------------------------------------------------
    // DELETE BRAND
    // --------------------------------------------------

    const deleteBrand = async (brand) => {
        const productCount = Number(
            brand.product_count || 0
        );

        if (productCount > 0) {
            alert(
                `You cannot delete "${brand.name}" because it has ${productCount} product(s) assigned to it.`
            );

            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${brand.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `brands/${brand.id}/`
            );

            setBrands((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== brand.id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete brand:",
                error
            );

            alert(
                error.response?.data?.detail ||
                    "Failed to delete brand."
            );
        }
    };

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">

                            <Link
                                to="/admin/dashboard"
                                className="hover:text-gray-900"
                            >
                                Dashboard
                            </Link>

                            <span>/</span>

                            <span className="text-gray-900">
                                Brands
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Brands
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage product brands and their logos.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        <span className="text-lg">
                            +
                        </span>

                        Add Brand
                    </button>

                </div>

                {/* STATS */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Brands"
                        value={stats.total}
                        icon="🏷️"
                    />

                    <StatCard
                        title="Active"
                        value={stats.active}
                        icon="✓"
                    />

                    <StatCard
                        title="Inactive"
                        value={stats.inactive}
                        icon="○"
                    />

                    <StatCard
                        title="Products Assigned"
                        value={stats.products}
                        icon="📦"
                    />

                </div>

                {/* SEARCH */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                    <div className="relative">

                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            🔍
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search brands..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                        />

                    </div>

                </div>

                {/* BRANDS */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    {loading ? (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <p className="text-sm text-gray-500">
                                Loading brands...
                            </p>
                        </div>
                    ) : filteredBrands.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                            <div className="mb-4 text-5xl">
                                🏷️
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                No brands found
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {search
                                    ? "Try a different search."
                                    : "Create your first brand to get started."}
                            </p>

                            {!search && (
                                <button
                                    onClick={
                                        openCreateModal
                                    }
                                    className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                                >
                                    Add Brand
                                </button>
                            )}

                        </div>
                    ) : (
                        <>
                            {/* DESKTOP */}
                            <div className="hidden overflow-x-auto md:block">

                                <table className="w-full">

                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

                                            <th className="px-6 py-4">
                                                Brand
                                            </th>

                                            <th className="px-6 py-4">
                                                Products
                                            </th>

                                            <th className="px-6 py-4">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-right">
                                                Actions
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">

                                        {filteredBrands.map(
                                            (brand) => (
                                                <tr
                                                    key={
                                                        brand.id
                                                    }
                                                    className="transition hover:bg-gray-50"
                                                >

                                                    {/* CLICKABLE BRAND */}
                                                    <td className="px-6 py-4">

                                                        <Link
                                                            to={`/admin/brands/${brand.id}`}
                                                            className="group flex items-center gap-4"
                                                        >
                                                            <BrandLogo
                                                                brand={
                                                                    brand
                                                                }
                                                            />

                                                            <div>
                                                                <div className="font-semibold text-gray-900 transition group-hover:text-gray-600">
                                                                    {
                                                                        brand.name
                                                                    }
                                                                </div>

                                                                <div className="text-xs text-gray-400">
                                                                    /
                                                                    {
                                                                        brand.slug
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>

                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {
                                                            brand.product_count
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <StatusBadge
                                                            active={
                                                                brand.is_active
                                                            }
                                                        />

                                                    </td>

                                                    <td className="px-6 py-4">

                                                        <div className="flex justify-end gap-2">

                                                            <button
                                                                onClick={() =>
                                                                    toggleStatus(
                                                                        brand
                                                                    )
                                                                }
                                                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                                            >
                                                                {brand.is_active
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        brand
                                                                    )
                                                                }
                                                                className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    deleteBrand(
                                                                        brand
                                                                    )
                                                                }
                                                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {/* MOBILE */}
                            <div className="divide-y divide-gray-100 md:hidden">

                                {filteredBrands.map(
                                    (brand) => (
                                        <div
                                            key={
                                                brand.id
                                            }
                                            className="p-4"
                                        >

                                            <div className="flex items-start justify-between gap-4">

                                                {/* CLICKABLE BRAND */}
                                                <Link
                                                    to={`/admin/brands/${brand.id}`}
                                                    className="flex min-w-0 items-center gap-3"
                                                >
                                                    <BrandLogo
                                                        brand={
                                                            brand
                                                        }
                                                    />

                                                    <div className="min-w-0">

                                                        <h3 className="truncate font-semibold text-gray-900 hover:text-gray-600">
                                                            {
                                                                brand.name
                                                            }
                                                        </h3>

                                                        <p className="truncate text-xs text-gray-400">
                                                            /
                                                            {
                                                                brand.slug
                                                            }
                                                        </p>

                                                    </div>
                                                </Link>

                                                <StatusBadge
                                                    active={
                                                        brand.is_active
                                                    }
                                                />

                                            </div>

                                            <div className="mt-4 flex items-center justify-between text-sm">

                                                <span className="text-gray-500">
                                                    Products
                                                </span>

                                                <span className="font-semibold text-gray-900">
                                                    {
                                                        brand.product_count
                                                    }
                                                </span>

                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2">

                                                <button
                                                    onClick={() =>
                                                        toggleStatus(
                                                            brand
                                                        )
                                                    }
                                                    className="rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                                >
                                                    {brand.is_active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            brand
                                                        )
                                                    }
                                                    className="rounded-lg bg-gray-900 px-2 py-2 text-xs font-medium text-white hover:bg-gray-800"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteBrand(
                                                            brand
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        </>
                    )}

                </div>

            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingBrand
                                        ? "Edit Brand"
                                        : "Add Brand"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editingBrand
                                        ? "Update brand information."
                                        : "Create a new product brand."}
                                </p>

                            </div>

                            <button
                                onClick={closeModal}
                                disabled={
                                    saving ||
                                    uploadingLogo
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                            >
                                ✕
                            </button>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-6"
                        >

                            {/* LOGO */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-900">
                                    Brand Logo
                                </label>

                                <div className="flex items-center gap-4">

                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                                        {logoPreview ? (
                                            <img
                                                src={
                                                    logoPreview
                                                }
                                                alt="Brand logo preview"
                                                className="h-full w-full object-contain p-2"
                                            />
                                        ) : (
                                            <span className="text-3xl">
                                                🏷️
                                            </span>
                                        )}

                                    </div>

                                    <div className="flex-1">

                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            type="file"
                                            accept="image/*"
                                            onChange={
                                                handleLogoChange
                                            }
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                                        />

                                        <p className="mt-2 text-xs text-gray-400">
                                            JPG, PNG, WEBP.
                                            Maximum 5MB.
                                        </p>

                                        {logoFile && (
                                            <button
                                                type="button"
                                                onClick={
                                                    removeLogoSelection
                                                }
                                                className="mt-2 text-xs font-medium text-red-600 hover:underline"
                                            >
                                                Remove selected logo
                                            </button>
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* NAME */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-900">
                                    Brand Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. HP"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                                    required
                                />

                            </div>

                            {/* ACTIVE */}
                            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4">

                                <div>

                                    <div className="font-semibold text-gray-900">
                                        Active Brand
                                    </div>

                                    <div className="mt-1 text-xs text-gray-500">
                                        Active brands can be assigned
                                        to products.
                                    </div>

                                </div>

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        form.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-5 w-5 rounded border-gray-300"
                                />

                            </label>

                            {/* ACTIONS */}
                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={
                                        saving ||
                                        uploadingLogo
                                    }
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving ||
                                        uploadingLogo
                                    }
                                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {uploadingLogo
                                        ? "Uploading logo..."
                                        : saving
                                        ? "Saving..."
                                        : editingBrand
                                        ? "Save Changes"
                                        : "Create Brand"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </div>
    );
}

// ==================================================
// STAT CARD
// ==================================================

function StatCard({
    title,
    value,
    icon,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg">
                    {icon}
                </div>

            </div>

        </div>
    );
}

// ==================================================
// BRAND LOGO
// ==================================================

function BrandLogo({ brand }) {
    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

            {brand.logo ? (
                <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-full w-full object-contain p-1"
                />
            ) : (
                <span className="text-xl">
                    🏷️
                </span>
            )}

        </div>
    );
}

// ==================================================
// STATUS BADGE
// ==================================================

function StatusBadge({ active }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
            }`}
        >
            {active
                ? "Active"
                : "Inactive"}
        </span>
    );
}