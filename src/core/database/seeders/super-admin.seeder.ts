import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SuperAdmin } from 'src/common/constants/super-admin.constant';
import { OrganizationEntity } from 'src/core/database/entities/organization.entity';
import { RoleEntity } from 'src/core/database/entities/role.entity';
import { UserOrganizationRoleEntity } from 'src/core/database/entities/user-organization-role.entity';
import { UserOrganizationEntity } from 'src/core/database/entities/user-organization.entity';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SuperAdminSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const userRepository = this.dataSource.getRepository(UserEntity);
    const roleRepository = this.dataSource.getRepository(RoleEntity);
    const organizationRepository = this.dataSource.getRepository(OrganizationEntity);
    const userOrgRepository = this.dataSource.getRepository(UserOrganizationEntity);
    const userOrgRoleRepository = this.dataSource.getRepository(UserOrganizationRoleEntity);

    // Check if the Super Admin Role exists
    let superAdminRole = await roleRepository.findOne({ where: { Name: SuperAdmin.roleName } });

    if (!superAdminRole) {
      superAdminRole = roleRepository.create({ Name: SuperAdmin.roleName });
      await roleRepository.save(superAdminRole);
      console.log('Super Admin Role created successfully.');
    }

    // Check if the Super Admin User exists
    let superAdminUser = await userRepository.findOne({
      where: { Email: SuperAdmin.email },
    });

    if (!superAdminUser) {
      const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);
      superAdminUser = userRepository.create({
        FullName: SuperAdmin.name,
        Email: SuperAdmin.email,
        Password: hashedPassword,
      });
      await userRepository.save(superAdminUser);
      console.log('Super Admin User created successfully.');
    }

    // Check if the Default Organization exists
    let defaultOrganization = await organizationRepository.findOne({
      where: { Name: SuperAdmin.organizationName, Email: SuperAdmin.email },
    });

    if (!defaultOrganization) {
      defaultOrganization = organizationRepository.create({
        Name: SuperAdmin.organizationName,
        Email: SuperAdmin.email,
      });
      await organizationRepository.save(defaultOrganization);
      console.log('Default Organization created successfully.');
    }

    // Associate Super Admin with Organization (UserOrganization)
    let userOrganization = await userOrgRepository.findOne({
      where: { User: { Id: superAdminUser.Id }, Organization: { Id: defaultOrganization.Id } },
    });

    if (!userOrganization) {
      userOrganization = userOrgRepository.create({
        User: superAdminUser,
        Organization: defaultOrganization,
      });
      await userOrgRepository.save(userOrganization);
      console.log('Super Admin added to Default Organization.');
    }

    // Assign Super Admin Role to UserOrganization (UserOrganizationRole)
    const userOrgRoleExists = await userOrgRoleRepository.findOne({
      where: { UserOrganization: { Id: userOrganization.Id }, Role: { Id: superAdminRole.Id } },
    });

    if (!userOrgRoleExists) {
      const userOrgRole = userOrgRoleRepository.create({
        UserOrganization: userOrganization,
        Role: superAdminRole,
      });
      await userOrgRoleRepository.save(userOrgRole);
      console.log('Super Admin Role assigned successfully.');
    } else {
      console.log('Super Admin Role already assigned.');
    }
  }
}
