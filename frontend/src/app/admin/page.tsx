"use client";

import { useState, useEffect } from "react";
import { adminService, type Company, type AdminStats } from "@/services/adminService";
import styles from "./page.module.scss";

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      setError("Please enter your admin email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify admin credentials by fetching companies
      await adminService.getCompanies(adminEmail);
      setIsLoggedIn(true);
      localStorage.setItem("adminEmail", adminEmail);
      fetchData();
    } catch (err) {
      setError("Invalid admin email or access denied");
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!adminEmail) return;

    setLoading(true);
    setError("");

    try {
      const [companiesData, statsData] = await Promise.all([
        adminService.getCompanies(adminEmail),
        adminService.getStats(adminEmail)
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
        adminEmail
      );

      setCompanies(
        companies.map(c =>
          c.id === updatedCompany.id ? updatedCompany : c
        )
      );

      // Refresh stats
      const newStats = await adminService.getStats(adminEmail);
      setStats(newStats);
    } catch (err) {
      setError(`Failed to update ${company.name}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminEmail("");
    setCompanies([]);
    setStats(null);
    localStorage.removeItem("adminEmail");
  };

  // Load saved admin email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
      setAdminEmail(savedEmail);
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
          <p>Enter your admin email to access the dashboard</p>

          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="email"
              placeholder="Admin email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
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
                    <td className={styles.centered}>{company.maxProducts}</td>
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
