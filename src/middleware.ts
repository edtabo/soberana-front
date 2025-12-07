import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = ["/"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  console.log("--- MIDDLEWARE EXECUTING ---");
  console.log("Path:", pathname);
  console.log("All Cookies:", req.cookies.getAll());
  console.log("Token Value:", token);

  const isPublicRoute = publicRoutes.includes(pathname);

  let isValid = false;

  if (token) {
    try {
      // Usamos decode para leer la expiración sin verificar firma (evita crash en Edge)
      const decoded = jwt.decode(token) as { exp?: number; } | null;
      const currentTime = Math.floor(Date.now() / 1000);

      // Validar si existe y no ha expirado
      if (decoded && decoded.exp && decoded.exp > currentTime) {
        isValid = true;
      }
    } catch (error) {
      console.error("Error al decodificar token en middleware:", error);
      isValid = false;
    }
  }

  // 1. Usuario autenticado en ruta pública (ej: Login) -> Redirigir a Dashboard
  if (isValid && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Usuario NO autenticado en ruta protegida -> Redirigir a Login
  if (!isValid && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. Todo correcto -> Continuar
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
