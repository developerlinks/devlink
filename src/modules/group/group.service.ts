import { Injectable, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entity/group.entity';
import { User } from 'src/entity/user.entity';
import { QueryBaseDto } from './dto/get-group.dto';
import { Material } from 'src/entity/material.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Material) private materialRepository: Repository<Material>,
  ) {}

  async addGroup(id: string, group: Partial<Group>) {
    const usertmp = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    group.user = usertmp;
    const groupTmp = await this.groupRepository.create(group);
    return this.groupRepository.save(groupTmp);
  }

  // 查询自己的分组
  async getGroup(id: string, query: QueryBaseDto) {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [groups, total] = await this.groupRepository.findAndCount({
      where: {
        user: {
          id,
        },
      },
      take,
      skip,
    });
    const totalPages = Math.ceil(total / limit);

    return {
      groups,
      total,
      totalPages,
    };
  }

  // 查询该分组下的物料
  async getMaterialsByGroupId(groupId: string, userId: string, query: QueryBaseDto) {
    const { limit, page } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    const [materials, total] = await this.materialRepository.findAndCount({
      where: {
        user: {
          id: userId,
        },
        groups:{
          id: groupId,
        }
      },
      take,
      skip,
    });
    if (materials.length === 0) {
      return new NotFoundException('不存在');
    }
    const totalPages = Math.ceil(total / limit);

    return {
      materials: materials,
      total,
      totalPages,
    };
  }
}
