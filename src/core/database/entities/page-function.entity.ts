// import { Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { BaseEntity } from './base.entity';
// import { FunctionEntity } from './function.entity';
// import { PageEntity } from './page.entity';

// @Entity({ name: 'PageFunction' })
// export class PageFunctionEntity extends BaseEntity {
//   @ManyToOne(() => PageEntity, (page) => page.PageFunction)
//   @JoinColumn({ name: 'PageId' })
//   Page: PageEntity;

//   @ManyToOne(() => FunctionEntity, (func) => func.PageFunction)
//   @JoinColumn({ name: 'FunctionId' })
//   Function: FunctionEntity;
// }
