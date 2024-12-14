import { Types } from "mongoose";


interface IProject {
    _id?: string;
    title: string;
    client_name: string;
    compliance_info: string;
    created_by: Types.ObjectId;
    pm_id: Types.ObjectId;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;

}

enum ProjectStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    SUSPENDED = 'suspended',
}