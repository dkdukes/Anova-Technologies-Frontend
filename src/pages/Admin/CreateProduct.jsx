import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function CreateProduct() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const descriptionEditorRef = useRef(null);
    const descriptionImageInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [images, setImages] = useState([]);

    const [form, setForm] = useState({
        name: "",
        category_id: "",
        brand_id: "",
        color: "",
        weight: "",

        short_description: "",
        description: "",
        highlights: "",

        variation: "",
        sku: "",
        stock_quantity: "",
        price: "",
        sale_price: "",
        sale_start_date: "",
        sale_end_date: "",

        model: "",
        cpu_cores: "",
        cpu_speed: "",
        display_size: "",
        drive_type: "",
        graphics_type: "",
        storage_capacity: "",
        system_memory: "",
        cpu_manufacturer: "",

        warranty: "",

        condition: "new",
        low_stock_threshold: "3",
        status: "draft",
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                setError("");

                const [categoriesResponse, brandsResponse] = await Promise.all([
                    api.get("categories/"),
                    api.get("brands/"),
                ]);

                setCategories(
                    categoriesResponse.data.results || categoriesResponse.data
                );

                setBrands(
                    brandsResponse.data.results || brandsResponse.data
                );
            } catch (err) {
                console.error(err);
                setError(
                    "Unable to load categories and brands. Please refresh the page."
                );
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageSelect = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        if (!selectedFiles.length) return;

        setError("");

        const remainingSlots = MAX_IMAGES - images.length;

        if (remainingSlots <= 0) {
            setError(`You can upload a maximum of ${MAX_IMAGES} images.`);
            e.target.value = "";
            return;
        }

        const filesToAdd = selectedFiles.slice(0, remainingSlots);
        const validImages = [];

        for (const file of filesToAdd) {
            if (!file.type.startsWith("image/")) {
                setError(`${file.name} is not a valid image.`);
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                setError(`${file.name} is larger than 5MB.`);
                continue;
            }

            const preview = URL.createObjectURL(file);

            validImages.push({
                file,
                preview,
                isPrimary:
                    images.length === 0 && validImages.length === 0,
            });
        }

        setImages((previous) => [...previous, ...validImages]);
        e.target.value = "";
    };

    const removeImage = (index) => {
        setImages((previous) => {
            const imageToRemove = previous[index];

            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }

            const updated = previous.filter(
                (_, imageIndex) => imageIndex !== index
            );

            if (
                updated.length > 0 &&
                !updated.some((image) => image.isPrimary)
            ) {
                updated[0].isPrimary = true;
            }

            return updated;
        });
    };

    const setPrimaryImage = (index) => {
        setImages((previous) =>
            previous.map((image, imageIndex) => ({
                ...image,
                isPrimary: imageIndex === index,
            }))
        );
    };



    const updateDescriptionFromEditor = () => {
        const editor = descriptionEditorRef.current;

        if (!editor) return;

        const html = editor.innerHTML;

        setForm((previous) => ({
            ...previous,
            description: html,
        }));
    };

    const handleDescriptionInput = (e) => {
        // Capture innerHTML before React's state updater runs.
        // Do not access e.currentTarget inside setForm's callback.
        const html = e.currentTarget?.innerHTML ?? "";

        setForm((previous) => ({
            ...previous,
            description: html,
        }));
    };

    const formatDescription = (command, value = null) => {
        const editor = descriptionEditorRef.current;

        if (!editor) return;

        editor.focus();
        document.execCommand(command, false, value);

        updateDescriptionFromEditor();
    };

    const resizeDescriptionImage = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const image = new Image();

                image.onload = () => {
                    const maxWidth = 1200;
                    const scale = Math.min(1, maxWidth / image.width);
                    const canvas = document.createElement("canvas");

                    canvas.width = Math.round(image.width * scale);
                    canvas.height = Math.round(image.height * scale);

                    const context = canvas.getContext("2d");
                    context.drawImage(
                        image,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    resolve(canvas.toDataURL("image/jpeg", 0.8));
                };

                image.onerror = reject;
                image.src = event.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleDescriptionImageSelect = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image for the product description.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Description images must be 5MB or smaller.");
            return;
        }

        try {
            setError("");

            const imageData = await resizeDescriptionImage(file);
            const imageHtml =
                `<p><img src="${imageData}" alt="${file.name.replace(/"/g, "&quot;")}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" /></p><p><br></p>`;

            const editor = descriptionEditorRef.current;

            if (!editor) {
                setError("The description editor is not available. Please try again.");
                return;
            }

            editor.focus();
            document.execCommand("insertHTML", false, imageHtml);

            updateDescriptionFromEditor();
        } catch (error) {
            console.error("Description image error:", error);
            setError("Unable to insert the description image.");
        }
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            return "Product name is required.";
        }

        if (!form.category_id) {
            return "Please select a category.";
        }

        if (!form.brand_id) {
            return "Please select a brand.";
        }

        if (!form.sku.trim()) {
            return "SKU is required.";
        }

        if (!form.price) {
            return "Product price is required.";
        }

        if (Number(form.price) < 0) {
            return "Price cannot be negative.";
        }

        if (
            form.sale_price &&
            Number(form.sale_price) >= Number(form.price)
        ) {
            return "Sale price must be lower than the regular price.";
        }

        if (form.sale_start_date && !form.sale_price) {
            return "Enter a sale price when using a sale start date.";
        }

        if (form.sale_end_date && !form.sale_price) {
            return "Enter a sale price when using a sale end date.";
        }

        if (
            form.sale_start_date &&
            form.sale_end_date &&
            new Date(form.sale_end_date) <= new Date(form.sale_start_date)
        ) {
            return "Sale end date must be later than the sale start date.";
        }

        if (form.stock_quantity === "") {
            return "Stock quantity is required.";
        }

        if (Number(form.stock_quantity) < 0) {
            return "Stock quantity cannot be negative.";
        }

        if (form.cpu_cores && Number(form.cpu_cores) < 0) {
            return "CPU cores cannot be negative.";
        }

        if (form.cpu_speed && Number(form.cpu_speed) < 0) {
            return "CPU speed cannot be negative.";
        }

        if (form.display_size && Number(form.display_size) < 0) {
            return "Display size cannot be negative.";
        }

        if (form.weight && Number(form.weight) < 0) {
            return "Weight cannot be negative.";
        }

        if (images.length === 0) {
            return "Please upload at least one product image.";
        }

        return null;
    };

    const uploadImage = async (image, productId, sortOrder) => {
        const formData = new FormData();

        formData.append("image", image.file);
        formData.append("alt_text", form.name);
        formData.append("is_primary", image.isPrimary);
        formData.append("sort_order", sortOrder);

        const response = await api.post(
            `admin/products/${productId}/images/upload/`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    };

    const handleSubmit = async (e, publishStatus = null) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            setSaving(true);

            const cleanedHighlights = form.highlights
                .split("\n")
                .map((highlight) => highlight.trim())
                .filter(Boolean);

            const productPayload = {
                name: form.name.trim(),
                category_id: Number(form.category_id),
                brand_id: Number(form.brand_id),
                color: form.color.trim(),
                weight: form.weight ? Number(form.weight) : null,

                short_description: form.short_description.trim(),
                description: form.description.trim(),
                highlights: cleanedHighlights,

                variation: form.variation.trim(),
                sku: form.sku.trim(),
                stock_quantity: Number(form.stock_quantity),
                price: Number(form.price).toFixed(2),
                sale_price: form.sale_price
                    ? Number(form.sale_price).toFixed(2)
                    : null,
                sale_start_date: form.sale_start_date
                    ? new Date(form.sale_start_date).toISOString()
                    : null,
                sale_end_date: form.sale_end_date
                    ? new Date(form.sale_end_date).toISOString()
                    : null,

                model: form.model.trim(),
                cpu_cores: form.cpu_cores
                    ? Number(form.cpu_cores)
                    : null,
                cpu_speed: form.cpu_speed
                    ? Number(form.cpu_speed)
                    : null,
                display_size: form.display_size
                    ? Number(form.display_size)
                    : null,
                drive_type: form.drive_type.trim(),
                graphics_type: form.graphics_type.trim(),
                storage_capacity: form.storage_capacity.trim(),
                system_memory: form.system_memory.trim(),
                cpu_manufacturer: form.cpu_manufacturer.trim(),

                warranty: form.warranty.trim(),

                condition: form.condition,
                low_stock_threshold: Number(
                    form.low_stock_threshold || 3
                ),
                status: publishStatus || form.status,
            };

            const productResponse = await api.post(
                "products/",
                productPayload
            );

            const product = productResponse.data;

            for (let index = 0; index < images.length; index++) {
                await uploadImage(images[index], product.id, index);
            }

            setSuccess(
                publishStatus === "active"
                    ? "Product published successfully!"
                    : "Product saved as draft successfully!"
            );

            window.scrollTo({ top: 0, behavior: "smooth" });

            setTimeout(() => {
                navigate("/admin/products");
            }, 1500);
        } catch (err) {
            console.error("Create product error:", err);

            let message = "Unable to create the product.";

            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === "string") {
                    message = data;
                } else if (data.detail) {
                    message = data.detail;
                } else {
                    const firstError = Object.values(data)[0];

                    if (Array.isArray(firstError)) {
                        message = firstError[0];
                    } else if (typeof firstError === "string") {
                        message = firstError;
                    }
                }
            }

            setError(message);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        return () => {
            images.forEach((image) => {
                if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, []);

    useEffect(() => {
        const editor = descriptionEditorRef.current;

        if (!editor) return;

        if (editor.innerHTML !== form.description) {
            editor.innerHTML = form.description || "";
        }
    }, [loadingData]);

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">
                        Loading product form...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <style>{`
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
            `}</style>

            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Add New Product
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Add a product to your Anova Technologies store
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                        >
                            ← Back to Products
                        </button>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="max-w-6xl mx-auto px-6 py-8"
            >
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                        <strong>Please check the form:</strong>
                        <span className="ml-2">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
                        {success}
                    </div>
                )}

                {/* 1. IMAGES */}
                <section className="card">
                    <SectionHeading
                        title="1. Product Images"
                        description="Upload up to 5 high-quality product images. Choose one as the main image."
                    />

                    <div className="flex flex-wrap gap-4">
                        {images.length < MAX_IMAGES && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-500 hover:bg-gray-50 transition"
                            >
                                <span className="text-3xl text-gray-400">+</span>
                                <span className="text-xs text-gray-500 mt-2">
                                    Add Image
                                </span>
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        {images.map((image, index) => (
                            <div
                                key={`${image.file.name}-${index}`}
                                className="relative w-32"
                            >
                                <div
                                    className={`w-32 h-32 rounded-xl overflow-hidden border-2 ${
                                        image.isPrimary
                                            ? "border-black"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <img
                                        src={image.preview}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm shadow hover:bg-red-700"
                                >
                                    ×
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPrimaryImage(index)}
                                    className={`mt-2 w-full text-xs py-1.5 rounded-lg ${
                                        image.isPrimary
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {image.isPrimary
                                        ? "★ Main Image"
                                        : "Set as Main"}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="mt-5 text-xs text-gray-400">
                        JPG, PNG or WEBP • Maximum 5MB per image
                    </p>
                </section>

                {/* 2. NAME + CATEGORY */}
                <section className="card">
                    <SectionHeading
                        title="2. Product Name & Category"
                        description="Enter the product name and select its category."
                    />

                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="Product Name *" className="md:col-span-1">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. HP EliteBook 840 G8"
                                className="input"
                            />
                        </Field>

                        <Field label="Category *">
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </section>

                {/* 3. BRAND + COLOR + WEIGHT */}
                <section className="card">
                    <SectionHeading
                        title="3. Brand, Color & Weight"
                        description="Add the basic physical product details."
                    />

                    <div className="grid md:grid-cols-3 gap-5">
                        <Field label="Brand *">
                            <select
                                name="brand_id"
                                value={form.brand_id}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Color">
                            <input
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                                placeholder="e.g. Silver"
                                className="input"
                            />
                        </Field>

                        <Field label="Weight (kg)">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="weight"
                                value={form.weight}
                                onChange={handleChange}
                                placeholder="e.g. 1.40"
                                className="input"
                            />
                        </Field>
                    </div>
                </section>

                {/* 4. DESCRIPTION + HIGHLIGHTS */}
                <section className="card">
                    <SectionHeading
                        title="4. Product Description & Highlights"
                        description="Give customers a clear understanding of the product."
                    />

                    <Field label="Product Description">
                        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => formatDescription("bold")}
                                    className="px-3 py-1.5 rounded hover:bg-gray-200 font-bold"
                                    title="Bold"
                                >
                                    B
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => formatDescription("italic")}
                                    className="px-3 py-1.5 rounded hover:bg-gray-200 italic"
                                    title="Italic"
                                >
                                    I
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => formatDescription("formatBlock", "<p>")}
                                    className="px-3 py-1.5 rounded hover:bg-gray-200"
                                    title="Paragraph"
                                >
                                    ¶
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => formatDescription("insertUnorderedList")}
                                    className="px-3 py-1.5 rounded hover:bg-gray-200"
                                    title="Bullet list"
                                >
                                    • List
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => formatDescription("insertOrderedList")}
                                    className="px-3 py-1.5 rounded hover:bg-gray-200"
                                    title="Numbered list"
                                >
                                    1. List
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => descriptionImageInputRef.current?.click()}
                                    className="px-3 py-1.5 rounded hover:bg-gray-200"
                                    title="Insert image"
                                >
                                    🖼️ Image
                                </button>

                                <input
                                    ref={descriptionImageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleDescriptionImageSelect}
                                    className="hidden"
                                />
                            </div>

                            <div
                                ref={descriptionEditorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={handleDescriptionInput}
                                className="min-h-[260px] px-4 py-4 outline-none text-sm text-gray-700 leading-7 prose max-w-none"
                                data-placeholder="Write a detailed product description. Use separate paragraphs and insert images where needed..."
                            />
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Write the description in paragraphs. You can format text and insert product images between paragraphs.
                        </p>
                    </Field>

                    <div className="mt-6">
                        <label className="label">Product Highlights</label>
                        <p className="text-xs text-gray-400 mb-3">
                            Enter one highlight per line. Each line will be saved as a separate highlight.
                        </p>

                        <textarea
                            value={form.highlights}
                            onChange={(e) =>
                                setForm((previous) => ({
                                    ...previous,
                                    highlights: e.target.value,
                                }))
                            }
                            rows="7"
                            placeholder={`Example:\nIntel Core i5 processor\n8GB RAM\n512GB SSD storage\n15.6-inch Full HD display\n1-year warranty`}
                            className="input resize-y"
                        />
                    </div>
                </section>

                {/* 5. VARIATION + PRICING */}
                <section className="card">
                    <SectionHeading
                        title="5. Variation, SKU, Quantity & Pricing"
                        description="Configure the product variation, inventory, price and optional sale period."
                    />

                    <div className="grid md:grid-cols-2 gap-5">
                        <Field label="Variation">
                            <input
                                name="variation"
                                value={form.variation}
                                onChange={handleChange}
                                placeholder="e.g. 16GB / 512GB SSD"
                                className="input"
                            />
                        </Field>

                        <Field label="SKU *">
                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="e.g. HP-840-G8-001"
                                className="input"
                            />
                        </Field>

                        <Field label="Quantity *">
                            <input
                                type="number"
                                min="0"
                                name="stock_quantity"
                                value={form.stock_quantity}
                                onChange={handleChange}
                                placeholder="10"
                                className="input"
                            />
                        </Field>

                        <Field label="Regular Price (KSh) *">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="85000"
                                className="input"
                            />
                        </Field>

                        <Field label="Sale Price (KSh)">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="sale_price"
                                value={form.sale_price}
                                onChange={handleChange}
                                placeholder="79999"
                                className="input"
                            />
                        </Field>

                        <Field label="Sale Start Date">
                            <input
                                type="datetime-local"
                                name="sale_start_date"
                                value={form.sale_start_date}
                                onChange={handleChange}
                                className="input"
                            />
                        </Field>

                        <Field label="Sale End Date">
                            <input
                                type="datetime-local"
                                name="sale_end_date"
                                value={form.sale_end_date}
                                onChange={handleChange}
                                className="input"
                            />
                        </Field>

                        <Field label="Low Stock Alert">
                            <input
                                type="number"
                                min="0"
                                name="low_stock_threshold"
                                value={form.low_stock_threshold}
                                onChange={handleChange}
                                placeholder="3"
                                className="input"
                            />
                        </Field>

                        <Field label="Condition">
                            <select
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="new">New</option>
                                <option value="refurbished">
                                    Refurbished
                                </option>
                            </select>
                        </Field>
                    </div>
                </section>

                {/* 6. TECHNICAL FIELDS */}
                <section className="card">
                    <SectionHeading
                        title="6. Technical Specifications"
                        description="Add the technical information customers can use to compare products."
                    />

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Field label="Model">
                            <input
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                placeholder="e.g. EliteBook 840 G8"
                                className="input"
                            />
                        </Field>

                        <Field label="CPU Manufacturer">
                            <input
                                name="cpu_manufacturer"
                                value={form.cpu_manufacturer}
                                onChange={handleChange}
                                placeholder="e.g. Intel"
                                className="input"
                            />
                        </Field>

                        <Field label="CPU Cores">
                            <input
                                type="number"
                                min="0"
                                name="cpu_cores"
                                value={form.cpu_cores}
                                onChange={handleChange}
                                placeholder="e.g. 8"
                                className="input"
                            />
                        </Field>

                        <Field label="CPU Speed (GHz)">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="cpu_speed"
                                value={form.cpu_speed}
                                onChange={handleChange}
                                placeholder="e.g. 2.40"
                                className="input"
                            />
                        </Field>

                        <Field label="Display Size (inches)">
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="display_size"
                                value={form.display_size}
                                onChange={handleChange}
                                placeholder="e.g. 14"
                                className="input"
                            />
                        </Field>

                        <Field label="Drive Type">
                            <input
                                name="drive_type"
                                value={form.drive_type}
                                onChange={handleChange}
                                placeholder="e.g. SSD"
                                className="input"
                            />
                        </Field>

                        <Field label="Graphics Type">
                            <input
                                name="graphics_type"
                                value={form.graphics_type}
                                onChange={handleChange}
                                placeholder="e.g. Intel Iris Xe"
                                className="input"
                            />
                        </Field>

                        <Field label="Storage Capacity">
                            <input
                                name="storage_capacity"
                                value={form.storage_capacity}
                                onChange={handleChange}
                                placeholder="e.g. 512GB"
                                className="input"
                            />
                        </Field>

                        <Field label="System Memory">
                            <input
                                name="system_memory"
                                value={form.system_memory}
                                onChange={handleChange}
                                placeholder="e.g. 16GB DDR4"
                                className="input"
                            />
                        </Field>
                    </div>
                </section>

                {/* 7. WARRANTY — KEPT AT THE BOTTOM */}
                <section className="card mb-0">
                    <SectionHeading
                        title="7. Product Warranty"
                        description="Specify the warranty provided with this product."
                    />

                    <input
                        name="warranty"
                        value={form.warranty}
                        onChange={handleChange}
                        placeholder="e.g. 6 Months Warranty"
                        className="input max-w-md"
                    />
                </section>

                {/* ACTIONS */}
                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        disabled={saving}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, "draft")}
                        disabled={saving}
                        className="px-6 py-3 border border-gray-900 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Draft"}
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, "active")}
                        disabled={saving}
                        className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Publishing..." : "Publish Product"}
                    </button>
                </div>
            </form>

            <style>{`
                .card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }

                .input {
                    width: 100%;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    padding: 0.7rem 0.8rem;
                    font-size: 0.875rem;
                    color: #111827;
                    background: white;
                    outline: none;
                }

                .input:focus {
                    border-color: #111827;
                    box-shadow: 0 0 0 1px #111827;
                }
            `}</style>
        </div>
    );
}

function SectionHeading({ title, description }) {
    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
                {title}
            </h2>
            {description && (
                <p className="text-sm text-gray-500 mt-1">
                    {description}
                </p>
            )}
        </div>
    );
}

function Field({ label, children, className = "" }) {
    return (
        <div className={className}>
            <label className="label">{label}</label>
            {children}
        </div>
    );
}

export default CreateProduct;
