import { IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ description: 'Session UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ description: 'User message', example: '권동하의 주요 프로젝트는 뭔가요?', maxLength: 500 })
  @IsString()
  @MaxLength(500)
  message: string;
}
