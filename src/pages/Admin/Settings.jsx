import { useEffect, useState } from "react";
import api from "../../api";

function Settings() {
    const [settings, setSettings] = useState({
        store_name: "",
        store_email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        logo: "",
        description: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("admin/settings/");

            setSettings({
                store_name: response.data.store_name || "",
                store_email: response.data.store_email || "",
                phone: response.data.phone || "",
                address: response.data.address || "",
                city: response.data.city || "",
                country: response.data.country || "",
                logo: response.data.logo || "",
                description: response.data.description || "",
            });
        } catch (err) {
            console.error("SETTINGS ERROR:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to load store settings."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSuccess("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await api.patch(
                "admin/settings/",
                settings
            );

            setSettings({
                store_name: response.data.store_name || "",
                store_email: response.data.store_email || "",
                phone: response.data.phone || "",
                address: response.data.address || "",
                city: response.data.city || "",
                country: response.data.country || "",
                logo: response.data.logo || "",
                description: response.data.description || "",
            });

            setSuccess(
                "Store settings updated successfully."
            );
        } catch (err) {
            console.error("SAVE SETTINGS ERROR:", err);

            setError(
                err.response?.data?.detail ||
                JSON.stringify(err.response?.data) ||
                "Failed to save settings."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Loading settings...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your Anova Technologies store information.
                </p>
            </div>

            {/* Messages */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* General Settings */}
            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 px-6 py-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        General Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Basic information about your store.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                    {/* Store Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Store Name
                        </label>

                        <input
                            type="text"
                            name="store_name"
                            value={settings.store_name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="Anova Technologies"
                        />
                    </div>

                    {/* Store Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Store Email
                        </label>

                        <input
                            type="email"
                            name="store_email"
                            value={settings.store_email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="info@example.com"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="+254 700 000 000"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Country
                        </label>

                        <input
                            type="text"
                            name="country"
                            value={settings.country}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="Kenya"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="Street / Building"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            City
                        </label>

                        <input
                            type="text"
                            name="city"
                            value={settings.city}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="Nairobi"
                        />
                    </div>

                    {/* Logo */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Store Logo URL
                        </label>

                        <input
                            type="url"
                            name="logo"
                            value={settings.logo}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="https://..."
                        />

                        {settings.logo && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs text-gray-500">
                                    Logo Preview
                                </p>

                                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-3">
                                    <img
                                        src={settings.logo}
                                        alt={settings.store_name}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Store Description
                        </label>

                        <textarea
                            name="description"
                            value={settings.description}
                            onChange={handleChange}
                            rows={5}
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            placeholder="Tell customers about Anova Technologies..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Settings;