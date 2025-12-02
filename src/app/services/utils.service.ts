import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient) {}

  /**
   * Descarga un archivo PDF desde una URL.
   * @param fileUrl URL del PDF a descargar
   * @param filename Nombre con el que se descargará el archivo (opcional)
   */
  downloadPdf(fileUrl: string, filename: string = 'archivo.pdf'): void {
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
      next: (fileBlob: Blob) => {
        const blob = new Blob([fileBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar PDF: ', err);
      }
    });
  }

  /**
 * Inicia la descarga de un archivo PDF usando su URL firmada.
 * @param signedUrl La URL firmada generada por el backend (GCS).
 * @param filename El nombre deseado para el archivo descargado (ej: "Contrato_123.pdf").
 */
  downloadPdfFromSignedUrl(signedUrl: string, filename: string): void {
      // 1. Crear un elemento de enlace (Anchor Element).
    const link = document.createElement('a');

    // 2. Asignar la URL firmada.
    link.href = signedUrl;

    // 3. Establecer target="_blank" para forzar la apertura en una nueva pestaña.
    link.target = "_blank"; // ⬅️ Cambio clave para nueva pestaña

    // 4. ELIMINAR la propiedad 'download'. 
    //    link.download = filename; // ⬅️ Esta línea se omite.

    // 5. Agregar el enlace temporalmente al cuerpo del documento.
    document.body.appendChild(link);

    // 6. Simular el clic en el enlace para iniciar la navegación.
    link.click();

    // 7. Limpiar el elemento del DOM.
    document.body.removeChild(link);
  }

  formatDate(date: Date | null): string | null {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
