"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function CreateUser() {
  console.log("MI URL DEL SEVER CONECTADO ES:", API_URL);

  const navigate = useNavigate();

  const [comprobarContraseña, setComprobarContraseña] = useState<string>("");
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "",
    empresaId: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rol: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.contrasena != comprobarContraseña) {
      toast.warning("Verifique su contraseña");
      return;
    }

    if (formData.contrasena.length < 8) {
      toast.warning("La contraseña debe ser mayor a 8 caracteres");
      return; // Detener si la contraseña es corta
    }

    if (
      !formData.correo ||
      !formData.nombre ||
      !formData.contrasena ||
      !formData.rol
    ) {
      toast.warning("Faltan campos por llenar");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users`, formData);

      if (response.status === 201) {
        toast.success("Usuario creado");
        const { authToken } = response.data; // Asegúrate de que el backend retorna authToken
        localStorage.setItem("authToken", authToken);
        navigate("/marcas-gt/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el usuario. Intente de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="w-full max-w-md md:max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registro de Usuario</CardTitle>
          <CardDescription>Crea una nueva cuenta de usuario.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  name="correo"
                  placeholder="ejemplo@gmail.com"
                  type="email"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="comprobarContrasena">
                  Comprobar contraseña
                </Label>
                <Input
                  id="comprobarContrasena"
                  name="comprobarContrasena"
                  type="password"
                  required
                  onChange={(e) => setComprobarContraseña(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rol">Rol</Label>
                <Select onValueChange={handleRoleChange} required>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="VENDEDOR">VENDEDOR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full" onClick={handleSubmit}>
            Registrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
