import Link from "next/link";
import { redirect } from "next/navigation";
import { clearSessionToken } from "../../lib/session";

async function logout() {
  "use server";
  await clearSessionToken();
  redirect("/login");
}

export default function PrintRequestsPage() {
  // TODO B: recibir searchParams, pedir el listado con apiFetch y mostrar las solicitudes.
  // TODO B: agregar los enlaces Todas y Pendientes debajo de la navegación de acciones.
  return (
    <main>
      <h1>Solicitudes de impresión</h1>
      <div className="actions">
        <Link className="button" href="/print-requests/new">Nueva solicitud</Link>
        <form action={logout}><button type="submit">Cerrar sesión</button></form>
      </div>
      <section className="panel" aria-label="Solicitudes">
        <p>Espacio para el listado del preparcial.</p>
      </section>
    </main>
  );
}
