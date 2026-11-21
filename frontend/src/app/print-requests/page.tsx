import Link from "next/link";
import { redirect } from "next/navigation";
import { clearSessionToken } from "../../lib/session";
import { apiFetch } from "../../lib/api";
import type { PrintRequest } from "../../lib/print-types";

async function logout() {
  "use server";
  await clearSessionToken();
  redirect("/login");
}

type PrintRequestsPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function PrintRequestsPage({ searchParams }: PrintRequestsPageProps) {
  // TODO B: recibir searchParams, pedir el listado con apiFetch y mostrar las solicitudes.
  const { status } = await searchParams;
  const selectedStatus = status === "pending" || status === "printed" ? status : undefined;
  const endpointURL = selectedStatus
    ? `/print-requests?status=${selectedStatus}`
    : "/print-requests";

  const response = await apiFetch(endpointURL);
  const data = response?.ok ? await response.json().catch(() => null) : null;
  const requests: PrintRequest[] | null = Array.isArray(data) ? data : null;
  
  // TODO B: agregar los enlaces Todas y Pendientes debajo de la navegación de acciones.
  return (
    <main>
      <h1>Solicitudes de impresión</h1>
      <div className="actions">
        <Link className="button" href="/print-requests/new">Nueva solicitud</Link>
        <form action={logout}><button type="submit">Cerrar sesión</button></form>
      </div>
      <div>
        <Link href="/print-requests"> Todas </Link>
        <Link href="/print-requests/?status=pending"> Pendientes </Link>
      </div>
        {requests === null && <p role="alert">No se pudieron consultar las solicitudes.</p>}
      {requests?.length === 0 && <p>No hay solicitudes para mostrar.</p>}
      {requests && requests.length > 0 && (
        <section className="orders-grid" aria-label="Solicitudes">
          {requests.map((request) => (
            <article key={request.id}>
              <h2>{request.title}</h2>
              <p>Páginas: { request.pages }</p>
              <p>Impresora: { request.printer.name }</p>
              <p>Estado: { request.status}</p>
              <Link href={`/print-requests/${request.id}`}>
                Ver comprobante
              </Link>
            </article>
          ))}
        </section>
        )}
    </main>
  );
}
