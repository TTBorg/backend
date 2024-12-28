export interface IUser {
    _id?: string;
    fname?: string;
    lname?: string;
    company_name?: string;
    email?: string;
    alt_email?: string;
    phone?: string;
    whatsapp_number?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    team_size?: number;
    password?: string;
    role?: UserRole;
    created_at?: Date;
    updated_at?: Date;
    assigned_projects?: string[];
    status?: boolean;
    admin_id?: string;
    verified_mail?: boolean;
    company_email?: string;
    specialization?: string;
}

//TODO: create missing types for the different user roles

export enum UserRole {
    ADMIN = 'admin',
    PROJECT_MANAGER = 'project_manager',
    CONTRACTOR = 'contractor',
    CONSULTANT = 'consultant',
    PROJECT_OWNER = 'project_owner'
}