import HeaderBar from 'app/shared/components/HeaderBar';
import MainContent from './MainContent';
import { Toaster } from 'react-hot-toast';
import { getAllStaff } from '@/actions/staff.actions';

const StaffMangement = async () => {
    const staffList = await getAllStaff();
    return (
        <>
            <HeaderBar title="Staff Management" />
            <MainContent staffList={staffList} />
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
            />
        </>
    );
};
export default StaffMangement;
