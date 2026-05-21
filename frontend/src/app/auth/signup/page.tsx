// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { authService } from "@/services/authService";
// import { Header } from "@/components/Header";
// import styles from "./page.module.scss";

// export default function SignUp() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     slug: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("As senhas não correspondem");
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await authService.signup(
//         formData.name,
//         formData.email,
//         formData.password,
//         formData.slug
//       );

//       authService.setToken(result.token);
//       router.push("/dashboard");
//     } catch (err: any) {
//       setError(err.response?.data?.error || "Erro ao criar conta");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className={styles.container}>
//         <div className={styles.formWrapper}>
//           <h1>Criar Conta</h1>
//           <p>Comece seu catálogo em minutos</p>

//           {error && <div className={styles.error}>{error}</div>}

//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.formGroup}>
//               <label htmlFor="name">Nome da Empresa *</label>
//               <input
//                 id="name"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Minha Loja"
//                 required
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="email">Email *</label>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="seu@email.com"
//                 required
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="slug">
//                 URL do Catálogo *
//                 <span className={styles.hint}>minhaurl.com/catalog/seu-slug</span>
//               </label>
//               <input
//                 id="slug"
//                 type="text"
//                 name="slug"
//                 value={formData.slug}
//                 onChange={handleChange}
//                 placeholder="minha-loja"
//                 pattern="^[a-z0-9\-]+$"
//                 title="Apenas letras minúsculas, números e hífens"
//                 required
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="password">Senha *</label>
//               <input
//                 id="password"
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Mínimo 6 caracteres"
//                 minLength={6}
//                 required
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label htmlFor="confirmPassword">Confirmar Senha *</label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Repita a senha"
//                 minLength={6}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={styles.submitButton}
//             >
//               {loading ? "Criando conta..." : "Criar Conta"}
//             </button>
//           </form>

//           <p className={styles.link}>
//             Já tem conta? <Link href="/auth/login">Faça login</Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { Header } from "@/components/Header";
import styles from "./page.module.scss";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    slug: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    setLoading(true);

    try {
      // Corrigido: Passando os 4 argumentos soltos na ordem exata esperada pelo service
      const result = await authService.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.slug
      );

      authService.setToken(result.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1>Criar Conta</h1>
          <p>Comece seu catálogo em minutos</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome da Empresa *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Minha Loja"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="slug">
                URL do Catálogo *
                <span className={styles.hint}>minhaurl.com/catalog/seu-slug</span>
              </label>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="minha-loja"
                pattern="^[a-z0-9\-]+$"
                title="Apenas letras minúsculas, números e hífens"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Senha *</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha *</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword" // Corrigido: removido o name="password" duplicado daqui
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          <p className={styles.link}>
            Já tem conta? <Link href="/auth/login">Faça login</Link>
          </p>
        </div>
      </div>
    </>
  );
}