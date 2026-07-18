// Limitador de tasa de intentos en memoria para Server Actions de Next.js

interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}

class LoginRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos en milisegundos

  /**
   * Obtiene la llave única para el limitador (combina IP y correo para evitar evasión)
   */
  private getStoreKey(ip: string, email: string): string {
    const cleanIp = ip.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    return `${cleanIp}:${cleanEmail}`;
  }

  /**
   * Verifica si una solicitud de inicio de sesión está bloqueada actualmente
   * Retorna los segundos restantes de bloqueo, o 0 si no está bloqueado
   */
  public getLockoutTimeRemaining(ip: string, email: string): number {
    const key = this.getStoreKey(ip, email);
    const record = this.store.get(key);

    if (!record) return 0;

    const now = Date.now();
    if (now < record.lockoutUntil) {
      return Math.ceil((record.lockoutUntil - now) / 1000); // Retorna segundos restantes
    }

    // Si ya pasó el tiempo de bloqueo, limpiar el registro viejo
    if (record.attempts >= this.MAX_ATTEMPTS) {
      this.store.delete(key);
    }
    return 0;
  }

  /**
   * Registra un intento fallido de inicio de sesión
   */
  public registerFailure(ip: string, email: string): { attempts: number; locked: boolean } {
    const key = this.getStoreKey(ip, email);
    const record = this.store.get(key) || { attempts: 0, lockoutUntil: 0 };

    record.attempts += 1;

    if (record.attempts >= this.MAX_ATTEMPTS) {
      record.lockoutUntil = Date.now() + this.LOCKOUT_DURATION;
    }

    this.store.set(key, record);

    return {
      attempts: record.attempts,
      locked: record.attempts >= this.MAX_ATTEMPTS,
    };
  }

  /**
   * Limpia los intentos fallidos al iniciar sesión con éxito
   */
  public reset(ip: string, email: string): void {
    const key = this.getStoreKey(ip, email);
    this.store.delete(key);
  }
}

// Exportar una instancia global compartida (singleton en NodeJS)
export const loginRateLimiter = new LoginRateLimiter();
