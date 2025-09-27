import InfoRow from '@/components/InfoRow';
import { supplierModel } from '@/types/index';

type Props = {
    supplier: supplierModel;
};

const SupplierInformation = ({ supplier }: Props) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                Supplier Information
            </h2>
            <div className="mt-4">
                <InfoRow label="Supplier Name" value={supplier.name} />
                <InfoRow label="Contact Person" value={supplier.contactPerson} />
                <InfoRow label="Phone" value={supplier.phone} />
                <InfoRow label="Email" value={supplier.email} />
            </div>
        </div>
    );
};

export default SupplierInformation;
