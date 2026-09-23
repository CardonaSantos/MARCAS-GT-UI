import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { VentaHistorialPDF } from "@/Types/PDF/VentaHistorialPDF";
import TicketPDF from "./TicketPDF";
const API_URL = import.meta.env.VITE_API_URL;
interface Sorteo {
  id: number;
  descripcionSorteo: string;
  creadoEn: string;
  actualizadoEn: string;
  estado: string;
}
function TicketPage() {
  const [sorteo, setSorteo] = useState<Sorteo | null>(null);

  useEffect(() => {
    const getTicketFormar = async () => {
      try {
        const response = await axios.get(`${API_URL}/ticket`);
        if (response.status === 200 && response.data.length > 0) {
          // Selecciona el primer elemento si el array tiene datos
          setSorteo(response.data[0]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir modelo de ticket");
      }
    };
    getTicketFormar();
  }, []);

  // Obtén el parámetro id de la URL
  const { id } = useParams();
  const [venta, setVenta] = useState<VentaHistorialPDF>();

  const getSale = async () => {
    try {
      const response = await axios.get(`${API_URL}/venta/get-sale/${id}`);
      if (response.status === 200) {
        setVenta(response.data);
      }
    } catch (error) {
      console.log("Error al conseguir el registro de venta");
      toast.error("Error al encontrar registro de venta");
    }
  };

  useEffect(() => {
    getSale();
  }, [id]);

  return (
    <div>
      {venta && sorteo ? (
        <PDFViewer width="100%" height="600">
          <TicketPDF sorteo={sorteo} venta={venta} />
        </PDFViewer>
      ) : (
        <p className="text-center font-extrabold text-xl">Cargando PDF</p>
      )}
    </div>
  );
}

export default TicketPage;
