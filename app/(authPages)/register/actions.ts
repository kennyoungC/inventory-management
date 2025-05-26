'use server';

export async function register(state: unknown | null, formData: FormData) {
    const data = {
        restaurantName: formData.get('restaurantName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        accessCode: formData.get('accessCode'),
        password: formData.get('password'),
    };

    console.log('here the server log ', data);
    return data;
}
