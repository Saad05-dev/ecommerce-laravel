import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

/**
 * Admin Dashboard Component
 * 
 * Complete admin interface for managing products and categories
 * Features:
 * - Statistics cards (products, revenue, orders, low stock)
 * - Products management with CRUD operations
 * - Categories management with CRUD operations
 * - Search and filter functionality
 * - Image upload with preview
 * - Responsive design
 */
export default function Dashboard({ stats, recentOrders, lowStockProducts }) {
    // ==================== STATE MANAGEMENT ====================

    // Products state
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    // Categories state
    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Product modal state
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Loading and active tab states
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('products');

    // Product form state
    const [productForm, setProductForm] = useState({
        name: '',
        sku: '',
        description: '',
        price: '',
        compare_price: '',
        cost: '',
        stock_quantity: '',
        weight: '',
        category_id: '',
        is_active: true,
        image: null
    });

    // Category form state
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        is_active: true
    });

    // ==================== DATA FETCHING ====================

    /**
     * Fetch all products from the API
     */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/admin/products', { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' });
            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Failed to parse products response:', await response.text());
                throw new Error('Failed to load products: server returned unexpected response');
            }
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch all categories from the API
     */
    const fetchCategories = async () => {
        try {
            const response = await fetch('/admin/categories', { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' });
            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Failed to parse categories response:', await response.text());
                throw new Error('Failed to load categories: server returned unexpected response');
            }
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories');
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ==================== FILTERING LOGIC ====================

    /**
     * Filter products based on search, category, and stock status
     */
    useEffect(() => {
        let filtered = [...products];

        // Search by name or SKU
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.category_id === parseInt(selectedCategory)
            );
        }

        // Filter by stock status
        if (stockFilter === 'low') {
            filtered = filtered.filter(product => product.stock_quantity < 10 && product.stock_quantity > 0);
        } else if (stockFilter === 'out') {
            filtered = filtered.filter(product => product.stock_quantity === 0);
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedCategory, stockFilter, products]);

    // ==================== PRODUCT OPERATIONS ====================

    /**
     * Open product modal for create/edit
     */
    const handleProductModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name,
                sku: product.sku,
                description: product.description || '',
                price: product.price,
                compare_price: product.compare_price || '',
                cost: product.cost || '',
                stock_quantity: product.stock_quantity,
                weight: product.weight || '',
                category_id: product.category_id || '',
                is_active: product.is_active,
                image: null
            });
            setImagePreview(product.image_url);
        } else {
            setEditingProduct(null);
            setProductForm({
                name: '',
                sku: '',
                description: '',
                price: '',
                compare_price: '',
                cost: '',
                stock_quantity: '',
                weight: '',
                category_id: '',
                is_active: true,
                image: null
            });
            setImagePreview(null);
        }
        setShowProductModal(true);
    };

    /**
     * Handle image selection and preview
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductForm({ ...productForm, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    /**
     * Submit product form
     */
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            Object.keys(productForm).forEach(key => {
                if (productForm[key] !== null && productForm[key] !== '') {
                    if (key === 'is_active') {
                        // Convertir true/false en 1/0 pour Laravel
                        formData.append(key, productForm[key] ? '1' : '0');
                    } else {
                        formData.append(key, productForm[key]);
                    }
                }
            });

            const url = editingProduct ? `/admin/products/${editingProduct.id}` : '/admin/products';
            if (editingProduct) formData.append('_method', 'PUT');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                credentials: 'same-origin',
                body: formData
            });

            // NOUVEAU CODE ICI 👇
            const responseText = await response.text();

            // Si c'est du HTML (erreur), affiche-le
            if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
                console.error('HTML Error Response:', responseText);

                // Ouvre dans nouvelle fenêtre
                const errorWindow = window.open('', '_blank');
                errorWindow.document.write(responseText);

                alert('Erreur serveur! Une nouvelle fenêtre s\'est ouverte avec les détails.');
                setLoading(false);
                return;
            }

            const data = JSON.parse(responseText);

            if (response.ok) {
                alert(data.message);
                setShowProductModal(false);
                fetchProducts();
            } else {
                alert(data.message || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete product with confirmation
     */
    const handleDeleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setLoading(true);

        try {
            const response = await fetch(`/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                // Non-JSON response (HTML error page) — show fallback
                const text = await response.text();
                console.error('Non-JSON response deleting product:', text);
                alert('Failed to delete product: server returned an unexpected response.');
                return;
            }

            if (response.ok) {
                alert(data.message);
                fetchProducts();
            } else {
                // Surface structured server messages when available
                if (data && (data.hasOrders || data.products_count || data.children_count)) {
                    alert(data.message);
                } else {
                    alert(data.message || 'Failed to delete product');
                }
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle product active status (activate/deactivate)
     */
    const handleToggleActive = async (productId, currentStatus) => {
        const action = currentStatus ? 'deactivate' : 'activate';
        if (!confirm(`Are you sure you want to ${action} this product?`)) return;
        setLoading(true);

        try {
            const response = await fetch(`/admin/products/${productId}/toggle-active`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Non-JSON response toggling product:', await response.text());
                alert(`Failed to ${action} product: server returned an unexpected response.`);
                return;
            }

            if (response.ok) {
                alert(data.message);
                fetchProducts();
            } else {
                alert(data.message || `Failed to ${action} product`);
            }
        } catch (error) {
            console.error(`Error ${action}ing product:`, error);
            alert(`Failed to ${action} product`);
        } finally {
            setLoading(false);
        }
    };

    // ==================== CATEGORY OPERATIONS ====================

    /**
     * Open category modal for create/edit
     */
    const handleCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                description: category.description || '',
                is_active: category.is_active
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({
                name: '',
                description: '',
                is_active: true
            });
        }
        setShowCategoryModal(true);
    };

    /**
     * Submit category form
     */
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingCategory ? `/admin/categories/${editingCategory.id}` : '/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify(categoryForm)
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Non-JSON response saving category:', await response.text());
                alert('Failed to save category: server returned an unexpected response.');
                return;
            }

            if (response.ok) {
                alert(data.message);
                setShowCategoryModal(false);
                fetchCategories();
                fetchProducts();
            } else {
                alert(data.message || 'Failed to save category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete category with confirmation
     */
    const handleDeleteCategory = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        setLoading(true);

        try {
            const response = await fetch(`/admin/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                const text = await response.text();
                console.error('Non-JSON response deleting category:', text);
                alert('Failed to delete category: server returned an unexpected response.');
                return;
            }

            if (response.ok) {
                alert(data.message);
                fetchCategories();
                fetchProducts();
            } else {
                if (data && (data.products_count || data.children_count)) {
                    alert(data.message);
                } else {
                    alert(data.message || 'Failed to delete category');
                }
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    // ==================== RENDER ====================

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* ==================== STATISTICS CARDS ==================== */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Products</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                        <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-red-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <p className="text-sm font-medium text-gray-500">Low Stock Alert</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.lowStockCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== TABS NAVIGATION ==================== */}
                    <div className="mb-6 border-b border-gray-200 bg-white shadow-sm sm:rounded-t-lg">
                        <div className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'products'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                Products Management
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`border-b-2 py-4 px-1 text-sm font-medium ${activeTab === 'categories'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                Categories Management
                            </button>
                        </div>
                    </div>

                    {/* ==================== PRODUCTS TAB ==================== */}
                    {activeTab === 'products' && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-b-lg">
                            <div className="p-6">
                                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                                    <button
                                        onClick={() => handleProductModal()}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Product
                                    </button>
                                </div>

                                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name or SKU..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">All Categories</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                                        <select
                                            value={stockFilter}
                                            onChange={(e) => setStockFilter(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="all">All Stock Levels</option>
                                            <option value="low">Low Stock (&lt; 10)</option>
                                            <option value="out">Out of Stock</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SKU</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                                                </tr>
                                            ) : filteredProducts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No products found</td>
                                                </tr>
                                            ) : (
                                                filteredProducts.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {product.image_url ? (
                                                                    <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded object-cover" />
                                                                ) : (
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                                                                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(product.price).toFixed(2)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.stock_quantity === 0 ? 'bg-red-100 text-red-800' :
                                                                product.stock_quantity < 10 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-green-100 text-green-800'
                                                                }`}>
                                                                {product.stock_quantity} units
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {product.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button onClick={() => handleProductModal(product)} className="mr-3 text-indigo-600 hover:text-indigo-900">Edit</button>
                                                            <button
                                                                onClick={() => handleToggleActive(product.id, product.is_active)}
                                                                className={`mr-3 ${product.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                                                            >
                                                                {product.is_active ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900" disabled={product.has_orders} title={product.has_orders ? 'Cannot delete product with orders. Deactivate instead.' : ''}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== CATEGORIES TAB ==================== */}
                    {activeTab === 'categories' && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-b-lg">
                            <div className="p-6">
                                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                                    <button
                                        onClick={() => handleCategoryModal()}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                    >
                                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Category
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Products</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {categories.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No categories found</td>
                                                </tr>
                                            ) : (
                                                categories.map((category) => (
                                                    <tr key={category.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-500">{category.description || 'No description'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.products_count || 0} products</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {category.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button onClick={() => handleCategoryModal(category)} className="mr-3 text-indigo-600 hover:text-indigo-900">Edit</button>
                                                            <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900" disabled={category.products_count > 0 || category.children_count > 0} title={category.products_count > 0 ? 'Cannot delete category with products.' : (category.children_count > 0 ? 'Cannot delete category with subcategories.' : '')}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== PRODUCT MODAL ==================== */}
                    {showProductModal && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowProductModal(false)}></div>
                                <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white shadow-xl">
                                    <div className="p-6">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                        </h3>
                                        <form onSubmit={handleProductSubmit}>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={productForm.name}
                                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">SKU *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={productForm.sku}
                                                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                                    <select
                                                        value={productForm.category_id}
                                                        onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        <option value="">No Category</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        required
                                                        value={productForm.price}
                                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Compare Price</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={productForm.compare_price}
                                                        onChange={(e) => setProductForm({ ...productForm, compare_price: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={productForm.cost}
                                                        onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        value={productForm.stock_quantity}
                                                        onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        value={productForm.weight}
                                                        onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                                    <textarea
                                                        rows="3"
                                                        value={productForm.description}
                                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    ></textarea>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                                    />
                                                    {imagePreview && (
                                                        <div className="mt-2">
                                                            <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={productForm.is_active}
                                                            onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">Active</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowProductModal(false)}
                                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== CATEGORY MODAL ==================== */}
                    {showCategoryModal && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex min-h-screen items-center justify-center px-4">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCategoryModal(false)}></div>
                                <div className="relative z-50 w-full max-w-md rounded-lg bg-white shadow-xl">
                                    <div className="p-6">
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                                        </h3>
                                        <form onSubmit={handleCategorySubmit}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Category Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={categoryForm.name}
                                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    rows="3"
                                                    value={categoryForm.description}
                                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                ></textarea>
                                            </div>
                                            <div className="mb-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={categoryForm.is_active}
                                                        onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                                </label>
                                            </div>
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCategoryModal(false)}
                                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}