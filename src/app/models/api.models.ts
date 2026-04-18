/** Contratos alineados con el backend FastAPI. */

// ─── Usuario ───────────────────────────────────────────────
export interface UsuarioRead {
  id_usuario: string;
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  rol: string;
  telefono: string | null;
  activo: boolean;
}

export interface UsuarioCreate {
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  clave: string;
  rol: string;
  telefono?: string | null;
  activo?: boolean;
}

export interface UsuarioUpdate {
  nombre_completo?: string;
  nombre_usuario?: string;
  email?: string;
  clave?: string;
  rol?: string;
  telefono?: string | null;
  activo?: boolean;
}

// ─── Titular ───────────────────────────────────────────────
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

// ─── Visitante ─────────────────────────────────────────────
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

// ─── Atracciones ───────────────────────────────────────────
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

// ─── Categoría ─────────────────────────────────────────────
export interface CategoriaRead {
  id_categoria: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
  estado?: boolean;
  id_usuario_creacion: string;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string | null;
  estado?: boolean;
  id_usuario_edita: string;
}

// ─── Producto ──────────────────────────────────────────────
export interface ProductoRead {
  id_producto: string;
  id_categoria: string;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface ProductoCreate {
  id_categoria: string;
  nombre: string;
  descripcion?: string | null;
  id_usuario_creacion: string;
}

export interface ProductoUpdate {
  id_categoria?: string;
  nombre?: string;
  descripcion?: string | null;
  id_usuario_edita: string;
}

// ─── Pedido ────────────────────────────────────────────────
export interface PedidoRead {
  id_pedido: string;
  id_usuario: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface PedidoCreate {
  id_usuario: string;
  nombre: string;
  descripcion?: string | null;
  estado?: string | null;
  id_usuario_creacion: string;
}

export interface PedidoUpdate {
  id_usuario?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: string | null;
  id_usuario_edita: string;
}

// ─── Detalle Pedido ────────────────────────────────────────
export interface DetallePedidoRead {
  id_detalle_pedido: string;
  id_pedido: string;
  id_producto: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
}

export interface DetallePedidoCreate {
  id_pedido: string;
  id_producto: string;
  nombre: string;
  descripcion?: string | null;
  estado?: string | null;
}

export interface DetallePedidoUpdate {
  id_pedido?: string;
  id_producto?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: string | null;
}

// ─── Pago ──────────────────────────────────────────────────
export interface PagoRead {
  id_pago: string;
  id_pedido: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
  referencia: string;
  tipo_pago: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface PagoCreate {
  id_pedido: string;
  nombre: string;
  descripcion?: string | null;
  estado?: string | null;
  referencia: string;
  tipo_pago: string;
  id_usuario_creacion: string;
}

export interface PagoUpdate {
  id_pedido?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: string | null;
  referencia?: string;
  tipo_pago?: string;
  id_usuario_edita: string;
}