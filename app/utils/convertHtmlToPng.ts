import { toPng } from 'html-to-image';


interface ExportOptions {
  fileName?: string;
  backgroundColor?: string;
  pixelRatio?: number;
}

export const convertHtmlToPng = async (element: HTMLElement | null | undefined, 
  options: ExportOptions = {}): Promise<boolean> => {

    if (!element) {
        console.error('Export Utility: No se proporcionó un elemento HTML válido.');
        return false;
    }

    const {
        fileName = `captura-${Date.now()}.png`,
        backgroundColor = '#ffffff', // Evita transparencias
        pixelRatio = 2 // Duplica la resolución para pantallas Retina/celulares (evita textos borrosos)
    } = options;

    try {
    // 1. Convertir el HTML a Base64 PNG
    const dataUrl = await toPng(element, { backgroundColor, pixelRatio });

    // 2. Crear un enlace oculto en el navegador para forzar la descarga
    const link = document.createElement('a');
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    link.href = dataUrl;
    
    // 3. Disparar el click y limpiar el DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Export Utility: Error al generar la imagen PNG:', error);
    return false;
  }

};