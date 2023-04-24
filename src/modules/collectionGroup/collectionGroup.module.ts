import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionGroupController } from './collectionGroup.controller';
import { CollectionGroupService } from './collectionGroup.service';
import { User } from 'src/entity/user.entity';
import { CollectionGroup } from 'src/entity/collectionGroup.entity';
import { Material } from 'src/entity/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionGroup, User, Material])],
  controllers: [CollectionGroupController],
  providers: [CollectionGroupService],
  exports: [CollectionGroupService],
})
export class CollectionGroupModule {}
