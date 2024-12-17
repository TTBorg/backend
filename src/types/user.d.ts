export interface IUser {
    _id?: string;
    fname?: string;
    lname?: string;
    company_name?: string;
    email?: string;
    alt_email?: string;
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    team_size?: number;
    password?: string;
    role?: UserRole;
    created_at?: Date;
    updated_at?: Date;
    assigned_projects?: string[];
    status?: boolean;
    admin_id?: string;
    verified_mail?: boolean;
}

export enum UserRole {
    ADMIN = 'admin',
    PROJECT_MANAGER = 'project_manager'
}