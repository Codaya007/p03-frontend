import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Página principal</h1>
      <p>Para acceder al sistema presione el botón Acceder</p>
    </main>
  );
}
