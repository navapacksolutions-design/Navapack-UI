/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Package,
  Users,
  Search,
  Menu,
  X,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  XCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  ShoppingBag,
  UserCheck,
  Clock,
} from "lucide-react";
import { APPS_SCRIPT_ADMIN_KEY, APPS_SCRIPT_URL } from "../config/appsScript";
import { getDisplayImageUrl } from "../utils/imageUrl";

interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  description: string;
  tag: string;
  imageUrl: string;
  active: boolean;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  phone: string;
  role: string;
  status: "Approved" | "Pending" | "Rejected";
}

const ADMIN_KEY = APPS_SCRIPT_ADMIN_KEY;
const LOCAL_PRODUCTS_API_URL = "https://navapack-backend.azurewebsites.net/api/products/";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  products?: T;
  users?: T;
};

async function getFromApi<T>(action: "getAllProducts" | "getUsers") {
  const response = await fetch(
    `${APPS_SCRIPT_URL}?action=${action}`
  );
  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to load dashboard data.");
  }

  return action === "getAllProducts"
    ? result.products as T
    : result.users as T;
}

async function getProductsFromLocalApi(): Promise<Product[]> {
  const response = await fetch(LOCAL_PRODUCTS_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load products (Status: ${response.status})`);
  }

  const data = (await response.json()) as Array<Partial<Product>>;

  return data
    .filter((product) => product.active !== false)
    .map((product) => ({
      id: String(product.id ?? ""),
      name: product.name ?? "",
      category: product.category?.trim() || "Other Products",
      categorySlug: product.categorySlug?.trim() || "",
      description: product.description ?? "",
      tag: product.tag ?? "Customizable",
      imageUrl: getDisplayImageUrl(product.imageUrl ?? ""),
      active: product.active !== false,
    }));
}

async function createProductInLocalApi(payload: Partial<Product>): Promise<Product> {
  const response = await fetch(LOCAL_PRODUCTS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create product (Status: ${response.status})`);
  }

  const product = (await response.json()) as Partial<Product>;

  return {
    id: String(product.id ?? ""),
    name: product.name ?? "",
    category: product.category?.trim() || "Other Products",
    categorySlug: product.categorySlug?.trim() || "",
    description: product.description ?? "",
    tag: product.tag ?? "Customizable",
    imageUrl: getDisplayImageUrl(product.imageUrl ?? ""),
    active: product.active !== false,
  };
}

async function updateProductInLocalApi(id: string, payload: Partial<Product>): Promise<Product> {
  const response = await fetch(`${LOCAL_PRODUCTS_API_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product (Status: ${response.status})`);
  }

  const product = (await response.json()) as Partial<Product>;

  return {
    id: String(product.id ?? id),
    name: product.name ?? "",
    category: product.category?.trim() || "Other Products",
    categorySlug: product.categorySlug?.trim() || "",
    description: product.description ?? "",
    tag: product.tag ?? "Customizable",
    imageUrl: getDisplayImageUrl(product.imageUrl ?? ""),
    active: product.active !== false,
  };
}

async function deleteProductFromLocalApi(id: string): Promise<void> {
  const response = await fetch(`${LOCAL_PRODUCTS_API_URL}${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product (Status: ${response.status})`);
  }
}

async function postToApi(
  action: string,
  payload: Record<string, unknown>
) {
  if (!ADMIN_KEY) {
    throw new Error("Admin actions are not configured.");
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, key: ADMIN_KEY, ...payload }),
  });
  const result = (await response.json()) as ApiResponse<never>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "The action could not be completed.");
  }
}

// =====================================================
// DASHBOARD
// =====================================================

export const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [staff, setStaff] = useState<Staff[]>([]);

  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const [activeTab, setActiveTab] =
    useState<"dashboard" | "products" | "staff">(
      "dashboard"
    );

  const [search, setSearch] =
    useState("");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [showProductForm, setShowProductForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "staff",
    employeeId: "",
    phone: "",
    department: "",
    status: "Approved" as Staff["status"],
  });

  const [productForm, setProductForm] =
    useState({
      name: "",
      category: "",
      description: "",
      tag: "",
      imageUrl: "",
      active: true,
    });

  const loadDashboardData = async () => {
    setLoading(true);
    setDataError("");

    try {
      const [apiProducts, apiUsers] = await Promise.all([
        getProductsFromLocalApi(),
        getFromApi<Omit<Staff, "id">[]>("getUsers"),
      ]);

      setProducts(apiProducts);
      setStaff(apiUsers.map((user) => ({ ...user, id: user.email })));
    } catch (error) {
      setDataError(
        error instanceof Error ? error.message : "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  // ===================================================
  // PRODUCT SEARCH
  // ===================================================

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query) ||
        product.tag
          .toLowerCase()
          .includes(query)
    );
  }, [products, search]);

  // ===================================================
  // PRODUCT FUNCTIONS
  // ===================================================

  const openAddProduct = () => {
    setEditingProduct(null);

    setProductForm({
      name: "",
      category: "",
      description: "",
      tag: "",
      imageUrl: "",
      active: true,
    });

    setShowProductForm(true);
  };

  const openEditProduct = (
    product: Product
  ) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      tag: product.tag,
      imageUrl: product.imageUrl,
      active: product.active,
    });

    setShowProductForm(true);
  };

  const saveProduct = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!productForm.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    try {
      if (editingProduct) {
        await updateProductInLocalApi(editingProduct.id, productForm);
      } else {
        await createProductInLocalApi(productForm);
      }

      await loadDashboardData();
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Unable to save product."
      );
    }
  };

  const deleteProduct = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      await deleteProductFromLocalApi(id);
      await loadDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to delete product.");
    }
  };

  const toggleProduct = async (
    id: string
  ) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    try {
      await updateProductInLocalApi(id, { active: !product.active });
      await loadDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to update product.");
    }
  };

  // ===================================================
  // STAFF FUNCTIONS
  // ===================================================

  const updateStaffStatus = async (
    id: string,
    status: Staff["status"]
  ) => {
    const member = staff.find((item) => item.id === id);
    if (!member) return;

    try {
      await postToApi("updateUserStatus", {
        email: member.email,
        status,
      });
      await loadDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to update staff status.");
    }
  };

  const deleteStaff = async (
    id: string
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this staff member?"
      )
    ) {
      return;
    }

    const member = staff.find((item) => item.id === id);
    if (!member) return;

    try {
      await postToApi("deleteUser", { email: member.email });
      await loadDashboardData();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to delete staff member.");
    }
  };

  const openEditStaff = (member: Staff) => {
    setEditingStaff(member);
    setStaffForm({
      name: member.name,
      role: member.role,
      employeeId: member.employeeId,
      phone: member.phone,
      department: member.department,
      status: member.status,
    });
    setShowStaffForm(true);
  };

  const saveStaff = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingStaff) return;

    try {
      await postToApi("updateUser", {
        email: editingStaff.email,
        updates: staffForm,
      });
      await loadDashboardData();
      setShowStaffForm(false);
      setEditingStaff(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to update staff member.");
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {
    window.location.href = "/";
  };

  // ===================================================
  // COUNTS
  // ===================================================

  const activeProducts =
    products.filter(
      (product) => product.active
    ).length;

  const pendingStaff =
    staff.filter(
      (member) =>
        member.status === "Pending"
    ).length;

  const approvedStaff =
    staff.filter(
      (member) =>
        member.status === "Approved"
    ).length;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#f7f9fb]">

      {/* MOBILE OVERLAY */}

      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-72
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            mobileMenu
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b px-6">

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-xs text-slate-500">
              Management Panel
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() =>
              setMobileMenu(false)
            }
          >
            <X size={22} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="space-y-2 p-4">

          <SidebarButton
            active={
              activeTab ===
              "dashboard"
            }
            icon={
              <LayoutDashboard
                size={19}
              />
            }
            label="Dashboard"
            onClick={() => {
              setActiveTab(
                "dashboard"
              );
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            active={
              activeTab ===
              "products"
            }
            icon={
              <Package size={19} />
            }
            label="Products"
            onClick={() => {
              setActiveTab(
                "products"
              );
              setMobileMenu(false);
            }}
          />

          <SidebarButton
            active={
              activeTab === "staff"
            }
            icon={
              <Users size={19} />
            }
            label="Staff"
            onClick={() => {
              setActiveTab("staff");
              setMobileMenu(false);
            }}
          />

        </nav>

        {/* USER */}

        <div className="absolute bottom-0 w-full border-t p-4">

          <div className="mb-3 rounded-xl bg-slate-50 p-4">

            <p className="font-semibold text-slate-900">
              Admin User
            </p>

            <p className="text-xs text-slate-500">
              admin@example.com
            </p>

            <span className="mt-2 inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              Administrator
            </span>

          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="lg:pl-72">

        {/* TOPBAR */}

        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">

          <button
            className="lg:hidden"
            onClick={() =>
              setMobileMenu(true)
            }
          >
            <Menu size={24} />
          </button>

          <div className="relative max-w-xl flex-1">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />

          </div>

          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            A
          </div>

        </header>

        {/* CONTENT */}

        <main className="p-4 sm:p-6 lg:p-8">

          {loading && (
            <p className="mb-6 text-sm text-slate-500">
              Loading dashboard data...
            </p>
          )}

          {dataError && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              <span>{dataError}</span>
              <button
                type="button"
                onClick={() => void loadDashboardData()}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* DASHBOARD */}

          {activeTab ===
            "dashboard" && (
            <DashboardHome
              products={products}
              activeProducts={
                activeProducts
              }
              staff={staff}
              pendingStaff={
                pendingStaff
              }
              approvedStaff={
                approvedStaff
              }
              setActiveTab={
                setActiveTab
              }
            />
          )}

          {/* PRODUCTS */}

          {activeTab ===
            "products" && (
            <ProductsSection
              products={
                filteredProducts
              }
              onAdd={
                openAddProduct
              }
              onEdit={
                openEditProduct
              }
              onDelete={
                deleteProduct
              }
              onToggle={
                toggleProduct
              }
            />
          )}

          {/* STAFF */}

          {activeTab === "staff" && (
            <StaffSection
              staff={staff}
              onEdit={openEditStaff}
              onStatusChange={
                updateStaffStatus
              }
              onDelete={
                deleteStaff
              }
            />
          )}

        </main>

      </div>

      {/* PRODUCT MODAL */}

      {showProductForm && (
        <ProductModal
          form={productForm}
          setForm={setProductForm}
          editing={
            !!editingProduct
          }
          onClose={() => {
            setShowProductForm(
              false
            );
            setEditingProduct(
              null
            );
          }}
          onSubmit={saveProduct}
        />
      )}

      {showStaffForm && editingStaff && (
        <StaffModal
          member={editingStaff}
          form={staffForm}
          setForm={setStaffForm}
          onClose={() => {
            setShowStaffForm(false);
            setEditingStaff(null);
          }}
          onSubmit={saveStaff}
        />
      )}

    </div>
  );
};

// =====================================================
// SIDEBAR BUTTON
// =====================================================

const SidebarButton = ({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        transition
        ${
          active
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
};

// =====================================================
// DASHBOARD HOME
// =====================================================

const DashboardHome = ({
  products,
  activeProducts,
  staff,
  pendingStaff,
  approvedStaff,
  setActiveTab,
}: {
  products: Product[];
  activeProducts: number;
  staff: Staff[];
  pendingStaff: number;
  approvedStaff: number;
  setActiveTab: (
    tab: "dashboard" | "products" | "staff"
  ) => void;
}) => {
  return (
    <div className="space-y-8">

      {/* STAT CARDS */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Products"
          value={
            products.length
          }
          icon={
            <Package size={22} />
          }
          description="All products"
        />

        <StatCard
          title="Active Products"
          value={activeProducts}
          icon={
            <ShoppingBag
              size={22}
            />
          }
          description="Currently active"
        />

        <StatCard
          title="Pending Staff"
          value={pendingStaff}
          icon={
            <Clock size={22} />
          }
          description="Awaiting approval"
        />

        <StatCard
          title="Approved Staff"
          value={approvedStaff}
          icon={
            <UserCheck
              size={22}
            />
          }
          description="Active staff"
        />

      </div>

      {/* QUICK ACTIONS */}

      <div>

        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <QuickAction
            icon={
              <Plus size={21} />
            }
            title="Add Product"
            description="Create a new product"
            onClick={() =>
              setActiveTab(
                "products"
              )
            }
          />

          <QuickAction
            icon={
              <Package size={21} />
            }
            title="Manage Products"
            description="View and edit products"
            onClick={() =>
              setActiveTab(
                "products"
              )
            }
          />

          <QuickAction
            icon={
              <Users size={21} />
            }
            title="Manage Staff"
            description="Approve or manage staff"
            onClick={() =>
              setActiveTab(
                "staff"
              )
            }
          />

        </div>

      </div>

      {/* RECENT PRODUCTS */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-5">

          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Products
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recently added products
            </p>
          </div>

          <button
            onClick={() =>
              setActiveTab(
                "products"
              )
            }
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            View all
          </button>

        </div>

        <div className="divide-y divide-slate-100">

          {products
            .slice(0, 4)
            .map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 p-5"
              >

                <div className="flex items-center gap-4">

                  {product.imageUrl ? (
                    <img
                      src={
                        getDisplayImageUrl(product.imageUrl)
                      }
                      alt={
                        product.name
                      }
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <Package
                        size={20}
                      />
                    </div>
                  )}

                  <div>

                    <p className="font-medium text-slate-900">
                      {product.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {
                        product.category
                      }
                    </p>

                  </div>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    product.active
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {product.active
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>
            ))}

        </div>

      </div>

    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <TrendingUp
          size={14}
        />
        {description}
      </div>

    </motion.div>
  );
};

// =====================================================
// QUICK ACTION
// =====================================================

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>

      <div>

        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

    </button>
  );
};

// =====================================================
// PRODUCTS SECTION
// =====================================================

const ProductsSection = ({
  products,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}: {
  products: Product[];
  onAdd: () => void;
  onEdit: (
    product: Product
  ) => void;
  onDelete: (
    id: string
  ) => void;
  onToggle: (
    id: string
  ) => void;
}) => {
  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your products.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Product
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Category
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Tag
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="p-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {products.map(
                (product) => (
                  <tr
                    key={
                      product.id
                    }
                    className="hover:bg-slate-50"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        {product.imageUrl ? (
                          <img
                            src={
                              getDisplayImageUrl(product.imageUrl)
                            }
                            alt=""
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                            <Package
                              size={18}
                            />
                          </div>
                        )}

                        <div>

                          <p className="font-medium text-slate-900">
                            {
                              product.name
                            }
                          </p>

                          <p className="max-w-xs truncate text-xs text-slate-500">
                            {
                              product.description
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {
                        product.category
                      }
                    </td>

                    <td className="p-4">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {product.tag ||
                          "-"}
                      </span>

                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex justify-end gap-1">

                        <button
                          onClick={() =>
                            onEdit(
                              product
                            )
                          }
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Pencil
                            size={17}
                          />
                        </button>

                        <button
                          onClick={() =>
                            onToggle(
                              product.id
                            )
                          }
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Toggle status"
                        >
                          {product.active ? (
                            <ToggleRight
                              size={19}
                            />
                          ) : (
                            <ToggleLeft
                              size={19}
                            />
                          )}
                        </button>

                        <button
                          onClick={() =>
                            onDelete(
                              product.id
                            )
                          }
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {products.length ===
          0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            No products found.
          </div>
        )}

      </div>

    </div>
  );
};

// =====================================================
// STAFF SECTION
// =====================================================

const StaffSection = ({
  staff,
  onEdit,
  onStatusChange,
  onDelete,
}: {
  staff: Staff[];
  onEdit: (member: Staff) => void;
  onStatusChange: (
    id: string,
    status: Staff["status"]
  ) => void;
  onDelete: (
    id: string
  ) => void;
}) => {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Staff
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage staff members and approvals.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Staff
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Employee ID
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Department
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Phone
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Role
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="p-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {staff.map(
                (member) => (
                  <tr
                    key={
                      member.id
                    }
                    className="hover:bg-slate-50"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {member.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <p className="font-medium text-slate-900">
                            {
                              member.name
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              member.email
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {
                        member.employeeId
                      }
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {
                        member.department
                      }
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {member.phone || "-"}
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {member.role}
                    </td>

                    <td className="p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          member.status ===
                          "Approved"
                            ? "bg-green-100 text-green-700"
                            : member.status ===
                              "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {
                          member.status
                        }
                      </span>

                    </td>

                    <td className="p-4">

                      <div className="flex justify-end gap-1">

                        <button
                          onClick={() => onEdit(member)}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Edit staff member"
                        >
                          <Pencil size={17} />
                        </button>

                        {member.status !==
                          "Approved" && (
                          <button
                            onClick={() =>
                              onStatusChange(
                                member.id,
                                "Approved"
                              )
                            }
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                            title="Approve"
                          >
                            <Check
                              size={17}
                            />
                          </button>
                        )}

                        {member.status !==
                          "Rejected" && (
                          <button
                            onClick={() =>
                              onStatusChange(
                                member.id,
                                "Rejected"
                              )
                            }
                            className="rounded-lg p-2 text-orange-600 hover:bg-orange-50"
                            title="Reject"
                          >
                            <XCircle
                              size={17}
                            />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            onDelete(
                              member.id
                            )
                          }
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

// =====================================================
// STAFF MODAL
// =====================================================

const StaffModal = ({
  member,
  form,
  setForm,
  onClose,
  onSubmit,
}: {
  member: Staff;
  form: {
    name: string;
    role: string;
    employeeId: string;
    phone: string;
    department: string;
    status: Staff["status"];
  };
  setForm: React.Dispatch<React.SetStateAction<{
    name: string;
    role: string;
    employeeId: string;
    phone: string;
    department: string;
    status: Staff["status"];
  }>>;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <form onSubmit={onSubmit} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Edit Staff Member</h2>
          <p className="text-sm text-slate-500">{member.email}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} placeholder="Staff name" />
        <InputField label="Employee ID" value={form.employeeId} onChange={(employeeId) => setForm({ ...form, employeeId })} placeholder="Employee ID" />
        <InputField label="Department" value={form.department} onChange={(department) => setForm({ ...form, department })} placeholder="Department" />
        <InputField label="Phone" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} placeholder="Phone number" />

        <label className="block text-sm font-medium text-slate-700">
          Role
          <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Status
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Staff["status"] })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400">
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t pt-5">
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium">Cancel</button>
        <button type="submit" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Save Changes</button>
      </div>
    </form>
  </div>
);

// =====================================================
// PRODUCT MODAL
// =====================================================

const ProductModal = ({
  form,
  setForm,
  editing,
  onClose,
  onSubmit,
}: {
  form: {
    name: string;
    category: string;
    description: string;
    tag: string;
    imageUrl: string;
    active: boolean;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      category: string;
      description: string;
      tag: string;
      imageUrl: string;
      active: boolean;
    }>
  >;
  editing: boolean;
  onClose: () => void;
  onSubmit: (
    e: React.FormEvent
  ) => void;
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {editing
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <p className="text-xs text-slate-500">
              Enter product details below.
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-5"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <InputField
              label="Product Name"
              value={form.name}
              onChange={(value) =>
                setForm({
                  ...form,
                  name: value,
                })
              }
              placeholder="Enter product name"
            />

            <InputField
              label="Category"
              value={
                form.category
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  category:
                    value,
                })
              }
              placeholder="Enter category"
            />

            <InputField
              label="Tag"
              value={form.tag}
              onChange={(value) =>
                setForm({
                  ...form,
                  tag: value,
                })
              }
              placeholder="Eco Friendly"
            />

            <InputField
              label="Image URL"
              value={
                form.imageUrl
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  imageUrl:
                    value,
                })
              }
              placeholder="https://..."
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              rows={4}
              placeholder="Enter product description"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

          </div>

          <label className="flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              checked={
                form.active
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  active:
                    e.target.checked,
                })
              }
              className="h-4 w-4"
            />

            <span className="text-sm text-slate-700">
              Product is active
            </span>

          </label>

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {editing
                ? "Update Product"
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

// =====================================================
// INPUT FIELD
// =====================================================

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
}) => {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />

    </div>
  );
};
