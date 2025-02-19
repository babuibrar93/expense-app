// import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
// import { BaseEntity } from './base.entity';
// import { ModuleEntity } from './module.entity';
// import { PageFunctionEntity } from './page-function.entity';

// @Entity({ name: 'Page' })
// export class PageEntity extends BaseEntity {
//   @Column({ type: 'varchar', length: 255, nullable: false })
//   Name: string;

//   @ManyToOne(() => ModuleEntity, (module) => module.Page)
//   @JoinColumn({ name: 'ModuleId' })
//   Module: ModuleEntity;

//   @OneToMany(() => PageFunctionEntity, (pf) => pf.Page)
//   PageFunction: PageFunctionEntity[];
// }
