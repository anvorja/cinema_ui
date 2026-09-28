// src/components/admin/tickets/TicketsTab.jsx
// Boletería: el personal admin escanea o ingresa un código de boleto
// y lo marca como USED si es válido.
import React, { useState, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { useToast } from '../hooks/useToast';
import { QrCodeIcon, CheckCircleIcon, XCircleIcon, TicketIcon } from '@heroicons/react/24/outline';

const STATUS_BADGE = {
  active:    { label: 'ACTIVO',    cls: 'bg-board-ok/20 text-board-okink border border-board-ok/40' },
  used:      { label: 'USADO',     cls: 'bg-board-line2/20 text-board-mute border border-board-line2/40' },
  cancelled: { label: 'CANCELADO', cls: 'bg-board-alarm/20 text-board-alarmink border border-board-alarm/40' },
};

const TicketsTab = () => {
  const { adminApi } = useApi();
  const { toast } = useToast();
  const inputRef = useRef(null);

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { ok: bool, ticket?, error? }
  const [history, setHistory] = useState([]); // últimas validaciones

  const handleValidate = async (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);

    try {
      const ticket = await adminApi.validateTicket(trimmed);
      const entry = { code: trimmed, ok: true, ticket, ts: new Date() };
      setResult({ ok: true, ticket });
      setHistory(prev => [entry, ...prev].slice(0, 10));
      toast.success(`Boleto ${trimmed} marcado como USADO`, { title: 'Boleto válido' });
    } catch (err) {
      const msg = err.message || 'Error validando boleto';
      const entry = { code: trimmed, ok: false, error: msg, ts: new Date() };
      setResult({ ok: false, error: msg });
      setHistory(prev => [entry, ...prev].slice(0, 10));
      toast.error(msg, { title: 'Boleto inválido' });
    } finally {
      setLoading(false);
      setCode('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-board-amber/20 rounded-lg">
          <QrCodeIcon className="h-6 w-6 text-board-amberink" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-board-ink">Validación de Boletos</h2>
          <p className="text-board-mute text-sm">Ingresa o escanea el código del boleto para validarlo en entrada</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de escaneo */}
        <div className="space-y-4">
          <div className="bg-board-panel2 rounded-xl p-6">
            <h3 className="text-board-ink font-semibold mb-4 flex items-center gap-2">
              <TicketIcon className="h-5 w-5 text-board-amberink" />
              Código de boleto
            </h3>

            <form onSubmit={handleValidate} className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CINE-XXXXXXX"
                autoFocus
                className="w-full bg-board-panel2 border border-board-line2 rounded-lg px-4 py-3 text-board-ink text-lg font-mono placeholder-board-mute focus:outline-none focus:ring-2 focus:ring-board-amber focus:border-transparent tracking-widest"
              />
              <button
                type="submit"
                disabled={!code.trim() || loading}
                className="w-full py-3 bg-board-amber hover:bg-board-amberpress disabled:opacity-40 disabled:cursor-not-allowed text-board-onamber font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Validando...' : 'Validar boleto'}
              </button>
            </form>

            {/* Resultado */}
            {result && (
              <div className={`mt-4 p-4 rounded-lg border ${
                result.ok
                  ? 'bg-board-ok/10 border-board-ok/40'
                  : 'bg-board-alarm/10 border-board-alarm/40'
              }`}>
                <div className="flex items-center gap-3">
                  {result.ok
                    ? <CheckCircleIcon className="h-8 w-8 text-board-okink flex-shrink-0" />
                    : <XCircleIcon className="h-8 w-8 text-board-alarmink flex-shrink-0" />
                  }
                  <div>
                    {result.ok ? (
                      <>
                        <p className="text-board-okink font-bold text-lg">¡Boleto válido!</p>
                        <p className="text-board-ink/70 text-sm">
                          Asiento: <span className="text-board-ink font-mono">{result.ticket.seat_number}</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-board-alarmink font-bold text-lg">Boleto rechazado</p>
                        <p className="text-board-ink/70 text-sm">{result.error}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="bg-board-panel2/50 rounded-xl p-4">
            <p className="text-board-mute text-xs leading-relaxed">
              <strong className="text-board-ink2">Formato:</strong> CINE-XXXXXXX<br />
              Los boletos sólo pueden validarse una vez. Boletos <strong className="text-board-amberink">ACTIVOS</strong> de compras <strong className="text-board-amberink">CONFIRMADAS</strong> son los únicos aceptados.
            </p>
          </div>
        </div>

        {/* Historial de la sesión */}
        <div className="bg-board-panel2 rounded-xl p-6">
          <h3 className="text-board-ink font-semibold mb-4">Historial de la sesión</h3>

          {history.length === 0 ? (
            <div className="text-center text-board-mute py-12">
              <QrCodeIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aún no se han validado boletos</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.ok ? 'bg-board-ok/10' : 'bg-board-alarm/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {entry.ok
                      ? <CheckCircleIcon className="h-5 w-5 text-board-okink flex-shrink-0" />
                      : <XCircleIcon className="h-5 w-5 text-board-alarmink flex-shrink-0" />
                    }
                    <div>
                      <p className="text-board-ink font-mono text-sm font-medium">{entry.code}</p>
                      {entry.ok
                        ? <p className="text-board-mute text-xs">Asiento: {entry.ticket?.seat_number}</p>
                        : <p className="text-board-alarmink text-xs truncate max-w-[180px]">{entry.error}</p>
                      }
                    </div>
                  </div>
                  <span className="text-board-mute text-xs font-mono flex-shrink-0">
                    {formatTime(entry.ts)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-board-line2 flex justify-between text-xs text-board-mute">
              <span>✅ {history.filter(h => h.ok).length} válidos</span>
              <span>❌ {history.filter(h => !h.ok).length} rechazados</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketsTab;
