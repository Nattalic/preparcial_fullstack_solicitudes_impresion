import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import type { Printer } from "../../../lib/print-types";
import { redirect } from "next/navigation";

async function createPrintRequest(formData: FormData) {
  "use server";

  // TODO C: leer el formulario y enviar el POST con apiFetch.
    const response = await apiFetch("/print-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      pages: Number(formData.get("pages")),
      printerId: Number(formData.get("printerId")),
    }),
  });
  // TODO C: solo si responde 201, leer el id de la respuesta y abrir el comprobante.
  if (response?.status !== 201) redirect("/print-requests/new?error=api");

  const request = await response.json().catch(() => null);
  const id = request?.id;
  if (typeof id !== "number" || !Number.isSafeInteger(id) || id < 1) {
    redirect("/print-requests/new?error=receipt");
  }

  redirect(`/print-requests/${id}`);

}

export default async function NewPrintRequestPage() {
  // La carga de impresoras ya está preparada; usar una sesión iniciada.
  const response = await apiFetch("/printers");
  const printers: Printer[] = response.ok ? await response.json() : [];

  return (
    <main>
      <h1>Nueva solicitud</h1>
      <Link href="/print-requests">Volver al listado</Link>
      <form className="panel fields" action={createPrintRequest}>
        <label>Título del documento<input name="title" maxLength={100} required /></label>
        <label>Páginas<input name="pages" type="number" min={1} step={1} required /></label>
        <label>
          Impresora
          <select name="printerId" defaultValue="" required>
            <option value="" disabled>Seleccionar una impresora</option>
            {printers.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.name}{printer.isAvailable ? " — disponible" : " — fuera de servicio"}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Enviar solicitud</button>
      </form>
    </main>
  );
}
