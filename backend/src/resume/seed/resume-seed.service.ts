import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResumeEntry } from '../schemas/resume-entry.schema';
import { SEED_DATA } from './resume-seed.data';

@Injectable()
export class ResumeSeedService implements OnModuleInit {
  private readonly logger = new Logger(ResumeSeedService.name);

  constructor(
    @InjectModel(ResumeEntry.name) private readonly model: Model<ResumeEntry>,
  ) {}

  async onModuleInit(): Promise<void> {
    // 인덱스 명시적 생성 (프로덕션 환경에서 autoIndex가 늦을 수 있음)
    await this.model.ensureIndexes();
    this.logger.log('Indexes ensured');

    const count = await this.model.countDocuments();
    if (count > 0) {
      this.logger.log(`Seed skipped: ${count} entries already exist`);
      return;
    }

    await this.model.insertMany(SEED_DATA);
    this.logger.log(`Seed complete: ${SEED_DATA.length} entries inserted`);
  }
}
