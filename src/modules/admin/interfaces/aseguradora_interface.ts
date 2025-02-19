export interface Respuesta {
  message: string;
  totalRegistros: number;
  data: Aseguradora[];
}

export interface Aseguradora {
  id_aseguradora: string;
  id_correduria: string;
  nombre: string;
  nombre_gestor: string;
  tel_gestor: string;
  logo: string;
  descripcion: string;
}
