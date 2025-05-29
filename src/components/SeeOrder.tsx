import React, { useState } from 'react'; 
import { getDocumentFirebaseId } from '../services/data-firebase';

const statusSteps = [
  { key: 'pending', label: 'Pendiente' },
  { key: 'processing', label: 'En proceso' },
  { key: 'shipped', label: 'Enviado' },
  { key: 'completed', label: 'Completado' },
];

const SeeOrder: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError('');
    setOrder(null);
    if (!orderId.trim()) {
      setError('Por favor ingresa un ID de compra.');
      return;
    }
    setLoading(true);
    try {
      const result = await getDocumentFirebaseId('orders', orderId.trim());
      if (result) {
        setOrder(result);
      } else {
        setError('No se encontró la orden. Verifica el ID.');
      }
    } catch (e) {
      setError('Ocurrió un error al buscar la orden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-4 sm:p-8 border border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center tracking-tight">Consulta tu Pedido</h1>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Ingresa tu ID de compra"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 text-base sm:text-lg"
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold transition-colors shadow-lg disabled:opacity-60 text-base sm:text-lg"
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
        {order && (
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <span className="text-gray-400 text-xs">ID de compra</span>
                <div className="text-base sm:text-lg font-mono text-yellow-400">{order.idFirestore}</div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${order.estado === 'completed' ? 'bg-green-700 text-green-100' :
                    order.estado === 'shipped' ? 'bg-purple-700 text-purple-100' :
                    order.estado === 'processing' ? 'bg-blue-700 text-blue-100' :
                    'bg-amber-700 text-amber-100'}
                `}>
                  {statusSteps.find(s => s.key === order.estado)?.label}
                </span>
              </div>
            </div>
            {/* Barra de progreso de estado */}
            <div className="flex items-center justify-between mb-6">
              {statusSteps.map((step, idx) => (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs
                      ${order.estado === step.key ? 'bg-yellow-400 text-gray-900' :
                        statusSteps.findIndex(s => s.key === order.estado) > idx ? 'bg-green-600 text-white' :
                        'bg-gray-700 text-gray-400'}
                    `}>
                      {idx + 1}
                    </div>
                    <span className="mt-2 text-xs text-gray-400">{step.label}</span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded-full
                      ${statusSteps.findIndex(s => s.key === order.estado) > idx ? 'bg-green-600' : 'bg-gray-700'}`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Info del cliente */}
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-2">Datos del Cliente</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.buyerInfo && Object.entries(order.buyerInfo).map(([key, value]) => (
                  <div key={key} className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <span className="text-xs text-gray-500 capitalize">{key}</span>
                    <div className="text-gray-200 font-medium truncate">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Productos */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white mb-2">Productos</h2>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {order.cart && order.cart.map((product: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 sm:gap-4 bg-gray-900 p-2 sm:p-3 rounded-lg border border-gray-800">
                    <img src={product.image?.[0]} alt={product.name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-gray-700" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-100 truncate text-sm sm:text-base">{product.name}</div>
                      <div className="text-xs text-gray-400 truncate">{product.brand}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-200 font-bold text-sm sm:text-base">${(product.price * product.quantity).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">x{product.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Total y fecha */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 pt-4 gap-2 sm:gap-0">
              <div className="text-gray-400 text-xs sm:text-sm">Fecha: <span className="text-gray-200 font-medium">{order.fecha}</span></div>
              <div className="text-base sm:text-lg font-bold text-yellow-400">Total: ${order.totalPrice?.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeeOrder; 