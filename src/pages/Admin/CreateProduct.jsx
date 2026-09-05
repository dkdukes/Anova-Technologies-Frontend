import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    brand_id: "",
    category_id: "",
    condition: "new",

    weight: "",
    package_length: "",
    package_width: "",
    package_height: "",

    short_description: "",
    description: "",

    warranty: "",

    price: "",
    sale_price: "",
    stock_quantity: "",
    low_stock_threshold: "3",

    status: "draft",
    is_featured: false,

    meta_title: "",
    meta_description: "",
  });

  const [specifications, setSpecifications] = useState([
    {
      name: "",
      value: "",
    },
  ]);

  const [highlights, setHighlights] = useState([
    "",
  ]);

  // --------------------------------------------------
  // LOAD CATEGORIES AND BRANDS
  // --------------------------------------------------

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [
          categoriesResponse,
          brandsResponse,
        ] = await Promise.all([
          api.get("categories/"),
          api.get("brands/"),
        ]);

        setCategories(
          categoriesResponse.data.results ||
          categoriesResponse.data
        );

        setBrands(
          brandsResponse.data.results ||
          brandsResponse.data
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

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // --------------------------------------------------
  // IMAGE SELECTION
  // --------------------------------------------------

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(
      e.target.files || []
    );

    if (!selectedFiles.length) {
      return;
    }

    setError("");

    const remainingSlots =
      MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      );

      return;
    }

    const filesToAdd =
      selectedFiles.slice(
        0,
        remainingSlots
      );

    const validImages = [];

    for (const file of filesToAdd) {

      if (!file.type.startsWith("image/")) {
        setError(
          `${file.name} is not a valid image.`
        );

        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `${file.name} is larger than 5MB.`
        );

        continue;
      }

      const preview = URL.createObjectURL(
        file
      );

      validImages.push({
        file,
        preview,
        isPrimary: images.length === 0 &&
          validImages.length === 0,
      });
    }

    setImages((previous) => [
      ...previous,
      ...validImages,
    ]);

    e.target.value = "";
  };

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = (index) => {

    setImages((previous) => {

      const imageToRemove =
        previous[index];

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(
          imageToRemove.preview
        );
      }

      const updated = previous.filter(
        (_, imageIndex) =>
          imageIndex !== index
      );

      if (
        updated.length > 0 &&
        !updated.some(
          (image) => image.isPrimary
        )
      ) {
        updated[0].isPrimary = true;
      }

      return updated;
    });
  };

  // --------------------------------------------------
  // MAKE PRIMARY IMAGE
  // --------------------------------------------------

  const setPrimaryImage = (index) => {

    setImages((previous) =>
      previous.map(
        (image, imageIndex) => ({
          ...image,
          isPrimary:
            imageIndex === index,
        })
      )
    );
  };

  // --------------------------------------------------
  // SPECIFICATIONS
  // --------------------------------------------------

  const handleSpecificationChange = (
    index,
    field,
    value
  ) => {

    setSpecifications((previous) =>
      previous.map(
        (specification, specificationIndex) =>
          specificationIndex === index
            ? {
                ...specification,
                [field]: value,
              }
            : specification
      )
    );
  };

  const addSpecification = () => {

    setSpecifications((previous) => [
      ...previous,
      {
        name: "",
        value: "",
      },
    ]);
  };

  const removeSpecification = (index) => {

    setSpecifications((previous) =>
      previous.filter(
        (_, specificationIndex) =>
          specificationIndex !== index
      )
    );
  };

  // --------------------------------------------------
  // HIGHLIGHTS
  // --------------------------------------------------

  const handleHighlightChange = (
    index,
    value
  ) => {

    setHighlights((previous) =>
      previous.map(
        (highlight, highlightIndex) =>
          highlightIndex === index
            ? value
            : highlight
      )
    );
  };

  const addHighlight = () => {

    setHighlights((previous) => [
      ...previous,
      "",
    ]);
  };

  const removeHighlight = (index) => {

    setHighlights((previous) =>
      previous.filter(
        (_, highlightIndex) =>
          highlightIndex !== index
      )
    );
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateForm = () => {

    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.sku.trim()) {
      return "SKU is required.";
    }

    if (!form.brand_id) {
      return "Please select a brand.";
    }

    if (!form.category_id) {
      return "Please select a category.";
    }

    if (!form.price) {
      return "Product price is required.";
    }

    if (
      Number(form.price) < 0
    ) {
      return "Price cannot be negative.";
    }

    if (
      form.sale_price &&
      Number(form.sale_price) >=
        Number(form.price)
    ) {
      return "Sale price must be lower than the regular price.";
    }

    if (
      form.stock_quantity === ""
    ) {
      return "Stock quantity is required.";
    }

    if (images.length === 0) {
      return "Please upload at least one product image.";
    }

    return null;
  };

  // --------------------------------------------------
  // UPLOAD IMAGE
  // --------------------------------------------------

  const uploadImage = async (
    image,
    productId,
    sortOrder
  ) => {

    const formData = new FormData();

    formData.append(
      "image",
      image.file
    );

    formData.append(
      "product_id",
      productId
    );

    formData.append(
      "alt_text",
      form.name
    );

    formData.append(
      "is_primary",
      image.isPrimary
    );

    formData.append(
      "sort_order",
      sortOrder
    );

    const response = await api.post(
      "products/images/upload/",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  };

  // --------------------------------------------------
  // CREATE PRODUCT
  // --------------------------------------------------

  const handleSubmit = async (
    e,
    publishStatus = null
  ) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {

      setSaving(true);

      // ---------------------------------------------
      // PREPARE HIGHLIGHTS
      // ---------------------------------------------

      const cleanedHighlights =
        highlights
          .map((highlight) =>
            highlight.trim()
          )
          .filter(Boolean);

      // ---------------------------------------------
      // PREPARE PRODUCT PAYLOAD
      // ---------------------------------------------

      const productPayload = {
        name: form.name.trim(),

        sku: form.sku.trim(),

        category_id:
          Number(form.category_id),

        brand_id:
          Number(form.brand_id),

        condition:
          form.condition,

        short_description:
          form.short_description.trim(),

        description:
          form.description.trim(),

        highlights:
          cleanedHighlights,

        price:
          Number(form.price).toFixed(2),

        sale_price:
          form.sale_price
            ? Number(
                form.sale_price
              ).toFixed(2)
            : null,

        stock_quantity:
          Number(form.stock_quantity),

        low_stock_threshold:
          Number(
            form.low_stock_threshold || 3
          ),

        warranty:
          form.warranty.trim(),

        weight:
          form.weight
            ? Number(form.weight)
            : null,

        package_length:
          form.package_length
            ? Number(form.package_length)
            : null,

        package_width:
          form.package_width
            ? Number(form.package_width)
            : null,

        package_height:
          form.package_height
            ? Number(form.package_height)
            : null,

        status:
          publishStatus ||
          form.status,

        is_featured:
          form.is_featured,

        meta_title:
          form.meta_title.trim(),

        meta_description:
          form.meta_description.trim(),
      };

      // ---------------------------------------------
      // CREATE PRODUCT
      // ---------------------------------------------

      const productResponse =
        await api.post(
          "products/",
          productPayload
        );

      const product =
        productResponse.data;

      // ---------------------------------------------
      // UPLOAD IMAGES
      // ---------------------------------------------

      for (
        let index = 0;
        index < images.length;
        index++
      ) {

        await uploadImage(
          images[index],
          product.id,
          index
        );
      }

      // ---------------------------------------------
      // CREATE SPECIFICATIONS
      // ---------------------------------------------

      const validSpecifications =
        specifications.filter(
          (specification) =>
            specification.name.trim() &&
            specification.value.trim()
        );

      for (
        let index = 0;
        index <
        validSpecifications.length;
        index++
      ) {

        await api.post(
          "products/specifications/",
          {
            product_id:
              product.id,

            name:
              validSpecifications[
                index
              ].name.trim(),

            value:
              validSpecifications[
                index
              ].value.trim(),

            sort_order: index,
          }
        );
      }

      // ---------------------------------------------
      // SUCCESS
      // ---------------------------------------------

      setSuccess(
        publishStatus === "active"
          ? "Product published successfully!"
          : "Product saved as draft successfully!"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Give user time to see success
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);

    } catch (err) {

      console.error(
        "Create product error:",
        err
      );

      let message =
        "Unable to create the product.";

      if (
        err.response?.data
      ) {

        const data =
          err.response.data;

        if (
          typeof data === "string"
        ) {
          message = data;
        } else if (
          data.detail
        ) {
          message = data.detail;
        } else {

          const firstError =
            Object.values(data)[0];

          if (
            Array.isArray(firstError)
          ) {
            message =
              firstError[0];
          }
        }
      }

      setError(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // CLEAN UP PREVIEWS
  // --------------------------------------------------

  useEffect(() => {

    return () => {

      images.forEach((image) => {

        if (image.preview) {
          URL.revokeObjectURL(
            image.preview
          );
        }

      });

    };

  }, []);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

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

      {/* HEADER */}

      <div className="bg-white border-b">

        <div className="max-w-6xl mx-auto px-6 py-5">

          <div className="flex items-center justify-between">

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
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
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

        {/* ALERTS */}

        {error && (

          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">

            <strong>
              Please check the form:
            </strong>

            <span className="ml-2">
              {error}
            </span>

          </div>

        )}

        {success && (

          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">

            {success}

          </div>

        )}

        {/* ================================================= */}
        {/* PRODUCT IMAGES */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-gray-900">
              1. Product Images
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Upload up to 5 high-quality product images.
              The first image is used as the main image.
            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            {/* ADD IMAGE */}

            {images.length < MAX_IMAGES && (

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-500 hover:bg-gray-50 transition"
              >

                <span className="text-3xl text-gray-400">
                  +
                </span>

                <span className="text-xs text-gray-500 mt-2">
                  Add Image
                </span>

              </button>

            )}

            {/* HIDDEN FILE INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={
                handleImageSelect
              }
              className="hidden"
            />

            {/* IMAGE PREVIEWS */}

            {images.map(
              (image, index) => (

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

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm shadow hover:bg-red-700"
                  >
                    ×
                  </button>

                  {/* PRIMARY */}

                  <button
                    type="button"
                    onClick={() =>
                      setPrimaryImage(index)
                    }
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

              )
            )}

          </div>

          <div className="mt-5 text-xs text-gray-400">
            JPG, PNG or WEBP • Maximum 5MB per image
          </div>

        </section>

        {/* ================================================= */}
        {/* PRODUCT INFORMATION */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            2. Product Information
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Enter the basic information customers will see.
          </p>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="md:col-span-2">

              <label className="label">
                Product Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. HP EliteBook 840 G8"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                SKU *
              </label>

              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. HP-840-G8-001"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                Condition
              </label>

              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="input"
              >

                <option value="new">
                  New
                </option>

                <option value="refurbished">
                  Refurbished
                </option>

              </select>

            </div>

            <div>

              <label className="label">
                Brand *
              </label>

              <select
                name="brand_id"
                value={form.brand_id}
                onChange={handleChange}
                className="input"
              >

                <option value="">
                  Select Brand
                </option>

                {brands.map(
                  (brand) => (

                    <option
                      key={brand.id}
                      value={brand.id}
                    >
                      {brand.name}
                    </option>

                  )
                )}

              </select>

            </div>

            <div>

              <label className="label">
                Category *
              </label>

              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="input"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* MEASUREMENTS */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            3. Product Measurements
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Enter the product/package measurements.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div>

              <label className="label">
                Weight (kg)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="1.40"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                Length (cm)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="package_length"
                value={form.package_length}
                onChange={handleChange}
                placeholder="32"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                Width (cm)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="package_width"
                value={form.package_width}
                onChange={handleChange}
                placeholder="22"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                Height (cm)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                name="package_height"
                value={form.package_height}
                onChange={handleChange}
                placeholder="4"
                className="input"
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* SPECIFICATIONS */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-semibold text-gray-900">
                4. Product Specifications
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Add technical specifications for your product.
              </p>

            </div>

            <button
              type="button"
              onClick={
                addSpecification
              }
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
            >
              + Add Specification
            </button>

          </div>

          <div className="space-y-3">

            {specifications.map(
              (
                specification,
                index
              ) => (

                <div
                  key={index}
                  className="flex gap-3"
                >

                  <input
                    value={
                      specification.name
                    }
                    onChange={(e) =>
                      handleSpecificationChange(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Specification name"
                    className="input"
                  />

                  <input
                    value={
                      specification.value
                    }
                    onChange={(e) =>
                      handleSpecificationChange(
                        index,
                        "value",
                        e.target.value
                      )
                    }
                    placeholder="Value e.g. 8GB RAM"
                    className="input"
                  />

                  {specifications.length >
                    1 && (

                    <button
                      type="button"
                      onClick={() =>
                        removeSpecification(
                          index
                        )
                      }
                      className="px-4 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>

                  )}

                </div>

              )
            )}

          </div>

        </section>

        {/* ================================================= */}
        {/* DESCRIPTION */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            5. Product Description & Highlights
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Give customers a clear understanding of the product.
          </p>

          <div className="mb-6">

            <label className="label">
              Short Description
            </label>

            <textarea
              name="short_description"
              value={
                form.short_description
              }
              onChange={handleChange}
              rows="3"
              maxLength="500"
              placeholder="Short summary of the product..."
              className="input resize-none"
            />

          </div>

          <div className="mb-8">

            <label className="label">
              Full Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="7"
              placeholder="Describe the product in detail..."
              className="input resize-none"
            />

          </div>

          <div>

            <div className="flex items-center justify-between mb-4">

              <div>

                <label className="label">
                  Product Highlights
                </label>

                <p className="text-xs text-gray-400">
                  Add the key benefits/features customers should notice.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addHighlight
                }
                className="text-sm font-medium hover:underline"
              >
                + Add Highlight
              </button>

            </div>

            <div className="space-y-3">

              {highlights.map(
                (
                  highlight,
                  index
                ) => (

                  <div
                    key={index}
                    className="flex gap-3 items-center"
                  >

                    <span className="text-green-600 font-bold">
                      ✓
                    </span>

                    <input
                      value={highlight}
                      onChange={(e) =>
                        handleHighlightChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="e.g. 512GB SSD storage"
                      className="input"
                    />

                    {highlights.length >
                      1 && (

                      <button
                        type="button"
                        onClick={() =>
                          removeHighlight(
                            index
                          )
                        }
                        className="px-3 text-red-500"
                      >
                        ×
                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* WARRANTY */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            6. Warranty
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Specify the warranty provided with this product.
          </p>

          <input
            name="warranty"
            value={form.warranty}
            onChange={handleChange}
            placeholder="e.g. 6 Months Warranty"
            className="input max-w-md"
          />

        </section>

        {/* ================================================= */}
        {/* PRICING */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            7. Pricing & Inventory
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Set your selling price and inventory levels.
          </p>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="label">
                Regular Price (KSh) *
              </label>

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

            </div>

            <div>

              <label className="label">
                Sale Price (KSh)
              </label>

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

            </div>

            <div>

              <label className="label">
                Stock Quantity *
              </label>

              <input
                type="number"
                min="0"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                placeholder="10"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                Low Stock Alert
              </label>

              <input
                type="number"
                min="0"
                name="low_stock_threshold"
                value={
                  form.low_stock_threshold
                }
                onChange={handleChange}
                placeholder="3"
                className="input"
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* SEO */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-900">
            8. Search & SEO
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-6">
            Optional information for search engines.
          </p>

          <div className="space-y-5">

            <div>

              <label className="label">
                Meta Title
              </label>

              <input
                name="meta_title"
                value={form.meta_title}
                onChange={handleChange}
                placeholder="HP EliteBook 840 G8 | Anova Technologies"
                className="input"
              />

            </div>

            <div>

              <label className="label">
                Meta Description
              </label>

              <textarea
                name="meta_description"
                value={
                  form.meta_description
                }
                onChange={handleChange}
                rows="3"
                placeholder="Buy HP EliteBook 840 G8 from Anova Technologies..."
                className="input resize-none"
              />

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* PUBLISH */}
        {/* ================================================= */}

        <section className="bg-white rounded-xl border shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-900">
            9. Publish Product
          </h2>

          <div className="mt-5 flex items-center gap-3">

            <input
              type="checkbox"
              name="is_featured"
              checked={
                form.is_featured
              }
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label className="text-sm text-gray-700">
              Feature this product on the store
            </label>

          </div>

          <div className="mt-8 flex flex-wrap gap-3">

            <button
              type="button"
              disabled={saving}
              onClick={(e) =>
                handleSubmit(
                  e,
                  "draft"
                )
              }
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >

              {saving
                ? "Saving..."
                : "Save Draft"}

            </button>

            <button
              type="button"
              disabled={saving}
              onClick={(e) =>
                handleSubmit(
                  e,
                  "active"
                )
              }
              className="px-7 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >

              {saving
                ? "Publishing..."
                : "Publish Product"}

            </button>

          </div>

        </section>

      </form>

      {/* SMALL GLOBAL STYLES */}

      <style>{`
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

export default CreateProduct;