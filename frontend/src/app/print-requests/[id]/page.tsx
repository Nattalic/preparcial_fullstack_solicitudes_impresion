import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import type { PrintRequest } from "../../../lib/print-types";

type PrintRequestDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function PrintRequestDetailPage({ params }: PrintRequestDetailProps) {
  // TODO C: leer id de params y consultar la solicitud mediante apiFetch.
    const { id } = await params;
    const requestId = Number(id);
    if (!Number.isSafeInteger(requestId) || requestId < 1 || String(requestId) !== id) {
      notFound();
    }

    const response = await apiFetch(`/print-requests/${requestId}`);
    if (response?.status === 404) notFound();

    const request: PrintRequest | null = response.ok
      ? await response.json().catch(() => null)
      : null;

  // TODO C: mostrar los datos del comprobante sin depender del formulario.
  return (
    <main>
      <h1>Comprobante</h1>
      <Link href="/print-requests">Volver al listado</Link>
      <section className="panel" aria-label="Detalle de la solicitud">
        <h2> Solicitud #{requestId}</h2>
        {request ? (
        <>
          <p> Id: {request.id} </p>
          <p> Título: {request.title} </p>
          <p> Páginas: {request.pages} </p>
          <p> Impresora: {request.printer.name} </p>
          <p> Estado: {request.status === "printed" ? "Impreso" : "Pendiente"}</p>
        </>
      ) : (
        <p role="alert">No se pudo consultar la solicitud.</p>
      )}
      </section>
    </main>
  );
}
