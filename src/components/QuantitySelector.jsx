import { useState } from "react";

export default function QuantitySelector({
  stock,
  onChange,
}) {
  const [quantity, setQuantity] = useState(1);

  const decrease = () => {
    const newQuantity = Math.max(1, quantity - 1);

    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  const increase = () => {
    const newQuantity = Math.min(stock, quantity + 1);

    setQuantity(newQuantity);
    onChange(newQuantity);
  };

  const handleInput = (e) => {
    let value = Number(e.target.value);

    if (!value || value < 1) {
      value = 1;
    }

    if (value > stock) {
      value = stock;
    }

    setQuantity(value);
    onChange(value);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-900">
        Quantity
      </p>

      <div className="flex w-fit items-center rounded-lg border border-gray-300">

        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= 1}
          className="px-4 py-2 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>

        <input
          type="number"
          min="1"
          max={stock}
          value={quantity}
          onChange={handleInput}
          className="w-14 border-x border-gray-300 py-2 text-center font-semibold outline-none"
        />

        <button
          type="button"
          onClick={increase}
          disabled={quantity >= stock}
          className="px-4 py-2 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>

      </div>

      <p className="mt-2 text-xs text-gray-500">
        {stock} available
      </p>
    </div>
  );
}