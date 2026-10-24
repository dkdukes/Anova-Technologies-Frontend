
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProductReviews() {
    const { slug } = useParams();
    const { user, isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [hasReview, setHasReview] = useState(false);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadReviews() {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    `products/${slug}/reviews/`
                );

                if (active) {
                    const data = response.data;
                    setReviews(
                        Array.isArray(data) ? data : data.results || []
                    );
                }

                if (isAuthenticated) {
                    const eligibility = await api.get(
                        `products/${slug}/reviews/eligibility/`
                    );

                    if (active) {
                        setCanReview(eligibility.data.can_review);
                        setHasReview(eligibility.data.has_review);
                    }
                } else if (active) {
                    setCanReview(false);
                    setHasReview(false);
                }
            } catch (err) {
                if (active) {
                    setError(
                        "Could not load reviews. Please try again."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadReviews();

        return () => {
            active = false;
        };
    }, [slug, isAuthenticated]);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");
        setSubmitting(true);

        try {
            const response = await api.post(
                `products/${slug}/reviews/create/`,
                { rating, title, comment }
            );

            setMessage(
                response.data.message ||
                "Your review was submitted for approval."
            );

            setHasReview(true);
            setCanReview(false);
            setTitle("");
            setComment("");
        } catch (err) {
            const data = err.response?.data;
            const detail = data?.detail;
            setError(
                typeof detail === "string"
                    ? detail
                    : "Could not submit your review. Please check your details."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900">
                Customer Reviews
            </h2>

            {loading ? (
                <p className="mt-4 text-gray-500">
                    Loading reviews...
                </p>
            ) : (
                <>
                    {reviews.length === 0 ? (
                        <p className="mt-4 text-gray-500">
                            No approved reviews yet.
                        </p>
                    ) : (
                        <div className="mt-5 space-y-5">
                            {reviews.map((review) => (
                                <article
                                    key={review.id}
                                    className="rounded-lg border border-gray-200 p-4"
                                >
                                    <div className="flex justify-between gap-4">
                                        <h3 className="font-medium">
                                            {review.title || "Customer review"}
                                        </h3>
                                        <span className="text-amber-500">
                                            {"★".repeat(review.rating)}
                                            {"☆".repeat(5 - review.rating)}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-gray-700">
                                        {review.comment}
                                    </p>

                                    <p className="mt-3 text-sm text-gray-500">
                                        By {review.username}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div className="mt-8">
                <h3 className="text-lg font-semibold">
                    Write a Review
                </h3>

                {!isAuthenticated ? (
                    <p className="mt-2 text-gray-600">
                        Please log in to check whether you can review this product.
                    </p>
                ) : hasReview ? (
                    <p className="mt-2 text-gray-600">
                        You have already submitted a review for this product.
                    </p>
                ) : !canReview ? (
                    <p className="mt-2 text-gray-600">
                        You can review this product after purchasing and receiving it.
                    </p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="mt-4 max-w-xl space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium">
                                Rating
                            </label>
                            <select
                                value={rating}
                                onChange={(e) =>
                                    setRating(Number(e.target.value))
                                }
                                className="mt-1 w-full rounded-lg border p-3"
                            >
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <option key={value} value={value}>
                                        {value} star{value !== 1 ? "s" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Review title
                            </label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={150}
                                className="mt-1 w-full rounded-lg border p-3"
                                placeholder="Summarize your experience"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Your review
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                rows={4}
                                className="mt-1 w-full rounded-lg border p-3"
                                placeholder="What did you think of this product?"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p className="text-sm text-green-700">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-50"
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>
                    </form>
                )}

                {error && !canReview && !loading && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
                {message && !canReview && (
                    <p className="mt-3 text-sm text-green-700">{message}</p>
                )}
            </div>
        </section>
    );
}
