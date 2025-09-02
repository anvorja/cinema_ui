// src/components/payment/PaymentMethodSelector.jsx

const PaymentMethodSelector = ({ methods, selectedMethod, onSelect }) => {
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method)}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
            selectedMethod?.id === method.id
              ? 'border-blue-500 bg-blue-500/20'
              : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">{method.icon}</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">{method.name}</h3>
              <p className="text-white/70 text-sm">{method.description}</p>
            </div>
            {selectedMethod?.id === method.id && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};


export { PaymentMethodSelector };