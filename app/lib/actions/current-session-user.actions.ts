import { getCodeSession } from 'app/lib/session';
import Staff from 'app/lib/models/staffs';
import Restaurant from 'app/lib/models/restaurants';
import dbConnect from 'app/lib/db';

export async function getCurrentSessionUser() {
    const codeSession = await getCodeSession();

    if (!codeSession) return null;

    await dbConnect();

    if (codeSession.type === 'staff') {
        const staff = await Staff.findById(codeSession.id);
        if (!staff) return null;
        return {
            role: 'staff',
            name: staff.full_name,
            jobTitle: staff.job_title,
            email: staff.email,
            lastLoggedIn: staff.last_login_at ? staff.last_login_at.toISOString() : null,
        };
    } else if (codeSession.type === 'admin') {
        const admin = await Restaurant.findById(codeSession.id);
        if (!admin) return null;
        return {
            role: 'admin',
            name: admin.restaurant_name,
            email: admin.email,
            jobTitle: 'Admin',
        };
    }
    return null;
}
