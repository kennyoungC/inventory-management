export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
export const staffMembers = [
    {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Head Chef',
        email: 'sarah.johnson@restaurant.com',
        role: 'admin',
        lastLogin: '2025-05-03T14:30:00',
    },
    {
        id: 2,
        name: 'Michael Chen',
        title: 'Sous Chef',
        email: 'michael.chen@restaurant.com',
        role: 'staff',
        lastLogin: '2025-05-04T09:15:00',
    },
    {
        id: 3,
        name: 'Emma Wilson',
        title: 'Pastry Chef',
        email: 'emma.wilson@restaurant.com',
        role: 'staff',
        lastLogin: '2025-05-02T11:45:00',
    },
    {
        id: 4,
        name: 'David Kim',
        title: 'Restaurant Manager',
        email: 'david.kim@restaurant.com',
        role: 'admin',
        lastLogin: '2025-05-04T08:30:00',
    },
    {
        id: 5,
        name: 'Jennifer Lopez',
        title: 'Server',
        email: 'jennifer.lopez@restaurant.com',
        role: 'staff',
        lastLogin: '2025-05-03T16:20:00',
    },
    {
        id: 6,
        name: 'Robert Smith',
        title: 'Bartender',
        email: 'robert.smith@restaurant.com',
        role: 'staff',
        lastLogin: '2025-05-01T10:05:00',
    },
];
