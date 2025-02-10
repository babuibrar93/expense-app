export interface UserPermissions {
    organizationId: number;
    modules: {
      moduleId: number;
      pages: {
        pageId: number;
        functions: string[];
      }[];
    }[];
  }