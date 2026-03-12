import { ApiProperty } from '@nestjs/swagger';

export class RelatedLink {
  @ApiProperty({ example: 'StoLink 프로젝트' })
  title: string;

  @ApiProperty({ example: 'https://github.com/dongha-kwon/stolink' })
  url: string;
}

export class ChatResponseDto {
  @ApiProperty({ description: 'AI reply' })
  reply: string;

  @ApiProperty({ description: 'Related links', type: [RelatedLink] })
  relatedLinks: RelatedLink[];
}
