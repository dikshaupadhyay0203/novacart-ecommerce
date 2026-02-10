// frontend/src/components/Products/ProductList.js
import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const ProductList = ({ items, loading, error, pagination }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="large" message="Loading amazing products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-red-50 rounded-xl p-8">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 bg-gray-50 rounded-xl p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 text-center mb-4">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Showing <span className="font-semibold">{items.length}</span> of{' '}
            <span className="font-semibold">{pagination?.totalItems || items.length}</span> products
          </span>
          {pagination?.currentPage && pagination?.totalPages > 1 && (
            <span className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          )}
        </div>
        
        {/* View Toggle */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={item._id}
            className="animate-fadeInUp"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <ProductCard item={item} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              pagination.hasPrevPage
                ? 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => {
              if (pagination.hasPrevPage) {
                const url = new URL(window.location);
                url.searchParams.set('page', pagination.currentPage - 1);
                window.location.href = url.toString();
              }
            }}
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              const isActive = pageNum === pagination.currentPage;

              return (
                <button
                  key={pageNum}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    const url = new URL(window.location);
                    url.searchParams.set('page', pageNum);
                    window.location.href = url.toString();
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              pagination.hasNextPage
                ? 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 hover:border-purple-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => {
              if (pagination.hasNextPage) {
                const url = new URL(window.location);
                url.searchParams.set('page', pagination.currentPage + 1);
                window.location.href = url.toString();
              }
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Load More Button (Alternative to pagination) */}
      {pagination && pagination.hasNextPage && (
        <div className="flex justify-center mt-8">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;