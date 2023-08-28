import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePublicationDto {
    @IsNumber()
    @IsNotEmpty()
    mediaId: number

    @IsNumber()
    @IsNotEmpty()
    postId: number

    @IsNotEmpty()
    @IsDateString()
    date: Date
}
