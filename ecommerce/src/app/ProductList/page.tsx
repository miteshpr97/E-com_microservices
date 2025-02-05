

const ProductList = () => {
    return (
        <div className="max-w-full flex flex-wrap gap-6 justify-center p-4">
            <div className="w-64 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img
                    className="w-full h-40 object-cover"
                    src=""
                    alt=""
                />
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 truncate"></h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2"></p>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-md font-semibold text-gray-900"></span>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button
                            className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-blue-600 transition duration-300"

                        >
                            Add to Cart
                        </button>
                        <button
                            className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 transition duration-300"

                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList