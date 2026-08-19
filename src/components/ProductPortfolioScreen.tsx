import React, { useEffect, useMemo, useState } from 'react';
import { ScreenId, TransitionType, ProductItem } from '../types';

interface ProductPortfolioScreenProps {
  onNavigate: (screen: ScreenId, transition: TransitionType) => void;
  onRequestQuote: (productName?: string) => void;
}

// Utility to convert Google Drive viewing URLs to direct image source URLs
const formatImageUrl = (url: string): string => {
  if (!url) return '';
  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
};

export const ProductPortfolioScreen: React.FC<ProductPortfolioScreenProps> = ({ onNavigate, onRequestQuote }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://navapack-backend.azurewebsites.net/api/products/');
        
        if (!response.ok) {
          throw new Error(`Failed to load products (Status: ${response.status})`);
        }

        const data: ProductItem[] = await response.json();
        
        // Filter active products and transform Google Drive URLs if applicable
        const formattedProducts = data
          .filter((product) => product.active !== false)
          .map((product) => ({
            ...product,
            imageUrl: formatImageUrl(product.imageUrl),
          }));

        setProducts(formattedProducts);
      } catch (error: unknown) {
        setLoadError(error instanceof Error ? error.message : 'Unable to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>();

    products.forEach((product) => {
      const slug = product.categorySlug?.trim();
      const label = product.category?.trim();

      if (slug && label) {
        uniqueCategories.set(slug, label);
      }
    });

    return [
      { slug: 'all', label: 'All Solutions' },
      ...Array.from(uniqueCategories, ([slug, label]) => ({ slug, label })),
    ];
  }, [products]);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.categorySlug === activeCategory);

  const productsByCategory = useMemo(() => {
    const grouped = new Map<string, ProductItem[]>();

    filteredProducts.forEach((product) => {
      const categoryProducts = grouped.get(product.category) || [];
      categoryProducts.push(product);
      grouped.set(product.category, categoryProducts);
    });

    return Array.from(grouped, ([category, categoryProducts]) => ({
      category,
      products: categoryProducts,
    }));
  }, [filteredProducts]);

  return (
    <div className="w-full pt-28 pb-20 bg-slate-50/50">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#006c49]/10 text-[#006c49] rounded-full">
              <span className="material-symbols-outlined text-base" aria-hidden="true">verified</span>
              <span className="font-bold text-xs uppercase tracking-wider">Custom Flexible Packaging Manufacturer</span>
            </div>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-slate-900 leading-tight">
              Custom Flexible Packaging Products
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed">
              NavaPack manufactures a wide range of customized plastic bags and flexible packaging products
              using HDPE, LDPE, PP, and unlaminated BOPP materials — customized by dimensions, thickness,
              colour, handle type, gusset, and printing requirements.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <span className="material-symbols-outlined text-9xl text-slate-900" aria-hidden="true">inventory_2</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl text-slate-900 mb-4">Production Capacity</h3>
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <span className="text-slate-600">Blown Film Extrusion</span>
                    <span className="font-extrabold text-[#006c49]">150 MT / month</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <span className="text-slate-600">Recycling & Industrial Pulverization </span>
                    <span className="font-extrabold text-[#006c49]">150MT / Month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Scaling Target</span>
                    <span className="font-extrabold text-[#006c49]">100% by Dec 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation Pills */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 mb-12">
        <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-2.5 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === c.slug
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grouped by category */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 space-y-14">
        {loading && (
          <p className="text-center text-sm text-sky-600">
            Loading products...
          </p>
        )}

        {loadError && (
          <p className="text-center text-sm text-rose-600">
            {loadError}
          </p>
        )}

        {!loading && !loadError && filteredProducts.length === 0 && (
          <p className="text-center text-sm text-sky-600">
            No products are available in this category.
          </p>
        )}

        {productsByCategory.map(({ category, products: categoryProducts }) => (
          <div key={category}>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
              <h2 className="font-extrabold text-2xl text-slate-900">{category}</h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] overflow-hidden relative bg-white">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border border-white/10">
                      {product.category}
                    </div>
                  </div>

                  {/* Card Body - Slate 900 Background with White Text */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-slate-900 text-white">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed mb-6 line-clamp-3">
                        {product.description || 'Customizable packaging solution tailored to specs.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
                      <span className="text-[11px] font-semibold text-slate-200 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
                        {product.tag || 'Customizable'}
                      </span>

                      <button
                        onClick={() => onRequestQuote(product.name)}
                        className="flex items-center gap-1.5 font-bold text-xs text-white hover:text-[#6ffbbe] transition-colors cursor-pointer group/btn"
                      >
                        <span>Request Quote</span>
                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform" aria-hidden="true">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA Section */}
      <section className="mt-20 max-w-7xl mx-auto px-6 md:px-10">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl text-white">
          <div className="max-w-xl relative z-10">
            <h2 className="font-extrabold text-3xl sm:text-4xl mb-4 leading-snug">
              Need Custom Packaging?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Speak to our technical team for the right material, thickness, design, and printing solution.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onRequestQuote()}
                className="bg-[#6ffbbe] text-[#005236] px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:brightness-105 transition-all shadow-lg cursor-pointer"
              >
                <span>Request a Custom Quote</span>
                <span className="material-symbols-outlined text-sm" aria-hidden="true">send</span>
              </button>

              <button
                onClick={() => onNavigate('sustainability', 'none')}
                className="border border-slate-700 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition-all cursor-pointer"
              >
                View Sustainability
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative z-10">
            <div className="w-56 h-56 bg-[#6ffbbe]/15 backdrop-blur-md rounded-full flex items-center justify-center p-8 border border-[#6ffbbe]/25">
              <span className="material-symbols-outlined text-7xl text-[#6ffbbe]" aria-hidden="true">recycling</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};