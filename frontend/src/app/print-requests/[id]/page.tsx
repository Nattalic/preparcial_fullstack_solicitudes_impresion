import Link from "next/link";

export default function PrintRequestDetailPage() {
  // TODO C: leer id de params y consultar la solicitud mediante apiFetch.
  // TODO C: mostrar los datos del comprobante sin depender del formulario.
  return (
    <main>
      <h1>Comprobante</h1>
      <Link href="/print-requests">Volver al listado</Link>
      <section className="panel" aria-label="Detalle de la solicitud">
        <p>Espacio para los datos del comprobante.</p>
      </section>
    </main>
  );
}
