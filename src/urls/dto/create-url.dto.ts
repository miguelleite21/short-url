import { IsUrl, IsOptional, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(6)
  customSlug?: string;
}
