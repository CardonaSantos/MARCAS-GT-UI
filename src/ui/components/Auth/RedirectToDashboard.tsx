// import { useStore } from "../Context/ContextSucursal";
// import { Navigate } from "react-router-dom";

// function RedirectToDashboard() {
//   const isAuth = localStorage.getItem("authTokenPos");
//   const userRol = useStore((state) => state.userRol);

//   if (!isAuth) {
//     return <Navigate to="/login" />;
//   }

//   if (userRol === "ADMIN") {
//     return <Navigate to="/dashboard" />;
//   }

//   if (userRol === "EMPLOYEE") {
//     return <Navigate to="/dashboard-empleado" />;
//   }

//   return <Navigate to="/login" />;
// }
