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

}
