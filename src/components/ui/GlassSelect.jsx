// src/components/ui/GlassSelect.jsx
import Select from './Select';

const GlassSelect = (props) => {
  return (
    <div className="glass-select-shimmer">
      <Select {...props} />
    </div>
  );
};

export default GlassSelect;