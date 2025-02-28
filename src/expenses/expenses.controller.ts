import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { ApiResponse } from 'src/common/dtos/api-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/types/basic.enum';
import { UserEntity } from 'src/core/database/entities/user.entity';
import { CreateExpenseDto, UpdateExpenseDto } from './dtos/expense.dto';
import { GetAllExpenseDto, GetExpenseStatsDto } from './dtos/expense.all.dto';
import { ExpenseService } from './expense.service';
import { OrganizationGuard } from 'src/common/guards/organization.guard';

@Controller('expense')
@ApiTags('Expense')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, OrganizationGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @ApiOperation({ summary: 'Create a new expense' })
  async createExpense(@Body() body: CreateExpenseDto, @CurrentUser() currentUser: UserEntity) {
    const response = await this.expenseService.create(body, currentUser);
    return new ApiResponse(true, HttpStatus.CREATED, 'Expense created successfully', response);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @ApiOperation({ summary: 'Update an existing expense' })
  async updateExpense(@Param('id') id: string, @Body() body: UpdateExpenseDto) {
    const response = await this.expenseService.update(id, body);
    return new ApiResponse(true, HttpStatus.OK, 'Expense updated successfully', response);
  }

  @Get('stats/:organizationId')
  async getExpenseStats(
    @Param('organizationId') organizationId: string,
    @Query() query: GetExpenseStatsDto
  ) {
    const response = await this.expenseService.getExpenseStats(organizationId, query);
    return new ApiResponse(true, HttpStatus.OK, 'Expense stats fetched successfully', response);
  }

  @Get(':organizationId/:id')
  @ApiOperation({ summary: 'Fetch a single expense within an organization' })
  async fetchExpenseById(@Param('organizationId') organizationId: string, @Param('id') id: string) {
    const response = await this.expenseService.findExpenseById(organizationId, id);
    return new ApiResponse(true, HttpStatus.OK, 'Expense retrieved successfully', response);
  }

  @Get(':organizationId')
  @ApiOperation({ summary: 'Fetch all expenses within an organization (paginated)' })
  async fetchAllExpenses(
    @Param('organizationId') organizationId: string,
    @Query() query: GetAllExpenseDto
  ) {
    const response = await this.expenseService.findAll(organizationId, query);
    return new ApiResponse(true, HttpStatus.OK, 'All expenses retrieved successfully', response);
  }

  @Delete(':organizationId/:id')
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  @ApiOperation({ summary: 'Delete an expense within an organization' })
  async removeExpense(@Param('organizationId') organizationId: string, @Param('id') id: string) {
    await this.expenseService.remove(organizationId, id);
    return new ApiResponse(true, HttpStatus.OK, 'Expense deleted successfully');
  }
}
