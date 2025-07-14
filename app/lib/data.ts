import dbConnect from './db';
import Restaurant from './models/restaurants';
import Staff from './models/staffs';

export async function getRestuarantByEmail(email: string) {
    const user = await Restaurant.findOne({
        email,
    });
    return user;
}

export async function getAllStaff(restaurantId: string) {
    await dbConnect();
    const staffList = await Staff.find({ restaurant_id: restaurantId }).select('-__v').lean();
    if (!staffList) return [];
    return staffList.map(staff => ({
        id: staff._id!.toString(),
        // role: staff.role,
        restaurantId: staff.restaurant_id.toString(),
        fullName: staff.full_name,
        jobTitle: staff.job_title,
        isActive: staff.is_active,
        email: staff.email,
        lastLoginAt:
            staff.last_login_at instanceof Date
                ? staff.last_login_at.toISOString()
                : staff.last_login_at || undefined,
    }));
}
