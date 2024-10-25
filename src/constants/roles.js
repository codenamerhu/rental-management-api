const Roles = Object.freeze({
    TENANT: 'Tenant',
    LANDLORD: 'Landlord',
    AGENT: 'Agent',
    STAFF: 'Staff'
});

const StaffRoles = Object.freeze({
    SUPERUSER: 'SuperUser',
    EDITOR: 'Editor',
    VIEWER: 'Viewer'
});

module.exports = { Roles, StaffRoles };
