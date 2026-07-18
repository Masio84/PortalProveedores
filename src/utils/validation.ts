// Utilerías de Validación y Sanitización para Evitar Inyecciones (SQLi/XSS)

/**
 * Sanitiza texto plano eliminando etiquetas HTML y caracteres peligrosos de inyección
 */
export function sanitizeText(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  
  // Convertir a cadena y recortar espacios vacíos
  let clean = String(value).trim();
  
  // Reemplazar caracteres especiales de HTML para evitar XSS
  clean = clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return clean;
}

/**
 * Valida el formato de un correo electrónico
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Valida que un teléfono tenga exactamente 10 dígitos
 */
export function isValidTelefono(telefono: string): boolean {
  const telRegex = /^\d{10}$/;
  return telRegex.test(telefono);
}

/**
 * Valida el formato del RFC mexicano (Físico o Moral)
 * - Persona Moral: 3 letras, 6 números, 3 alfanuméricos de homoclave (12 chars total)
 * - Persona Física: 4 letras, 6 números, 3 alfanuméricos de homoclave (13 chars total)
 */
export function isValidRFC(rfc: string): boolean {
  const cleanRFC = rfc.trim().toUpperCase();
  const rfcRegex = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})$/;
  return rfcRegex.test(cleanRFC);
}

/**
 * Valida el formato del CURP mexicano (18 caracteres estructurados)
 */
export function isValidCURP(curp: string): boolean {
  const cleanCURP = curp.trim().toUpperCase();
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/;
  return curpRegex.test(cleanCURP);
}

/**
 * Valida la Clave de Elector del INE (18 caracteres alfanuméricos)
 */
export function isValidINE(ine: string): boolean {
  const cleanINE = ine.trim().toUpperCase();
  const ineRegex = /^[A-Z\d]{18}$/;
  return ineRegex.test(cleanINE);
}

/**
 * Valida la CLABE Interbancaria de México (18 dígitos numéricos exactos)
 */
export function isValidCLABE(clabe: string): boolean {
  const cleanCLABE = clabe.trim();
  const clabeRegex = /^\d{18}$/;
  return clabeRegex.test(cleanCLABE);
}

/**
 * Valida un Código Postal mexicano (5 dígitos numéricos exactos)
 */
export function isValidCP(cp: string): boolean {
  const cleanCP = cp.trim();
  const cpRegex = /^\d{5}$/;
  return cpRegex.test(cleanCP);
}

/**
 * Valida que un porcentaje esté entre 0 y 100
 */
export function isValidPorcentaje(porcentaje: number | string): boolean {
  const num = Number(porcentaje);
  return !isNaN(num) && num >= 0 && num <= 100;
}
