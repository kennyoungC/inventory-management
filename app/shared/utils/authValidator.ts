import { getCodeSession } from 'app/lib/session';
import { auth } from 'auth';

export async function validateAuthentication() {
    const [session, codeSession] = await Promise.all([auth(), getCodeSession()]);
    const restaurantDetails = session?.user;

    if (!restaurantDetails || !codeSession) {
        throw new Error('Authentication required');
    }

    return { session, codeSession, restaurantDetails };
}
