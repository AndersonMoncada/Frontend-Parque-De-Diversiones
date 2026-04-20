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

// Titular
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

// Visitante
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

// Atracciones
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

export interface MecanicaRead {
  id_mecanica: string;
  id_atraccion: string;
}

export interface MecanicaCreate {
  id_atraccion: string;
}

export interface FisicaRead {
  id_fisica: string;
  id_atraccion: string;
}

export interface FisicaCreate {
  id_atraccion: string;
}