import { Types } from "mongoose";


interface IProject {
    _id?: string;
    title: string;
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

interface IProjectDetails {
    _id?: string;
    project_id: Types.ObjectId;
    project_description: string;
    project_client: string;
    project_country: string;
    project_state: string;
    project_city: string;
    owners: [Types.ObjectId];
    compliance_info: string;
    contractors: [Types.ObjectId];
    consultants: [Types.ObjectId];
    compliance_documents: [Types.ObjectId];
    created_at: string;
    updated_at: string;
}

interface IProjectDocument{
    _id?: string;
    project_detail_id: Types.ObjectId;
    document_name: string;
    description: string;
    document_url: string;
    created_at: string;
    updated_at: string;
}