import format from 'date-fns/format';
import { es } from 'date-fns/locale';

import { Record } from '../types';

interface ProductRecordProps {
  record: Record;
}

export function ProductRecord({ record }: ProductRecordProps) {
  return (
    <div className="ml-8 p-2 border-l-2 border-gray-200">
      <div className="bg-white p-3 rounded shadow">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">Conteo #{record.counter}</h4>
            <p className="text-sm text-gray-500">
              {format(new Date(record.create_at), 'PPpp')}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-medium">Unidades:</span> {record.quantity_in_units}
            </p>
            <p>
              <span className="font-medium">Paquetes:</span> {record.quantity_in_packaging_units}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}