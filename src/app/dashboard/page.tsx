export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bienvenido al Panel de Control</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Usuarios Activos</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Inventario Total</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Alertas</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}