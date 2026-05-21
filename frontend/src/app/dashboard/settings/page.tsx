"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("❌ Você precisa estar autenticado");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompany(data);
        setPhone(data.phone || "");
      } else {
        setMessage("❌ Erro ao carregar dados da empresa");
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("❌ Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setMessage("❌ Por favor, preencha o número de telefone");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/company/phone`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompany(data.data);
        setMessage("✅ Número salvo com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await response.json();
        setMessage(`❌ Erro: ${error.error || "Erro ao salvar"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("❌ Erro ao salvar número");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>⚙️ Configurações</h1>

        {company && (
          <div className={styles.section}>
            <div className={styles.companyInfo}>
              <h2>Informações da Empresa</h2>
              <p className={styles.infoItem}>
                <strong>Nome:</strong> {company.name}
              </p>
              <p className={styles.infoItem}>
                <strong>Email:</strong> {company.email}
              </p>
            </div>

            <div className={styles.section}>
              <h2>📱 WhatsApp para Receber Pedidos</h2>
              <p className={styles.description}>
                Configure seu número WhatsApp para receber os pedidos dos
                clientes automaticamente quando eles finalizarem a compra.
              </p>

              <form onSubmit={handleSavePhone} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Número WhatsApp</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+55 11 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={saving}
                    className={styles.input}
                  />
                  <small>
                    Formato recomendado: +55 11 999999999 ou (11) 99999-9999
                  </small>
                </div>

                {message && (
                  <div
                    className={
                      message.includes("✅") ? styles.success : styles.error
                    }
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className={styles.btn}
                >
                  {saving ? "Salvando..." : "💾 Salvar Número"}
                </button>
              </form>

              {company.phone && (
                <div className={styles.info}>
                  <h3>✅ Número cadastrado</h3>
                  <p className={styles.phoneDisplay}>{company.phone}</p>
                  <p className={styles.infoText}>
                    Os clientes receberão um link para enviar mensagens para
                    este número quando finalizarem a compra.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <h2>ℹ️ Como Funciona?</h2>
              <div className={styles.helpBox}>
                <ol>
                  <li>
                    <strong>Cliente acessa seu catálogo</strong> e adiciona
                    produtos ao carrinho
                  </li>
                  <li>
                    <strong>Cliente clica "Finalizar via WhatsApp"</strong> e
                    preenche seus dados
                  </li>
                  <li>
                    <strong>WhatsApp abre automaticamente</strong> com a lista
                    de compra pré-preenchida
                  </li>
                  <li>
                    <strong>Você recebe a mensagem</strong> com os dados do
                    cliente e produtos
                  </li>
                  <li>
                    <strong>Você confirma e envia a cotação</strong> via
                    WhatsApp
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
