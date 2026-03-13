import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeEntry, ResumeEntrySchema } from './schemas/resume-entry.schema';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { ResumeSeedService } from './seed/resume-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResumeEntry.name, schema: ResumeEntrySchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeSeedService],
  exports: [ResumeService],
})
export class ResumeModule {}
