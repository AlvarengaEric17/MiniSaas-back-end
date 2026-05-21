"use client";

import { useState, useEffect } from "react";
import { adminService, type Company, type AdminStats } from "@/services/adminService";
import styles from "./page.module.scss";

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingMaxProducts, setEditingMaxProducts] = useState<{ [key: string]: number }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify admin credentials by fetching companies
      await adminService.getCompanies(adminEmail, adminPassword);
      setIsLoggedIn(true);
      localStorage.setItem("adminEmail", adminEmail);
      localStorage.setItem("adminPassword", adminPassword);
      fetchData();
    } catch (err) {
      setError("Invalid email, password or access denied");
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!adminEmail || !adminPassword) return;

    setLoading(true);
    setError("");

    try {
      const [companiesData, statsData] = await Promise.all([
        adminService.getCompanies(adminEmail, adminPassword),
        adminService.getStats(adminEmail, adminPassword)
      ]);

      setCompanies(companiesData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (company: Company) => {
    setUpdatingId(company.id);
    setError("");

    try {
      const updatedCompany = await adminService.updateCompanyPremium(
        company.id,
        !company.premium,
        undefined,
        adminEmail,
        adminPassword
      );

      setCompanies(
        companies.map(c =>
          c.id === updatedCompany.id ? updatedCompany : c
        )
      );

      // Refresh stats
      const newStats = await adminService.getStats(adminEmail, adminPassword);
      setStats(newStats);
    } catch (err) {
      setError(`Failed to update ${company.name}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMaxProductsChange = (companyId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setEditingMaxProducts(prev => ({
      ...prev,
      [companyId]: numValue
    }));
  };

  const updateMaxProducts = async (company: Company) => {
    const newMaxProducts = editingMaxProducts[company.id];

    if (newMaxProducts === undefined) return;

    setUpdatingId(company.id);
    setError("");

    try {
      const updatedCompany = await adminService.updateCompanyPremium(
        company.id,
        company.premium,
        newMaxProducts,
        adminEmail,
        adminPassword
      );

      setCompanies(
        companies.map(c =>
          c.id === updatedCompany.id ? updatedCompany : c
        )
      );

      setEditingMaxProducts(prev => {
        const newState = { ...prev };
        delete newState[company.id];
        return newState;
      });

      // Refresh stats
      const newStats = await adminService.getStats(adminEmail, adminPassword);
      setStats(newStats);
    } catch (err) {
      setError(`Failed to update max products for ${company.name}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminEmail("");
    setAdminPassword("");
    setCompanies([]);
    setStats(null);
    setEditingMaxProducts({});
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminPassword");
  };

  // Load saved admin credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("adminEmail");
    const savedPassword = localStorage.getItem("adminPassword");
    if (savedEmail && savedPassword) {
      setAdminEmail(savedEmail);
      setAdminPassword(savedPassword);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch data when logged in
  useEffect(() => {
    if (isLoggedIn && adminEmail) {
      fetchData();
    }
  }, [isLoggedIn, adminEmail]);

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1>Admin Dashboard</h1>
          <p>Enter your credentials to access</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Admin email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Companies</h3>
            <p className={styles.statValue}>{stats.totalCompanies}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Premium Companies</h3>
            <p className={styles.statValue}>{stats.premiumCompanies}</p>
            <span className={styles.statSub}>{stats.premiumPercentage}</span>
          </div>
          <div className={styles.statCard}>
            <h3>Free Companies</h3>
            <p className={styles.statValue}>{stats.freeCompanies}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Products</h3>
            <p className={styles.statValue}>{stats.totalProducts}</p>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2>Companies Management</h2>

        {loading ? (
          <p className={styles.loading}>Loading companies...</p>
        ) : companies.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Slug</th>
                  <th>Products</th>
                  <th>Max Products</th>
                  <th>Premium</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company.id} className={styles.tableRow}>
                    <td className={styles.name}>{company.name}</td>
                    <td>{company.email}</td>
                    <td>{company.slug}</td>
                    <td className={styles.centered}>{company._count.products}</td>
                    <td className={styles.centered}>
                      {editingMaxProducts[company.id] !== undefined ? (
                        <div className={styles.editMaxProducts}>
                          <input
                            type="number"
                            value={editingMaxProducts[company.id]}
                            onChange={(e) => handleMaxProductsChange(company.id, e.target.value)}
                            min="1"
                            max="1000"
                          />
                          <button
                            onClick={() => updateMaxProducts(company)}
                            disabled={updatingId === company.id}
                            className={styles.btnSave}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingMaxProducts(prev => {
                              const newState = { ...prev };
                              delete newState[company.id];
                              return newState;
                            })}
                            disabled={updatingId === company.id}
                            className={styles.btnCancel}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className={styles.editMaxProductsView}>
                          <span>{company.maxProducts}</span>
                          <button
                            onClick={() => setEditingMaxProducts(prev => ({
                              ...prev,
                              [company.id]: company.maxProducts
                            }))}
                            disabled={updatingId === company.id}
                            className={styles.btnEdit}
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>
                    <td className={styles.centered}>
                      <span className={company.premium ? styles.premiumBadge : styles.freeBadge}>
                        {company.premium ? "✓ Premium" : "Free"}
                      </span>
                    </td>
                    <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => togglePremium(company)}
                        disabled={updatingId === company.id}
                        className={
                          company.premium
                            ? styles.btnRemovePremium
                            : styles.btnAddPremium
                        }
                      >
                        {updatingId === company.id
                          ? "Updating..."
                          : company.premium
                          ? "Remove Premium"
                          : "Add Premium"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.empty}>No companies found</p>
        )}
      </div>
    </div>
  );
}
