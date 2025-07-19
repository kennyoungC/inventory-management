export type NavItems = {
    name: string;
    href: string;
    icon: string;
};

export type InputsProps = {
    label: string;
    name: string;
    placeholder: string;
    error?: string;
    type?: string;
    defaultValue?: string;
    required?: boolean;
};

export type StaffModel = {
    id: string;
    restaurantId: string;
    fullName: string;
    jobTitle: string;
    isActive: boolean;
    email: string;
    lastLoginAt: string;
    role?: string;
};
