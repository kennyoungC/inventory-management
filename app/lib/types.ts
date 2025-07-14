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
