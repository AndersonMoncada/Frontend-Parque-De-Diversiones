// ---------- USUARIO ----------
export interface UsuarioRead {
  id_usuario: string;
  nombre_usuario: string;
  rol: string;
  activo: boolean;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
}

export interface UsuarioCreate {
  nombre_usuario: string;
  contrasena: string;
  rol?: string;
}

export interface UsuarioUpdate {
  nombre_usuario?: string;
  contrasena?: string;
  rol?: string;
  activo?: boolean;
}

// ---------- TITULAR ----------
export interface TitularRead {
  id_titular: string;
  nombre: string;
  cedula: string;
  telefono: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface TitularCreate {
  nombre: string;
  cedula: string;
  telefono?: string | null;
  id_usuario_creacion: string;
}

export interface TitularUpdate {
  nombre?: string;
  telefono?: string | null;
}

// ---------- VISITANTE ----------
export interface VisitanteRead {
  id_visitante: string;
  nombre_visitante: string;
  edad: number;
  estatura: number;
  id_titular: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface VisitanteCreate {
  nombre_visitante: string;
  edad: number;
  estatura: number;
  id_titular: string;
  id_usuario_creacion: string;
}

export interface VisitanteUpdate {
  nombre_visitante?: string;
  edad?: number;
  estatura?: number;
  id_usuario_edita: string;
}

// ---------- ENTRADA ----------
export interface EntradaRead {
  id_entrada: string;
  codigo: string;
  precio: number;
  reingreso: boolean;
  fecha: string | null;
  id_titular: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface EntradaCreate {
  codigo: string;
  precio: number;
  fecha: string;
  reingreso?: boolean;
  id_titular: string;
  id_usuario_creacion: string;
}

export interface EntradaUpdate {
  precio?: number;
  reingreso?: boolean;
}

// ---------- SEDE ----------
export interface SedeRead {
  id_sede: string;
  nombre: string;
  ubicacion: string;
}

export interface SedeCreate {
  nombre: string;
  ubicacion: string;
}

export interface SedeUpdate {
  nombre?: string;
  ubicacion?: string;
}

// ---------- ATRACCIÓN ----------
export interface AtraccionRead {
  id_atraccion: string;
  nombre: string;
  edad_minima: number;
  estatura_minima: number;
  id_sede: string;
}

export interface AtraccionCreate {
  nombre: string;
  edad_minima: number;
  estatura_minima: number;
  id_sede: string;
}

export interface AtraccionUpdate {
  nombre?: string;
  edad_minima?: number;
  estatura_minima?: number;
}

// ---------- ACUÁTICA ----------
export interface AcuaticaRead {
  id_acuatica: string;
  id_atraccion: string;
  profundidad: number | null;
  capacidad: number;
  propulsion: string;
}

export interface AcuaticaCreate {
  id_atraccion: string;
  profundidad: number;
  capacidad: number;
  propulsion: string;
}

export interface AcuaticaUpdate {
  profundidad?: number;
  capacidad?: number;
  propulsion?: string;
}

// ---------- ELECTRÓNICA ----------
export interface ElectronicaRead {
  id_electronica: string;
  id_atraccion: string;
  experiencia: string;
  equipamiento: string | null;
}

export interface ElectronicaCreate {
  id_atraccion: string;
  experiencia: string;
  equipamiento?: string | null;
}

export interface ElectronicaUpdate {
  experiencia?: string;
  equipamiento?: string | null;
}

// ---------- MECÁNICA ----------
export interface MecanicaRead {
  id_mecanica: string;
  id_atraccion: string;
}

export interface MecanicaCreate {
  id_atraccion: string;
}

// ---------- FÍSICA ----------
export interface FisicaRead {
  id_fisica: string;
  id_atraccion: string;
}

export interface FisicaCreate {
  id_atraccion: string;
}